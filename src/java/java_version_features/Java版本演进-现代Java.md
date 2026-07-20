---
title: Java版本演进-现代Java
shortTitle: 现代Java
description: 文章描述
icon: basil:document-solid
author: Minhat
isOriginal: true
date: 2026-07-20
category:
  - JAVA
tag:
  - Java
---

Java 5 到 Java 8 是 Java 最辉煌的十年。泛型、Lambda、Stream 三大范式变革让 Java 从"啰嗦"走向"优雅"。本文用代码逐一展示这十年中每一个改变编程方式的关键特性。

<!-- more -->

# 版本总览

| 版本 | 代号 | 年份 | 核心特性 |
|------|------|------|----------|
| Java 5 | Tiger | 2004 | 泛型、注解、自动装箱、增强for、枚举、可变参数、JUC |
| Java 6 | Mustang | 2006 | 脚本引擎、编译器API、可插拔注解 |
| Java 7 | Dolphin | 2011 | try-with-resources、钻石操作符、String switch、NIO.2、Fork/Join |
| Java 8 | (无代号) | 2014 | Lambda、Stream、Optional、新日期API、接口默认方法 |

# Java 5（2004 年 9 月）

代号 Tiger（老虎）。Java 历史上最强的一次语言级更新，共引入 15 个 JSR，是 Java 现代化的起点。版本号也从此从 1.x 改称 Java 5（内部仍是 1.5）。

## 泛型（Generics）

没有泛型的时代，集合操作如同走钢丝——每一次 get 都要手动转型，一个类型错误在编译期完全不可见：

```java
// ===== Java 1.4 时代（没有泛型）=====
List list = new ArrayList();
list.add("hello");
list.add(42);             // 编译通过！没有任何警告
String s = (String) list.get(0);  // 强制转型，运行时才发现
String s2 = (String) list.get(1); // ClassCastException! 运行时炸

// ===== Java 5：编译期类型安全 =====
List<String> list = new ArrayList<String>();
list.add("hello");
// list.add(42);          // 编译错误！直接拦截
String s = list.get(0);   // 不需要转型！
```

### 泛型类与泛型方法

```java
// 泛型类——一个类通用于多种类型
public class Box<T> {
    private T item;

    public void put(T item) { this.item = item; }
    public T get() { return item; }

    public static void main(String[] args) {
        Box<String> stringBox = new Box<String>();
        stringBox.put("Hello");
        String str = stringBox.get();    // 不需要转型

        Box<Integer> intBox = new Box<Integer>();
        intBox.put(42);
        int n = intBox.get();            // 自动拆箱，也不需要转型
    }
}

// 泛型方法——比泛型类更灵活
public class Util {
    // 在返回值前声明 <T>
    public static <T> T first(List<T> list) {
        return list.get(0);
    }

    // 泛型方法 + 通配符
    public static <T> void copy(List<? super T> dest, List<? extends T> src) {
        for (int i = 0; i < src.size(); i++) {
            dest.set(i, src.get(i));
        }
    }
}
```

### 通配符与 PECS 原则

```java
// PECS: Producer Extends, Consumer Super

// <? extends T>：你只能从里面"读"（它是生产者）
public static double sumOfList(List<? extends Number> list) {
    double sum = 0.0;
    for (Number n : list) {   // 可以安全地当作 Number 来读
        sum += n.doubleValue();
    }
    // list.add(42);          // 编译错误！不知道具体是什么子类型
    return sum;
}

// <? super T>：你只能往里面"写"（它是消费者）
public static void fillNumbers(List<? super Integer> list) {
    for (int i = 0; i < 10; i++) {
        list.add(i);          // Integer 及其子类都能安全地加入
    }
    // Integer n = list.get(0);  // 编译错误！读出来的类型不确定
}

// 使用示例
List<Number> numbers = new ArrayList<Number>();
fillNumbers(numbers);      // Integer 是 Number 的子类，可以写入
double sum = sumOfList(numbers);  // Number 是 Number 的子类，可以读取
```

### 类型擦除

泛型的底层实现是类型擦除——编译后所有泛型信息被擦掉，还原为原始类型：

```java
// 这两行代码编译后完全相同
List<String>  list1 = new ArrayList<String>();
List<Integer> list2 = new ArrayList<Integer>();

// 运行时反射也分不清它们的类型参数
System.out.println(list1.getClass() == list2.getClass()); // true!
// 都是 class java.util.ArrayList

// 因此：
// - instanceof 不能带泛型参数：if (obj instanceof List<String>) ← 编译错误
// - 不能创建泛型数组：new T[10] ← 编译错误
// - 静态字段不能使用类型参数：static T item ← 编译错误
```

## 增强 for 循环（for-each）

告别迭代器和手动索引：

```java
// ===== Java 1.4 =====
List list = Arrays.asList(new String[]{"a", "b", "c"});
for (Iterator it = list.iterator(); it.hasNext(); ) {
    String s = (String) it.next();
    System.out.println(s);
}

// ===== Java 5 =====
for (String s : list) {
    System.out.println(s);
}

// 数组同样适用
int[] nums = {1, 2, 3, 4, 5};
for (int n : nums) {
    System.out.println(n);
}
```

底层原理：只要实现了 `Iterable` 接口，就能用 for-each：

```java
// 自己实现一个可 for-each 的集合
class MyCollection implements Iterable<String> {
    private String[] items = {"甲", "乙", "丙", "丁"};

    public Iterator<String> iterator() {
        return new Iterator<String>() {
            private int index = 0;
            public boolean hasNext() { return index < items.length; }
            public String next() { return items[index++]; }
            public void remove() { throw new UnsupportedOperationException(); }
        };
    }
}

// 现在就能用 for-each 了
MyCollection coll = new MyCollection();
for (String s : coll) {
    System.out.println(s);  // 甲 乙 丙 丁
}
```

## 自动装箱与拆箱（Autoboxing）

```java
// ===== Java 1.4 =====
Integer obj = new Integer(42);        // 手动装箱
int n = obj.intValue();               // 手动拆箱

List list = new ArrayList();
list.add(new Integer(100));           // 必须包装
int val = ((Integer) list.get(0)).intValue();  // 必须拆箱

// ===== Java 5 =====
Integer obj = 42;                     // 自动装箱
int n = obj;                          // 自动拆箱

List<Integer> list = new ArrayList<Integer>();
list.add(100);                        // 自动装箱 int → Integer
int val = list.get(0);                // 自动拆箱 Integer → int

// 在方法调用中同样自动转换
Integer sum(Integer a, Integer b) { return a + b; }
int result = sum(3, 5);   // 传入 int → 自动装箱 → 内部加法 → 自动拆箱 → 返回
```

**陷阱**：`==` 在装箱类型上比较的是引用，不是值：

```java
Integer a = 127;
Integer b = 127;
System.out.println(a == b);    // true（-128~127 走缓存池）

Integer c = 128;
Integer d = 128;
System.out.println(c == d);    // false! 超出缓存范围

// 正确做法：用 equals
System.out.println(c.equals(d));  // true
```

## 枚举（Enum）

Java 5 之前的尴尬——用 int 常量枚举：

```java
// ===== Java 1.4 的"枚举"——类型不安全 =====
public class OldStyle {
    public static final int RED   = 0;
    public static final int GREEN = 1;
    public static final int BLUE  = 2;

    public void setColor(int color) {
        // 可以传 999，编译期完全不会报错！
    }
}

// ===== Java 5：真正的枚举 =====
public enum Color {
    RED, GREEN, BLUE
}

// 枚举用 == 比较就足够了（单例保证）
Color c = Color.RED;
if (c == Color.RED) {
    System.out.println("是红色");
}
```

### 带字段和方法的枚举

Java 的枚举远不止常量集合，它是完整的类：

```java
public enum Planet {
    MERCURY(3.303e+23, 2.4397e6),
    VENUS  (4.869e+24, 6.0518e6),
    EARTH  (5.976e+24, 6.37814e6),
    MARS   (6.421e+23, 3.3972e6),
    JUPITER(1.9e+27,   7.1492e7),
    SATURN (5.688e+26, 6.0268e7),
    URANUS (8.686e+25, 2.5559e7),
    NEPTUNE(1.024e+26, 2.4746e7);

    private final double mass;    // 质量（kg）
    private final double radius;  // 半径（m）

    // 枚举的构造器默认且只能是 private
    Planet(double mass, double radius) {
        this.mass = mass;
        this.radius = radius;
    }

    // 万有引力常数
    private static final double G = 6.67300E-11;

    // 计算物体在行星表面的重力
    public double surfaceWeight(double otherMass) {
        return otherMass * surfaceGravity();
    }

    private double surfaceGravity() {
        return G * mass / (radius * radius);
    }
}

// 使用
double earthWeight = 70;  // kg
double mass = earthWeight / Planet.EARTH.surfaceGravity();
for (Planet p : Planet.values()) {
    System.out.printf("你在 %s 上的体重是 %.2f kg%n",
        p, p.surfaceWeight(mass));
}
```

### 策略枚举

```java
// 用枚举实现策略模式——每个枚举常量重写抽象方法
public enum Operation {
    PLUS {
        public double apply(double x, double y) { return x + y; }
    },
    MINUS {
        public double apply(double x, double y) { return x - y; }
    },
    TIMES {
        public double apply(double x, double y) { return x * y; }
    },
    DIVIDE {
        public double apply(double x, double y) {
            if (y == 0) throw new ArithmeticException("除数不能为零");
            return x / y;
        }
    };

    // 抽象方法——每个枚举常量必须实现
    public abstract double apply(double x, double y);
}

// 使用——比 if-else 优雅得多
double result = Operation.PLUS.apply(10, 5);  // 15
```

## 注解（Annotation）

```java
// Java 5 引入了注解机制，从此声明式编程成为主流

// ===== 内置注解 =====

// @Override —— 告诉编译器这是重写方法，帮你检查签名是否正确
class Parent {
    public void doWork() {}
}
class Child extends Parent {
    @Override
    public void doWork() {}   // 如果拼错成 doWrok，编译器报错
}

// @Deprecated —— 标记过时 API
@Deprecated
public static void oldMethod() {
    System.out.println("这个方法过时了，用 newMethod 代替");
}

// @SuppressWarnings —— 压制编译器警告
@SuppressWarnings("unchecked")
List<String> list = (List<String>) someUntypedMethod();
// "unchecked"、"deprecation"、"rawtypes" 等常见参数
```

### 自定义注解

```java
import java.lang.annotation.*;

// 定义一个简单的注解
@Retention(RetentionPolicy.RUNTIME)   // 运行时可通过反射读取
@Target(ElementType.METHOD)           // 只能用在方法上
public @interface Test {
    // 属性（当名为 value 且只有它时，使用时可以不写属性名）
    String value() default "";
    int timeout() default 1000;
}

// 定义一个标记注解（没有属性的注解）
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface ThreadSafe {
    String author() default "unknown";
    String date();
}

// 使用自定义注解
@ThreadSafe(author = "minhat", date = "2026-07-20")
public class AnnotatedService {

    @Test(value = "testLogin", timeout = 3000)
    public void login() {
        System.out.println("登录测试...");
    }

    @Test("testLogout")   // value 可省略属性名
    public void logout() {
        System.out.println("退出测试...");
    }

    @Test  // 使用默认值
    public void register() {
        System.out.println("注册测试...");
    }
}

// 通过反射读取注解
public class AnnotationProcessor {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = AnnotatedService.class;

        // 读取类上的注解
        if (clazz.isAnnotationPresent(ThreadSafe.class)) {
            ThreadSafe ts = clazz.getAnnotation(ThreadSafe.class);
            System.out.println("作者: " + ts.author());
            System.out.println("日期: " + ts.date());
        }

        // 读取方法上的注解并执行
        for (java.lang.reflect.Method m : clazz.getMethods()) {
            if (m.isAnnotationPresent(Test.class)) {
                Test test = m.getAnnotation(Test.class);
                System.out.println("执行测试: "
                    + (test.value().isEmpty() ? m.getName() : test.value())
                    + " (超时: " + test.timeout() + "ms)");
                m.invoke(clazz.getDeclaredConstructor().newInstance());
            }
        }
    }
}
```

## 可变参数（Varargs）

```java
// ===== Java 1.4：参数数量不确定时只能用数组 =====
public static void printArgs1(String[] args) {
    for (int i = 0; i < args.length; i++) {
        System.out.print(args[i] + " ");
    }
}
// 调用时必须创建数组
printArgs1(new String[]{"a", "b", "c"});

// ===== Java 5：可变参数 =====
public static void printArgs2(String... args) {
    for (String arg : args) {
        System.out.print(arg + " ");
    }
}
// 调用简洁无比
printArgs2("a", "b", "c");   // 直接传任意个参数
printArgs2();                 // 零个也可以
printArgs2("hello");          // 一个也可以
```

可变参数的本质是数组，但语法糖让调用侧极其优雅：

```java
// printf 就是可变参数的经典应用
System.out.printf("姓名: %s, 年龄: %d, 分数: %.2f%n",
    "张三", 25, 88.5);

// 可变参数必须是最后一个参数
public static String join(String delimiter, String... words) {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < words.length; i++) {
        if (i > 0) sb.append(delimiter);
        sb.append(words[i]);
    }
    return sb.toString();
}

System.out.println(join(", ", "Java", "Kotlin", "Scala"));
// Java, Kotlin, Scala
```

## 静态导入（Static Import）

```java
// ===== Java 1.4 =====
double r = Math.cos(Math.PI * 2);

// ===== Java 5：静态导入 =====
import static java.lang.Math.cos;
import static java.lang.Math.PI;

double r = cos(PI * 2);   // 就像调用当前类的方法一样

// 通配符导入所有静态成员
import static java.lang.Math.*;

double area = PI * pow(radius, 2);

// 常用静态导入
import static org.junit.Assert.*;    // JUnit 断言
import static java.util.Collections.*;  // 集合工具方法
```

## java.util.concurrent（JUC）

这是 Java 5 最重量级的类库更新。Doug Lea 的并发大师作品正式进入 JDK。

### 原子类

```java
import java.util.concurrent.atomic.*;

public class AtomicDemo {
    // 无需 synchronized 的线程安全计数器
    private AtomicInteger counter = new AtomicInteger(0);

    public void increment() {
        counter.incrementAndGet();   // 原子自增，无需加锁
    }

    public int getCount() {
        return counter.get();
    }

    public static void main(String[] args) {
        // 原子更新引用
        AtomicReference<String> ref = new AtomicReference<String>("old");
        ref.compareAndSet("old", "new");  // CAS: 如果是 old 就更新为 new
        System.out.println(ref.get());     // new

        // 原子更新数组元素
        AtomicIntegerArray arr = new AtomicIntegerArray(10);
        arr.incrementAndGet(0);  // arr[0]++
    }
}
```

### 显式锁

```java
import java.util.concurrent.locks.*;

public class LockDemo {
    private final Lock lock = new ReentrantLock();
    private final Condition notEmpty = lock.newCondition();
    private final Condition notFull = lock.newCondition();
    private int count = 0;
    private final int MAX = 10;

    // Lock 相比 synchronized 的优势：
    // 1. 可以非阻塞尝试获取锁（tryLock）
    // 2. 可以超时获取锁
    // 3. 可以中断等待
    // 4. 可以有多个等待条件（Condition）

    public void produce() {
        lock.lock();
        try {
            while (count >= MAX) {
                notFull.await();   // 等待不满，相当于 Object.wait()
            }
            count++;
            System.out.println("生产，当前: " + count);
            notEmpty.signal();     // 唤醒消费者，相当于 Object.notify()
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            lock.unlock();         // 忘了 unlock 是灾难！finally 保底
        }
    }

    public void consume() {
        lock.lock();
        try {
            while (count <= 0) {
                notEmpty.await();
            }
            count--;
            System.out.println("消费，当前: " + count);
            notFull.signal();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            lock.unlock();
        }
    }

    // ReadWriteLock：读多写少场景的性能利器
    private final ReadWriteLock rwLock = new ReentrantReadWriteLock();

    public int read() {
        rwLock.readLock().lock();
        try {
            return count;   // 多个读线程可以同时持有，互不阻塞
        } finally {
            rwLock.readLock().unlock();
        }
    }

    public void write(int value) {
        rwLock.writeLock().lock();
        try {
            count = value;   // 写锁是排他的
        } finally {
            rwLock.writeLock().unlock();
        }
    }
}
```

### 线程池与并发集合

```java
import java.util.concurrent.*;

public class ExecutorDemo {
    public static void main(String[] args) throws Exception {

        // 创建线程池
        ExecutorService pool = Executors.newFixedThreadPool(4);

        // 提交任务——有返回值
        Future<Integer> future = pool.submit(new Callable<Integer>() {
            public Integer call() throws Exception {
                Thread.sleep(1000);
                return 42;
            }
        });

        // 提交任务——无返回值
        pool.execute(new Runnable() {
            public void run() {
                System.out.println("后台任务执行中...");
            }
        });

        // 获取结果（阻塞直到完成）
        Integer result = future.get();
        System.out.println("任务结果: " + result);

        // 优雅关闭
        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);

        // ===== 并发集合 =====
        // ConcurrentHashMap：无需锁的高并发 Map
        ConcurrentMap<String, Integer> map = new ConcurrentHashMap<String, Integer>();
        map.put("key", 1);
        map.putIfAbsent("key", 2);  // 原子操作：不存在才写入

        // CopyOnWriteArrayList：读多写少，写时复制
        CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<String>();

        // BlockingQueue：阻塞队列——生产者/消费者的完美工具
        BlockingQueue<String> queue = new LinkedBlockingQueue<String>(100);
        queue.put("task");       // 队列满时阻塞
        String task = queue.take();  // 队列空时阻塞
    }
}
```

### 同步工具类

```java
import java.util.concurrent.*;

public class SyncUtilsDemo {
    public static void main(String[] args) throws Exception {

        // CountDownLatch：等人齐了一起出发
        int runnerCount = 5;
        CountDownLatch startSignal = new CountDownLatch(1);
        CountDownLatch doneSignal = new CountDownLatch(runnerCount);

        for (int i = 0; i < runnerCount; i++) {
            final int no = i;
            new Thread(new Runnable() {
                public void run() {
                    try {
                        startSignal.await();   // 等待发令枪
                        System.out.println("选手" + no + " 起跑");
                        Thread.sleep((long) (Math.random() * 3000));
                        System.out.println("选手" + no + " 到达终点");
                        doneSignal.countDown();  // 到达终点
                    } catch (InterruptedException e) {}
                }
            }).start();
        }

        Thread.sleep(1000);
        System.out.println("各就各位——预备——跑！");
        startSignal.countDown();  // 发令
        doneSignal.await();        // 等待所有人到达
        System.out.println("全部到达，比赛结束");

        // CyclicBarrier：人到齐了一起做下一件事
        CyclicBarrier barrier = new CyclicBarrier(3, new Runnable() {
            public void run() {
                System.out.println("三人都到齐了，开饭！");
            }
        });

        // Semaphore：控制同时访问的线程数（收费站放行 N 辆车）
        Semaphore semaphore = new Semaphore(3);  // 最多 3 个线程同时访问
        semaphore.acquire();   // 获取许可（可能阻塞）
        // ... 访问资源 ...
        semaphore.release();   // 释放许可

        // Exchanger：两个线程交换数据
        Exchanger<String> exchanger = new Exchanger<String>();
        // 线程 A：String fromA = exchanger.exchange(dataFromA);
        // 线程 B：String fromB = exchanger.exchange(dataFromB);
    }
}
```

# Java 6（2006 年 12 月）

代号 Mustang（野马）。203 个包、3,793 个类。Java 6 主要是内部优化和类库扩充，语言本身没有新语法。

## 脚本引擎

JDK 内嵌 JavaScript 引擎（基于 Rhino），可以在 Java 中执行脚本：

```java
import javax.script.*;

public class ScriptDemo {
    public static void main(String[] args) throws Exception {
        ScriptEngineManager manager = new ScriptEngineManager();

        // 获取 JavaScript 引擎
        ScriptEngine engine = manager.getEngineByName("JavaScript");

        // 执行 JS 代码
        engine.eval("print('Hello from JavaScript!')");

        // 向脚本传入 Java 变量
        engine.put("name", "Minhat");
        engine.eval("print('Hello, ' + name + '!')");

        // 从脚本获取返回值
        Object result = engine.eval("(function(a, b) { return a + b; })(3, 5)");
        System.out.println(result);  // 8.0

        // 使用 Invocable 调用脚本中的函数
        engine.eval("function greet(who) { return 'Hi, ' + who + '!'; }");
        Invocable invocable = (Invocable) engine;
        String greeting = (String) invocable.invokeFunction("greet", "Minhat");
        System.out.println(greeting);  // Hi, Minhat!
    }
}
```

## 可插拔注解处理

```java
import javax.annotation.processing.*;
import javax.lang.model.*;
import javax.lang.model.element.*;
import javax.tools.*;
import java.util.*;

// 自定义注解处理器——编译时自动检查代码
@SupportedAnnotationTypes("Override")
@SupportedSourceVersion(SourceVersion.RELEASE_6)
public class CustomProcessor extends AbstractProcessor {

    @Override
    public boolean process(
        Set<? extends TypeElement> annotations,
        RoundEnvironment roundEnv
    ) {
        for (TypeElement annotation : annotations) {
            for (Element element :
                roundEnv.getElementsAnnotatedWith(annotation)) {
                System.out.println("发现 @Override 标注: " + element);
                // 在这里可以做编译期检查、生成代码等
            }
        }
        return true;
    }
}
```

::: tip 注解处理的遗产
Java 6 的 Pluggable Annotation Processing API 直接催生了后来的 Lombok、MapStruct、Dagger 等编译期代码生成工具。Java 编译时第一次有了"元编程"的能力。
:::

# Java 7（2011 年 7 月）

代号 Dolphin（海豚）。时隔五年才发布（Sun 被 Oracle 收购期间），但质量极高——try-with-resources 解决了资源管理的永恒痛点，NIO.2 补齐了文件操作，Fork/Join 引入了工作窃取算法。

## try-with-resources

Java 7 最经典的新特性，彻底告别 finally 样板代码：

```java
// ===== Java 1.6 =====
BufferedReader reader = null;
try {
    reader = new BufferedReader(new FileReader("data.txt"));
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (reader != null) {
        try {
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();   // 关闭也可能抛异常，淹没了原始异常！
        }
    }
}

// ===== Java 7：try-with-resources =====
try (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}  // reader.close() 自动调用，无论是否有异常
```

多资源同时管理，用分号隔开：

```java
// 三个资源，自动按打开的逆序关闭
try (
    FileInputStream fis = new FileInputStream("source.txt");
    InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
    BufferedReader br = new BufferedReader(isr)
) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

自动关闭的前提是实现 `AutoCloseable` 接口：

```java
// 自己的资源类也能享受 try-with-resources
public class MyResource implements AutoCloseable {
    public MyResource() {
        System.out.println("资源创建");
    }

    public void doWork() {
        System.out.println("资源工作中...");
    }

    @Override
    public void close() throws Exception {
        System.out.println("资源关闭（自动调用）");
    }
}

// 使用
try (MyResource res = new MyResource()) {
    res.doWork();
}
// 输出:
// 资源创建
// 资源工作中...
// 资源关闭（自动调用）
```

## 钻石操作符（Diamond Operator）

```java
// ===== Java 5/6：类型推断还不够聪明 =====
Map<String, List<Map<String, Integer>>> map =
    new HashMap<String, List<Map<String, Integer>>>();  // 重复得让人窒息

// ===== Java 7：钻石操作符 =====
Map<String, List<Map<String, Integer>>> map = new HashMap<>();  // <> 就够了

// 所有泛型类型都适用
List<String> list = new ArrayList<>();
Set<Integer> set = new HashSet<>();
Map<String, Object> config = new LinkedHashMap<>();
```

## String 支持 switch

```java
// ===== Java 1.6：只能用 if-else 链 =====
String command = "start";
if (command.equals("start")) {
    System.out.println("启动中...");
} else if (command.equals("stop")) {
    System.out.println("停止中...");
} else {
    System.out.println("未知命令");
}

// ===== Java 7：switch 直接支持字符串 =====
switch (command) {
    case "start":
        System.out.println("启动中...");
        break;
    case "stop":
        System.out.println("停止中...");
        break;
    case "restart":
        System.out.println("重启中...");
        break;
    default:
        System.out.println("未知命令: " + command);
}

// 注意：字符串匹配是调用 equals()，大小写敏感！
```

## 多异常捕获

```java
// ===== Java 6 =====
try {
    Class.forName("com.example.MyClass").newInstance();
} catch (ClassNotFoundException e) {
    handle(e);
} catch (InstantiationException e) {
    handle(e);
} catch (IllegalAccessException e) {
    handle(e);
}

// ===== Java 7：一条 catch 捕获多种异常 =====
try {
    Class.forName("com.example.MyClass").newInstance();
} catch (ClassNotFoundException | InstantiationException |
         IllegalAccessException e) {
    handle(e);    // 异常引用 e 是隐式 final 的
}
```

## 数字字面量增强

```java
// 二进制字面量
int flag = 0b1010_1100;       // byte、short、int、long 都支持

// 下划线分隔——让长数字更可读
long creditCard = 1234_5678_9012_3456L;
int oneMillion  = 1_000_000;
long hexBytes   = 0xFF_EC_DE_5E;
long maxLong    = 0x7fff_ffff_ffff_ffffL;

// 编译后下划线被移除，不影响数值
```

## NIO.2（java.nio.file）

Java 7 给了文件操作一次彻底的现代化改造。`java.nio.file.Path` + `Files` 工具类取代了 `java.io.File` 的大部分职责：

```java
import java.nio.file.*;
import java.nio.file.attribute.*;
import java.io.*;

public class Nio2Demo {
    public static void main(String[] args) throws Exception {

        // Path 取代 File
        Path path = Paths.get("/home/user/docs/readme.txt");

        // 链式操作
        Path home = Paths.get("/home/user");
        Path docs = home.resolve("docs");
        Path readme = docs.resolve("readme.txt");
        System.out.println(readme);  // /home/user/docs/readme.txt

        // 获取相对路径
        Path relative = home.relativize(readme);
        System.out.println(relative); // docs/readme.txt

        // ===== Files 工具类：一行代码搞定常见操作 =====

        // 读取整个文件（小文件最快捷的方式）
        List<String> lines = Files.readAllLines(path,
            java.nio.charset.StandardCharsets.UTF_8);

        byte[] bytes = Files.readAllBytes(path);

        // 写入文件
        Files.write(path, lines, java.nio.charset.StandardCharsets.UTF_8);

        // 复制/移动
        Files.copy(path, Paths.get("/backup/readme.txt"),
            StandardCopyOption.REPLACE_EXISTING);
        Files.move(path, Paths.get("/archive/readme.txt"),
            StandardCopyOption.ATOMIC_MOVE);

        // 创建目录（包括不存在的父目录）
        Files.createDirectories(docs.resolve("sub1/sub2"));

        // 删除
        Files.delete(path);          // 不存在抛出异常
        Files.deleteIfExists(path);  // 不存在不报错

        // 文件属性
        long size = Files.size(path);
        boolean readable = Files.isReadable(path);
        FileTime lastModified = Files.getLastModifiedTime(path);

        // 遍历目录
        try (DirectoryStream<Path> stream =
                Files.newDirectoryStream(home, "*.txt")) {
            for (Path entry : stream) {
                System.out.println(entry.getFileName());
            }
        }

        // ===== 文件监控（WatchService）=====
        WatchService watcher = FileSystems.getDefault().newWatchService();
        Path watchDir = Paths.get("/tmp");
        watchDir.register(watcher,
            StandardWatchEventKinds.ENTRY_CREATE,
            StandardWatchEventKinds.ENTRY_MODIFY,
            StandardWatchEventKinds.ENTRY_DELETE
        );

        System.out.println("监控 /tmp 目录变化...");
        WatchKey key = watcher.take();  // 阻塞等待事件
        for (WatchEvent<?> event : key.pollEvents()) {
            WatchEvent.Kind kind = event.kind();
            Path fileName = (Path) event.context();
            System.out.println(kind + ": " + fileName);
        }
        key.reset();
    }
}
```

## Fork/Join 框架

工作窃取（work-stealing）算法的 Java 实现——大任务递归拆成小任务，多线程并行执行：

```java
import java.util.concurrent.*;

// 计算 1 到 n 的和（用 Fork/Join）
public class ForkJoinSum extends RecursiveTask<Long> {
    private static final int THRESHOLD = 10_000;  // 阈值：小于此值不再拆分
    private final long start;
    private final long end;

    public ForkJoinSum(long start, long end) {
        this.start = start;
        this.end = end;
    }

    @Override
    protected Long compute() {
        long length = end - start;

        // 任务足够小，直接计算
        if (length <= THRESHOLD) {
            long sum = 0;
            for (long i = start; i <= end; i++) {
                sum += i;
            }
            return sum;
        }

        // 任务太大，一分为二
        long mid = start + length / 2;
        ForkJoinSum left = new ForkJoinSum(start, mid);
        ForkJoinSum right = new ForkJoinSum(mid + 1, end);

        left.fork();                              // 分叉执行左边
        long rightResult = right.compute();       // 当前线程执行右边
        long leftResult = left.join();            // 等待左边完成

        return leftResult + rightResult;
    }

    public static void main(String[] args) {
        ForkJoinPool pool = new ForkJoinPool();
        ForkJoinSum task = new ForkJoinSum(1, 1_000_000_000L);
        long result = pool.invoke(task);
        System.out.println("1 到 10 亿之和: " + result);
    }
}
```

工作窃取的核心思想：每个线程有自己的双端队列，自己的任务从队头取；空闲线程"偷"其他线程队尾的任务。CPU 永不闲置。

# Java 8（2014 年 3 月）

Java 8 是继 Java 5 之后最大的一次发布，从根本上改变了 Java 的编程范式。如果说 Java 5 让 Java "现代化"，那 Java 8 让 Java "函数式"。

## Lambda 表达式

从匿名内部类到 Lambda，代码量直接腰斩：

```java
// ===== Java 7：匿名内部类 =====
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("老式写法");
    }
}).start();

// 排序
Collections.sort(list, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.compareTo(b);
    }
});

// ===== Java 8：Lambda =====
new Thread(() -> System.out.println("Lambda 写法")).start();

Collections.sort(list, (a, b) -> a.compareTo(b));
```

### Lambda 语法全解

```java
// Lambda 就是函数式接口（只有一个抽象方法的接口）的实例

// 格式 1：(参数) -> 表达式
Runnable r = () -> System.out.println("无参无返回值");

// 格式 2：(参数) -> { 语句块; return 值; }
Runnable r2 = () -> {
    System.out.println("第一步");
    System.out.println("第二步");
};

// 格式 3：单参数可以省略括号
Consumer<String> print = s -> System.out.println(s);

// 格式 4：多参数，类型可以推断（省略）
Comparator<Integer> comp = (a, b) -> a - b;

// 格式 5：显式声明参数类型
Comparator<Integer> comp2 = (Integer a, Integer b) -> a - b;

// 格式 6：方法体只有 return 时，省略 return 和花括号
BinaryOperator<Integer> add = (a, b) -> a + b;
// 等价于
BinaryOperator<Integer> add2 = (a, b) -> { return a + b; };
```

### 函数式接口

```java
// @FunctionalInterface：编译期检查接口是否只有一个抽象方法
// （可以有多个 default 或 static 方法，但抽象方法只能有一个）

@FunctionalInterface
interface Calculator {
    int compute(int a, int b);

    // 默认方法不算"抽象方法"
    default String name() { return "计算器"; }
}

// 使用
Calculator add = (a, b) -> a + b;
Calculator multiply = (a, b) -> a * b;

System.out.println(add.compute(3, 5));       // 8
System.out.println(multiply.compute(3, 5));  // 15
```

### 四大核心函数式接口

```java
import java.util.function.*;

public class FunctionalInterfacesDemo {
    public static void main(String[] args) {

        // 1. Function<T, R>：接收 T，返回 R ——"转换"
        Function<String, Integer> strLen = s -> s.length();
        System.out.println(strLen.apply("Hello"));   // 5

        Function<Integer, String> intToStr = n -> "数字: " + n;
        System.out.println(intToStr.apply(42));       // 数字: 42

        // 函数组合
        Function<String, String> upper = s -> s.toUpperCase();
        Function<String, String> exclaim = s -> s + "!";
        Function<String, String> shout = upper.andThen(exclaim);
        System.out.println(shout.apply("hello"));      // HELLO!

        // 2. Consumer<T>：接收 T，不返回——"消费"
        Consumer<String> printer = s -> System.out.println("打印: " + s);
        printer.accept("Hello World");

        // Consumer 链式调用
        Consumer<String> log = s -> System.out.println("日志: " + s);
        printer.andThen(log).accept("一条消息");  // 依次执行

        // 3. Supplier<T>：无参，返回 T——"供给"
        Supplier<Double> random = () -> Math.random();
        System.out.println(random.get());

        Supplier<String> env = () -> System.getenv("JAVA_HOME");
        System.out.println(env.get());

        // 4. Predicate<T>：接收 T，返回 boolean——"断言"
        Predicate<String> isEmpty = s -> s == null || s.isEmpty();
        System.out.println(isEmpty.test(""));     // true
        System.out.println(isEmpty.test("abc"));  // false

        // 逻辑组合
        Predicate<String> notEmpty = isEmpty.negate();
        Predicate<String> longEnough = s -> s.length() > 3;
        Predicate<String> valid = notEmpty.and(longEnough);

        System.out.println(valid.test("ab"));      // false（太短）
        System.out.println(valid.test("abcd"));    // true
    }
}
```

## 方法引用

方法引用（Method Reference）是 Lambda 的进一步简化。当 Lambda 体只是调用一个已有方法时，用方法引用更清晰：

```java
// ===== 四种方法引用 =====

// 1. 静态方法引用    ClassName::staticMethod
Function<String, Integer> parser1 = s -> Integer.parseInt(s);
Function<String, Integer> parser2 = Integer::parseInt;      // 等价

// 2. 实例方法引用    instance::method
String prefix = "Hello, ";
Function<String, String> greeting1 = s -> prefix.concat(s);
Function<String, String> greeting2 = prefix::concat;        // 等价

// 3. 特定类的实例方法    ClassName::instanceMethod
// （第一个参数成为方法调用者）
Function<String, Integer> len1 = s -> s.length();
Function<String, Integer> len2 = String::length;            // 等价

BiFunction<String, String, Integer> cmp1 =
    (a, b) -> a.compareTo(b);
BiFunction<String, String, Integer> cmp2 =
    String::compareTo;                                       // 等价

// 4. 构造方法引用    ClassName::new
Supplier<List<String>> factory1 = () -> new ArrayList<>();
Supplier<List<String>> factory2 = ArrayList::new;            // 等价

// 带参数的构造方法引用
Function<Integer, ArrayList<String>> sized1 =
    n -> new ArrayList<>(n);
Function<Integer, ArrayList<String>> sized2 =
    ArrayList::new;                                          // 等价
```

## Stream API

Stream 是 Java 8 最重要的新增 API——将集合操作从"怎么做"变成"要什么"：

```java
import java.util.*;
import java.util.stream.*;

public class StreamDemo {
    public static void main(String[] args) {
        List<String> names = Arrays.asList(
            "张三", "李四", "王五", "赵六", "田七", "孙八"
        );

        // ===== 一个完整的 Stream 流水线 =====
        List<String> result = names.stream()          // 1. 创建流
            .filter(s -> s.length() == 2)             // 2. 中间操作：过滤
            .sorted((a, b) -> b.compareTo(a))         //    中间操作：排序
            .map(s -> s.toUpperCase())                //    中间操作：映射
            .collect(Collectors.toList());            // 3. 终止操作：收集

        System.out.println(result);  // [田七, 王五, 李四, 张三]

        // 核心特点：惰性求值——中间操作不会立即执行，
        // 只有在终止操作调用时才一次性执行整个流水线。
    }
}
```

### Stream 创建

```java
// 从集合
Stream<String> s1 = list.stream();            // 顺序流
Stream<String> s2 = list.parallelStream();    // 并行流

// 从数组
Stream<Integer> s3 = Arrays.stream(new Integer[]{1, 2, 3});

// 从值
Stream<String> s4 = Stream.of("a", "b", "c");

// 无限流
Stream<Double> randoms = Stream.generate(Math::random);  // 无限随机数
Stream<Integer> naturals = Stream.iterate(0, n -> n + 1); // 0, 1, 2, ...

// 取前 10 个
List<Integer> first10 = naturals.limit(10)
    .collect(Collectors.toList());
System.out.println(first10);  // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// 从文件行
try (Stream<String> lines = Files.lines(Paths.get("file.txt"))) {
    long count = lines.count();
}
```

### 中间操作

```java
List<Integer> nums = Arrays.asList(1, 2, 3, 3, 4, 5, 5, 6);

// filter：过滤
nums.stream().filter(n -> n % 2 == 0)  // [2, 4, 6]

// map：转换
nums.stream().map(n -> n * n)          // [1, 4, 9, 9, 16, 25, 25, 36]

// flatMap：将每个元素变成流，再合并
List<String> words = Arrays.asList("Hello", "World");
words.stream()
    .flatMap(w -> Arrays.stream(w.split("")))  // [H,e,l,l,o,W,o,r,l,d]
    .distinct()                                 // 去重
    .forEach(System.out::print);                // HeloWrd

// distinct：去重
nums.stream().distinct()               // [1, 2, 3, 4, 5, 6]

// sorted：排序
nums.stream().sorted((a, b) -> b - a)  // 降序

// peek：调试神器——不改变流，只查看经过的元素
nums.stream()
    .filter(n -> n > 3)
    .peek(n -> System.out.println("过滤后: " + n))
    .map(n -> n * 2)
    .peek(n -> System.out.println("映射后: " + n))
    .collect(Collectors.toList());

// limit / skip：限长 / 跳过
Stream.iterate(1, n -> n + 1)
    .skip(5)       // 跳过前 5 个
    .limit(3)      // 取 3 个
    .forEach(System.out::println);  // 6 7 8
```

### 终止操作

```java
List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// ===== 匹配 =====
boolean allEven = nums.stream().allMatch(n -> n % 2 == 0);  // false
boolean anyEven = nums.stream().anyMatch(n -> n % 2 == 0);  // true
boolean noneNeg = nums.stream().noneMatch(n -> n < 0);      // true

// ===== 查找 =====
Optional<Integer> first = nums.stream().filter(n -> n > 5).findFirst();
first.ifPresent(n -> System.out.println("第一个>5的数: " + n));

Optional<Integer> any = nums.parallelStream()
    .filter(n -> n > 5).findAny();   // 并行流中更高效

// ===== 归约 =====
int sum = nums.stream().reduce(0, (a, b) -> a + b);          // 55
int product = nums.stream().reduce(1, (a, b) -> a * b);      // 3628800
Optional<Integer> max = nums.stream().reduce(Integer::max);

// 无初始值的 reduce 返回 Optional（因为流可能为空）
Optional<Integer> min = nums.stream().reduce(Integer::min);

// 并行归约——适合大数据量
int parallelSum = nums.parallelStream()
    .reduce(0, Integer::sum, Integer::sum);

// ===== 数值流 =====
// 基本类型流避免拆箱装箱开销
IntStream ints = IntStream.rangeClosed(1, 100);  // 1~100
int realSum = ints.sum();                         // 5050

DoubleStream doubles = DoubleStream.of(1.0, 2.0, 3.5);
double avg = doubles.average().orElse(0);

LongStream longs = LongStream.range(0, 1_000_000);
long count = longs.count();

// ===== 收集 =====
List<Integer> list = nums.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());

// 分组
Map<Boolean, List<Integer>> groups = nums.stream()
    .collect(Collectors.groupingBy(n -> n % 2 == 0));
// {false=[1,3,5,7,9], true=[2,4,6,8,10]}

// 多级分组
Map<Integer, Map<String, List<String>>> team = employees.stream()
    .collect(Collectors.groupingBy(Employee::getAge,
             Collectors.groupingBy(Employee::getDepartment,
             Collectors.mapping(Employee::getName,
             Collectors.toList()))));

// 分区（分两组）
Map<Boolean, List<Integer>> partition = nums.stream()
    .collect(Collectors.partitioningBy(n -> n > 5));

// 拼接
String joined = names.stream()
    .collect(Collectors.joining(", ", "[", "]"));
// [张三, 李四, 王五]
```

## Optional

有史以来最令人焦虑的异常 `NullPointerException` 终于有了优雅的应对方式：

```java
import java.util.*;

public class OptionalDemo {
    public static void main(String[] args) {

        // ===== 创建 =====
        Optional<String> empty = Optional.empty();
        Optional<String> nonEmpty = Optional.of("Hello");
        Optional<String> nullable = Optional.ofNullable(maybeReturnNull());

        // ===== 判空并操作 =====

        // 老式写法
        String value = getConfig("path");
        if (value != null) {
            System.out.println(value.toUpperCase());
        }

        // Optional 写法——链式操作，优雅
        getConfigOpt("path")
            .map(String::toUpperCase)
            .ifPresent(System.out::println);

        // ===== 提供默认值 =====
        String result1 = getConfigOpt("timeout").orElse("30");
        String result2 = getConfigOpt("timeout")
            .orElseGet(() -> loadDefaultTimeout());  // 惰性求值
        String result3 = getConfigOpt("critical")
            .orElseThrow(() -> new RuntimeException("关键配置缺失！"));

        // ===== 过滤 =====
        Optional<Integer> port = getPort()
            .filter(p -> p > 0 && p <= 65535)
            .filter(p -> p != 80);
        // 端口号合法且不是 80 才通过

        // ===== 常见使用模式 =====

        // 模式 1：链式转换
        String city = getUser(42)
            .flatMap(User::getAddress)       // flatMap 解决 Optional 嵌套
            .map(Address::getCity)
            .orElse("未知城市");

        // 模式 2：if-else 替代
        getConfigOpt("mode")
            .ifPresentOrElse(
                mode -> System.out.println("模式: " + mode),
                () -> System.out.println("使用默认模式")
            );

        // 模式 3：组合（Java 9+）
        Optional<String> combined = getConfigOpt("host")
            .or(() -> getConfigOpt("hostname"))
            .or(() -> Optional.of("localhost"));
    }

    private static Optional<String> getConfigOpt(String key) {
        // 实际的配置读取逻辑
        return Optional.ofNullable(System.getProperty(key));
    }

    private static String getConfig(String key) {
        return System.getProperty(key);
    }

    private static String maybeReturnNull() { return null; }
    private static String loadDefaultTimeout() { return "60"; }
    private static Optional<Integer> getPort() {
        return Optional.of(8080);
    }
    private static Optional<User> getUser(int id) {
        return Optional.empty();
    }

    static class User {
        Optional<Address> getAddress() { return Optional.empty(); }
    }
    static class Address {
        String getCity() { return "Beijing"; }
    }
}
```

## 接口默认方法与静态方法

```java
// Java 8 之前，接口只能有抽象方法——加一个方法，所有实现类都得改
// Java 8 引入了 default 方法和 static 方法

public interface Greeting {

    // 抽象方法——实现类必须重写
    String greet(String name);

    // default 方法——提供默认实现，实现类可以重写也可以不重写
    default String casualGreet(String name) {
        return "Hi, " + name + "!";
    }

    default String formalGreet(String name) {
        return "Dear " + name + ",";
    }

    // static 方法——直接通过接口名调用
    static Greeting createDefault() {
        return name -> "Hello, " + name;
    }

    static String timestamp() {
        return "[" + System.currentTimeMillis() + "]";
    }
}

// 实现类只需要实现抽象方法
public class ChineseGreeting implements Greeting {
    @Override
    public String greet(String name) {
        return "你好, " + name + "!";
    }
    // casualGreet 和 formalGreet 直接继承默认实现，无需写任何代码
}

// 接口默认方法冲突时的规则：
// 1. 类的方法优先于接口的默认方法
// 2. 两个无关接口有相同默认方法时，类必须显式重写
public class Ambiguous implements A, B {
    @Override
    public void doIt() {
        A.super.doIt();  // 显式指定用哪个接口的实现
    }
}
```

## 新的日期时间 API（java.time）

在 Java 8 之前，`Date` 和 `Calendar` 是许多开发者诟病的 API。Joda-Time 作者 Stephen Colebourne 亲自操刀设计了 JSR 310，彻底解决了问题：

```java
import java.time.*;
import java.time.format.*;
import java.time.temporal.*;

public class DateTimeDemo {
    public static void main(String[] args) {

        // ===== 核心类：不可变、线程安全 =====

        // LocalDate：只有日期
        LocalDate today = LocalDate.now();
        LocalDate birthday = LocalDate.of(1995, Month.MARCH, 15);
        LocalDate nextWeek = today.plusWeeks(1);
        LocalDate lastMonth = today.minusMonths(1);

        System.out.println("今天: " + today);
        System.out.println("下周日: " + today.with(DayOfWeek.SUNDAY));

        // LocalTime：只有时间
        LocalTime now = LocalTime.now();
        LocalTime lunch = LocalTime.of(12, 0);
        LocalTime later = now.plusHours(3).plusMinutes(30);

        // LocalDateTime：日期 + 时间
        LocalDateTime dt = LocalDateTime.now();
        LocalDateTime meeting = LocalDateTime.of(2026, 8, 15, 14, 30);

        // ZonedDateTime：带时区
        ZonedDateTime tokyo = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"));
        ZonedDateTime newYork = tokyo.withZoneSameInstant(
            ZoneId.of("America/New_York")
        );
        System.out.println("东京: " + tokyo.toLocalTime());
        System.out.println("纽约: " + newYork.toLocalTime());

        // Instant：时间戳（从 1970-01-01 00:00:00 UTC 的纳秒数）
        Instant instant = Instant.now();
        Instant epoch = Instant.ofEpochSecond(0);
        System.out.println("当前时间戳: " + instant.toEpochMilli());

        // Duration：时间差（时分秒纳秒）
        Duration duration = Duration.between(
            LocalTime.of(9, 0),
            LocalTime.of(17, 30)
        );
        System.out.println("工作时长: " + duration.toHours() + "小时");

        // Period：日期差（年月日）
        Period period = Period.between(
            LocalDate.of(2020, 1, 1), today
        );
        System.out.println("过去了: " + period.getYears() + "年 "
            + period.getMonths() + "月 " + period.getDays() + "天");

        // ===== 格式化与解析 =====
        DateTimeFormatter fmt = DateTimeFormatter
            .ofPattern("yyyy年MM月dd日 HH:mm:ss");
        String formatted = LocalDateTime.now().format(fmt);
        System.out.println(formatted);  // 2026年07月20日 14:30:00

        LocalDateTime parsed = LocalDateTime.parse(
            "2026-08-15T14:30:00",
            DateTimeFormatter.ISO_LOCAL_DATE_TIME
        );

        // ===== 日期计算 =====

        // 调整到下一个周一
        LocalDate nextMonday = today.with(
            TemporalAdjusters.next(DayOfWeek.MONDAY)
        );

        // 本月最后一天
        LocalDate lastDayOfMonth = today.with(
            TemporalAdjusters.lastDayOfMonth()
        );

        // 这个季度的第一天
        LocalDate firstOfQuarter = today.with(
            TemporalAdjusters.firstDayOfMonth()
        ).withMonth(((today.getMonthValue() - 1) / 3) * 3 + 1);

        // 判断闰年
        boolean leap = Year.now().isLeap();
        System.out.println("今年是闰年吗? " + leap);

        // ===== 时间戳与日期互转 =====
        // Instant → LocalDateTime（需要指定时区）
        Instant ins = Instant.now();
        LocalDateTime ldt = LocalDateTime.ofInstant(
            ins, ZoneId.systemDefault()
        );

        // LocalDateTime → Instant
        Instant fromLdt = ldt.atZone(ZoneId.systemDefault()).toInstant();
    }
}

// ===== 新旧互操作 =====
// 和遗留代码打交道时，可以与 java.util.Date 互转
import java.util.Date;

// Date → Instant
Date oldDate = new Date();
Instant modern = oldDate.toInstant();

// Instant → Date
Instant now = Instant.now();
Date backToOld = Date.from(now);
```

# 现代时代总结

从 2004 到 2014，Java 完成了三次范式跃迁：

| 版本 | 范式变革 | 核心武器 |
|------|----------|----------|
| Java 5 | 类型安全 | 泛型、枚举、注解 |
| Java 7 | 资源管理 | try-with-resources、NIO.2 |
| Java 8 | 函数式编程 | Lambda、Stream、Optional |

Java 5 告别了类型转换的原始社会，Java 7 治愈了资源管理的慢性病，Java 8 彻底改变了代码的思维模型——从命令式的"怎么做"到声明式的"要什么"。这三步之后，Java 已经完全现代化了。

下一篇《Java 版本演进-模块化时代》继续——从 Java 9 的 Jigsaw 模块系统开始，到 var、Record、Sealed Classes，看 Java 如何持续进化。
