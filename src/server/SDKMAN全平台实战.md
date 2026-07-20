---
title: SDKMAN全平台实战
shortTitle: SDKMAN实战
description: 文章描述
icon: basil:document-solid
author: Minhat
isOriginal: true
date: 2026-07-20
category:
  - SERVER
tag:
  - SDKMAN
  - Java
---

SDKMAN 是 JVM 生态中管理软件开发工具包的命令行工具。一条命令就能安装和切换 JDK、Maven、Gradle、Kotlin 等工具的不同版本。本文从安装到实战，帮你告别手动配置环境变量的繁琐。

<!-- more -->

# SDKMAN 是什么？

SDKMAN（Software Development Kit Manager）专注于 **JVM 生态**的版本管理。和 NVM 管 Node、pyenv 管 Python 一样，SDKMAN 管理的是：

- **JDK**（Oracle、OpenJDK、GraalVM、Zulu、Temurin 等发行版）
- **构建工具**（Maven、Gradle、Ant、sbt）
- **JVM 语言**（Kotlin、Groovy、Scala）
- **框架 CLI**（Spring Boot CLI、Quarkus CLI、Micronaut CLI）
- **其他工具**（VisualVM、JMeter、JBang）

::: tip 与 NVM 的关系
NVM 管理 Node.js，SDKMAN 管理 Java 生态。两者互补，在 WSL 中可以共存，覆盖前端和后端的版本管理需求。
:::

# 安装 SDKMAN

## Linux / WSL / macOS 安装

```bash
# 一键安装
curl -s "https://get.sdkman.io" | bash

# 安装完成后，加载配置
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

安装脚本会自动在 `~/.bashrc` 或 `~/.zshrc` 末尾追加初始化代码。安装后验证：

```bash
sdk version
# 输出类似: SDKMAN 5.18.2
```

## 离线安装（网络受限环境）

```bash
# 1. 在有网的机器上下载离线包
curl -s "https://get.sdkman.io" | bash
# SDKMAN 安装完成后
sdk offline enable

# 2. 手动部署
# SDKMAN 所有文件在 ~/.sdkman/ 下
# 将整个目录打包迁移到目标机器
tar -czf sdkman.tar.gz ~/.sdkman
```

## Windows 用户

SDKMAN 不直接支持 Windows。推荐两种方式：

```bash
# 方式一：WSL 2 中安装（推荐）
wsl --install -d Ubuntu-22.04
# 然后在 WSL 终端中执行上面的安装命令

# 方式二：使用 Git Bash 或 Cygwin
# 在 Git Bash 中执行 curl -s "https://get.sdkman.io" | bash
# 但部分功能可能受限
```

# 核心命令

## 帮助与总览

```bash
# 查看所有可用命令
sdk help

# 查看某条命令的详细帮助
sdk help install
sdk help use
sdk help env

# 查看 SDKMAN 版本
sdk version

# 查看 SDKMAN 配置信息
sdk config

# 查看 SDKMAN 广播消息（新功能、版本发布通知等）
sdk broadcast
```

## 安装工具（install）

```bash
# 安装最新稳定版
sdk install java
sdk install maven
sdk install gradle

# 安装指定版本（标识符格式：版本号-发行版代号）
sdk install java 21.0.3-tem
sdk install java 17.0.8-tem
sdk install java 8.0.402-tem

# 安装指定发行版的最新版本（大版本通配）
sdk install java 17.0.0-tem        # 安装 Temurin 17 的最新小版本
sdk install java 21.0.0-graal      # 安装 GraalVM 21 的最新小版本
sdk install java 11.0.0-zulu       # 安装 Zulu 11 的最新小版本

# 强制重新安装（覆盖已有版本）
sdk install java 21.0.3-tem --force

# 安装多个工具批量操作
sdk install java 21.0.3-tem && sdk install maven 3.9.6 && sdk install gradle 8.8

# 安装并跳过确认（非交互模式）
sdk install java 21.0.3-tem -y
```

## 版本切换（use / default）

```bash
# 临时切换到指定版本（仅当前终端会话生效）
sdk use java 21.0.3-tem

# 快速切回上一版本
sdk use java 17.0.8-tem
sdk use java 21.0.3-tem
# 没有内置的 "previous" 命令，建议记下版本号

# 设置默认版本（新终端永久生效）
sdk default java 21.0.3-tem

# 查看当前正在使用的是哪个版本
sdk current java
java -version

# 一键切换 + 验证
sdk use java 21.0.3-tem && java -version

# 切换后检查 JAVA_HOME
sdk use java 21.0.3-tem
echo $JAVA_HOME
# /home/用户名/.sdkman/candidates/java/21.0.3-tem
```

`use` 与 `default` 的核心区别：

| 命令 | 生效范围 | 持久性 | 典型场景 |
|------|----------|--------|----------|
| `sdk use` | 仅当前 shell | 关闭终端即失效 | 临时测试新版本、快速切换 |
| `sdk default` | 所有新终端 | 永久（修改 current 软链接） | 日常开发的固定版本 |

日常开发中先用 `sdk use` 试用新版本，确认项目一切正常后再 `sdk default` 固化。

## 查看版本列表（list）

```bash
# 查看某个工具的所有可用版本（从远程获取，可能有数千条）
sdk list java
sdk list maven
sdk list gradle

# 查看某个工具时，不刷新远程缓存（只看本地已知的）
sdk list java --cached

# 查看所有可管理的工具（candidates）
sdk list

# 查看本地已安装的版本
sdk list java | grep installed
sdk list maven | grep installed

# 组合过滤：查看已安装的某个大版本
sdk list java | grep -E "installed.* 17\."

# 查看某个工具当前使用的版本和已安装版本
sdk current java        # 当前版本（简洁）
sdk list java | grep -E "installed|>>>"  # 安装情况总览
```

### `sdk list java` 输出解读

```bash
# Vendor        | Use | Version      | Dist    | Status     | Identifier
# Corretto      |     | 21.0.2       | amzn    |            | 21.0.2-amzn
# >>> Temurin    |     | 21.0.3       | tem     | installed  | 21.0.3-tem
#               ↑↑↑
# >>> = 当前使用中  (use 标记)
# installed = 已安装 (status 列)
# Identifier = 安装和切换时使用的标识符
```

常用 JDK 发行版标识速查：

| 发行版 | 标识缩写 | 说明 |
|--------|----------|------|
| Eclipse Temurin | `tem` | 开源首选，最常用 |
| GraalVM Oracle | `graal` | 高性能多语言运行时 |
| GraalVM Community | `graalce` | 社区版 GraalVM |
| Amazon Corretto | `amzn` | AWS 维护 |
| Azul Zulu | `zulu` | 嵌入式友好 |
| Liberica | `librca` | BellSoft 维护 |
| Oracle JDK | `oracle` | Oracle 官方版 |
| Microsoft JDK | `ms` | 微软构建 |

## 查看当前版本（current）

```bash
# 查看单个工具的当前版本
sdk current java
sdk current maven
sdk current gradle

# 一次性查看所有已安装工具的当前版本
sdk current
# 输出示例：
# Using:
#   java: 21.0.3-tem
#   maven: 3.9.6
#   gradle: 8.8

# 路径相关
echo $JAVA_HOME
# /home/用户名/.sdkman/candidates/java/current

which java
# /home/用户名/.sdkman/candidates/java/current/bin/java

# 查看某个工具的真实安装路径（非 current 软链接）
sdk home java 21.0.3-tem
# /home/用户名/.sdkman/candidates/java/21.0.3-tem

# 查看当前版本的安装路径
sdk home java
# /home/用户名/.sdkman/candidates/java/current
```

::: tip JAVA_HOME
SDKMAN 通过 `sdk use` 或 `sdk default` 切换版本时，会自动更新 `JAVA_HOME` 环境变量。IDE 和构建工具读取的就是这个变量。用 `echo $JAVA_HOME` 确认指向正确。
:::

## 安装路径与 home

```bash
# SDKMAN 所有工具的目录结构：
ls ~/.sdkman/candidates/
# java/  maven/  gradle/  kotlin/  ...

# 每个工具的结构：
ls ~/.sdkman/candidates/java/
# 21.0.3-tem/       ← 具体版本目录
# 17.0.8-tem/       ← 具体版本目录
# current -> 21.0.3-tem  ← 软链接，指向默认版本

# 查看指定版本路径（可用于设置 IDEA 等 IDE 的 JDK 路径）
sdk home java 17.0.8-tem
# /home/用户名/.sdkman/candidates/java/17.0.8-tem

# 查看当前默认版本的路径
sdk home java
# /home/用户名/.sdkman/candidates/java/current

# 查看 maven 路径
sdk home maven 3.9.6
```

## 升级与降级（upgrade）

```bash
# 将当前正在使用的版本升级到该大版本的最新小版本
sdk upgrade java

# 将指定工具的当前版本升级到最新小版本
sdk use maven 3.9.6
sdk upgrade maven     # 升级到 3.9.x 的最新版

# 升级某个工具的默认版本
sdk default java 21.0.2-tem
sdk upgrade java      # 升级默认的 21 大版本到最新小版本

# 降级（没有内置降级命令，本质就是切换到旧版本）
sdk use java 17.0.8-tem    # 切到更旧的版本 = 降级

# 查看可升级到哪个版本
sdk list java | grep " 21\." | tail -5
# 对比当前版本和新版本决定是否升级
```

## 卸载与清理

```bash
# 卸载某个工具的指定版本
sdk uninstall java 17.0.8-tem
sdk uninstall maven 3.8.8

# 临时卸载当前版本然后切换到另一个
sdk uninstall java 21.0.2-tem && sdk default java 21.0.3-tem

# 清理下载缓存（zip 包，回收空间最明显）
sdk flush archives

# 清理临时文件
sdk flush temp

# 清理广播消息缓存
sdk flush broadcast

# 清理版本缓存（强制下次 list 重新获取远程数据）
sdk flush version

# 一键清理所有
sdk flush

# 安装后的 zip 包不清理会很占空间，定期清理习惯：
du -sh ~/.sdkman/archives/
# 几百 MB 到几 GB 都有可能
```

## 升级 SDKMAN 自身

```bash
# 升级到最新稳定版
sdk selfupdate

# 强制更新（即使版本号没变也重新拉取）
sdk selfupdate force

# 查看当前 SDKMAN 版本
sdk version

# 开启/关闭自动更新提示
sdk config
# 在 ~/.sdkman/etc/config 中设置：
# sdkman_auto_selfupdate=true
```

## 项目环境配置（env）

```bash
# 在项目根目录生成 .sdkmanrc（记录当前所有工具版本）
cd ~/projects/my-java-app
sdk env init
# 生成的文件内容示例：
# java=21.0.3-tem
# maven=3.9.6

# 应用 .sdkmanrc 中的配置（自动安装缺失的工具和版本）
sdk env

# 应用但不安装缺失版本（只切换已安装的）
sdk env --no-install

# 查看当前项目环境的配置
cat .sdkmanrc

# 手动编辑 .sdkmanrc 后再次 sdk env 即可生效
vim .sdkmanrc
sdk env

# 离开项目后手动恢复默认版本
cd ~
sdk env clear
# 或者手动切换回日常版本
sdk use java 21.0.3-tem
```

## 离线模式

```bash
# 开启离线模式（跳过所有网络检查，命令响应更快）
sdk offline enable

# 关闭离线模式（恢复联网）
sdk offline disable

# 查看当前是离线还是在线模式
sdk config | grep offline

# 离线模式适用场景：
# - 网络不稳定
# - 已经安装了所需版本，不需要联网查询
# - 纯切换版本，不需要安装新版本
```

## 查看已安装的所有工具与版本

```bash
# 查看安装了哪些工具的哪些版本
for candidate in $(ls ~/.sdkman/candidates/); do
    echo "=== $candidate ==="
    sdk list $candidate 2>/dev/null | grep installed
done

# 更简洁的方式：直接看文件系统
ls ~/.sdkman/candidates/java/
ls ~/.sdkman/candidates/maven/
ls ~/.sdkman/candidates/gradle/

# 查看当前各工具的默认版本（current 指向）
find ~/.sdkman/candidates -maxdepth 2 -name current -ls
```

## 环境变量配置

```bash
# SDKMAN 自动管理 JAVA_HOME、M2_HOME 等环境变量
# 查看当前环境变量
echo $JAVA_HOME
echo $M2_HOME
echo $GRADLE_HOME

# SDKMAN 的配置文件
cat ~/.sdkman/etc/config

# 常用配置项：
# sdkman_auto_answer=true          # 安装时自动确认，跳过提示
# sdkman_auto_selfupdate=false     # 关闭自动更新检查
# sdkman_curl_connect_timeout=7    # 网络请求连接超时（秒）
# sdkman_curl_max_time=200         # 网络请求总超时（秒）
# sdkman_curl_retry=2              # 请求失败重试次数
```

# JDK 实战：多版本管理完整流程

## 场景一：项目需要 JDK 8，日常开发用 JDK 21

```bash
# 1. 确认当前状态
sdk current java

# 2. 安装 JDK 8
sdk install java 8.0.402-tem

# 3. 临时切换到 JDK 8
sdk use java 8.0.402-tem
java -version
# openjdk version "1.8.0_402"

# 4. 编译/运行老项目
mvn clean package

# 5. 切回日常版本
sdk use java 21.0.3-tem
```

## 场景二：对比不同 JDK 发行版的性能

```bash
# 安装不同发行版的同一大版本
sdk install java 21.0.3-tem       # Eclipse Temurin
sdk install java 21.0.3-graal     # GraalVM
sdk install java 21.0.2-amzn      # Amazon Corretto
sdk install java 21.0.2-zulu      # Azul Zulu

# 依次切换并运行基准测试
for vendor in tem graal amzn zulu; do
    sdk use java 21.0.3-$vendor 2>/dev/null || sdk use java 21.0.2-$vendor
    echo "=== $vendor ==="
    java -version 2>&1 | head -1
    # 运行性能测试
done
```

## 场景三：`.sdkmanrc` 项目级版本锁定

类似 `.nvmrc`，SDKMAN 支持 `.sdkmanrc` 文件：

```bash
# 1. 在项目中生成 .sdkmanrc（记录当前使用的所有工具版本）
cd ~/projects/my-java-app
sdk env init
# 生成的文件内容示例：
# java=21.0.3-tem
# maven=3.9.6

# 2. 提交到 Git
git add .sdkmanrc
git commit -m "锁定 JDK 和 Maven 版本"

# 3. 团队成员进入项目后自动配置环境
cd ~/projects/my-java-app
sdk env
# SDKMAN 会自动读取 .sdkmanrc 并安装/切换对应的版本
```

### 自动切换脚本

在 `~/.bashrc` 中追加，实现 `cd` 进目录自动执行 `sdk env`：

```bash
# 进入目录时自动加载 .sdkmanrc
sdkman_auto_env() {
    if [ -f ".sdkmanrc" ]; then
        sdk env 2>/dev/null
    fi
}

# bash 版本
cd() {
    builtin cd "$@" && sdkman_auto_env
}

# zsh 版本
autoload -U add-zsh-hook
add-zsh-hook chpwd sdkman_auto_env
```

# 管理 Maven / Gradle

SDKMAN 不止管 JDK，构建工具的版本管理同样方便。

## Maven

```bash
# 安装指定版本
sdk install maven 3.9.6

# 查看可用版本
sdk list maven

# 项目 A 需要 Maven 3.8，项目 B 需要 Maven 3.9
cd ~/projects/project-A
sdk use maven 3.8.8
mvn --version

cd ~/projects/project-B
sdk use maven 3.9.6
mvn --version
```

::: tip JDK + Maven 联动
在 `.sdkmanrc` 中同时锁定 JDK 和 Maven，一条 `sdk env` 搞定项目的完整构建环境。
:::

## Gradle

```bash
# 安装 Gradle
sdk install gradle 8.8

# Gradle 多版本切换
sdk use gradle 8.8
gradle --version

sdk use gradle 7.6.4
gradle --version
```

# 管理其他 JVM 工具

```bash
# ===== JVM 语言 =====
sdk install kotlin        # Kotlin 编译器
sdk install scala         # Scala 编译器
sdk install groovy        # Groovy

# ===== 框架 CLI =====
sdk install springboot    # Spring Boot CLI
sdk install quarkus       # Quarkus CLI
sdk install micronaut     # Micronaut CLI

# ===== 开发工具 =====
sdk install visualvm      # JVM 性能监控
sdk install jmeter        # 压力测试
sdk install jbang         # 一行脚本运行 Java
sdk install ant           # Ant 构建工具
```

# 配置优化

## 国内镜像加速

```bash
# SDKMAN 默认从国外服务器下载，国内访问可能较慢
# 配置文件位置
cat ~/.sdkman/etc/config

# 可尝试设置代理
# 在 ~/.sdkman/etc/config 中添加：
# sdkman_auto_answer=true
# sdkman_auto_selfupdate=false
# sdkman_insecure_ssl=false
# sdkman_curl_connect_timeout=7
# sdkman_curl_max_time=200
# sdkman_curl_retry=2

# 或为 curl 设置代理
# sdkman_curl_options="--proxy http://127.0.0.1:7890"
```

## 自定义安装目录

```bash
# 默认安装目录：~/.sdkman/
# 如需自定义，安装前设置环境变量
export SDKMAN_DIR="/opt/sdkman"
curl -s "https://get.sdkman.io" | bash
```

## 离线模式

```bash
# 开启离线模式（跳过网络检查，速度更快）
sdk offline enable

# 关闭离线模式
sdk offline disable
```

# 常见问题

## 安装 JDK 时报 SSL 错误

```bash
# 症状：sdk install java 后提示 SSL certificate problem
# 原因：证书过期或代理问题

# 解决方案 1：更新系统证书
sudo apt update && sudo apt install ca-certificates

# 解决方案 2：临时跳过 SSL 验证（不推荐，仅应急）
# 在 ~/.sdkman/etc/config 中设置：
# sdkman_insecure_ssl=true
```

## sdk 命令找不到

```bash
# 检查 SDKMAN 是否正确初始化
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk version

# 确认 ~/.bashrc 中有初始化代码
grep sdkman ~/.bashrc
```

## `sdk list java` 结果太多看不过来

```bash
# 按发行版过滤
sdk list java | grep -E "tem|graal|amzn"

# 只看 LTS 版本
sdk list java | grep -E "8\.|11\.|17\.|21\."

# 只看已安装的
sdk list java | grep installed

# 只看某大版本
sdk list java | grep " 21\."
```

## Maven/Gradle 切换后项目报错

```bash
# 切换工具版本后，清理缓存避免不一致
mvn clean         # Maven: 清理 target 目录
gradle clean      # Gradle: 清理 build 目录

# 如果仍有问题，清理本地仓库缓存
rm -rf ~/.m2/repository/org/example/    # Maven（仅清理问题依赖）
# 或
rm -rf ~/.gradle/caches/                # Gradle
```

## 升级 JDK 后 IDEA 找不到 SDK

```bash
# SDKMAN 安装的 JDK 路径（以 Temurin 21 为例）：
~/.sdkman/candidates/java/21.0.3-tem/

# 在 IDEA 中手动添加 SDK：
# File → Project Structure → SDK → Add JDK →
# 路径填入: /home/你的用户名/.sdkman/candidates/java/21.0.3-tem/

# 或者用 current 快捷路径（始终指向当前默认版本）：
~/.sdkman/candidates/java/current
```

# 命令速查

| 命令 | 说明 |
|------|------|
| `sdk list java` | 查看 JDK 所有可用版本 |
| `sdk install java 21.0.3-tem` | 安装指定版本的 JDK |
| `sdk use java 21.0.3-tem` | 临时切换到指定版本 |
| `sdk default java 21.0.3-tem` | 设为默认版本 |
| `sdk current java` | 查看当前使用的版本 |
| `sdk current` | 查看所有工具的当前版本 |
| `sdk uninstall java 17.0.8-tem` | 卸载指定版本 |
| `sdk env init` | 生成 .sdkmanrc 项目配置 |
| `sdk env` | 根据 .sdkmanrc 自动配置环境 |
| `sdk flush` | 清理缓存和残留文件 |
| `sdk selfupdate` | 升级 SDKMAN 自身 |
| `sdk offline enable` | 开启离线模式 |
| `sdk version` | 查看 SDKMAN 版本 |

# 总结

| 对比维度 | SDKMAN | NVM（对比参照） |
|----------|--------|-----------------|
| 管理对象 | JDK、Maven、Gradle、Kotlin 等 | Node.js |
| 版本切换粒度 | 单工具单版本 | 单工具单版本 |
| 项目级配置 | `.sdkmanrc`（`sdk env`） | `.nvmrc`（`nvm use`） |
| 发行版选择 | 几十种 JDK 发行版可选 | 单一发行版 |
| Windows 原生支持 | 不支持（需 WSL） | 有 nvm-windows |

SDKMAN 是 Java 开发者的必备工具箱，一条命令管理 JDK、Maven、Gradle 的版本，搭配 `.sdkmanrc` 实现项目级环境锁定。至此你已经有了 **WSL（Linux 环境）→ NVM（Node 版本）→ SDKMAN（Java 版本）** 的完整开发工具链，无论前端还是后端，版本切换不再头疼。
