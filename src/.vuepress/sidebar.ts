import {sidebar} from "vuepress-theme-hope";

export default sidebar({
    "/": [
        "",
        {
            text: "Java",
            icon: "ri:java-fill",
            prefix: "java/",
            link: "/java/",
            children: "structure",
        },
        {
            text: "服务器",
            icon: "solar:server-bold",
            prefix: "server/",
            link: "/server/",
            children: "structure",
        },
        {
            text: "人工智能",
            icon: "tdesign:ai-1-filled",
            prefix: "ai/",
            link: "/ai/",
            children: "structure",
        },
        {
            text: "其它",
            icon: "tdesign:app-filled",
            prefix: "other/",
            link: "/other/",
            children: "structure",
        },
        "intro",
    ],
});
