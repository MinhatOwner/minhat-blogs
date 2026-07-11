import { execSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

function getAllMdFiles(dir) {
  const result = [];
  const files = readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = join(dir, file.name);
    if (file.isDirectory()) {
      result.push(...getAllMdFiles(fullPath));
    } else if (file.name.endsWith('.md')) {
      result.push(fullPath);
    }
  }
  return result;
}

function getLastCommitDate(filePath) {
  try {
    const cmd = `git log -1 --format="%ad" --date=format:"%Y-%m-%d" -- "${filePath}"`;
    const date = execSync(cmd, { encoding: 'utf-8' }).trim();
    return date || null;
  } catch (error) {
    console.error(`获取文件 ${filePath} 的提交日期失败:`, error.message);
    return null;
  }
}

function updateYamlFrontMatter(content, date) {
  const yamlRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(yamlRegex);

  if (match) {
    const existingYaml = match[1];
    const dateRegex = /^date:\s*.+$/m;
    
    if (dateRegex.test(existingYaml)) {
      const updatedYaml = existingYaml.replace(dateRegex, `date: ${date}`);
      return content.replace(yamlRegex, `---\n${updatedYaml}\n---`);
    } else {
      const lines = existingYaml.split(/\r?\n/);
      const lastLine = lines[lines.length - 1];
      const separator = lastLine.trim() ? '\n' : '';
      const updatedYaml = existingYaml + separator + `date: ${date}`;
      return content.replace(yamlRegex, `---\n${updatedYaml}\n---`);
    }
  } else {
    return `---\ndate: ${date}\n---\n${content}`;
  }
}

function main() {
  const srcDir = join(__dirname, 'src');
  console.log(`正在扫描目录: ${srcDir}`);

  const mdFiles = getAllMdFiles(srcDir);
  console.log(`共找到 ${mdFiles.length} 个 markdown 文件`);

  let updatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const file of mdFiles) {
    const relPath = relative(__dirname, file);
    console.log(`\n处理文件: ${relPath}`);

    const date = getLastCommitDate(file);
    if (!date) {
      console.log(`  ❌ 获取提交日期失败，跳过`);
      failedCount++;
      continue;
    }

    console.log(`  最后提交日期: ${date}`);

    const content = readFileSync(file, 'utf-8');
    const yamlRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
    const match = content.match(yamlRegex);
    const dateRegex = /^date:\s*.+$/m;
    
    let hasDate = false;
    let existingDate = '';
    
    if (match) {
      hasDate = dateRegex.test(match[1]);
      if (hasDate) {
        const existingDateMatch = match[1].match(dateRegex);
        existingDate = existingDateMatch[0].replace(/^date:\s*/, '').trim();
      }
    }

    if (hasDate) {
      if (existingDate === date) {
        console.log(`  ⏭️ 日期已为最新，跳过`);
        skippedCount++;
        continue;
      }
      console.log(`  更新日期: ${existingDate} -> ${date}`);
    } else {
      console.log(`  添加日期: ${date}`);
    }

    const updatedContent = updateYamlFrontMatter(content, date);
    writeFileSync(file, updatedContent, 'utf-8');
    console.log(`  ✅ 成功更新`);
    updatedCount++;
  }

  console.log(`\n=======================`);
  console.log(`处理完成:`);
  console.log(`  更新: ${updatedCount} 个文件`);
  console.log(`  跳过: ${skippedCount} 个文件`);
  console.log(`  失败: ${failedCount} 个文件`);
}

const resolvedArgv = process.argv[1].replace(/\\/g, '/');
const resolvedMeta = fileURLToPath(import.meta.url).replace(/\\/g, '/');
if (resolvedMeta === resolvedArgv) {
  main();
}

export { getAllMdFiles, getLastCommitDate, updateYamlFrontMatter };