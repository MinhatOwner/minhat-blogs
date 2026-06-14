---
# 文章标题，默认取第一个 h1
title: Linux命令
# 短标题，导航栏/侧边栏优先显示
shortTitle: Linux命令
# 文章描述
description: 文章描述
# 页面图标 (FontClass 或图片路径)
icon: mi:document
# 作者，设为 false 可隐藏
author: Minhat
# 是否原创
isOriginal: true
# 写作日期 YYYY-MM-DD
date: 2026-06-11
# 分类
category:
  - Linux
# 标签
tag:
  - Linux
---

这是文章摘要

<!-- more -->

# upower（查看电池状态）

在Linux中，upower是一个用于获取和监视电池状态的命令行工具。它能够提供关于电池的充电状态、剩余电量、电池容量和电量消耗速率等信息。

```bash
# /org/freedesktop/UPower/devices/battery_BAT0是电源设备的路径，
# 不同计算机可能路径不同，需要根据情况修改
upower -i /org/freedesktop/UPower/devices/battery_BAT0
```

其中，`/org/freedesktop/UPower/devices/battery_BAT0`是电源设备的路径，不同计算机可能路径不同，需要根据情况修改。执行该命令后，会输出当前设备的状态信息，包括充电状态、剩余电量、电池容量和电量消耗速率等。

除了查看电池状态，`upower`还可以用于设置当电量低于一定水平时的警报、休眠等操作，以便及时保护电池、保存数据。这些设置对于延长电池寿命、降低功耗、提高使用体验都很有帮助。

需要注意的是，`upower`命令需要系统支持`dbus-core`和`libdbus`等库，因此在使用前需要确保这些库已经安装并正确配置。此外`upower`还可以通过其他方式获取电池状态，如使用图形界面或使用其他命令行工具等。

# firewall（防火墙）

在 Linux 系统中，`firewall`是一种用于网络安全的技术，可以保护网络免受未经授权的访问和攻击。firewall 可以控制进出网络的数据包，根据安全规则对数据包进行过滤和操作。

在 Linux 系统中，firewalld 是常用的 firewall 工具之一，它是一个动态防火墙工具，可以用于配置和管理防火墙规则。`firewalld`使用 Linux 内核提供的 Netfilter 框架来实现防火墙功能。

使用 firewalld，可以定义不同的区域和规则，并根据需要添加或删除规则。例如，可以定义公共区域和信任区域，并配置规则来限制对特定网络服务的访问。此外，irewalld还提供了其他功能，如网络地址转换（NAT）和端口转发等。

总之，Linux firewall是一种用于保护网络安全的工具，可以控制进出网络的数据包，并根据安全规则进行过滤和操作。firewalld 是常用的 firewall 工具之一，可以用于配置和管理防火墙规则。

## 1、firewalld 的基本使用

- 启动：`systemctl start firewalld`
- 查看状态：`systemctl status firewalld`
- 禁止开机启动：`systemctl disable firewalld`
- 停止运行：`systemctl stop firewalld`

## 2、配置 firewalld-cmd

- 查看版本：`firewall-cmd --version`
- 查看帮助：`firewall-cmd --help`
- 显示状态：`firewall-cmd --state`
- 查看所有打开的端口：`firewall-cmd --zone=public --list-ports`
- 更新防火墙规则：`firewall-cmd --reload`
- 更新防火墙规则，重启服务：`firewall-cmd --completely-reload`
- 查看已激活的Zone信息:`firewall-cmd --get-active-zones`
- 查看指定接口所属区域：`firewall-cmd --get-zone-of-interface=eth0`
- 拒绝所有包：`firewall-cmd --panic-on`
- 取消拒绝状态：`firewall-cmd --panic-off`
- 查看是否拒绝：`firewall-cmd --query-panic`

## 3、信任级别，通过 Zone 的值指定

- `drop`: 丢弃所有进入的包，而不给出任何响应
- `block`: 拒绝所有外部发起的连接，允许内部发起的连接
- `public`: 允许指定的进入连接
- `external`: 同上，对伪装的进入连接，一般用于路由转发
- `dmz`: 允许受限制的进入连接
- `work`: 允许受信任的计算机被限制的进入连接，类似 workgroup
- `home`: 同上，类似 homegroup
- `internal`: 同上，范围针对所有互联网用户
- `trusted`: 信任所有连接

## 4、firewall开启和关闭端口

以下都是指在 public 的 Zone 下的操作，不同的 Zone 只要改变 Zone 后面的值就可以

- 添加：`firewall-cmd --zone=public --add-port=80/tcp --permanent`（--permanent永久生效，没有此参数重启后失效）
- 重新载入：`firewall-cmd --reload`
- 查看：`firewall-cmd --zone=public --query-port=80/tcp`
- 删除：`firewall-cmd --zone=public --remove-port=80/tcp --permanent`
- 列出防火墙规则：`firewall-cmd --list-all`

## 5、管理服务

以 smtp 服务为例， 添加到 work zone

- 添加：`firewall-cmd --zone=work --add-service=smtp`
- 查看：`firewall-cmd --zone=work --query-service=smtp`
- 删除：`firewall-cmd --zone=work --remove-service=smtp`

## 6、配置 IP 地址伪装

- 查看：`firewall-cmd --zone=external --query-masquerade`
- 打开：`firewall-cmd --zone=external --add-masquerade`
- 关闭：`firewall-cmd --zone=external --remove-masquerade`

## 7、端口转发

- 打开端口转发，首先需要打开 IP 地址伪装：`firewall-cmd --zone=external --add-masquerade`
- 转发 tcp 22 端口至 3753：`firewall-cmd --zone=external --add-forward-port=22:porto=tcp:toport=3753`
- 转发端口数据至另一个IP的相同端口：`firewall-cmd --zone=external --add-forward-port=22:porto=tcp:toaddr=192.168.1.112`
- 转发端口数据至另一个IP的 3753 端口：`firewall-cmd --zone=external --add-forward-port=22:porto=tcp:：toport=3753:toaddr=192.168.1.112`

# systemctl（管理系统服务）

在 Linux 中，`systemctl`是 Systemd 的主命令，用于管理系统服务。systemctl 可用来管理系统服务的状态，包括启动、停止、重启、查看状态等操作。

- 启动一个服务：`systemctl start firewalld.service`
- 关闭一个服务：`systemctl stop firewalld.service`
- 重启一个服务：`systemctl restart firewalld.service`
- 显示一个服务的状态：`systemctl status firewalld.service`
- 在开机时启用一个服务：`systemctl enable firewalld.service`
- 在开机时禁用一个服务：`systemctl disable firewalld.service`
- 查看服务是否开机启动：`systemctl is-enabled firewalld.service`
- 查看已启动的服务列表：`systemctl list-unit-files|grep enabled`
- 查看启动失败的服务列表：`systemctl --failed`

# Linux 关机重启
- `shutdown -h now`立刻关机
- `shutdown -h 1 "Hello,1分钟后会关机"`
- `shutdown -r now`现在重新启动计算机
- `halt`关机，作用和上面一样
- `reboot`现在重新启动计算机
- `sync`把内存的数据同步到磁盘中

**注意细节:**

1. 不管是重启系统还是关闭系统，首先要运行 sync 命令，把内存中的数据写到磁盘中
2. 目前的 shutdown/reboot/halt 等均已经在关机前进行了 sync，小心驶得万年船

# 用户管理

## 1、useradd（添加用户）

- 基本语法：`useradd 用户名`
- 应用案例：`useradd milan`

**细节说明:**

1. 当创建用户成功后，会自动地创建和用户同名的家目录，默认该用户的家目录在`/home/milan`
2. 也可通过 `useradd -d 指定目录 新的用户名`，给新创建的用户指定家目录

## 2、passwd（修改密码）

- 基本语法：`passwd 用户名`

## 3、userdel（删除用户）
`userdel 用户名`这个不会删除用户的家目录
`userdel -r 用户名`这个会删除用户的家目录

## 4、usermod（修改用户）

- 语法：`usermod [选项] 登录名`

1. 用户ID（UID）：用户 ID 是唯一的标识符，用于区分不同的用户。usermod 可以修改用户的 UID。
2. 用户组（GID）：usermod 可以修改用户所属的用户组。
3. 家目录：usermod 可以修改用户的家目录。
4. 登录Shell：usermod 可以修改用户登录时使用的 Shell。
5. 密码：usermod 可以修改用户的密码。
6. 其他属性：usermod 还可以修改其他一些属性，如用户名、备注等。

## 5、id（查询用户信息）
 
- 语法：`id 用户名`

# alsamixer（音频管理）

- alsamixer 是 Linux 音频架构 ALSA 中的 Alsa 工具的其中一个，用于配置音频的各个参数。
- alsamixer 是基于文本下的图形界面的，可以通过键盘的上下键，左右键等，很方便地设置需要的音量，开关某个 switch（开关）等等操作。

# Linux帮助命令

## 1、man 命令

man 是 "manual" 的缩写，用于查看命令的手册页。通过 man \<command\> 可以查看特定命令的手册页，例如 man ls 会显示 ls 命令的手册页。手册页中包含了命令的详细描述、选项、用法示例等信息。

## 2、whatis 命令

whatis是一个用于查询命令功能的命令。它会在由catman -w命令创建的数据库中查找指定的命令、系统调用、库函数或特殊文件名，并显示与这些关键字相关的简短描述。这个命令对于快速了解某个命令或函数的基本用途非常有用。

## 3、help 命令

help 命令用于查看 shell 内置命令的帮助信息。在大多数 shell 中，输入 help 命令将显示内置命令的列表。要获取特定内置命令的帮助信息，可以使用 help \<builtin-command\>，例如 help cd 会显示 cd 命令的帮助信息。

## 4、--help 选项

大部分的外部命令都支持 --help 选项，用于在控制台打印出命令的帮助信息。有些命令字没有 --help 也可以使用 -h 来获取帮助。例如，command --help 或 command -h 可以显示该命令的帮助信息。

# 软件包管理系统

## 1、apt-get

### 1.1、安装软件包

```bash
# 普通安装
apt-get install PackageName
# 安装指定包的指定版
apt-get install PackageName=VersionName
# 重新安装
apt-get --reinstall install PackageName
# 安装源码包所需要的编译环境
apt-get build-dep PackageName
# 修复依赖关系
apt-get -f install
# 下载软件包的源码
apt-get source PackageName
```

### 1.2、卸载软件包
```bash
# 删除软件包, 保留配置文件
apt-get remove PackageName
# 删除软件包, 同时删除配置文件
apt-get --purge remove PackageName
# 删除软件包, 同时删除配置文件
apt-get purge PackageName
# 删除软件包, 同时删除为满足依赖
# 而自动安装且不再使用的软件包
apt-get autoremove PackageName
# 删除软件包, 删除配置文件,删除不再使用的依赖包
apt-get --purge autoremove PackageName
# 清除 已下载的软件包 和 旧软件包
apt-get clean && apt-get autoclean
```

### 1.3、更新软件包

```bash
# 更新安装源（Source）
apt-get update
# 更新已安装的软件包
apt-get upgrade
# 更新已安装的软件包（识别并处理依赖关系的改变）
apt-get dist-upgrade
```

### 1.4、查询软件包

```bash
# 列出已安装的所有软件包
dpkg -l
# 搜索软件包
apt-cache search PackageName
# 获取软件包的相关信息, 如说明、大小、版本等
apt-cache show PackageName
# 查看该软件包需要哪些依赖
apt-cache depends PackageName
# 查看该软件包被哪些包依
apt-cache rdepends PackageName
# 检查是否有损坏的依赖
apt-get check
```

- apt
- aptitude
- dpkg
- yum
- dnf