import {sidebar} from "vuepress-theme-hope";

export default sidebar({
    "/": [
        "",
        {
            text: "操作系统",
            icon: "laptop-code",
            prefix: "os/",
            link: "/os/",
            children: "structure",
        },
        {
            text: "AI",
            icon: "laptop-code",
            prefix: "ai/",
            link: "/ai/",
            children: "structure",
        },
        {
            text: "其它",
            icon: "laptop-code",
            prefix: "other/",
            link: "/other/",
            children: "structure",
        },
        {
            text: "如何使用",
            icon: "laptop-code",
            prefix: "demo/",
            link: "demo/",
            children: "structure",
        },
        {
            text: "文章",
            icon: "book",
            prefix: "posts/",
            children: "structure",
        },
        "intro",
        {
            text: "幻灯片",
            icon: "person-chalkboard",
            link: "https://ecosystem.vuejs.press/zh/plugins/markdown/revealjs/demo.html",
        },
    ],
});
