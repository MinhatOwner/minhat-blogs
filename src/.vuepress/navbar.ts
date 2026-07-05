import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",
    "/os/",
    "/ai/",
    "/study/",
    "/other/",
    {
        text: "推荐网站",
        icon: "link",
        children: [
            {
                text: "娱乐",
                children: [
                    {
                        text: "扫雷",
                        link: "https://minesweeper.online",
                    },
                    {
                        text: "小霸王",
                        link: "https://www.yikm.net",
                    },
                    {
                        text: "灰机Wiki",
                        link: "https://www.huijiwiki.com",
                    },
                    {
                        text: "欧乐影院",
                        link: "https://www.yifan168.net",
                    },
                    {
                        text: "我爱音乐",
                        link: "https://www.lovemusic520.com",
                    },
                ]
            },
            {
                text: "编程资源",
                children: [
                    {
                        text: "VuePress主题",
                        link: "https://theme-hope.vuejs.press",
                    },
                    {
                        text: "Spring中文网",
                        link: "https://springdoc.cn",
                    },
                    {
                        text: "MvnRepository",
                        link: "https://mvnrepository.com",
                    },
                    {
                        text: "Java全栈知识体系",
                        link: "https://pdai.tech",
                    },
                    {
                        text: "JavaGuide",
                        link: "https://javaguide.cn",
                    },
                    {
                        text: "仓颉编程语言",
                        link: "https://cangjie-lang.cn",
                    },
                    {
                        text: "程序员盒子",
                        link: "https://www.coderutil.com",
                    },
                    {
                        text: "W3CSchool",
                        link: "https://www.w3cschool.cn",
                    },
                    {
                        text: "Mermaid",
                        link: "https://mermaid.nodejs.cn",
                    },
                    {
                        text: "冰河技术",
                        link: "https://binghe.gitcode.host",
                    },
                    {
                        text: "iconify",
                        link: "https://iconify.design",
                    },
                ]
            }
        ]
    },
]);
