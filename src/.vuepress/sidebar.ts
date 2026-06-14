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
        "intro",
    ],
});
