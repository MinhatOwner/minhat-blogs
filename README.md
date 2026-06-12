每篇文章里面可以配置那些

● 基于刚才从官方文档获取的完整信息，以下是每篇文章中可配置的全部 Frontmatter 字段：

  ---
信息类

  ---
title: 文章标题           # 默认取第一个 h1
shortTitle: 短标题         # 导航栏/侧边栏优先显示
description: 文章描述
icon: fa-solid fa-book    # 页面图标 (FontClass 或图片路径)
author: Minhat            # 作者，设为 false 可隐藏
isOriginal: true          # 是否原创
date: 2025-01-01          # 写作日期 YYYY-MM-DD
category:                 # 分类
- 前端
tag:                      # 标签
- Vue
- 教程
license: MIT              # 协议名称
copyright: 版权信息        # 页脚版权，设为 false 禁用
pageview: false           # 是否显示浏览量（需 Waline）
cover: /images/cover.png  # 预览图
banner: /images/banner.png # 宽屏分享图
article: true             # 是否加入文章列表
timeline: true            # 是否加入时间线
sticky: 1                 # 置顶（数字越大越靠前）
star: 1                   # 星标文章（数字越大越靠前）
  ---

布局类

  ---
pageInfo:                # 页面信息显示条目（可自定义排序）
- Author
- Date
- Category
- Tag
- ReadingTime
- Word
breadcrumb: true         # 是否显示路径导航
breadcrumbIcon: true     # 路径导航是否显示图标
breadcrumbExclude: false # 是否被路径导航排除
navbar: true             # false 禁用导航栏
sidebar: true            # false 禁用侧边栏
index: true              # 是否在侧边栏/目录中索引
order: 1                 # 侧边栏排序（正数越小越靠前，负数越大越靠后）
comment: true            # 是否开启评论
lastUpdated: true        # 是否显示最后更新时间
editLink: true           # 是否显示编辑链接
contributors: true       # 是否显示贡献者
changelog: true          # 是否显示变更日志
prev: /path/to/prev      # 上一篇文章链接
next: /path/to/next      # 下一篇文章链接
footer: true             # 页脚内容（false 禁用）
backToTop: true          # 返回顶部按钮
toc: deep                # 标题列表（false 禁用 / deep 显示 h2-h6 / [2,4] 指定级别）
containerClass: my-class # 额外 CSS class
layout: Layout           # 自定义布局名称
侧边栏分组（dir）

当前页面如果是某个目录下的 README.md，可控制该分组：

  ---
dir:
text: 分组标题
icon: fa-solid fa-folder  # 分组图标
collapsible: true         # 是否可折叠
link: false               # 分组是否作为链接
index: true               # 是否索引该目录
order: 1                  # 分组排序
  ---

插件配置类

  ---
copy:
triggerLength: 100        # 触发附加版权的最小字数
disableCopy: false        # 禁用复制
disableSelection: false   # 禁用选择
feed:
title: Feed标题
description: Feed描述
content: Feed内容
author:
- name: Minhat
email: xx@xx.com
url: https://...
contributor: [...]
guid: unique-id
sitemap:
changefreq: daily         # always|hourly|daily|weekly|monthly|yearly|never
exclude: false            # 是否从 Sitemap 排除
priority: 0.7             # 优先级 0~1
  ---

  ---
总共约 40+ 个可配置项，分布在信息、布局、插件三个类别。之前漏掉的 icon、sticky、star、cover、banner 等属于「信息 Frontmatter 配置」，不是 pageInfo 的子项，而是独立的
top-level 字段。


# 还可定义这些

---
# 这是文章的标题
title: 页面配置
# 你可以自定义封面图片
cover: /assets/images/cover1.jpg
# 这是页面的图标
icon: file
# 这是侧边栏的顺序
order: 3
# 设置作者
author: Ms.Hope
# 设置写作时间
date: 2020-01-01
# 一个页面可以有多个分类
category:
- 使用指南
# 一个页面可以有多个标签
tag:
- 页面配置
- 使用指南
# 此页面会在文章列表置顶
sticky: true
# 此页面会出现在星标文章中
star: true
# 你可以自定义页脚
footer: 这是测试显示的页脚
# 你可以自定义版权信息
copyright: 无版权
---