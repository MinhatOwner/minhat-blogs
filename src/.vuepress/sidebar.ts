import {sidebar} from "vuepress-theme-hope";

export default sidebar({
    "/": [
        "",
        {
            text: "操作系统",
            icon: "tdesign:system-code",
            prefix: "os/",
            link: "/os/",
            children: "structure",
        },
        {
            text: "AI",
            icon: "tdesign:ai-1",
            prefix: "ai/",
            link: "/ai/",
            children: "structure",
        },
        {
            text: "学习笔记",
            icon: "iconamoon:apps-thin",
            prefix: "study-notes/",
            link: "/study-notes/",
            children: "structure",
        },
        {
            text: "其它",
            icon: "iconamoon:apps-thin",
            prefix: "other/",
            link: "/other/",
            children: "structure",
        },
        "intro",
    ],
});
