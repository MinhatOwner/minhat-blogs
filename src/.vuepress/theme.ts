import {hopeTheme} from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
// 主题配置
export default hopeTheme({
    // ================主题配置-主题基本选项================
    // 当前网站部署到的域名。
    hostname: "https://minhat.cn",
    // 文章显示的默认作者
    author: {
        // 作者姓名
        name: "Minhat",
        // 作者网站
        url: "https://minhat.cn",
        // 作者 Email
        email: "222222@QQ.com"
    },
    // ================主题配置-主题功能选项================
    // 博客相关
    blog: {
        // 博主姓名
        name: "Minhat",
        // 口号、座右铭或介绍语。
        description: "一个Java后端开发者",
        // 博主的个人介绍地址
        intro: "/intro.html",
        // 博主的媒体链接配置
        // 如果社交媒体已在下方列表中，你可以直接设置 社交媒体名称: 社交媒体地址。
        medias: {
            Baidu: "https://example.com",
            BiliBili: "https://example.com",
            Bitbucket: "https://example.com",
            Dingding: "https://example.com",
            Discord: "https://example.com",
            Dribbble: "https://example.com",
            Email: "mailto:info@example.com",
            Evernote: "https://example.com",
            Facebook: "https://example.com",
            Flipboard: "https://example.com",
            Gitee: "https://example.com",
            GitHub: "https://example.com",
            Gitlab: "https://example.com",
            Gmail: "mailto:info@example.com",
            Instagram: "https://example.com",
            Lark: "https://example.com",
            Lines: "https://example.com",
            Linkedin: "https://example.com",
            Pinterest: "https://example.com",
            Pocket: "https://example.com",
            QQ: "https://example.com",
            Qzone: "https://example.com",
            Reddit: "https://example.com",
            Rss: "https://example.com",
            Steam: "https://example.com",
            Twitter: "https://example.com",
            Wechat: "https://example.com",
            Weibo: "https://example.com",
            Whatsapp: "https://example.com",
            Youtube: "https://example.com",
            Zhihu: "https://example.com",
            VuePressThemeHope: {
                icon: "https://theme-hope-assets.vuejs.press/logo.svg",
                link: "https://theme-hope.vuejs.press",
            },
        },
    },
    // 加密配置
    encrypt: {
        config: {
            "/demo/encrypt.html": {
                hint: "Password: 1234",
                password: "1234",
            },
        },
    },
    // ================主题配置-主题布局选项================
    // 导航栏配置
    navbar,
    // 导航栏图标，应为基于 .vuepress/public 文件夹的绝对路径。
    logo: "/logo-black.svg",
    // 导航栏图标(深色)
    logoDark: "/logo-white.svg",
    // 仓库配置，用于在导航栏中显示仓库链接。
    repo: "https://gitee.com/minhat",
    // 文档在仓库中的目录
    docsDir: "src",
    // 侧边栏配置
    sidebar,
    // 页脚的默认内容，可输入 HTMLString
    footer: "默认页脚",
    // 是否默认显示页脚
    displayFooter: true,
    // ================主题配置-主题外观选项================
    // ================主题配置-主题多语言选项================
    // ================主题配置-主题行为选项================

    // ================Markdown配置================
    // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
    // hotReload: true,
    // 此处开启了很多功能用于演示，你应仅保留用到的功能。
    markdown: {
        // ================Markdown配置-Markdown行为配置================
        // 是否将独立的 <img> 转换为 <figure>。
        figure: true,
        // 是否支持 GFM
        gfm: true,
        // 是否启用图片懒加载。
        imgLazyload: true,
        // 是否启用 v-pre 容器支持
        vPre: true,
        // ================Markdown配置-Markdown语法配置================
        component: true,
        // 是否启用图片大小。
        imgSize: true,
        // 是否启用 Markdown 导入支持。你可以传递一个选项来自定义行为。
        include: true,
        // 是否启用选项卡支持
        tabs: true,
        // 是否启用任务列表格式支持。你可以传递一个对象来配置任务列表。
        tasklist: true,
        // ================Markdown配置-Markdown样式化配置================
        // 是否启用自定义对齐。
        align: true,
        // 是否启用属性自定义支持。
        attrs: true,
        // 是否启用标记支持。
        mark: true,
        // 是否启用隐藏内容支持。
        spoiler: true,
        // 样式化内联标记以创建所需的片段。
        stylize: [
            {
                matcher: "Recommended",
                // oxlint-disable-next-line typescript/consistent-return
                replacer: ({tag}) => {
                    if (tag === "em") {
                        return {
                            tag: "Badge",
                            attrs: {type: "tip"},
                            content: "Recommended",
                        };
                    }
                },
            },
        ],
        // 是否启用下标支持
        sub: true,
        // 是否启用上标支持
        sup: true,
        // ================Markdown配置-Markdown图表配置================
        // 是否启用 plantuml 支持。
        plantuml: true,
        // ================Markdown配置-Markdown代码配置================
        // 是否启用选项卡支持。
        codeTabs: true,
        // 是否启用代码演示支持
        demo: true,
        // 取消注释它们如果你需要 TeX 支持
        // math: {
        //   // 启用前安装 katex
        //   type: "katex",
        //   // 或者安装 @mathjax/src
        //   type: "mathjax",
        // },
        // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
        // revealjs: {
        //   plugins: ["highlight", "math", "search", "notes", "zoom"],
        // },
        // 在启用之前安装 chart.js
        // chartjs: true,
        // insert component easily
        // 在启用之前安装 echarts
        // echarts: true,
        // 在启用之前安装 flowchart.ts
        // flowchart: true,
        // 在启用之前安装 mermaid
        // mermaid: true,
        // playground: {
        //   presets: ["ts", "vue"],
        // },
        // 在启用之前安装 @vue/repl
        // vuePlayground: true,
        // 在启用之前安装 sandpack-vue3
        // sandpack: true,
    },
    // ================插件配置================
    // 在这里配置主题提供的插件
    plugins: {
        // 启用博客功能
        blog: true,
        // 启用之前需安装 @waline/client
        // 警告: 这是一个仅供演示的测试服务，在生产环境中请自行部署并使用自己的服务！
        // comment: {
        //   provider: "Waline",
        //   serverURL: "https://waline-comment.vuejs.press",
        // },
        // 面向 VuePress2 的常用组件
        components: {
            components: ["Badge", "VPCard"],
        },
        // 图标组件的前缀。默认情况下，插件将使用
        icon: {
            prefix: "fa6-solid:",
        },
        // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
        // pwa: {
        //   favicon: "/favicon.ico",
        //   cacheHTML: true,
        //   cacheImage: true,
        //   appendBase: true,
        //   apple: {
        //     icon: "/assets/icon/apple-icon-152.png",
        //     statusBarColor: "black",
        //   },
        //   msTile: {
        //     image: "/assets/icon/ms-icon-144.png",
        //     color: "#ffffff",
        //   },
        //   manifest: {
        //     icons: [
        //       {
        //         src: "/assets/icon/chrome-mask-512.png",
        //         sizes: "512x512",
        //         purpose: "maskable",
        //         type: "image/png",
        //       },
        //       {
        //         src: "/assets/icon/chrome-mask-192.png",
        //         sizes: "192x192",
        //         purpose: "maskable",
        //         type: "image/png",
        //       },
        //       {
        //         src: "/assets/icon/chrome-512.png",
        //         sizes: "512x512",
        //         type: "image/png",
        //       },
        //       {
        //         src: "/assets/icon/chrome-192.png",
        //         sizes: "192x192",
        //         type: "image/png",
        //       },
        //     ],
        //     shortcuts: [
        //       {
        //         name: "Demo",
        //         short_name: "Demo",
        //         url: "/demo/",
        //         icons: [
        //           {
        //             src: "/assets/icon/guide-maskable.png",
        //             sizes: "192x192",
        //             purpose: "maskable",
        //             type: "image/png",
        //           },
        //         ],
        //       },
        //     ],
        //   },
        // },
    },
    // 多语言配置
    metaLocales: {
        editLink: "在 GitHub 上编辑此页",
    },
});
