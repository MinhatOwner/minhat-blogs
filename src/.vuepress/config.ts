import {defineUserConfig} from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
    // 部署站点的基础路径
    base: "/",
    // 站点的语言
    lang: "zh-CN",
    // 站点的标题
    title: "Minhat博客",
    // 站点的描述
    // 它将会在最终渲染出的 HTML 中作为 <meta name="description" /> 标签的 content 属性。
    // 它会被每个页面的 Frontmatter 中的 description 字段覆盖。
    description: "vuepress-theme-hope 的博客演示",
    // 设置站点要使用的主题
    theme,
    // 和 PWA 一起启用
    // shouldPrefetch: false,
});
