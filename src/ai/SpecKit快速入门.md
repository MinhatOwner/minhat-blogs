---
title: SpecKit快速入门
description: 文章描述
icon: basil:document-solid
author: Minhat
isOriginal: true
date: 2026-06-12
category:
  - AI
tag:
  - AI
---

这是文章摘要

<!-- more -->

- GitHub：https://github.com/github/spec-kit
- 文档：https://github.github.com/spec-kit

Speac Kit 是一款开源工具包，让你专注于**产品业务场景**与**可预期的交付成果**，无需从零开始凭感觉逐行手写代。码。

# 什么是规约驱动开发？

**规约驱动开发（SDD，Spec-Driven Development）**彻底颠覆了传统软件开发模式。数十年来，代码一直占据主导地位 —— 技术规约仅仅被当作临时框架，一旦进入实际编码阶段，便被束之高阁、弃之不用。而规约驱动开发改变了这一现状：技术规约具备可执行性，不再只是作为开发指引，而是能够直接生成可运行的程序实现。

# 安装 Specify 指南

## 1、前提要求

- Linux/macOS（也支持 Windows；现已无需 WSL 即可使用 PowerShell 脚本）
- AI 编程Aagent: Claude Code, GitHub Copilot, Codebuddy CLI, Gemini CLI, or Pi Coding Agent
- 使用 uv 进行包管理（推荐），或使用 pipx 进行持久化安装。
- **Python 3.11+**
- Git

## 2、安装

**使用uv/uvx安装**

```bash
# uv安装
pip install uv

uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

**使用 pipx 安装**

```bash
pipx install git+https://github.com/github/spec-kit.git
```

## 3、验证安装

```bash
specify version
```

# 快速使用

## 1、初始化新项目

```bash
# 创建新的项目
specify init <PROJECT_NAME>

# 初始化存在的项目
specify init .

# 检查已安装工具
specify check
```

## 2、定义你的规范体系/宪法（constitution）

在你的编码Agent的聊天界面中，使用`/speckit-constitution`斜杠命令来建立项目的核心规则和原则。你应该将项目的具体原则作为参数提供。

```bash
/speckit-constitution 本项目遵循库优先开发理念。所有功能必须先以独立库的形式实现。项目严格采用测试驱动开发（TDD），并优先选用函数式编程范式。
```

## 3、创建规约/规范文档（specify）

在对话中，使用`/speckit-specify`斜杠命令来描述你想要构建的内容。重点放在是什么和为什么上，无需提及技术栈。

```bash
/speckit-specify 开发一款应用，可帮我将照片整理到不同相册中。相册按日期自动分组，支持在主页通过拖拽方式重新排序。相册不允许嵌套存放其他相册。每个相册内的照片以网格缩略图形式展示预览。
```

## 4、完善规约/规范文档（clarify）

在对话中，使用`/speckit-clarify`斜杠命令，识别并解决规约中存在的模糊歧义。你可以传入指定重点领域作为参数。

```bash
/speckit-clarify 聚焦安全与性能相关要求
```

## 5、验证需求质量（checklist）

请使用以下命令验证规范清单`/speckit-checklist`：

```bash
/speckit-checklist
```

## 6、制定技术实施计划（plan）

在对话中，使用`/speckit-plan`斜杠命令，给出你的技术栈和架构选型方案。

## 7、拆解任务（tasks）

在对话中，使用`/speckit-tasks`斜杠命令，创建可执行的任务清单。

```bash
/speckit-tasks
```

## 8、校验（analyze）

可选操作：在对话中，使用`/speckit-analyze`校验方案

```bash
/speckit-analyze
```

## 9、实施（implement）

在对话中，使用`/speckit-implement`斜杠命令执行方案。

```bash
/speckit-implement
```
::: warning 提示
分阶段实施：对于复杂项目，应分阶段实施（例如，第一阶段：基本项目/任务结构；第二阶段：看板功能；第三阶段：评论和分配），以避免对代理的上下文造成过大负担。首先实现核心功能，验证其有效性，然后逐步添加其他功能。
:::

## 核心原则

1. 明确说明你要构建什么以及为什么
2. 在规范制定阶段不要过分关注技术栈
3. 正式实施前，反复迭代并完善您的规范。
4. 编写代码前先对技术方案进行校验评估
5. 交由智能编码Agent处理具体实现细节

# 官网资源导航

## CLI 参考

官方文档：https://github.github.com/spec-kit/reference/overview.html

Specific CLI（specify）管理规范驱动开发的完整生命周期——从项目初始化到工作流自动化。

- [核心指令](https://github.github.com/spec-kit/reference/core.html)：创建和管理 Spec Kit 项目的基础命令。使用必要的目录结构、模板和脚本初始化一个新项目。确认您的系统已安装所需的工具。检查版本和系统信息。
- [集成](https://github.github.com/spec-kit/reference/integrations.html)：集成功能将 Spec Kit 连接到您的 AI 编码代理。每个集成都会为特定代理设置相应的命令文件、上下文规则和目录结构。每个项目一次只能激活一个集成，您可以随时在它们之间切换。
- [扩展](https://github.github.com/spec-kit/reference/extensions.html)：扩展程序为 Spec Kit 添加新功能，包括特定领域的命令、外部工具集成、质量门控等等。用户可以通过目录发现这些扩展程序，并且可以独立地进行安装、更新、启用、禁用或移除。多个扩展程序可以共存于同一个项目中。
- [预设](https://github.github.com/spec-kit/reference/presets.html)：预设功能可自定义 Spec Kit 的工作方式——无需更改任何工具即可覆盖命令文件、模板文件和脚本文件。它们使您能够强制执行组织标准、根据您的方法论调整工作流程或实现整体体验的本地化。多个预设可以按优先级顺序堆叠，从而分层进行自定义。
- [工作流程](https://github.github.com/spec-kit/reference/workflows.html)：工作流将多步骤的规范驱动开发流程自动化为可重复的序列。它们将命令、提示符、shell 步骤和人工检查点串联起来，支持条件逻辑、循环、扇出/扇入，以及从中断的确切位置暂停和恢复的功能。

## 社区
- [社区预设](https://github.github.com/spec-kit/community/presets.html)：由社区贡献的预设可以自定义 Spec Kit 的行为——覆盖模板、命令和术语，而无需更改任何工具
- [社区攻略](https://github.github.com/spec-kit/community/walkthroughs.html)：通过这些由社区贡献的演练，了解规范驱动开发在不同场景下的实际应用
- [社区扩展](https://github.github.com/spec-kit/community/friends.html)：对 Spec Kit 进行扩展、可视化或构建的社区项目