---
title: Java版本演进-模块化时代
shortTitle: 模块化时代
description: 文章描述
icon: basil:document-solid
author: Minhat
isOriginal: true
date: 2026-07-21
category:
  - JAVA
tag:
  - Java
---

Java 9 到 Java 16，八年八版本。Oracle 实行六个月一个版本的快速迭代后，每个版本小而精。本文用代码逐一展示：模块化系统、var、Switch 表达式、文本块、Records、instanceof 模式匹配、Sealed Classes，以及隐藏的宝石。

<!-- more -->

# 版本总览

| 版本 | 发布日期 | 核心特性 |
|------|----------|----------|
| Java 9 | 2017.09 | 模块化系统（Jigsaw）、JShell、不可变集合工厂、接口私有方法 |
| Java 10 | 2018.03 | var 局部变量类型推断 |
| Java 11 | 2018.09 | HTTP Client、String/Files 新方法、Lambda var（LTS） |
| Java 12 | 2019.03 | Switch 表达式（预览）、Teeing Collector |
| Java 13 | 2019.09 | 文本块（预览）、Switch 表达式（二次预览） |
| Java 14 | 2020.03 | Records（预览）、instanceof 模式匹配（预览）、NPE 消息 |
| Java 15 | 2020.09 | 文本块（正式）、Sealed Classes（预览）、ZGC 生产可用 |
| Java 16 | 2021.03 | Records（正式）、instanceof 模式匹配（正式）、Vector API（孵化） |

# Java 9（2017 年 9 月）

## 模块化系统（Project Jigsaw）

Java 9 最核心的变化——将 JDK 拆分为数十个模块，同时允许开发者创建自己的模块：

```bash
# 查看 JDK 的所有模块
java --list-modules
# java.base@18.0.2
# java.desktop@18.0.2
# java.logging@18.0.2
# java.sql@18.0.2
# ...

# 描述一个模块
java --describe-module java.sql
```

### 创建模块

```java
// 项目结构：
// src/
// ├── com.example.app/
// │   ├── module-info.java
// │   └── com/example/app/Main.java
// └── com.example.util/
//     ├── module-info.java
//     └── com/example/util/StringUtil.java

// ===== com.example.util 模块 =====
// 文件：module-info.java
module com.example.util {
    // 导出包：其他模块可以访问
    exports com.example.util;
}

// 文件：com/example/util/StringUtil.java
package com.example.util;
public class StringUtil {
    public static String reverse(String s) {
        return new StringBuilder(s).reverse().toString();
    }
}

// ===== com.example.app 模块 =====
// 文件：module-info.java
module com.example.app {
    // 声明依赖：需要 com.example.util 模块
    requires com.example.util;
}

// 文件：com/example/app/Main.java
package com.example.app;
import com.example.util.StringUtil;

public class Main {
    public static void main(String[] args) {
        System.out.println(StringUtil.reverse("Hello Module!"));
    }
}
```

### 模块可见性控制

```java
// ===== 模块间访问控制 =====

module mymodule {
    // exports：导出给所有模块
    exports com.mymodule.api;

    // exports to：只导出给指定模块（限定导出）
    exports com.mymodule.internal to friend.module;

    // requires：声明依赖模块
    requires java.logging;

    // requires transitive：依赖传递——别人依赖我时，自动获得此模块
    requires transitive java.sql;

    // requires static：编译时必需，运行时可选
    requires static lombok;

    // opens：开放包给反射
    opens com.mymodule.data;

    // opens to：只开放给指定模块的反射
    opens com.mymodule.data to hibernate.core;

    // uses：声明使用某个服务
    uses com.mymodule.spi.MyService;

    // provides：提供某个服务的实现
    provides com.mymodule.spi.MyService
        with com.mymodule.spi.MyServiceImpl;
}
```

## JShell（交互式编程）

```bash
# 启动 JShell
jshell

# 直接在终端写 Java——不需要 class、不需要 main 方法！
jshell> 2 + 3
$1 ==> 5

jshell> System.out.println("Hello JShell!")
Hello JShell!

jshell> var list = List.of(1, 2, 3)
list ==> [1, 2, 3]

jshell> list.stream().map(n -> n * n).toList()
$4 ==> [1, 4, 9]

jshell> /list        # 列出所有代码片段
jshell> /vars        # 列出所有变量
jshell> /methods     # 列出所有方法
jshell> /exit        # 退出

# 甚至可以定义完整的方法
jshell> String greet(String name) {
   ...>     return "Hello, " + name + "!";
   ...> }
jshell> greet("Minhat")
$7 ==> "Hello, Minhat!"
```

## 不可变集合工厂方法

```java
// ===== Java 8：创建小集合很啰嗦 =====
List<String> list = new ArrayList<>();
list.add("a");
list.add("b");
list.add("c");
list = Collections.unmodifiableList(list);

// 或者
List<String> list2 = Arrays.asList("a", "b", "c");
// ← 这还不是不可变的，add/remove 会抛 UnsupportedOperationException
// 而且不能有 null，Arrays.asList 行为诡异

// ===== Java 9：一行创建不可变集合 =====
List<String> list = List.of("a", "b", "c");
Set<Integer> set = Set.of(1, 2, 3);
Map<String, Integer> map = Map.of("a", 1, "b", 2, "c", 3);

// Map 超过 10 个键值对用 ofEntries
Map<String, Integer> largerMap = Map.ofEntries(
    Map.entry("a", 1),
    Map.entry("b", 2),
    Map.entry("c", 3),
    Map.entry("d", 4),
    Map.entry("e", 5)
    // ...
);
```

::: warning 不可变集合的限制
- 不能有 null 元素：`List.of("a", null)` → NullPointerException
- 不能修改：`list.add("d")` → UnsupportedOperationException
- Set.of() 不能有重复元素
- Map.of() 不能有重复 key
:::

## 接口私有方法

```java
// Java 8：接口只能有 public default 方法
// Java 9：接口可以有 private 方法——default 方法之间的公共代码终于能提取了

public interface Parser {

    // 公共 API
    String parseJson(String json);

    default String parseJsonSafe(String json) {
        validate(json);                  // 调用私有方法
        try {
            return parseJson(json);
        } catch (Exception e) {
            return "{}";
        }
    }

    default String parseJsonLenient(String json) {
        validate(json);                  // 同样的校验逻辑复用
        return parseJson(json);
    }

    // Java 9 新增：私有实例方法
    private void validate(String json) {
        if (json == null || json.isBlank()) {
            throw new IllegalArgumentException("JSON 不能为空");
        }
    }

    // Java 9 新增：私有静态方法
    private static String sanitize(String input) {
        return input.trim().replace("﻿", "");
    }
}
```

## Stream API 增强

```java
// takeWhile：从头取满足条件的元素，直到第一个不满足的就停止
List<Integer> nums = List.of(1, 2, 3, 4, 0, 6, 7);
List<Integer> result1 = nums.stream()
    .takeWhile(n -> n < 5)
    .toList();
System.out.println(result1);  // [1, 2, 3, 4]——遇到 0（<5），继续；0<5 成立但...

// 注意 takeWhile 是遇到第一个"不满足条件"的元素就停止
List<Integer> nums2 = List.of(2, 4, 6, 1, 8, 10);
List<Integer> result2 = nums2.stream()
    .takeWhile(n -> n % 2 == 0)
    .toList();
System.out.println(result2);  // [2, 4, 6]——遇到 1（奇数）就停止

// dropWhile：从头丢弃满足条件的，一旦不满足就保留后续全部
List<Integer> result3 = nums.stream()
    .dropWhile(n -> n < 4)
    .toList();
System.out.println(result3);  // [4, 0, 6, 7]

// iterate 重载：有限流
// Java 8：Stream.iterate(seed, f) 是无限流，必须配合 limit
// Java 9：新增加终止条件的 iterate
List<Integer> powers = Stream.iterate(
    1,              // 起始值
    n -> n <= 100,  // 终止条件（Java 9 新增）
    n -> n * 2      // 迭代函数
).toList();
System.out.println(powers);  // [1, 2, 4, 8, 16, 32, 64]

// ofNullable：创建可能为空的单元素流
Stream<String> stream = Stream.ofNullable(maybeNull());
// 等价于：maybeNull() == null ? Stream.empty() : Stream.of(value)
```

## Optional 增强

```java
// ifPresentOrElse：有值时和没值时分别处理
Optional<String> opt = findUser(42);
opt.ifPresentOrElse(
    name -> System.out.println("用户: " + name),
    () -> System.out.println("用户不存在")
);

// or：如果为空，尝试另一个 Optional（惰性求值）
Optional<String> result = findCache("key1")
    .or(() -> findCache("key2"))
    .or(() -> Optional.of("默认值"));

// stream：Optional 可以转成 Stream（0 或 1 个元素）
List<String> users = Stream.of(1, 2, 3)
    .map(this::findUser)
    .flatMap(Optional::stream)   // 只保留有值的，跳过 empty
    .toList();
```

# Java 10（2018 年 3 月）

## var 局部变量类型推断

```java
// ===== Java 9 =====
Map<String, List<Map<Integer, String>>> complexMap =
    new HashMap<String, List<Map<Integer, String>>>();

// ===== Java 10 =====
var complexMap = new HashMap<String, List<Map<Integer, String>>>();

// 类型由右侧表达式推断，编译后字节码中的类型不变（非动态类型！）
var name = "Minhat";               // String
var age = 25;                      // int
var list = new ArrayList<String>(); // ArrayList<String>
var stream = list.stream();        // Stream<String>

// ===== 适用场景 =====

// for 循环中
for (var entry : map.entrySet()) {
    System.out.println(entry.getKey() + "=" + entry.getValue());
}

// try-with-resources
try (var reader = new BufferedReader(new FileReader("file.txt"))) {
    // reader 推断为 BufferedReader
}

// 复杂泛型
var userMap = new HashMap<String, User>();

// ===== 不能用的场景 =====

// var x;                        // 编译错误：必须初始化
// var x = null;                 // 编译错误：null 无法推断类型
// var lambda = (x, y) -> x + y; // 编译错误：Lambda 需要目标类型

// 方法参数、返回值、字段都不能用 var（var 仅限局部变量）
```

# Java 11（2018 年 9 月 · LTS）

## HTTP Client（标准化）

```java
import java.net.URI;
import java.net.http.*;
import java.net.http.HttpResponse.*;
import java.time.Duration;
import java.util.concurrent.*;

public class HttpClientDemo {
    public static void main(String[] args) throws Exception {

        // ===== 同步 GET =====
        HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.github.com/users/octocat"))
            .header("Accept", "application/json")
            .timeout(Duration.ofSeconds(5))
            .GET()
            .build();

        HttpResponse<String> response = client.send(
            request, BodyHandlers.ofString()
        );
        System.out.println("状态码: " + response.statusCode());
        System.out.println("响应体: " + response.body());

        // ===== 异步 GET =====
        CompletableFuture<HttpResponse<String>> future = client.sendAsync(
            request, BodyHandlers.ofString()
        );

        future.thenAccept(resp -> {
            System.out.println("异步结果: " + resp.body().substring(0, 100));
        }).join();

        // ===== POST 请求 =====
        String json = """
            {"title": "test", "body": "内容", "userId": 1}
            """;

        HttpRequest postRequest = HttpRequest.newBuilder()
            .uri(URI.create("https://jsonplaceholder.typicode.com/posts"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json))
            .build();

        HttpResponse<String> postResp = client.send(
            postRequest, BodyHandlers.ofString()
        );
        System.out.println("POST 结果: " + postResp.body());

        // ===== 文件下载 =====
        HttpRequest fileRequest = HttpRequest.newBuilder()
            .uri(URI.create("https://example.com/file.zip"))
            .build();

        HttpResponse<java.nio.file.Path> fileResp = client.send(
            fileRequest,
            BodyHandlers.ofFile(java.nio.file.Path.of("download.zip"))
        );
        System.out.println("文件已下载到: " + fileResp.body());
    }
}
```

## String 新增方法

```java
// isBlank：空白字符判断
System.out.println("  ".isBlank());        // true
System.out.println("".isBlank());          // true
System.out.println(" hi ".isBlank());      // false

// isEmpty  vs isBlank：
// ""          isEmpty=true   isBlank=true
// "   "       isEmpty=false  isBlank=true
// "hello"     isEmpty=false  isBlank=false

// lines：按行分割（跨平台）
String multiline = "第一行\n第二行\r\n第三行";
multiline.lines().forEach(System.out::println);
// 第一行
// 第二行
// 第三行

// strip：去除首尾空白（Unicode 友好，trim 只认 ASCII）
String s = "   hello   ";
System.out.println(s.trim());      // " hello "（trim 不认识  ）
System.out.println(s.strip());     // "hello"（strip 认识所有 Unicode 空白）

// 去首、去尾
s.stripLeading();   // 只去前面的空白
s.stripTrailing();  // 只去后面的空白

// repeat：重复
System.out.println("=".repeat(40));
System.out.println("Ha".repeat(3));  // HaHaHa
```

## Files 新增方法

```java
import java.nio.file.*;

// 读写字符串（终于不需要手动指定 Charset 了）
String content = Files.readString(Path.of("config.txt"));
Files.writeString(Path.of("output.txt"), "Hello World!");

// 两个方法的 Charset 默认 UTF-8（终于！）
String content2 = Files.readString(Path.of("config.txt"),
    java.nio.charset.StandardCharsets.UTF_8);
```

## Lambda 参数中的 var

```java
// Java 11 允许在 Lambda 参数中使用 var（主要用于加注解）

// 这样 annotate 成为可能
list.stream()
    .map((@NotNull var x) -> x.toUpperCase())
    .toList();

// 等价于
list.stream()
    .map((@NotNull String x) -> x.toUpperCase())
    .toList();

// 规则：一旦用了 var，该 Lambda 所有参数都得用 var
// 合法：(var x, var y) -> x + y
// 不合法：(var x, y) -> x + y    ← 混合了 var 和隐式类型
```

# Java 12（2019 年 3 月）

## Switch 表达式（预览）

```java
// ===== 传统 switch 的痛点 =====
// - break 容易遗漏（fall-through 陷阱）
// - 不能作为表达式返回值
// - 每个 case 作用域不隔离

// ===== Java 12/13 预览，Java 14 正式 =====
int day = 3;

// 箭头语法 + 多值 case
String result = switch (day) {
    case 1, 2, 3, 4, 5 -> "工作日";
    case 6, 7 -> "周末";
    default -> throw new IllegalArgumentException("无效日期: " + day);
};

// 代码块 + yield 返回值
String plan = switch (day) {
    case 1, 2, 3, 4, 5 -> {
        System.out.println("该上班了");
        yield "搬砖";      // yield 返回值（不是 return！）
    }
    case 6 -> {
        System.out.println("周六放松");
        yield "学习";
    }
    case 7 -> {
        System.out.println("周日充电");
        yield "运动";
    }
    default -> "休息";
};
```

## Teeing Collector

```java
import java.util.stream.*;

// Teeing：将数据同时送入两个收集器，然后合并结果
// 经典场景：求平均值时同时要 count 和 sum

record Stats(long count, double average) {}

List<Integer> nums = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

Stats stats = nums.stream()
    .collect(Collectors.teeing(
        Collectors.counting(),                    // 下游收集器 1
        Collectors.averagingDouble(n -> n),       // 下游收集器 2
        Stats::new                                 // 合并函数
    ));

System.out.println("数量: " + stats.count());      // 10
System.out.println("平均值: " + stats.average());   // 5.5
```

# Java 13（2019 年 9 月）

## 文本块（预览）

```java
// ===== Java 12 =====
String json = "{\n" +
    "  \"name\": \"Minhat\",\n" +
    "  \"age\": 25,\n" +
    "  \"hobbies\": [\"coding\", \"reading\"]\n" +
    "}";

String sql = "SELECT u.id, u.name, o.total\n" +
    "FROM users u\n" +
    "JOIN orders o ON u.id = o.user_id\n" +
    "WHERE u.status = 'active'\n" +
    "ORDER BY o.total DESC\n" +
    "LIMIT 10";

// ===== Java 13 预览，Java 15 正式 =====
String jsonBlock = """
    {
      "name": "Minhat",
      "age": 25,
      "hobbies": ["coding", "reading"]
    }
    """;

String sqlBlock = """
    SELECT u.id, u.name, o.total
    FROM users u
    JOIN orders o ON u.id = o.user_id
    WHERE u.status = 'active'
    ORDER BY o.total DESC
    LIMIT 10
    """;

// ===== 文本块特性 =====

// 1. 自动去除每行前导空格（以 """ 的位置为基准）
String indented = """
        line 1
        line 2
        line 3
        """;
// 实际结果: "line 1\nline 2\nline 3\n"
// 自动去掉了每行前面的 8 个空格

// 2. \（行尾反斜杠）：禁止换行（格式化需要但不想真的换行）
String longLine = """
    这是一段很长的文字，\
    但最终输出是一行，\
    不会被换行打断。
    """;
// 结果: "这是一段很长的文字，但最终输出是一行，不会被换行打断。"

// 3. \s：强制空格（防止尾随空格被 trim）
String withTrailing = """
    line1  \s
    line2
    """;
// line1 后面保留了 2 个空格 + 1 个 \s = 3 个空格

// 4. 内部引号不需要转义
String html = """
    <html>
      <body>
        <p class="greeting">Hello, "Minhat"!</p>
      </body>
    </html>
    """;
```

# Java 14（2020 年 3 月）

## Records（预览）

```java
// ===== Java 13：数据传输对象（DTO）的样板代码地狱 =====
public class OldUserDTO {
    private final String name;
    private final int age;
    private final String email;

    public OldUserDTO(String name, int age, String email) {
        this.name = name;
        this.age = age;
        this.email = email;
    }

    public String getName() { return name; }
    public int getAge() { return age; }
    public String getEmail() { return email; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OldUserDTO)) return false;
        OldUserDTO that = (OldUserDTO) o;
        return age == that.age &&
               Objects.equals(name, that.name) &&
               Objects.equals(email, that.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age, email);
    }

    @Override
    public String toString() {
        return "OldUserDTO{name='" + name + "', age=" + age +
               ", email='" + email + "'}";
    }
}

// ===== Java 14：一行搞定！ =====
record UserDTO(String name, int age, String email) {}

// 编译器自动生成：构造器、getter、equals、hashCode、toString
UserDTO user = new UserDTO("Minhat", 25, "minhat@example.com");
System.out.println(user.name());       // 访问器是 name()，不是 getName()
System.out.println(user.age());
System.out.println(user);              // UserDTO[name=Minhat, age=25, email=...]
```

### Record 高级用法

```java
// Record 可以有自己的构造器、实例方法和静态方法
public record Point(double x, double y) {

    // 紧凑构造器——对参数进行校验
    public Point {
        if (Double.isNaN(x) || Double.isNaN(y)) {
            throw new IllegalArgumentException("坐标不能是 NaN");
        }
        if (Double.isInfinite(x) || Double.isInfinite(y)) {
            throw new IllegalArgumentException("坐标不能是无穷");
        }
    }

    // 派生属性（不存数据，每次都计算）
    public double distanceFromOrigin() {
        return Math.sqrt(x * x + y * y);
    }

    // 静态方法
    public static Point origin() {
        return new Point(0, 0);
    }

    // 静态字段（只能 static，不能有实例字段！）
    private static final Point ORIGIN = new Point(0, 0);
}

// Record 可以实现接口
public record NamedPoint(String name, double x, double y)
    implements Comparable<NamedPoint> {

    @Override
    public int compareTo(NamedPoint other) {
        return Double.compare(
            this.x() * this.x() + this.y() * this.y(),
            other.x() * other.x() + other.y() * other.y()
        );
    }
}
```

::: tip Record 的限制
- Record 类隐式 final，不能继承
- 不能有其他实例字段（所有字段在 record 头部声明）
- 可以有 static 字段和方法
- 可以 override 自动生成的方法
:::

## instanceof 模式匹配（预览）

```java
// ===== Java 13 =====
if (obj instanceof String) {
    String s = (String) obj;   // 还要手动转型
    if (s.length() > 5) {
        System.out.println(s.toUpperCase());
    }
}

// ===== Java 14 预览，Java 16 正式 =====
if (obj instanceof String s && s.length() > 5) {
    System.out.println(s.toUpperCase());   // 直接用 s
}

// 更复杂的例子——曾经的多层 if-instanceof 链
Object data = fetchData();

// Java 13
if (data instanceof Integer) {
    Integer n = (Integer) data;
    processNumber(n);
} else if (data instanceof String) {
    String s = (String) data;
    processString(s);
} else if (data instanceof List) {
    @SuppressWarnings("unchecked")
    List<String> list = (List<String>) data;
    processList(list);
}

// Java 14+
if (data instanceof Integer n) {
    processNumber(n);
} else if (data instanceof String s) {
    processString(s);
} else if (data instanceof List<?> list) {
    processList((List<String>) list);  // 泛型仍需转型
}
```

## 更有用的 NullPointerException

```java
// ===== Java 13：NPE 只告诉你哪一行 =====
// NullPointerException
//     at com.example.App.process(App.java:42)
// ← 到底是 a、b 还是 c 是 null？

// ===== Java 14：NPE 精确到哪个变量是 null（-XX:+ShowCodeDetailsInExceptionMessages）=====
// NullPointerException: Cannot invoke "String.length()" because "user.name" is null
//     at com.example.App.process(App.java:42)
// ← user.name 是 null，一目了然！

// 复杂链式调用也能精确定位：
// user.getAddress().getCity().toUpperCase()
// NPE: Cannot invoke "String.toUpperCase()"
//       because the return value of "City.getCity()" is null
```

# Java 15（2020 年 9 月）

## 文本块正式转正

Java 13 预览、Java 14 二次预览、Java 15 正式。

```java
// 正则表达式再也不用嵌套转义了
var pattern = Pattern.compile("""
    \\d{3}   # 区号
    -        # 分隔符
    \\d{8}   # 号码
    """, Pattern.COMMENTS);

// HTML/JSON/SQL 拼接，直接粘贴
String html = """
    <html>
      <head>
        <title>%s</title>
      </head>
      <body>
        %s
      </body>
    </html>
    """.formatted(title, body);
```

## Sealed Classes（预览）

```java
// Sealed Class 限制"谁能继承我"——建模时锁定类型的层次结构

// 定义一个密封类：只允许指定的几个子类
public sealed class Shape
    permits Circle, Rectangle, Triangle { }

// 子类必须是 final、sealed 或 non-sealed 之一
public final class Circle extends Shape {
    private final double radius;
    public Circle(double radius) { this.radius = radius; }
    public double area() { return Math.PI * radius * radius; }
}

public final class Rectangle extends Shape {
    private final double width, height;
    public Rectangle(double width, double height) {
        this.width = width; this.height = height;
    }
    public double area() { return width * height; }
}

public non-sealed class Triangle extends Shape {
    // non-sealed 表示"我又开放继承了"
    private final double base, height;
    public Triangle(double base, double height) {
        this.base = base; this.height = height;
    }
    public double area() { return 0.5 * base * height; }
}

// 使用时——编译器知道只有这三种子类，switch 无需 default！
double getArea(Shape shape) {
    return switch (shape) {
        case Circle c    -> c.area();
        case Rectangle r -> r.area();
        case Triangle t  -> t.area();
        // 不需要 default——编译器确认穷举了所有情况！
    };
}
```

# Java 16（2021 年 3 月）

## Records 正式转正

Java 14 预览、Java 15 二次预览、Java 16 正式。

```java
// Record 的内部实现
record Book(String title, String author, int pages) {
    // 可以有额外的构造器重载
    public Book(String title, String author) {
        this(title, author, 0);  // pages 默认 0
    }
}

// Record 的反射特性：RecordComponent
Book book = new Book("Effective Java", "Joshua Bloch", 416);
Class<?> clazz = book.getClass();
System.out.println(clazz.isRecord());  // true

for (var component : clazz.getRecordComponents()) {
    System.out.println(component.getName() + ": " + component.getType());
}
// title: class java.lang.String
// author: class java.lang.String
// pages: int
```

## instanceof 模式匹配正式转正

## Stream.toList()

```java
// Java 8~15：collect
List<String> oldWay = stream.collect(Collectors.toList());

// Java 16：toList 直接返回不可变列表
List<String> newWay = stream.toList();
// 更短，且返回的列表不可修改
```

## Map.of() 的变体 mapMulti

```java
// flatMap 的替代方案——当每个元素映射结果数量不确定时性能更好
// 避免了为每个元素创建小 Stream 的开销

List<String> strings = List.of("1,2,3", "4,5", "6");

// flatMap 方式——每对字符串创建一个 Stream
List<Integer> numbers = strings.stream()
    .flatMap(s -> Arrays.stream(s.split(",")))
    .map(Integer::parseInt)
    .toList();

// mapMulti 方式——直接推入 Consumer，零中间 Stream
List<Integer> numbers2 = strings.stream()
    .<Integer>mapMulti((s, downstream) -> {
        for (String part : s.split(",")) {
            downstream.accept(Integer.parseInt(part));
        }
    })
    .toList();
```

# 模块化时代总结

从 2017 到 2021，Java 完成了一次"由重到轻"的转型。半年一个版本带来了更快的反馈循环和更小步的演进：

| 版本 | 核心贡献 |
|------|----------|
| Java 9 | 模块化让 JDK 可裁剪，适合容器化 |
| Java 10 | var 让代码更简洁 |
| Java 11 | HTTP Client 现代化 + LTS 奠定生产地位 |
| Java 12~15 | Switch/Text Block/Record 的预览-反馈-迭代模式 |
| Java 16 | Record + instanceof 模式匹配正式转正 |

预览-转正机制（Preview → Final）让社区在正式发布前就能试用新特性并及时反馈，这八年里 Java 语言层面的进化速度前所未有。

下一篇《Java 版本演进-云原生时代》继续——Java 17 到最新版，虚拟线程、模式匹配 for switch、Record 模式、Scoped Values 等重量级特性悉数登场。
