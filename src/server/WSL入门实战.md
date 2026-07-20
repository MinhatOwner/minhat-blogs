---
title: WSL入门实战
shortTitle: WSL入门
description: 文章描述
icon: basil:document-solid
author: Minhat
isOriginal: true
date: 2026-07-20
category:
  - SERVER
tag:
  - Linux
  - WSL
---

WSL（Windows Subsystem for Linux）是 Windows 上运行 Linux 环境的官方解决方案。本文从零开始，涵盖 WSL 的安装、常用命令、配置优化、与 Windows 的互操作，以及开发环境的搭建，帮助你在 Windows 上高效使用 Linux。

<!-- more -->

# WSL 简介

## 什么是 WSL？

WSL（Windows Subsystem for Linux）是微软为 Windows 10/11 提供的 Linux 兼容层，允许用户在 Windows 上原生运行 Linux 二进制可执行文件。无需虚拟机、无需双系统，即可获得完整的 Linux 终端体验。

## WSL 1 与 WSL 2

| 特性 | WSL 1 | WSL 2 |
|------|-------|-------|
| 架构 | 兼容层翻译 Linux 系统调用 | 运行在轻量级虚拟机中的完整 Linux 内核 |
| 文件系统性能 | Windows 文件系统操作快 | Linux 原生文件系统操作快 |
| 跨文件系统访问 | 快 | 较慢（建议文件放在 Linux 文件系统中） |
| 系统兼容性 | 部分系统调用不支持 | 完整 Linux 内核，兼容性好 |
| Docker 支持 | 不支持 | 原生支持 |
| 内存占用 | 较小 | 较大（可配置） |

**建议**：日常开发使用 WSL 2，除非需要在 Windows 文件系统中频繁操作大量小文件。

# WSL 安装

## 前置条件

- Windows 10 版本 2004 及以上（内部版本 19041 及以上），或 Windows 11
- 启用虚拟化功能（BIOS 中开启）

## 一键安装（推荐）

打开 **PowerShell（管理员）** ，执行：

```powershell
# 安装 WSL，默认使用 WSL 2
wsl --install
```

这条命令会自动完成以下步骤：
1. 启用「适用于 Linux 的 Windows 子系统」可选功能
2. 启用「虚拟机平台」可选功能
3. 下载并安装 Linux 内核更新包
4. 将 WSL 2 设为默认版本
5. 安装 Ubuntu（默认发行版）

安装完成后**重启计算机**，首次启动会自动进入 Ubuntu，设置用户名和密码即可。

## 手动安装

如果一键安装失败，可以分步操作：

### 1. 启用 WSL 功能

```powershell
# 以管理员身份运行 PowerShell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 启用虚拟机平台
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

重启计算机后继续。

### 2. 下载 Linux 内核更新包

前往 [WSL2 Linux 内核更新包](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi) 下载并安装。

### 3. 设置 WSL 2 为默认版本

```powershell
wsl --set-default-version 2
```

### 4. 安装 Linux 发行版

```powershell
# 查看可用的发行版
wsl --list --online

# 安装指定发行版，例如 Ubuntu 22.04
wsl --install -d Ubuntu-22.04
```

# WSL 基本命令

## 发行版管理

```bash
# 列出已安装的发行版及其状态（WSL 版本、运行状态）
wsl -l -v
wsl --list --verbose

# 仅列出正在运行的发行版
wsl --list --running

# 列出所有可在线安装的发行版
wsl --list --online
wsl -l -o

# 查看可安装发行版的详细信息（含版本号、下载地址）
wsl --list --online --all

# 设置默认发行版
wsl --set-default Ubuntu-22.04
wsl -s Ubuntu-22.04

# 注销（卸载）指定发行版（会删除所有数据）
wsl --unregister Ubuntu-22.04

# 导出发行版为 tar 文件（备份/迁移）
wsl --export Ubuntu-22.04 D:\backup\ubuntu.tar

# 从 tar 文件导入发行版（可指定安装路径和 WSL 版本）
wsl --import Ubuntu-22.04 D:\WSL\Ubuntu D:\backup\ubuntu.tar --version 2

# 导入时指定用户（新建的发行版默认以 root 登录，需配合 wsl.conf 设置默认用户）
wsl --import Ubuntu-22.04 D:\WSL\Ubuntu D:\backup\ubuntu.tar --version 2
```

## 启动与退出

```bash
# 启动默认发行版（进入 Home 目录）
wsl

# 在 Windows 当前目录启动 WSL
wsl .

# 在指定目录启动
wsl --cd /home/username/projects
wsl --cd ~/projects

# 以指定用户身份启动
wsl -u root
wsl --user root

# 启动指定发行版
wsl -d Ubuntu-22.04
wsl --distribution Ubuntu-22.04

# 启动后不进入交互式 shell，只执行指定命令
wsl ls -la
wsl -d Ubuntu-22.04 uname -r

# 不加载 Linux profile 文件执行命令（跳过 .bashrc / .profile）
wsl -e bash -c "echo Hello"
wsl --exec bash -c "echo Hello"

# 以指定 shell 启动
wsl --shell-type standard    # 默认 bash
wsl --shell-type login       # 登录 shell（加载 profile）
wsl --shell-type none        # 不启动任何 shell（仅启动 WSL 进程）

# 退出当前 WSL 会话
exit
# 或按 Ctrl+D

# 注销当前会话（不关闭整个 WSL，只退出当前终端）
logout
```

## 运行状态管理

```bash
# 终止（停止）指定发行版
wsl --terminate Ubuntu-22.04
wsl -t Ubuntu-22.04

# 关闭所有发行版和 WSL 虚拟机
wsl --shutdown

# 检查 WSL 整体状态（版本、内核信息、更新时间等）
wsl --status

# 检查哪些发行版正在运行
wsl --list --running

# 查看 WSL 版本信息
wsl --version
cat /proc/version        # 在 WSL 内部查看内核版本
```

## 更新与修复

```bash
# 更新 WSL 内核（Windows 11 / Windows 10 21H2+）
wsl --update

# 仅更新内核，不回滚到旧版
wsl --update --pre-release

# 查看更新历史
wsl --update --status

# 回滚到上一个 WSL 版本
wsl --update rollback

# 修复 WSL（检查系统组件完整性）
wsl --install --no-launch
```

## 版本切换

```bash
# 将指定发行版切换为 WSL 2
wsl --set-version Ubuntu-22.04 2

# 将指定发行版切换为 WSL 1
wsl --set-version Ubuntu-22.04 1

# 查看转换进度（转换可能需要几分钟）
# 转换前建议先备份
wsl --export Ubuntu-22.04 D:\backup\ubuntu.tar
```

## 路径转换（wslpath）

在 WSL 和 Windows 路径之间互转，脚本高频使用：

```bash
# Windows 路径 → WSL 路径
wslpath "C:\\Users\\Minhat\\Documents"
# 输出: /mnt/c/Users/Minhat/Documents

# WSL 路径 → Windows 路径
wslpath -w /home/username/projects
# 输出: \\wsl$\Ubuntu-22.04\home\username\projects

# 转换为 Windows 绝对路径
wslpath -a /mnt/c/Users

# 转换后放到剪贴板
wslpath -w /home/user/file.txt | clip.exe
```

## 系统信息查看

```bash
# 查看 WSL 发行版的 IP 地址
ip addr show eth0 | grep "inet "

# 主机名
hostname

# 查看当前 WSL 版本
wsl.exe -l -v

# 查看已安装的发行版详细信息（注册表路径）
# 在 Windows PowerShell 中：
Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Lxss\*" | Select-Object DistributionName, Version, State

# 查看 WSL 虚拟磁盘占用空间
# 在 Windows PowerShell 中：
Get-ChildItem "$env:LOCALAPPDATA\Packages" -Recurse -Filter "ext4.vhdx" | Select-Object FullName, @{N="Size(GB)";E={[math]::Round($_.Length/1GB, 2)}}
```

## Windows Terminal 集成

安装 WSL 后，Windows Terminal 会自动为每个发行版生成一个配置文件：

```bash
# 在 Windows Terminal 中直接启动指定发行版
wt -d "\\wsl$\Ubuntu-22.04\home\username" -p "Ubuntu-22.04"

# 新建标签页并在 WSL 中执行命令
wt -p "Ubuntu-22.04" -- wsl htop

# 分屏打开多个 WSL 发行版
wt -p "Ubuntu-22.04" ; split-pane -p "Debian"

# 在任意目录右键 → "在终端中打开" 即可在 WSL 中进入该目录
```

## 多发行版同时运行

WSL 2 支持同时运行多个发行版，互不干扰：

```bash
# 在每个发行版中启动不同的服务
wsl -d Ubuntu-22.04 -e bash -c "python3 -m http.server 8080"
wsl -d Debian -e bash -c "node server.js"

# 在不同终端窗口中操作不同发行版
# 它们共享同一个 WSL 2 虚拟机，但文件系统相互隔离
```

# WSL 配置

WSL 的全局配置文件位于用户目录下：

- **全局配置**：`%UserProfile%\.wslconfig`
- **发行版配置**：`/etc/wsl.conf`（在每个发行版内部）

## .wslconfig 全局配置

在 Windows 用户目录下创建 `.wslconfig` 文件：

```ini
# 全局 WSL 配置
[wsl2]
# 内存限制（默认为主机内存的 50% 或 8GB，取较小值）
memory=4GB

# 处理器核心数
processors=4

# 交换文件大小，设为 0 表示不使用交换文件
swap=2GB

# 交换文件存放路径
swapFile=D:\\WSL\\swap.vhdx

# 是否允许 WSL 使用 Windows 的网络代理
networkingMode=NAT

# 是否将 Windows 主机作为 DNS 代理
dnsTunneling=true

# 防火墙是否允许 WSL 的端口被主机访问
firewall=true

# 空闲连接多久后关闭（毫秒）
autoProxy=true

[experimental]
# 启用自动内存回收
autoMemoryReclaim=gradual

# 启用稀疏 VHD（虚拟磁盘按需增长）
sparseVhd=true
```

修改后执行 `wsl --shutdown` 重启 WSL 使配置生效。

## wsl.conf 发行版配置

在 WSL 内部编辑 `/etc/wsl.conf`：

```ini
# 发行版级配置

[boot]
# 是否启用 systemd（需要 WSL 0.67.6+）
systemd=true

[network]
# 主机名
hostname=dev-ubuntu
# 是否自动生成 /etc/hosts
generateHosts=true
# 是否自动生成 /etc/resolv.conf
generateResolvConf=true

[interop]
# 是否允许 WSL 中调用 Windows 程序
enabled=true
# 是否自动附加 Windows PATH 到 Linux 环境变量
appendWindowsPath=true

[user]
# 默认登录用户
default=yourusername

[filesystem]
# Linux 文件系统是否大小写敏感
caseSensitive=true
```

配置后同样需要 `wsl --shutdown` 重启生效。

# Windows 与 WSL 互操作

## 文件系统互通

这是 WSL 最强大的特性之一——两个系统可以无缝访问彼此的文件。

```bash
# ===== 在 WSL 中访问 Windows 文件 =====

# Windows 盘符挂载在 /mnt 下
ls /mnt/c/Users/
cd /mnt/d/Projects/

# 在 WSL 中打开 Windows 资源管理器（当前目录）
explorer.exe .

# 在 WSL 中用 VS Code 打开当前目录
code .

# ===== 在 Windows 中访问 WSL 文件 =====

# 在资源管理器地址栏输入：
\\wsl$\Ubuntu-22.04\home\username\

# 或在 PowerShell 中：
cd \\wsl$\Ubuntu-22.04\home\username\
```

::: warning 性能提示
跨文件系统操作时（如在 WSL 中访问 `/mnt/c/` 下的文件），IO 性能会下降。对于开发项目，建议将代码放在 WSL 的 Linux 文件系统中（如 `/home/username/projects/`），而不是 Windows 文件系统。WSL 2 中，Linux 原生文件系统的 IO 性能远超跨文件系统访问。
:::

## 网络互操作

```bash
# WSL 与 Windows 共享 IP（WSL 2 默认 NAT 模式）

# 在 WSL 中获取 Windows 主机的 IP
cat /etc/resolv.conf | grep nameserver

# 便捷写法：直接使用 hostname
ping $(hostname).local

# Windows 访问 WSL 中的服务
# WSL 中启动的服务（如 web server）可以直接通过 localhost 访问
# 例如 WSL 中运行 python -m http.server 8080
# Windows 浏览器直接访问 http://localhost:8080
```

## 互相调用命令

```bash
# ===== WSL 中调用 Windows 程序 =====

# 打开记事本
notepad.exe test.txt

# 打开浏览器
explorer.exe "https://github.com"

# 使用 PowerShell 命令
powershell.exe "Get-Process"

# 使用剪贴板（将 WSL 输出复制到 Windows 剪贴板）
cat file.txt | clip.exe

# ===== Windows 中调用 WSL 命令 =====

# PowerShell / CMD 中：
wsl ls -la
wsl git status
wsl find . -name "*.java"

# 管道操作
echo "hello" | wsl tr '[:lower:]' '[:upper:]'
```

# 开发环境搭建

## 搭配 VS Code

VS Code 的 **WSL 远程开发** 插件（`ms-vscode-remote.remote-wsl`）让开发体验几乎与原生 Linux 一致。

```bash
# 在 WSL 终端中，进入项目目录后：
code .

# 第一次运行会自动安装 WSL 扩展
# 之后 VS Code 的所有终端、调试、Git 操作都在 WSL 中执行
```

## 搭配 IntelliJ IDEA

IntelliJ IDEA 也支持通过 WSL 进行开发：

1. 将项目放在 WSL 文件系统中（通过 `\\wsl$` 访问）
2. 在 IDEA 中直接打开该路径
3. 在 `Settings > Build > Build Tools` 中将构建工具指向 WSL 中的 Gradle/Maven

或者直接在 WSL 中安装 JetBrains Toolbox：

```bash
# 下载并安装 JetBrains Toolbox（Linux 版）
# 可在 WSL 中原生运行 JetBrains IDE
```

## Java 开发环境

```bash
# 安装 JDK（以 Ubuntu 为例）
sudo apt update
sudo apt install openjdk-17-jdk

# 验证安装
java -version
javac -version

# 安装 Maven
sudo apt install maven

# 安装 Gradle（使用 SDKMAN）
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install gradle
```

## Node.js 开发环境

```bash
# 使用 nvm 管理 Node.js 版本
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载配置
source ~/.bashrc

# 安装 Node.js LTS
nvm install --lts
nvm use --lts

# 验证
node -v
npm -v
```

## Docker 环境

WSL 2 原生支持 Docker，无需额外虚拟机：

```bash
# 方式一：安装 Docker Desktop for Windows
# 在 Settings > Resources > WSL Integration 中启用对应发行版

# 方式二：在 WSL 中直接安装 Docker Engine
sudo apt install docker.io
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

## Git 配置

```bash
# 安装 Git
sudo apt install git

# 配置用户信息
git config --global user.name "Minhat"
git config --global user.email "your-email@example.com"

# 配置 SSH 密钥
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub   # 复制公钥到 GitHub/Gitee

# 配置行尾处理（WSL + Windows 协作）
git config --global core.autocrlf input
```

# 常用技巧

## systemd 支持

WSL 0.67.6 及以上版本支持 systemd，使后台服务管理更自然：

```bash
# 编辑 /etc/wsl.conf，添加：
# [boot]
# systemd=true

# 重启 WSL 后生效
wsl --shutdown

# 之后就可以正常使用 systemctl
sudo systemctl start nginx
sudo systemctl enable docker
sudo systemctl status postgresql
```

## 端口转发

当需要通过 Windows 访问 WSL 中运行的服务时：

```bash
# 从 Windows 获取 WSL 的 IP
wsl hostname -I

# 在管理员 PowerShell 中设置端口转发
netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=<WSL_IP>

# 查看转发规则
netsh interface portproxy show all

# 删除转发规则
netsh interface portproxy delete v4tov4 listenport=8080 listenaddress=0.0.0.0
```

::: tip 提示
大多数情况下无需手动端口转发——WSL 2 自动将 `localhost` 转发到 Linux 中的服务。`wsl --install` 安装的新版本已是默认行为。
:::

## 磁盘空间管理

WSL 2 使用 `.vhdx` 虚拟磁盘文件，只增不减：

```powershell
# 查找 vhdx 文件位置
Get-ChildItem -Path "$env:LOCALAPPDATA\Packages" -Recurse -Filter "*.vhdx" | Select-Object FullName, Length

# 压缩磁盘空间（以管理员身份运行）
# 先关闭 WSL
wsl --shutdown

# 打开 DiskPart
diskpart
select vdisk file="C:\Users\你的用户名\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu22.04LTS_xxx\LocalState\ext4.vhdx"
attach vdisk readonly
compact vdisk
detach vdisk
exit
```

## 图形界面应用

WSL 2 支持运行 Linux GUI 应用（需要 Windows 11 或 Windows 10 21H2+）：

```bash
# 安装图形应用
sudo apt install gedit
sudo apt install nautilus

# 直接在终端启动
gedit &
nautilus .

# 安装完整的桌面环境（可选）
sudo apt install xfce4
```

# 常见问题

## 网络问题：WSL 内无法访问外网

```bash
# 问题表现：ping 不通外网，apt update 失败
# 解决方案 1：重置 DNS
sudo rm /etc/resolv.conf
sudo bash -c 'echo "nameserver 8.8.8.8" > /etc/resolv.conf'
sudo bash -c 'echo "nameserver 114.114.114.114" >> /etc/resolv.conf'

# 解决方案 2：在 .wslconfig 中禁用 DNS 隧道
# [wsl2]
# dnsTunneling=false
```

## 内存占用过高

```ini
# 编辑 %UserProfile%\.wslconfig
[wsl2]
memory=4GB          # 限制最大内存
swap=2GB            # 限制交换空间

[experimental]
autoMemoryReclaim=gradual  # 自动回收空闲内存
```

修改后执行 `wsl --shutdown`。

## 无法启动 WSL

```bash
# 错误：请启用虚拟机平台 Windows 功能并确保在 BIOS 中启用虚拟化
# 解决方案：
# 1. 检查 BIOS 是否开启虚拟化（Intel VT-x / AMD-V）
# 2. 以管理员身份运行：
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
# 3. 重启
```

## 文件权限问题

在 `/mnt/c` 等 Windows 挂载点下，Linux 权限系统不完全适用：

```bash
# 查看挂载选项
mount | grep "/mnt/c"

# 在 /etc/wsl.conf 中配置挂载选项
# [automount]
# enabled = true
# options = "metadata,umask=22,fmask=11"
# mountFsTab = false
```

# 总结

WSL 为 Windows 开发者提供了近乎原生的 Linux 体验，兼顾了两大系统的优势：

| 使用场景 | 推荐位置 |
|----------|----------|
| 项目代码（需要高性能 IO） | WSL 文件系统（`/home/username/projects/`） |
| 配置文件（需要跨系统访问） | Windows 文件系统（`/mnt/c/Users/`） |
| 后端服务（Node/Java/Python） | WSL 中运行 |
| 前端开发（VS Code） | WSL + VS Code Remote 插件 |
| Docker 容器 | WSL 2 + Docker Desktop |

掌握 WSL，你就拥有了 Windows 生态和 Linux 生态的双重优势，开发效率翻倍。
