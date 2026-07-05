import fs from 'fs';
import OpenAI from "openai";

process.env['FILE_PATH'] = "F:\\WebProject\\minhat\\src\\server\\Linux命令.md"

/** 从环境变量读取配置，缺失则直接退出 */
function getEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        console.error(`请设置环境变量 ${name}`);
        process.exit(1);
    }
    return value;
}

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: getEnv('API_KEY')
});

function readFile(filePath: string): string {
    if (!fs.existsSync(filePath)) {
        console.error(`文件不存在: ${filePath}`);
        process.exit(1);
    }
    return fs.readFileSync(filePath, 'utf-8');
}

/** 提取 <!-- more --> 以下的内容作为文章正文 */
function extractArticleBody(content: string): string {
    const marker = '<!-- more -->';
    const moreIndex = content.indexOf(marker);
    if (moreIndex === -1) {
        console.error(`文件中未找到 ${marker} 标记`);
        process.exit(1);
    }
    return content.substring(moreIndex + marker.length).trim();
}

/** 将 AI 生成的描述插入到 <!-- more --> 往上最近的 --- 之间 */
function replaceDescription(originalContent: string, description: string): string {
    const marker = '<!-- more -->';
    const moreIndex = originalContent.indexOf(marker);
    if (moreIndex === -1) {
        console.error(`文件中未找到 ${marker} 标记`);
        process.exit(1);
    }

    // 从 <!-- more --> 往前找最近的 ---
    const beforeMore = originalContent.substring(0, moreIndex);
    const lastDashIndex = beforeMore.lastIndexOf('---');
    if (lastDashIndex === -1) {
        console.error('文件中未找到 --- 标记');
        process.exit(1);
    }

    // 保留 --- 之前的内容，替换 --- 到 <!-- more --> 之间的内容
    const beforeFrontmatter = originalContent.substring(0, lastDashIndex + '---'.length);
    const afterMore = originalContent.substring(moreIndex);
    return `${beforeFrontmatter}\n${description}\n\n${afterMore}`;
}

async function main(): Promise<void> {
    const filePath = process.argv[2] || getEnv('FILE_PATH');
    const originalContent = readFile(filePath);
    const articleBody = extractArticleBody(originalContent);

    console.log('正在生成文章描述...');

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "你是一个文章内容描述总结助手，请根据用户提供的文章内容，生成一段简洁的描述，不超过200字。" },
            { role: "user", content: `请为以下文章内容生成一段描述：\n\n${articleBody}` },
        ],
        model: "deepseek-v4-flash",
    });

    const description = completion.choices[0].message.content;
    if (!description) {
        console.error('AI 未能生成描述');
        process.exit(1);
    }

    const newContent = replaceDescription(originalContent, description.trim());
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log('文章描述已更新并写入文件');
}

main().catch((err) => {
    console.error('生成失败:', err);
    process.exit(1);
});;