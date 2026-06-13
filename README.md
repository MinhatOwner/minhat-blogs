# vuepress 相关配置

## 文章 Frontmatter 可以配置那些字段

```yaml
# 这是文章的标题
title: 页面配置
# 导航栏/侧边栏优先显示
shortTitle: 短标题
# 你可以自定义封面图片
cover: /assets/images/cover1.jpg
# 这是页面的图标
icon: file
# 侧边栏排序（正数越小越靠前，负数越大越靠后）
order: 3
# 作者，设为 false 可隐藏
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
# 此页面会在文章列表置顶，置顶（数字越大越靠前）
sticky: true
# 此页面会出现在星标文章中， 星标文章（数字越大越靠前）
star: true
# 你可以自定义页脚，页脚内容（false 禁用）
footer: 这是测试显示的页脚
# 你可以自定义版权信息，页脚版权，设为 false 禁用
copyright: 无版权
# 是否原创
isOriginal: true
# 文章描述
description: 文章描述
# 协议名称
license: MIT
# 是否加入文章列表
article: true
# 是否加入时间线
timeline: true
```