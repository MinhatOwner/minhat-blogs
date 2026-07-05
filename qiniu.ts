import fs from 'fs';
import path from 'path';
import qiniu from 'qiniu';

// 配置七牛云凭证（生产环境建议改用环境变量）
process.env['QINIU_BUCKET'] = "minhat-blogs"
process.env['DIR_PATH'] = "./dist"

/** 从环境变量读取配置，缺失则直接退出 */
function getEnv(name: string): string {
  // 读取环境变量
  const value = process.env[name];
  // 如果变量为空则报错退出
  if (!value) {
    console.error(`请设置环境变量 ${name}`);
    process.exit(1);
  }
  return value;
}

// 读取全局配置
const ACCESS_KEY = getEnv('QINIU_ACCESS_KEY');
const SECRET_KEY = getEnv('QINIU_SECRET_KEY');
const BUCKET = getEnv('QINIU_BUCKET');
const DIR_PATH = getEnv('DIR_PATH');

/** 七牛云存储桶中的文件条目信息 */
interface FileEntry {
  key: string;        // 文件路径（对象名）
  putTime: number;    // 上传时间戳（100纳秒单位）
  hash: string;       // 文件哈希值
  fsize?: number;     // 文件大小（字节）
  mimeType: string;   // 文件 MIME 类型
  type?: number;      // 存储类型（0=标准，1=低频，2=归档）
  endUser?: string;   // 上传者标识
  status?: number;    // 文件状态（0=启用，1=禁用）
  md5?: string;       // 文件 MD5 值
}

/**
 * 获取存储桶中所有文件列表，自动处理分页
 * @param prefix 可选，只返回匹配前缀的文件
 */
async function listAllFiles(prefix = ''): Promise<FileEntry[]> {
  // 创建认证对象
  const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
  // 创建存储配置
  const config = new qiniu.conf.Config();
  // 创建存储桶管理器
  const bucketManager = new qiniu.rs.BucketManager(mac, config);

  // 存放所有文件条目
  const allItems: FileEntry[] = [];
  // 分页标记，为空字符串时表示没有更多数据
  let marker: string | undefined;

  // 循环翻页，每次获取 1000 条
  do {
    // 调用七牛 API 获取一页数据
    const result = await bucketManager.listPrefix(BUCKET, {
      prefix,       // 前缀过滤
      marker,       // 分页标记
      limit: 1000,  // 每页数量上限
    });

    // 将本页条目合并到总结果中
    if (result.data.items) {
      allItems.push(...result.data.items);
      console.log(`  已获取 ${allItems.length} 条...`);
    }

    // 更新分页标记。为空字符串时跳出循环
    marker = result.data.marker;
  } while (marker);

  return allItems;
}

/**
 * 批量删除文件
 * @param files 要删除的文件列表
 * @returns 删除结果统计
 */
export async function deleteFiles(files: FileEntry[]): Promise<{ success: number; fail: number }> {
  // 创建认证、配置、管理器
  const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
  const config = new qiniu.conf.Config();
  const bucketManager = new qiniu.rs.BucketManager(mac, config);

  let success = 0;
  let fail = 0;

  // 批量操作 API 每次最多处理 1000 条，按此分批
  for (let i = 0; i < files.length; i += 1000) {
    // 取当前批次（从 i 开始的 1000 条）
    const batch = files.slice(i, i + 1000);
    // 生成删除指令数组
    const deleteOps = batch.map((f) => qiniu.rs.deleteOp(BUCKET, f.key));

    // 打印批次进度
    console.log(`  删除批次 ${Math.floor(i / 1000) + 1}/${Math.ceil(files.length / 1000)}（${batch.length} 条）`);
    // 发送批量删除请求
    const result = await bucketManager.batch(deleteOps);

    // 遍历每条指令的响应码
    for (const op of result.data) {
      if (op.code === 200) {
        success++;
      } else {
        fail++;
      }
    }
  }

  return { success, fail };
}

/**
 * 上传本地目录下的所有文件到存储桶
 * 七牛无批量上传 API，采用并发控制实现批量上传效果
 * @param dirPath 要上传的目录路径
 * @param concurrency 并发上传数，默认 10
 * @returns 上传结果统计
 */
export async function uploadDir(dirPath: string, concurrency = 10): Promise<{ success: number; fail: number; errors: string[] }> {
  // 检查目录是否存在
  if (!fs.existsSync(dirPath)) {
    console.log(`目录不存在: ${dirPath}`);
    return { success: 0, fail: 0, errors: [] };
  }

  // 创建认证、配置、上传器
  const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
  const config = new qiniu.conf.Config();
  const formUploader = new qiniu.form_up.FormUploader(config);
  // 记录上传失败信息
  const errors: string[] = [];

  /** 递归收集目录下的所有文件路径 */
  async function getFiles(dir: string): Promise<string[]> {
    // 读取目录下的所有条目（包含文件类型信息）
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isFile()) {
        files.push(fullPath);
      } else if (entry.isDirectory()) {
        // 子目录递归
        files.push(...await getFiles(fullPath));
      }
    }
    return files;
  }

  // 获取所有待上传的文件
  const files = await getFiles(dirPath);
  if (files.length === 0) {
    console.log(`  目录为空，无文件可上传`);
    return { success: 0, fail: 0, errors: [] };
  }

  console.log(`  共发现 ${files.length} 个文件`);

  let success = 0;
  let fail = 0;

  // 按 concurrency 分组并行上传
  for (let i = 0; i < files.length; i += concurrency) {
    // 当前批次的文件
    const chunk = files.slice(i, i + concurrency);
    // 同时发起 concurrency 个上传请求
    const uploads = chunk.map(async (localPath) => {
      // 以相对于目录的路径作为七牛上的 key（Windows 反斜杠转正斜杠）
      const key = path.relative(dirPath, localPath).replace(/\\/g, '/');

      // 为每个文件生成独立的上传凭证
      const putPolicy = new qiniu.rs.PutPolicy({ scope: `${BUCKET}:${key}` });
      const uploadToken = putPolicy.uploadToken(mac);

      try {
        // 执行上传
        await formUploader.putFile(uploadToken, key, localPath, null);
        success++;
        console.log(`  ✓ ${key}`);
      } catch (err: any) {
        fail++;
        errors.push(`${key}: ${err.message ?? err}`);
        console.log(`  ✗ ${key} 失败: ${err.message ?? err}`);
      }
    });

    // 等待当前批次全部完成
    await Promise.all(uploads);
    // 打印总体进度
    console.log(`  进度 ${Math.min(i + concurrency, files.length)}/${files.length}`);
  }

  return { success, fail, errors };
}

/** 入口：清空存储桶并重新上传 dist */
async function sync() {
  const startTime = Date.now();
  console.log('=== 开始同步到七牛云 ===');
  console.log(`存储桶: ${BUCKET}`);
  console.log(`本地目录: ${DIR_PATH}`);
  console.log('');

  // 第一步：获取远端文件列表
  console.log('[1/3] 获取存储桶文件列表...');
  const files = await listAllFiles();
  console.log(`  完成，共 ${files.length} 个文件`);
  console.log('');

  // 第二步：删除所有远端文件
  if (files.length > 0) {
    console.log('[2/3] 删除所有文件...');
    const del = await deleteFiles(files);
    console.log(`  完成：成功 ${del.success} 个，失败 ${del.fail} 个`);
  } else {
    console.log('[2/3] 存储桶为空，跳过删除');
  }
  console.log('');

  // 第三步：上传本地文件
  console.log('[3/3] 上传 dist...');
  const up = await uploadDir(DIR_PATH);
  console.log(`  完成：成功 ${up.success} 个，失败 ${up.fail} 个`);
  if (up.errors.length > 0) {
    console.log('  失败详情:');
    up.errors.forEach((e) => console.log(`    ${e}`));
  }
  console.log('');

  // 输出总耗时
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`=== 同步结束，耗时 ${elapsed}s ===`);
}

// 启动同步流程
sync().catch((err) => {
  console.error('同步失败:', err);
  process.exit(1);
});