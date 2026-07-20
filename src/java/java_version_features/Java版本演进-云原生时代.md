---
title: Java版本演进-云原生时代
shortTitle: 云原生时代
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

Java 17 到 Java 24，虚拟线程重塑并发、模式匹配全面展开、Scoped Values 补全并发工具链。Java 正在变成一门简洁而富有表达力的现代语言。本文用代码逐一展示这些改变游戏规则的特性。

<!-- more -->

# 版本总览

| 版本 | 发布日期 | 核心特性 |
|------|----------|----------|
| Java 17 | 2021.09 | Sealed Classes（正式）、伪随机生成器增强（LTS） |
| Java 18 | 2022.03 | UTF-8 默认、简易 Web Server、`@snippet` 文档标签 |
| Java 19 | 2022.09 | 虚拟线程（预览）、Record 模式（预览） |
| Java 20 | 2023.03 | Scoped Values（孵化）、Record 模式（二次预览） |
| Java 21 | 2023.09 | **虚拟线程正式、Record 模式正式、Switch 模式匹配正式、有序集合**（LTS） |
| Java 22 | 2024.03 | super 前语句、未命名变量、字符串模板（二次预览） |
| Java 23 | 2024.09 | Markdown 文档注释、模块导入声明 |
| Java 24 | 2025.03 | 最新特性 |

# Java 17（2021 年 9 月 · LTS）

又一个 LTS 版本，Sealed Classes 正式转正，伪随机数生成器大幅增强。

## Sealed Classes 正式转正

Java 15 预览、Java 16 再次预览、Java 17 正式。与 Record 和 Switch 的穷举检查天作之合：

```java
// Sealed + Record + Switch = 代数数据类型（ADT）的 Java 实现
public sealed interface Expr
    permits Expr.Const, Expr.Add, Expr.Mult {

    record Const(int value) implements Expr {}
    record Add(Expr left, Expr right) implements Expr {}
    record Mult(Expr left, Expr right) implements Expr {}
}

// 求值——编译器能检查 switch 是否穷举了所有情况！
int evaluate(Expr e) {
    return switch (e) {
        case Expr.Const c  -> c.value();
        case Expr.Add a    -> evaluate(a.left()) + evaluate(a.right());
        case Expr.Mult m   -> evaluate(m.left()) * evaluate(m.right());
        // 编译器保证：没有遗漏，不需要 default！
    };
}

// 使用（模式匹配 for switch 在 Java 17 只是预览）
Expr expr = new Expr.Add(
    new Expr.Const(3),
    new Expr.Mult(new Expr.Const(4), new Expr.Const(5))
);
System.out.println(evaluate(expr));  // 3 + 4*5 = 23
```

## 伪随机数生成器增强

```java
import java.util.random.*;

public class RandomDemo {
    public static void main(String[] args) {

        // ===== 新的 RandomGenerator 接口 =====
        // 旧的 java.util.Random 和 ThreadLocalRandom 都实现了它

        // RandomGeneratorFactory：按算法名获取生成器
        RandomGenerator rng = RandomGeneratorFactory
            .of("L64X128MixRandom")
            .create();

        // 在 [1, 100) 范围内生成随机数
        int randomInRange = rng.nextInt(1, 100);

        // Stream 生成器
        rng.ints(10, 1, 100)          // 10 个 [1, 100) 的随机 int
           .forEach(n -> System.out.print(n + " "));

        // 选择算法
        RandomGeneratorFactory.all()
            .filter(f -> f.isHardware())    // 硬件随机源
            .filter(f -> f.isStatistical()) // 统计质量合格
            .sorted((a, b) -> a.name().compareTo(b.name()))
            .forEach(f -> System.out.println(f.name()));

        // 常用算法：
        // - L32X64MixRandom      速度快，统计质量好
        // - L64X128MixRandom     平衡速度和安全性
        // - L128X256MixRandom    高统计质量
        // - Xoshiro256PlusPlus   速度最快的一档
        // - L64X1024MixRandom    高安全性
    }
}
```

# Java 18（2022 年 3 月）

## UTF-8 成为默认字符集

```java
// Java 17 及之前：默认字符集取决于操作系统
// Windows：GBK / Windows-1252
// Linux/macOS：UTF-8

// Java 18 起：所有平台上默认字符集统一为 UTF-8
// java.nio.charset.Charset.defaultCharset() 在所有平台都返回 UTF-8

// 从此 java.io 读取文件默认 UTF-8，不再被操作系统绑架
// 仍在依赖 OS 默认编码的旧代码需要主动指定
```

## 简易 Web Server

```bash
# 一行命令启动一个简单的 HTTP 文件服务器
# 在任意目录执行：
jwebserver

# 启动后默认绑定 localhost:8000，提供当前目录的文件服务
# 浏览器打开 http://localhost:8000 即可浏览文件

# 指定端口和目录
jwebserver -p 9090 -d /var/www/html

# 指定绑定地址
jwebserver -b 0.0.0.0 -p 8080
```

也可以在代码中创建：

```java
import com.sun.net.httpserver.*;
import java.net.InetSocketAddress;

// 编程方式创建简易 HTTP 服务器
var server = SimpleFileServer.createFileServer(
    new InetSocketAddress(8080),
    Path.of("/var/www/html"),
    SimpleFileServer.OutputLevel.INFO
);
server.start();
```

## @snippet 文档标签

```java
/**
 * 计算两个数的最大公约数。
 *
 * 使用 {@snippet} 在 Javadoc 中内嵌带语法高亮的示例代码：
 *
 * {@snippet :
 * int gcd = MathUtils.gcd(48, 18);
 * System.out.println(gcd);  // 6
 * }
 *
 * @param a 第一个正整数
 * @param b 第二个正整数
 * @return 最大公约数
 */
public static int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

// @snippet 还支持从外部文件引用代码片段（高亮指定行）
/**
 * 使用方法：
 * {@snippet file="examples/GcdDemo.java" region="example"}
 */
```

# Java 19（2022 年 9 月）

## 虚拟线程（预览）

这是 Java 并发编程历史上最重要的变革——轻量级线程，创建成本从 MB 级降到 KB 级：

```java
import java.util.concurrent.*;

public class VirtualThreadDemo {
    public static void main(String[] args) throws Exception {

        // ===== 创建虚拟线程 =====

        // 方式 1：通过静态工厂创建并启动
        Thread vThread1 = Thread.startVirtualThread(() -> {
            System.out.println("虚拟线程运行中: " + Thread.currentThread());
        });

        // 方式 2：通过 Builder 创建
        Thread vThread2 = Thread.ofVirtual()
            .name("my-virtual-thread")
            .unstarted(() -> {
                System.out.println("Builder 创建的虚拟线程");
            });
        vThread2.start();

        // 方式 3：通过 ExecutorService（推荐）
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            // 提交 10,000 个任务——平台线程完全做不到
            for (int i = 0; i < 10_000; i++) {
                final int taskId = i;
                executor.submit(() -> {
                    // 每个任务在自己的虚拟线程中执行
                    String result = blockingIoCall(taskId);
                    System.out.println("任务 " + taskId + ": " + result);
                });
            }
        } // try-with-resources 自动等待所有任务完成并关闭
    }

    private static String blockingIoCall(int id) {
        try {
            // 模拟 IO 阻塞——虚拟线程被阻塞时自动让出平台线程
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return "result-" + id;
    }
}
```

### 虚拟线程 vs 平台线程

```java
// ===== 平台线程（Java 19 以前唯一的选择）=====

// 问题 1：线程很贵（默认 1MB 栈空间），数量受限
// 问题 2：上下文切换开销大
// 问题 3：阻塞操作浪费 OS 线程资源

// 传统解决方案：线程池 + 异步编程（CompletableFuture 等）
// → 代码复杂，调试困难，堆栈难追踪

// ===== 虚拟线程（Java 19+）=====

// 每个虚拟线程只占用几百 bytes
// 阻塞时自动"卸下"平台线程，不阻塞 OS 线程
// → 可以以同步风格写代码，享异步性能

// 100 万个虚拟线程并发执行 1 秒 sleep
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    long start = System.currentTimeMillis();
    for (int i = 0; i < 1_000_000; i++) {
        executor.submit(() -> Thread.sleep(Duration.ofSeconds(1)));
    }
    long end = System.currentTimeMillis();
    System.out.println("100 万虚拟线程耗时: " + (end - start) + "ms");
    // 大约 1200ms——几乎等同于单个 sleep 的时间！
}
```

### 并发数超大时使用 Semaphore 节制

```java
// 即使是虚拟线程，同时调用外部 API 也需要限流
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    var semaphore = new Semaphore(100);  // 最多 100 个并发
    var tasks = new ArrayList<Future<String>>();
    for (int i = 0; i < 10000; i++) {
        final int id = i;
        tasks.add(executor.submit(() -> {
            semaphore.acquire();
            try {
                return callExternalApi(id);
            } finally {
                semaphore.release();
            }
        }));
    }
    for (Future<String> task : tasks) {
        task.get();
    }
}
```

::: tip 虚拟线程的最佳实践
- **不要池化虚拟线程**——创建成本极低，用完就丢
- **同步阻塞代码直接用**——不需要 CompletableFuture 包装
- **ThreadLocal 谨慎使用**——虚拟线程生命周期短，ThreadLocal 膨胀更严重
:::

# Java 21（2023 年 9 月 · LTS）

Java 21 是继 Java 8 之后最重要的 LTS 版本。虚拟线程正式转正，模式匹配全面上线，有序集合终结了"首元素获取各显神通"的混乱。

## 虚拟线程正式转正

```java
// Java 21：虚拟线程不再是预览！直接在生产环境使用

// Spring Boot 3.2+ 已支持虚拟线程：
// spring.threads.virtual.enabled=true
// 一行配置，所有 Tomcat/Jetty 请求都在虚拟线程中处理
```

## Record 模式（解构）

```java
// ===== Record 模式：将 instanceof 检测 + 值提取一步完成 =====

record Point(int x, int y) {}
record Line(Point start, Point end) {}

// 嵌套解构
void printCoordinates(Object obj) {
    if (obj instanceof Line(Point(int x1, int y1), Point(int x2, int y2))) {
        System.out.printf("线段: (%d, %d) → (%d, %d)%n", x1, y1, x2, y2);
        // x1, y1, x2, y2 直接在 pattern 中提取完成！
    }
}

// 对比没有 Record 模式时的写法：
void printCoordinatesOld(Object obj) {
    if (obj instanceof Line line) {
        Point start = line.start();
        Point end = line.end();
        int x1 = start.x();
        int y1 = start.y();
        int x2 = end.x();
        int y2 = end.y();
        System.out.printf("线段: (%d, %d) → (%d, %d)%n", x1, y1, x2, y2);
    }
}
```

## Switch 模式匹配（正式）

Java 史上最强 Switch——穷举检查 + 解构提取 + Guard 条件三位一体：

```java
// ===== 完整模式匹配 Switch =====

// 对 Sealed 类层级做穷举模式匹配
String classify(Object obj) {
    return switch (obj) {
        case null ->
            "null 值";                        // null 处理

        case Integer i when i < 0 ->
            "负整数: " + i;                    // guarded pattern（条件守卫）

        case Integer i when i == 0 ->
            "零";

        case Integer i ->
            "正整数: " + i;                    // 无条件匹配（兜底）

        case String s when s.isEmpty() ->
            "空字符串";

        case String s when s.length() <= 10 ->
            "短字符串: " + s;

        case String s ->
            "长字符串: " + s.substring(0, 10) + "...";

        case double[] arr when arr.length == 0 ->
            "空 double 数组";

        case double[] arr ->
            "double 数组，长度: " + arr.length;

        default ->
            "未知类型: " + obj.getClass().getName();
    };
}
```

对 Sealed 类型做穷举匹配——不加 default 编译器也能确认全覆盖：

```java
sealed interface TrafficLight permits Red, Yellow, Green {}
record Red() implements TrafficLight {}
record Yellow() implements TrafficLight {}
record Green(int countdown) implements TrafficLight {}

String action(TrafficLight light) {
    return switch (light) {
        case Red()    -> "停止";
        case Yellow() -> "准备";
        case Green(int seconds) when seconds < 5
                     -> "加速通过（仅剩" + seconds + "秒）";
        case Green(int seconds)
                     -> "正常通行（剩余" + seconds + "秒）";
        // 编译器验证：Red、Yellow、Green 三种情况已穷举
    };
}
```

## 有序集合（Sequenced Collections）

Java 的集合框架一直有个"痛点"——本来有顺序的集合（List、LinkedHashSet、SortedSet 等），获取首尾元素的方式各不相同：

```java
// ===== Java 17 及以前：各显神通 =====
// List:           list.get(0)         list.get(list.size()-1)
// SortedSet:      set.first()         set.last()
// LinkedHashSet:  set.iterator().next()  ← 没有取首元素的直接方法！
// Deque:          deque.getFirst()    deque.getLast()

// ===== Java 21：统一接口 =====
import java.util.*;

public class SequencedDemo {
    public static void main(String[] args) {

        // SequencedCollection：新增三个接口
        // SequencedCollection → SequencedSet → SortedSet
        //                    → List
        //                    → Deque

        // 所有有序集合都可以：
        // getFirst()、getLast()、addFirst()、addLast()
        // removeFirst()、removeLast()、reversed()

        SequencedCollection<String> list = new ArrayList<>(List.of("a", "b", "c"));
        System.out.println(list.getFirst());   // a——不再需要 get(0)
        System.out.println(list.getLast());    // c——不再需要 get(size()-1)
        list.addFirst("first");               // [first, a, b, c]
        list.removeLast();                    // [first, a, b]

        // reversed() 返回逆序视图（不复制数据！）
        SequencedCollection<String> reversed = list.reversed();
        System.out.println(reversed);         // [b, a, first]

        // SequencedMap（LinkedHashMap、TreeMap 等）
        SequencedMap<String, Integer> map = new LinkedHashMap<>();
        map.put("one", 1);
        map.put("two", 2);
        map.put("three", 3);

        System.out.println(map.firstEntry()); // one=1
        System.out.println(map.lastEntry());  // three=3

        map.pollFirstEntry();  // 移除并返回第一个 entry
        map.pollLastEntry();   // 移除并返回最后一个 entry

        // 逆序遍历
        for (var entry : map.reversed().entrySet()) {
            System.out.println(entry.getKey() + "=" + entry.getValue());
        }
    }
}
```

# Java 22（2024 年 3 月）

## super() 前的语句

这是一个看似微小但解耦了无数样板代码的改进：

```java
// ===== Java 21：super 必须是构造器中第一句 =====
public class PositiveBigInteger extends BigInteger {

    public PositiveBigInteger(long value) {
        // 必须第一句！不能做任何校验
        super(String.valueOf(value));
        // 在这里才校验，但对象已经创建完成
        if (value <= 0) throw new IllegalArgumentException();
    }
}

// ===== Java 22：super 前可以写语句了（但不能用 this） =====
public class PositiveBigInteger extends BigInteger {

    public PositiveBigInteger(long value) {
        // 在 super() 之前校验——无效值根本不创建对象
        if (value <= 0) {
            throw new IllegalArgumentException("必须是正数: " + value);
        }
        // 把复杂转换逻辑放在 super() 前
        String binary = Long.toBinaryString(value);
        super(binary);
    }
}
```

## 未命名变量与模式（`_`）

```java
// ===== 不需要的变量用 _ 表示——编译器不报未使用警告 =====

// Java 21：不想要的参数仍然要有名字
map.forEach((k, v) -> System.out.println(k));  // v 未使用 → 警告

// Java 22：用 _ 明确表示"我不需要这个值"
map.forEach((k, _) -> System.out.println(k));

// try-with-resources 中
try (var conn = getConnection(); var _ = conn.createStatement()) {
    conn.doSomething();
    // Statement 只是为了连接不被关闭时才用的
}

// catch 块中
try {
    riskyOperation();
} catch (IOException _) {  // 不关心异常对象的细节
    System.out.println("IO 出错了");
}

// 模式匹配中
if (line instanceof Line(Point _, Point(int x, int y))) {
    // 只关心 end point 的坐标，start point 完全不管
    System.out.println("终点: " + x + ", " + y);
}

// 循环中
for (int _ = 0; _ < 10; _++) {  // 只关心循环次数
    queue.add(generateTask());
}
```

## 外部函数与内存 API（Foreign Function & Memory API）

```java
// C 语言中有 strtol 函数，Java 中直接调用它而无需 JNI！
// 这标志着 Java 正式具备了系统编程的能力

import java.lang.foreign.*;
import java.lang.invoke.*;

public class ForeignDemo {
    public static void main(String[] args) throws Throwable {

        // 1. 找到 C 标准库中的 strlen 函数
        Linker linker = Linker.nativeLinker();
        SymbolLookup stdlib = SymbolLookup.libraryLookup(
            // Linux: "libc.so.6", macOS: "libc.dylib", Windows: "msvcrt"
            "libc.so.6", Arena.global()
        );

        MemorySegment strlenAddr = stdlib.find("strlen").get();

        // 2. 描述函数签名：size_t strlen(const char *s)
        FunctionDescriptor strlenDesc = FunctionDescriptor.of(
            ValueLayout.JAVA_LONG,          // 返回值类型
            ValueLayout.ADDRESS             // 参数类型
        );

        MethodHandle strlen = linker.downcallHandle(
            strlenAddr, strlenDesc
        );

        // 3. 分配 off-heap 内存，写入字符串
        try (Arena arena = Arena.ofConfined()) {
            MemorySegment cString = arena.allocateFrom("Hello, Foreign API!");
            long length = (long) strlen.invoke(cString);
            System.out.println("strlen 返回: " + length);  // 20
        }
    }
}
```

# Java 23（2024 年 9 月）

## Markdown 文档注释

```java
/// # 计算类
///
/// 提供基础数学运算。支持 Markdown 语法：
///
/// - 加法：`add(a, b)`
/// - 减法：`subtract(a, b)`
///
/// 使用示例：
/// ```
/// int result = Calculator.add(3, 5);
/// ```
///
/// @param name 计算器名称
public record Calculator(String name) {

    /// 计算两个整数的和。
    ///
    /// 内部实现为 `a + b`，无溢出检查。
    ///
    /// @param a 第一个加数
    /// @param b 第二个加数
    /// @return a 和 b 的和
    public int add(int a, int b) {
        return a + b;
    }
}
```

## 模块导入声明

```java
// 原来需要逐个 import
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;
import java.util.stream.Collectors;

// Java 23：一行导入整个模块的所有导出包
import module java.base;

// 就这一行，java.base 模块导出的所有包都被导入了！
// java.lang.*, java.util.*, java.io.*, java.math.*, java.time.* ...
```

## 基本类型模式匹配（预览）

```java
// 模式匹配拓展到基本类型
int number = 42;

String description = switch (number) {
    case 0 -> "零";
    case int n when n > 0 && n < 100 -> "小正数";
    case int n when n >= 100 -> "大数";
    case int n -> "负数: " + n;  // 穷举覆盖
};
```

# Java 24（2025 年 3 月）

## 最新特性

```java
// Java 24 在 Java 21 LTS 基础上持续增强，重点特性包括：

// === 流收集器增强 ===
// gatherers API 预览，允许更灵活的中间操作
list.stream()
    .gather(Gatherers.windowFixed(3))  // 每 3 个元素一组
    .toList();

// === 类文件 API ===
// 无需第三方字节码库，直接解析、生成、修改 .class 文件

// === 向量 API（持续孵化） ===
// SIMD 指令的直接 Java 抽象，科学计算和 AI 推理场景性能极高
```

# 云原生时代总结

| 版本 | 核心贡献 |
|------|----------|
| Java 17 | Sealed Classes 补全类型体系（LTS） |
| Java 19 | 虚拟线程预览——并发范式的革命 |
| Java 21 | 虚拟线程、模式匹配、有序集合全部转正（LTS） |
| Java 22 | super 前语句、未命名变量——让语言更人性化 |
| Java 23 | Markdown 文档、模块导入——开发者体验全面提升 |

---

# 全文回顾：Java 从 1.0 到 24 的进化脉络

```
奠基时代（1.0~1.4）          现代Java（5~8）
    OOP 基础      →    泛型/Lambda/Stream
    内建多线程     →    JUC 并发包
    IO 基础       →    NIO/NIO.2

模块化时代（9~16）           云原生时代（17~24）
    Jigsaw 模块   →    虚拟线程
    var/文本块    →    模式匹配全家桶
    Record/Sealed →    有序集合
```

三大趋势贯穿始终：

1. **从啰嗦到简洁**：匿名内部类 → Lambda → var → Record → 模式匹配
2. **从重量到轻量**：操作系统线程 → 线程池 → 虚拟线程
3. **从开放到安全**：无约束继承 → Sealed Classes → 穷举检查

Java 没有变快，但用 Java 的人变快了。
