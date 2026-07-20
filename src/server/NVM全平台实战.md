---
title: NVM全平台实战
shortTitle: NVM实战
description: 文章描述
icon: basil:document-solid
author: Minhat
isOriginal: true
date: 2026-07-20
category:
  - SERVER
tag:
  - NVM
  - Node.js
---

NVM 是 Node.js 版本管理的事实标准工具。本文覆盖 nvm（Linux/WSL/macOS）和 nvm-windows（Windows）双平台，从安装、常用命令到项目实战，帮你统一管理开发环境中的 Node.js 版本。

<!-- more -->

# NVM 是什么？

NVM（Node Version Manager）让你在同一台机器上安装和切换不同版本的 Node.js。一条命令就能切换 Node 版本，告别全局覆盖、反复卸载安装的噩梦。

**典型场景：**
- 老项目需要 Node 14，新项目需要 Node 20
- 团队协作中每个人的 Node 版本不一致
- 想尝鲜新版 Node 又不想破坏当前环境
- CI/CD 中锁定项目所需的 Node 版本

# nvm（Linux / WSL / macOS）

## 安装 nvm

```bash
# 方式一：官方安装脚本（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 方式二：使用 wget
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 方式三：Git 克隆安装
git clone https://github.com/nvm-sh/nvm.git ~/.nvm
cd ~/.nvm
git checkout v0.40.1
```

安装脚本会自动在 `~/.bashrc` 或 `~/.zshrc` 中追加以下内容：

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

安装完成后，重新打开终端或执行：

```bash
source ~/.bashrc   # 或 source ~/.zshrc
```

验证安装：

```bash
nvm --version
# 输出类似: 0.40.1
```

## 镜像加速

国内网络拉取 Node 可能很慢，配置淘宝镜像：

```bash
# 设置镜像源为 npmmirror（淘宝）
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node

# 写入 shell 配置文件，永久生效
cat >> ~/.bashrc << 'EOF'
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
EOF

source ~/.bashrc
```

## 核心命令

### 安装 Node.js

```bash
# 安装最新版本
nvm install node

# 安装指定大版本（自动取该大版本下的最新小版本）
nvm install 22
nvm install 20
nvm install 18

# 安装精确版本
nvm install 20.11.0

# 安装 LTS 版本
nvm install --lts

# 安装指定 LTS 代号
nvm install lts/iron       # Node 20
nvm install lts/jod        # Node 22

# 安装后自动切换并显示版本
nvm install 22 && nvm use 22 && node -v
```

### 版本切换与查看

```bash
# 查看已安装的所有版本
nvm ls

# 查看所有可安装的远程版本（前 20 条）
nvm ls-remote

# 查看所有远程 LTS 版本
nvm ls-remote --lts

# 切换版本（当前终端会话生效）
nvm use 20

# 切换版本（指定全局别名 default）
nvm alias default 20

# 切换到 system 安装的 Node
nvm use system

# 查看当前使用的版本
nvm current
node -v
```

### 版本管理

```bash
# 卸载指定版本
nvm uninstall 18.16.0

# 查看指定版本的安装路径
nvm which 20.11.0

# 查看 nvm 的 Node 安装根目录
nvm which current

# 列出版本（带详细路径）
nvm ls --no-alias
```

### 别名与默认版本

```bash
# 设置默认版本（新终端自动使用）
nvm alias default 22

# 查看所有别名
nvm alias

# 自定义别名（给项目用的语义化名称）
nvm alias my-project 20.11.0
nvm alias legacy 14.21.3

# 切换到自定义别名
nvm use my-project

# 删除别名
nvm unalias my-project
nvm unalias legacy
```

## .nvmrc 自动切换

在项目根目录创建 `.nvmrc` 文件，团队成员和 CI 都能明确定义版本：

```bash
# 在项目根目录创建 .nvmrc
echo "20" > .nvmrc
# 或锁定精确版本
echo "20.11.0" > .nvmrc
# 或指定 LTS
echo "lts/iron" >> .nvmrc

# 进入项目目录后，手动执行自动切换
nvm use

# 要实现 cd 进目录自动切换，在 ~/.bashrc 中添加脚本
```

### 自动切换脚本

将以下内容追加到 `~/.bashrc`（或 `~/.zshrc`）：

```bash
# 进入目录时自动执行 nvm use
autoload -U add-zsh-hook   # 仅 zsh 需要
load-nvmrc() {
  local nvmrc_path
  nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version
    nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$(nvm version)" ]; then
      nvm use
    fi
  elif [ -n "$(PWD=$OLDPWD nvm_find_nvmrc)" ] && [ "$(nvm version)" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc   # zsh 版本
load-nvmrc
```

::: tip 提示
如果上面脚本太长，也可以用更轻量的方案：每次进项目手动 `nvm use`，或者用 fnm（一个更快的 nvm 替代品，自带自动切换功能）。
:::

# nvm-windows（Windows 原生）

如果你不使用 WSL，直接在 Windows 上开发，需要用 **nvm-windows**（与 Linux 版 nvm 不是同一个项目，命令略有差异）。

## 安装 nvm-windows

1. 下载安装包：[nvm-windows releases](https://github.com/coreybutler/nvm-windows/releases)
   - 推荐 `nvm-setup.exe`（安装器，自动配置环境变量）
   - 可选 `nvm-setup.zip`（绿色版，手动配置）
2. 运行安装器，按提示完成安装
3. **安装前如果已有全局 Node.js，建议先卸载**，避免冲突

验证安装：

```powershell
nvm version
# 输出类似: 1.1.12
```

::: warning 注意
nvm-windows 需要以**管理员身份**运行终端才能执行 `nvm install` 和 `nvm use`。安装时勾选 "Allow the application to use symbolic links" 可避免管理员权限要求。
:::

## 镜像加速

```powershell
# 设置镜像源为 npmmirror
nvm node_mirror https://npmmirror.com/mirrors/node/
nvm npm_mirror https://npmmirror.com/mirrors/npm/

# 查看当前镜像配置
nvm root
# 配置文件在 %APPDATA%\nvm\settings.txt
```

## 核心命令

### 安装 Node.js

```powershell
# 安装最新版本（64位）
nvm install latest

# 安装指定版本（64位）
nvm install 20.11.0

# 安装 32 位版本
nvm install 20.11.0 32

# 安装 LTS 版本
nvm install lts

# 查看所有可安装的远程版本
nvm list available
```

### 版本切换与查看

```powershell
# 查看已安装的版本
nvm list
nvm ls

# 切换版本
nvm use 20.11.0

# 查看当前使用的版本
nvm current
node -v
```

### 版本管理

```powershell
# 卸载指定版本
nvm uninstall 18.16.0

# 查看 nvm 安装目录
nvm root
```

### npm 相关

nvm-windows 在切换 Node 版本时，npm 也会一同切换（npm 随 Node 安装包捆绑）：

```powershell
# 升级 npm 到最新
nvm install latest
nvm use <new-version>
npm install -g npm@latest

# 统一管理全局包
# 切换版本后需要重新安装全局包，常用策略：
# 1. 用 npx 替代全局安装（如 npx create-react-app）
# 2. 记录全局包清单以便快速恢复
```

## 与 nvm（Linux 版）命令差异速查

| 操作 | nvm (Linux/WSL) | nvm-windows (Windows) |
|------|------------------|------------------------|
| 查看可安装版本 | `nvm ls-remote` | `nvm list available` |
| 安装最新版 | `nvm install node` | `nvm install latest` |
| 安装 LTS | `nvm install --lts` | `nvm install lts` |
| 设置默认版本 | `nvm alias default 20` | `nvm use 20.11.0`（use 即默认） |
| 查看别名 | `nvm alias` | 不支持 |
| .nvmrc 支持 | 支持 | 不支持 |
| 安装 32 位 | 不支持（只能装对应架构） | `nvm install 20.11.0 32` |
| 需要管理员权限 | 不需要 | 需要（或用符号链接模式） |

# 项目实战流程

## 场景一：接手一个老项目

项目要求 Node 14，而你本机是 Node 22：

```bash
# 1. 安装项目所需版本
nvm install 14

# 2. 切换到该版本
nvm use 14

# 3. 验证
node -v   # v14.21.3
npm -v

# 4. 安装依赖并运行
npm install
npm run dev

# 5. 完事后切回日常版本
nvm use 22
```

## 场景二：多项目并行开发

```bash
# 终端 A：维护老项目（Node 14）
cd ~/projects/legacy-app
nvm use 14
npm run dev

# 终端 B：开发新项目（Node 22）
cd ~/projects/new-app
nvm use 22
npm run dev

# 终端 C：尝鲜 Node 23
nvm install 23
nvm use 23
node --version
```

## 场景三：统一团队 Node 版本

```bash
# 1. 项目根目录创建 .nvmrc
echo "20.11.0" > .nvmrc

# 2. 提交到 Git
git add .nvmrc
git commit -m "锁定 Node.js 版本为 20.11.0"

# 3. 团队成员拉取后
git pull
nvm use   # 自动读取 .nvmrc 并切换版本

# 4. CI/CD 中（Dockerfile 或 workflow）：
# actions/setup-node@v4 可以直接读取 .nvmrc
```

## 场景四：全局包迁移

切换 Node 版本后，之前全局安装的包不会自动迁移：

```bash
# 方案一：导出旧版本全局包 → 新版本重新安装
nvm use 20
npm ls -g --depth=0   # 记录全局包清单

# 导出全局包列表
npm ls -g --depth=0 --json > ~/global-packages.json

# 切到新版本后，手动重新安装需要的包
nvm use 22
npm install -g pnpm yarn @vue/cli typescript

# 方案二：统一用 npx 替代全局安装
# 不装全局包，执行时直接用 npx
npx create-react-app my-app
npx prettier --write .
```

# 常见问题

## npm 全局包找不到

```bash
# 症状：切换 Node 版本后，之前装的全局命令（如 vue、yarn）失效
# 原因：每个 Node 版本有独立的全局包目录

# 解决：在新版本下重新安装
nvm use 22
npm install -g yarn pnpm @vue/cli
```

## nvm install 下载慢或失败

```bash
# 确认镜像已配置
echo $NVM_NODEJS_ORG_MIRROR              # Linux/WSL
nvm node_mirror                           # Windows (nvm-windows)

# 如果未配置，重新设置
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node    # nvm
nvm node_mirror https://npmmirror.com/mirrors/node/                # nvm-windows

# 手动下载安装（nvm-windows 备用方案）
# 1. 从镜像站下载对应版本的 zip: https://npmmirror.com/mirrors/node/
# 2. 解压到 %APPDATA%\nvm\ 对应版本目录下
# 3. nvm use <version>
```

## nvm 命令找不到 / nvm: command not found

```bash
# WSL/Linux 中安装后找不到 nvm
source ~/.bashrc           # 先试试手动加载
command -v nvm             # 检查 nvm 是否可执行

# 确认 .bashrc 中有以下内容
# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

```powershell
# Windows 中找不到 nvm
# 1. 检查环境变量 Path 是否包含 nvm 安装目录
# 2. 新开一个终端窗口再试
# 3. 重新运行安装器选择 "Repair"
```

## nvm use 在 Windows 上报权限错误

```powershell
# 以管理员身份运行 PowerShell 或 CMD
# 或安装时启用 "Use Symbolic Links" 模式（但 Node 部分版本不支持符号链接）

# 终极方案：用 WSL2 替代 nvm-windows
wsl --install -d Ubuntu-22.04
# 然后在 WSL 中安装 nvm，告别权限问题
```

## 如何卸载旧的全局 Node.js

```bash
# WSL / Linux
# 如果是 apt 安装的
sudo apt remove nodejs
sudo apt purge nodejs
sudo apt autoremove

# 如果是官方二进制包安装的
sudo rm -rf /usr/local/bin/node
sudo rm -rf /usr/local/bin/npm
sudo rm -rf /usr/local/lib/node_modules
```

```powershell
# Windows
# 控制面板 → 程序和功能 → 卸载 Node.js
# 或手动删除残留
Get-Command node   # 查看 node 路径
Remove-Item -Recurse -Force "C:\Program Files\nodejs"
```

# 总结

| 对比维度 | nvm (Linux/WSL) | nvm-windows |
|---------|------------------|-------------|
| 平台 | Linux、macOS、WSL | Windows 原生 |
| 权限要求 | 普通用户即可 | 需要管理员（或用符号链接模式） |
| .nvmrc 支持 | 支持（自动切换） | 不支持 |
| 别名功能 | 支持 | 不支持 |
| 更新频率 | 活跃维护 | 维护频率较低 |
| 推荐度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐（过渡方案） |

**建议**：Windows 用户优先用 WSL 2 + nvm（Linux 版），功能完整且无权限烦恼。nvm-windows 适合不想折腾 WSL、只需简单版本切换的场景。
