---
title: Java版本演进-奠基时代
shortTitle: Java奠基时代
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

从 1996 年的 Java 1.0 到 2002 年的 Java 1.4，这六年是 Java 语言的奠基时期。本文用代码逐一展示每个版本引入的核心特性，从 applet 到断言，从 Collection 到 NIO。

<!-- more -->

# 版本总览

| 版本 | 代号 | 年份 | 核心特性 |
|------|------|------|----------|
| Java 1.0 | Oak | 1996 | 语言基础、Applet、AWT、线程 |
| Java 1.1 | (无) | 1997 | 内部类、JDBC、RMI、序列化、反射 |
| Java 1.2 | Playground | 1998 | Collections 框架、Swing、JIT、strictfp |
| Java 1.3 | Kestrel | 2000 | HotSpot VM、JNDI、Timer |
| Java 1.4 | Merlin | 2002 | 断言、正则、NIO、异常链、日志 |

# Java 1.0（1996 年 1 月）

Java 1.0 发布了 8 个包、212 个类，确立了 Java 语言的基石：面向对象、跨平台、多线程。

## 基础语法

```java
// 一切从类开始
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java 1.0!");
    }
}
```

## 类与对象

```java
// Java 1.0 的类定义——没有泛型、没有注解、没有枚举
public class Person {
    private String name;      // 一切都是显式类型
    private int age;

    // 构造器
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 方法
    public String getName() { return name; }
    public int getAge() { return age; }

    // 重写 Object.toString()
    public String toString() {
        return "Person[name=" + name + ", age=" + age + "]";
    }
}

// 继承
public class Student extends Person {
    private String school;

    public Student(String name, int age, String school) {
        super(name, age);
        this.school = school;
    }

    public String getSchool() { return school; }
}
```

## 接口

```java
// Java 1.0 的接口——只能有抽象方法（没有默认方法、没有静态方法）
public interface Runnable {
    void run();       // 隐式 public abstract
}

public interface Drawable {
    void draw();
}

// 一个类可以实现多个接口
public class GameCharacter implements Runnable, Drawable {
    public void run() {
        System.out.println("角色奔跑");
    }

    public void draw() {
        System.out.println("绘制角色");
    }
}
```

## 多线程

Java 从 1.0 起就内建了多线程支持，这是它相较同期语言的一大优势：

```java
// 方式一：继承 Thread 类
public class MyThread extends Thread {
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println("MyThread 执行: " + i);
            try {
                Thread.sleep(300);  // 让出 CPU
            } catch (InterruptedException e) {
                return;
            }
        }
    }
}

// 方式二：实现 Runnable 接口
public class MyTask implements Runnable {
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println("MyTask 执行: " + i);
        }
    }
}

// 使用
public class ThreadDemo {
    public static void main(String[] args) {
        MyThread t1 = new MyThread();
        t1.start();       // 注意是 start()，不是 run()

        Thread t2 = new Thread(new MyTask());
        t2.start();

        // synchronized 同步
        synchronized (t2) {
            try {
                t2.wait(1000);  // 等待 t2 通知或超时
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

## Applet（历史遗迹）

这是 Java 早期的"杀手级应用"——在浏览器中运行 Java 程序：

```java
import java.applet.Applet;
import java.awt.Graphics;

// Java 1.0 时代的前端方案——现在早已被 JavaScript 取代
public class HelloApplet extends Applet {
    public void paint(Graphics g) {
        g.drawString("Hello, Applet!", 20, 20);
    }
}

// HTML 中嵌入：
// <applet code="HelloApplet.class" width="200" height="200"></applet>
```

## AWT 图形界面

```java
import java.awt.*;

public class AwtDemo {
    public static void main(String[] args) {
        Frame frame = new Frame("Java 1.0 AWT");
        Button button = new Button("点击我");

        // 事件处理——匿名内部类是 Java 1.1 才有的，
        // Java 1.0 只能用实现接口的方式
        frame.add(button);
        frame.setSize(300, 200);
        frame.setVisible(true);
    }
}
```

# Java 1.1（1997 年 2 月）

23 个包、504 个类。这一年的主题是"完善"，补齐了内部类、JDBC、序列化等关键能力。

## 内部类

内部类是 Java 1.1 最重要的语言级特性，四种形态至今仍在使用：

```java
public class Outer {
    private String name = "Outer";

    // 1. 成员内部类
    public class MemberInner {
        public void print() {
            System.out.println("访问外部类成员: " + name);
        }
    }

    // 2. 静态内部类（不依赖外部类实例）
    public static class StaticInner {
        public void print() {
            System.out.println("静态内部类");
        }
    }

    public void doSomething() {
        final int localVar = 42;

        // 3. 局部内部类
        class LocalInner {
            public void print() {
                System.out.println("局部内部类: " + localVar);
            }
        }
        new LocalInner().print();
    }

    // 4. 匿名内部类——最常用的形式
    public Runnable createRunner() {
        return new Runnable() {
            public void run() {
                System.out.println("匿名内部类实现的线程");
            }
        };
    }
}

// 使用示例
public class InnerDemo {
    public static void main(String[] args) {
        Outer outer = new Outer();

        // 成员内部类
        Outer.MemberInner member = outer.new MemberInner();
        member.print();

        // 静态内部类
        Outer.StaticInner staticInner = new Outer.StaticInner();
        staticInner.print();

        // 匿名内部类
        Runnable runner = outer.createRunner();
        new Thread(runner).start();
    }
}
```

## JDBC 数据库连接

```java
import java.sql.*;

public class JdbcDemo {
    public static void main(String[] args) throws Exception {
        // 1. 加载驱动（Java 1.1 的方式）
        Class.forName("com.mysql.jdbc.Driver");

        // 2. 获取连接
        Connection conn = DriverManager.getConnection(
            "jdbc:mysql://localhost:3306/test",
            "root",
            "password"
        );

        // 3. 创建 Statement
        Statement stmt = conn.createStatement();

        // 4. 执行查询
        ResultSet rs = stmt.executeQuery("SELECT id, name FROM users");

        // 5. 遍历结果——没有 try-with-resources，手动管理资源
        while (rs.next()) {
            int id = rs.getInt("id");
            String name = rs.getString("name");
            System.out.println(id + ": " + name);
        }

        // 6. 手动关闭（finally 块在实际代码中必不可少）
        rs.close();
        stmt.close();
        conn.close();
    }
}
```

## 反射

```java
import java.lang.reflect.*;

public class ReflectionDemo {
    public static void main(String[] args) throws Exception {
        // 1. 获取 Class 对象
        Class clazz = Class.forName("Person");

        // 2. 查看所有构造器
        Constructor[] constructors = clazz.getConstructors();
        for (int i = 0; i < constructors.length; i++) {
            System.out.println("构造器: " + constructors[i]);
        }

        // 3. 通过反射创建对象
        Constructor con = clazz.getConstructor(
            new Class[]{String.class, int.class}
        );
        Object obj = con.newInstance(
            new Object[]{"张三", 25}
        );

        // 4. 调用方法
        Method getName = clazz.getMethod("getName", new Class[]{});
        String name = (String) getName.invoke(obj, new Object[]{});
        System.out.println("反射调用结果: " + name);

        // 5. 修改私有字段
        Field ageField = clazz.getDeclaredField("age");
        ageField.setAccessible(true);   // Java 1.1 就支持
        ageField.set(obj, new Integer(30));
    }
}
```

## 序列化

```java
import java.io.*;

// 实现 Serializable 接口即可序列化
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    private String username;
    private transient String password;  // transient 字段不参与序列化

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String toString() {
        return "User[username=" + username + "]";
    }
}

// 序列化演示
public class SerialDemo {
    public static void main(String[] args) throws Exception {
        User user = new User("minhat", "secret123");

        // 序列化到文件
        ObjectOutputStream out = new ObjectOutputStream(
            new FileOutputStream("user.ser")
        );
        out.writeObject(user);
        out.close();

        // 从文件反序列化
        ObjectInputStream in = new ObjectInputStream(
            new FileInputStream("user.ser")
        );
        User restored = (User) in.readObject();
        in.close();

        System.out.println(restored);
        // 输出: User[username=minhat]
        // 注意 password 为 null——transient 字段不会被序列化
    }
}
```

## 国际化

```java
import java.util.*;

public class I18nDemo {
    public static void main(String[] args) {
        // 根据 locale 加载不同语言的资源
        ResourceBundle bundle = ResourceBundle.getBundle(
            "messages",
            Locale.CHINA
        );
        System.out.println(bundle.getString("hello"));

        // 日期格式化
        Date now = new Date();
        DateFormat df = DateFormat.getDateInstance(
            DateFormat.FULL,
            Locale.CHINA
        );
        System.out.println(df.format(now));
    }
}
```

# Java 1.2（1998 年 12 月）

59 个包、1520 个类。Java 平台的第一次大爆发——Swing 带来跨平台 GUI，Collections Framework 彻底改变了数据结构编程。从这个版本起，Java 被称为 "Java 2"。

## Collections 框架

这是 Java 1.2 最重要的新增内容，也是每个 Java 开发者日常使用的核心：

```java
import java.util.*;

public class CollectionsDemo {
    public static void main(String[] args) {

        // ===== List：有序、可重复 =====
        List list = new ArrayList();    // 没有泛型，原始类型
        list.add("张三");
        list.add("李四");
        list.add("张三");               // 允许重复
        list.add(0, "王五");            // 按索引插入

        System.out.println("List 大小: " + list.size());
        System.out.println("索引 1: " + list.get(1));

        // 遍历方式——经典 Iterator 模式
        Iterator it = list.iterator();
        while (it.hasNext()) {
            String name = (String) it.next();  // 必须手动转型
            System.out.println(name);
        }

        // ===== Set：无序、不重复 =====
        Set set = new HashSet();
        set.add("苹果");
        set.add("香蕉");
        set.add("苹果");               // 重复，添加无效
        System.out.println("Set 大小: " + set.size());  // 2

        // ===== Map：键值对 =====
        Map map = new HashMap();
        map.put("name", "张三");
        map.put("age", new Integer(25));
        map.put("name", "李四");        // 覆盖之前的 value

        System.out.println("name: " + map.get("name"));  // 李四

        // 遍历 Map 的 keys
        Iterator keys = map.keySet().iterator();
        while (keys.hasNext()) {
            Object key = keys.next();
            System.out.println(key + " = " + map.get(key));
        }

        // ===== 工具类 =====
        // Collections 提供排序、查找等静态方法
        Collections.sort(list);          // 要求元素实现 Comparable
        Collections.reverse(list);       // 反转
        Collections.shuffle(list);       // 随机打乱

        int index = Collections.binarySearch(list, "张三");

        // 不可变集合
        List unmodifiable = Collections.unmodifiableList(list);
    }
}
```

## Vector vs ArrayList

```java
// Vector 是 Java 1.0 的老 API
// ArrayList 是 Java 1.2 的新 API——两者最主要区别是线程安全

// Vector 是线程安全的（所有方法都有 synchronized）
Vector old = new Vector();
old.addElement("a");        // 旧式命名 addElement()
old.elementAt(0);           // 旧式命名 elementAt()

// ArrayList 不是线程安全的（性能更好）
ArrayList modern = new ArrayList();
modern.add("a");            // 新命名 add()
modern.get(0);              // 新命名 get()

// 在 Java 1.2 中，Vector 也被改造实现了 List 接口
// 所以新旧集合实际上可以互通
```

## 排序：Comparable 与 Comparator

```java
import java.util.*;

public class SortDemo {
    public static void main(String[] args) {

        // 方式一：实现 Comparable（自然排序）
        class Student implements Comparable {
            private String name;
            private int score;

            public Student(String name, int score) {
                this.name = name;
                this.score = score;
            }

            public int compareTo(Object o) {
                Student other = (Student) o;
                return this.score - other.score;  // 按成绩升序
            }

            public String toString() {
                return name + "(" + score + ")";
            }
        }

        // 方式二：Comparator（自定义排序逻辑，不修改原类）
        Comparator byName = new Comparator() {
            public int compare(Object o1, Object o2) {
                Student s1 = (Student) o1;
                Student s2 = (Student) o2;
                return s1.name.compareTo(s2.name);  // 按姓名排序
            }
        };

        List students = new ArrayList();
        students.add(new Student("张三", 85));
        students.add(new Student("李四", 92));
        students.add(new Student("王五", 78));

        Collections.sort(students);
        System.out.println("按成绩: " + students);

        Collections.sort(students, byName);
        System.out.println("按姓名: " + students);
    }
}
```

## Swing 图形界面

```java
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class SwingDemo {
    public static void main(String[] args) {
        // Swing 的入口——JFrame
        JFrame frame = new JFrame("Java 1.2 Swing Demo");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // 布局管理器
        JPanel panel = new JPanel(new BorderLayout());

        // 菜单栏
        JMenuBar menuBar = new JMenuBar();
        JMenu fileMenu = new JMenu("文件");
        JMenuItem exitItem = new JMenuItem("退出");
        fileMenu.add(exitItem);
        menuBar.add(fileMenu);

        // 工具栏
        JToolBar toolBar = new JToolBar();
        JButton newBtn = new JButton("新建");
        JButton openBtn = new JButton("打开");
        toolBar.add(newBtn);
        toolBar.add(openBtn);

        // 树形组件
        JTree tree = new JTree();

        // 组装
        panel.add(toolBar, BorderLayout.NORTH);
        panel.add(new JScrollPane(tree), BorderLayout.CENTER);

        frame.setJMenuBar(menuBar);
        frame.getContentPane().add(panel);
        frame.setSize(400, 300);
        frame.setVisible(true);
    }
}
```

## strictfp 关键字

```java
// strictfp（strict floating point）保证浮点运算在所有平台结果一致
// 可以修饰类、接口、方法

public strictfp class ExactCalculation {

    // 该方法在所有平台上得到完全相同的浮点结果
    public strictfp double preciseDivide(double a, double b) {
        return a / b;
    }

    public static void main(String[] args) {
        ExactCalculation calc = new ExactCalculation();
        System.out.println(calc.preciseDivide(1.0, 3.0));
        // 无论 Windows、Linux 还是 Solaris，输出完全一致
    }
}
```

# Java 1.3（2000 年 5 月）

76 个包、1840 个类。代号 Kestrel（红隼），主要是性能提升和 API 扩充。

## HotSpot 虚拟机

Java 1.3 默认启用 HotSpot JVM，这是 Java 性能的一次飞跃：

```bash
# HotSpot 的关键技术（代码无法直接展示，用启动参数说明）：

# -server  启动 Server VM（C2 编译器，启动慢但运行快，适合长期运行的服务）
java -server MyApp

# -client  启动 Client VM（C1 编译器，启动快，适合桌面应用）
java -client MyApp

# -Xms    设置初始堆大小
# -Xmx    设置最大堆大小
java -Xms128m -Xmx512m MyApp

# -XX:+PrintGCDetails  查看 GC 详情
java -XX:+PrintGCDetails MyApp
```

## Timer 定时任务

```java
import java.util.*;

public class TimerDemo {
    public static void main(String[] args) {
        Timer timer = new Timer();

        // 一次性任务：延迟 1 秒执行
        timer.schedule(new TimerTask() {
            public void run() {
                System.out.println("延迟 1 秒执行的任务");
            }
        }, 1000);

        // 固定延迟重复执行：延迟 2 秒后，每 3 秒执行一次
        timer.schedule(new TimerTask() {
            private int count = 0;
            public void run() {
                count++;
                System.out.println("第 " + count + " 次执行");
                if (count >= 5) {
                    timer.cancel();     // 取消所有任务
                    System.out.println("定时器已取消");
                }
            }
        }, 2000, 3000);

        // 固定频率重复执行：不管上次执行多久，严格按间隔触发
        timer.scheduleAtFixedRate(new TimerTask() {
            public void run() {
                System.out.println("心跳: " + System.currentTimeMillis());
            }
        }, 0, 1000);
    }
}
```

## JNDI 命名服务

```java
import javax.naming.*;

public class JndiDemo {
    public static void main(String[] args) throws Exception {
        // JNDI 是 Java 连接企业命名和目录服务的统一接口
        // Java 1.3 把它作为标准库的一部分

        // 设置 JNDI 属性
        Hashtable env = new Hashtable();
        env.put(Context.INITIAL_CONTEXT_FACTORY,
                "com.sun.jndi.fscontext.RefFSContextFactory");
        env.put(Context.PROVIDER_URL, "file:///tmp");

        // 创建上下文
        Context ctx = new InitialContext(env);

        // 绑定对象到 JNDI
        ctx.bind("myObject", "Hello JNDI");

        // 从 JNDI 查找对象
        String obj = (String) ctx.lookup("myObject");
        System.out.println(obj);  // Hello JNDI

        ctx.close();
    }
}
```

## 动态代理

```java
import java.lang.reflect.*;

public class DynamicProxyDemo {
    public static void main(String[] args) {
        // 目标对象
        final Calculator target = new CalculatorImpl();

        // 创建动态代理
        Calculator proxy = (Calculator) Proxy.newProxyInstance(
            Calculator.class.getClassLoader(),
            new Class[]{Calculator.class},
            new InvocationHandler() {
                public Object invoke(
                    Object proxy, Method method, Object[] args
                ) throws Throwable {
                    System.out.println(">>> 调用方法: " + method.getName());
                    long start = System.currentTimeMillis();

                    Object result = method.invoke(target, args);

                    long end = System.currentTimeMillis();
                    System.out.println("<<< 执行耗时: " + (end - start) + "ms");
                    return result;
                }
            }
        );

        int result = proxy.add(3, 5);
        System.out.println("结果: " + result);
    }
}

// 接口与实现
interface Calculator {
    int add(int a, int b);
    int subtract(int a, int b);
}

class CalculatorImpl implements Calculator {
    public int add(int a, int b) { return a + b; }
    public int subtract(int a, int b) { return a - b; }
}
```

# Java 1.4（2002 年 2 月）

135 个包、2991 个类。代号 Merlin（梅林——亚瑟王的魔法师），是 Java 1.x 时代的集大成者。断言、正则、NIO、异常链、日志五大特性，每一项都影响深远。

## 断言（assert）

```java
public class AssertDemo {

    // 前置条件断言
    public static double divide(double a, double b) {
        assert b != 0 : "除数不能为零";      // b 为零时抛出 AssertionError
        return a / b;
    }

    // 后置条件断言
    public static String capitalize(String s) {
        if (s == null || s.length() == 0) {
            return s;
        }
        String result = Character.toUpperCase(s.charAt(0)) + s.substring(1);
        assert result != null && result.length() == s.length()
            : "capitalize 后长度应保持不变";
        return result;
    }

    // 不变式断言
    public static void sort(int[] arr) {
        // 排序前记录
        int sumBefore = 0;
        for (int i = 0; i < arr.length; i++) {
            sumBefore += arr[i];
        }

        // 冒泡排序
        for (int i = 0; i < arr.length; i++) {
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[i] > arr[j]) {
                    int tmp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = tmp;
                }
            }
        }

        // 不变式：排序后元素总和不变
        int sumAfter = 0;
        for (int i = 0; i < arr.length; i++) {
            sumAfter += arr[i];
        }
        assert sumBefore == sumAfter : "排序不应改变元素总和！";
    }

    public static void main(String[] args) {
        // 注意：运行时需要 java -ea 启用断言
        // java -ea AssertDemo
        System.out.println(divide(10, 2));  // 5.0
        // divide(10, 0);                   // AssertionError: 除数不能为零

        int[] arr = {3, 1, 4, 1, 5};
        sort(arr);
    }
}
```

::: warning 断言默认关闭
断言默认被 JVM 忽略。开发测试阶段用 `java -ea`（enable assertions）开启，生产环境应关闭。**永远不要用断言来校验用户输入或公共 API 参数**——那是 `IllegalArgumentException` 的职责。
:::

## 正则表达式

```java
import java.util.regex.*;

public class RegexDemo {
    public static void main(String[] args) {

        // ===== 基础匹配 =====
        // 验证手机号
        Pattern phone = Pattern.compile("1[3-9]\\d{9}");
        Matcher m1 = phone.matcher("13812345678");
        System.out.println(m1.matches());         // true
        System.out.println(phone.matcher("1234").matches());  // false

        // 验证邮箱
        Pattern email = Pattern.compile(
            "[\\w.-]+@[\\w.-]+\\.\\w+"
        );
        System.out.println(email.matcher("test@example.com").matches());

        // ===== 分组捕获 =====
        Pattern date = Pattern.compile("(\\d{4})-(\\d{2})-(\\d{2})");
        Matcher m2 = date.matcher("今天是 2026-07-20 天气晴");
        if (m2.find()) {
            System.out.println("完整匹配: " + m2.group(0));  // 2026-07-20
            System.out.println("年: " + m2.group(1));        // 2026
            System.out.println("月: " + m2.group(2));        // 07
            System.out.println("日: " + m2.group(3));        // 20
        }

        // ===== 替换 =====
        String input = "小明的电话是13812345678，小红的电话是13998765432";
        String masked = input.replaceAll("(\\d{3})\\d{4}(\\d{4})", "$1****$2");
        System.out.println(masked);
        // 小明的电话是138****5678，小红的电话是139****5432

        // ===== 切割字符串 =====
        String csv = "张三,李四,王五,,赵六";
        String[] names = csv.split(",");
        for (int i = 0; i < names.length; i++) {
            System.out.println("[" + i + "] " + names[i]);
        }

        // ===== 量词模式：贪婪 vs 勉强 =====
        String html = "<p>段落一</p><p>段落二</p>";

        // 贪婪（默认）：尽可能多地匹配
        Pattern greedy = Pattern.compile("<p>.*</p>");
        Matcher mg = greedy.matcher(html);
        if (mg.find()) {
            System.out.println("贪婪: " + mg.group());
            // <p>段落一</p><p>段落二</p>（整个吃掉了）
        }

        // 勉强：尽可能少地匹配
        Pattern reluctant = Pattern.compile("<p>.*?</p>");
        Matcher mr = reluctant.matcher(html);
        while (mr.find()) {
            System.out.println("勉强: " + mr.group());
            // <p>段落一</p>
            // <p>段落二</p>
        }
    }
}
```

## NIO（New I/O）

Java 1.4 引入的 NIO 是 IO 性能的一次革命。核心三大件：Channel（通道）、Buffer（缓冲区）、Selector（多路复用）。

### Buffer

```java
import java.nio.*;

public class BufferDemo {
    public static void main(String[] args) {

        // 分配 10 个字符的缓冲区
        CharBuffer buffer = CharBuffer.allocate(10);

        // 写入
        buffer.put('J');
        buffer.put('a');
        buffer.put('v');
        buffer.put('a');

        System.out.println("写入后 position=" + buffer.position());  // 4
        System.out.println("写入后 limit=" + buffer.limit());        // 10

        // 从写模式切换到读模式
        buffer.flip();
        System.out.println("flip 后 position=" + buffer.position()); // 0
        System.out.println("flip 后 limit=" + buffer.limit());       // 4

        // 读取
        while (buffer.hasRemaining()) {
            System.out.print(buffer.get());
        }
        System.out.println();  // Java

        // 重置 position，重新读
        buffer.rewind();

        // 清空（回到写模式）
        buffer.clear();
    }
}
```

Buffer 的状态模型：

```java
// Buffer 的三个核心属性：
//
//   capacity（容量）：缓冲区总大小，创建后不可变
//   position（位置）：当前读写位置
//   limit（界限）：   读写不可超过此值
//
// 写模式：position=已写数，limit=capacity
// 读模式：position=0，     limit=已写数（flip 操作）

ByteBuffer buf = ByteBuffer.allocate(8);
//    [ _ _ _ _ _ _ _ _ ]
//    pos=0          cap=8
//    limit=8

// 写入 3 个字节
buf.put((byte) 1).put((byte) 2).put((byte) 3);
//    [ 1 2 3 _ _ _ _ _ ]
//        pos=3     cap=8
//    limit=8

// 切换到读模式
buf.flip();
//    [ 1 2 3 _ _ _ _ _ ]
//    pos=0  limit=3  cap=8
```

### Channel 文件读写

```java
import java.io.*;
import java.nio.*;
import java.nio.channels.*;

public class ChannelDemo {
    public static void main(String[] args) throws Exception {

        // ===== 文件复制：传统 IO =====
        long start1 = System.currentTimeMillis();
        FileInputStream fis = new FileInputStream("source.bin");
        FileOutputStream fos = new FileOutputStream("dest_io.bin");
        byte[] buf = new byte[8192];
        int len;
        while ((len = fis.read(buf)) != -1) {
            fos.write(buf, 0, len);
        }
        fis.close();
        fos.close();
        System.out.println("传统IO 耗时: " + (System.currentTimeMillis() - start1) + "ms");

        // ===== 文件复制：NIO Channel =====
        long start2 = System.currentTimeMillis();
        FileChannel src = new FileInputStream("source.bin").getChannel();
        FileChannel dst = new FileOutputStream("dest_nio.bin").getChannel();

        ByteBuffer buffer = ByteBuffer.allocateDirect(8192);  // 直接缓冲区
        while (src.read(buffer) != -1) {
            buffer.flip();
            dst.write(buffer);
            buffer.clear();
        }
        src.close();
        dst.close();
        System.out.println("NIO    耗时: " + (System.currentTimeMillis() - start2) + "ms");

        // ===== 更简洁：transferTo =====
        FileChannel src2 = new FileInputStream("source.bin").getChannel();
        FileChannel dst2 = new FileOutputStream("dest_nio2.bin").getChannel();
        src2.transferTo(0, src2.size(), dst2);  // 零拷贝，最快
        src2.close();
        dst2.close();
    }
}
```

### 内存映射文件

```java
import java.io.*;
import java.nio.*;
import java.nio.channels.*;

public class MmapDemo {
    public static void main(String[] args) throws Exception {
        // 内存映射——将文件直接映射到内存，读写如同操作数组
        RandomAccessFile file = new RandomAccessFile("data.txt", "rw");
        FileChannel channel = file.getChannel();

        // 将文件的 0~1023 字节映射到内存
        MappedByteBuffer map = channel.map(
            FileChannel.MapMode.READ_WRITE,
            0,
            1024
        );

        // 直接从内存读写，绕过 read/write 系统调用
        map.put(0, (byte) 'A');
        map.put(1, (byte) 'B');

        byte first = map.get(0);
        System.out.println("第 0 字节: " + (char) first);  // A

        channel.close();
        file.close();
    }
}
```

### Selector 多路复用

```java
import java.net.*;
import java.nio.*;
import java.nio.channels.*;
import java.util.*;

public class SelectorDemo {
    public static void main(String[] args) throws Exception {
        // ===== 非阻塞服务器（单线程处理多连接） =====
        ServerSocketChannel server = ServerSocketChannel.open();
        server.bind(new InetSocketAddress(8080));
        server.configureBlocking(false);     // 关键：设为非阻塞

        Selector selector = Selector.open();
        server.register(selector, SelectionKey.OP_ACCEPT);

        System.out.println("NIO 服务器启动于 8080 端口...");

        while (true) {
            // 阻塞直到有事件发生
            selector.select();

            Set keys = selector.selectedKeys();
            Iterator iter = keys.iterator();
            while (iter.hasNext()) {
                SelectionKey key = (SelectionKey) iter.next();
                iter.remove();             // 必须手动移除，否则下次会重复处理

                if (key.isAcceptable()) {
                    // 新连接
                    SocketChannel client = server.accept();
                    client.configureBlocking(false);
                    client.register(selector, SelectionKey.OP_READ);
                    System.out.println("新连接: " + client);
                }
                else if (key.isReadable()) {
                    // 可读
                    SocketChannel client = (SocketChannel) key.channel();
                    ByteBuffer buf = ByteBuffer.allocate(1024);
                    int read = client.read(buf);
                    if (read == -1) {
                        client.close();
                        System.out.println("连接关闭");
                    } else {
                        buf.flip();
                        byte[] data = new byte[buf.remaining()];
                        buf.get(data);
                        System.out.println("收到: " + new String(data));

                        // 回显（echo）
                        buf.rewind();
                        client.write(buf);
                    }
                }
            }
        }
    }
}
```

Selector 模型和非阻塞 IO 是 Java NIO 的精髓——一个线程就能管理成千上万个连接，这是后来 Netty 等高性能网络框架的基石。

## 异常链

```java
public class ExceptionChainDemo {

    // Java 1.4 之前，抛出新异常会丢掉原始异常信息
    // Java 1.4 引入 initCause()/getCause() 形成异常链

    public static void readConfig() throws ConfigException {
        try {
            FileInputStream fis = new FileInputStream("config.properties");
            // ... 读取配置
        } catch (IOException e) {
            // 将底层 IO 异常包装成业务异常
            ConfigException ce = new ConfigException("读取配置失败");
            ce.initCause(e);     // Java 1.4 新增——保留原始异常
            throw ce;
        }
    }

    public static void main(String[] args) {
        try {
            readConfig();
        } catch (ConfigException e) {
            System.out.println("异常: " + e.getMessage());
            Throwable root = e.getCause();   // Java 1.4 新增
            if (root != null) {
                System.out.println("根因: " + root.getClass().getName()
                    + ": " + root.getMessage());
            }
        }
    }
}

// 自定义异常，提供带 cause 的构造器
class ConfigException extends Exception {
    // Java 1.4 新增构造器——构造时直接传入 cause
    public ConfigException(String message, Throwable cause) {
        super(message, cause);     // Throwable 1.4 新增带 cause 的构造器
    }

    public ConfigException(String message) {
        super(message);
    }
}
```

有了异常链后，debug 变得可控——从最外层业务异常一层层往下挖，直到底层 root cause：

```java
// 异常链输出工具
public static void printChain(Throwable t) {
    System.out.println(t.getClass().getName() + ": " + t.getMessage());
    Throwable cause = t.getCause();
    int depth = 1;
    while (cause != null) {
        for (int i = 0; i < depth; i++) {
            System.out.print("  ");
        }
        System.out.println("Caused by: " + cause.getClass().getName()
            + ": " + cause.getMessage());
        cause = cause.getCause();
        depth++;
    }
}
```

## Logging 日志框架

```java
import java.util.logging.*;

public class LoggingDemo {

    // 创建 Logger
    private static final Logger logger = Logger.getLogger(
        LoggingDemo.class.getName()
    );

    public static void main(String[] args) {
        // ===== 基础使用 =====
        logger.severe("严重错误——数据库挂掉了");
        logger.warning("警告——连接池接近上限");
        logger.info("信息——用户登录成功");
        logger.config("配置——读取配置文件");
        logger.fine("调试——进入方法 A");
        logger.finer("详细调试——变量 x = 42");
        logger.finest("最详细——循环第 N 次迭代");

        // ===== 自定义日志格式 =====
        ConsoleHandler handler = new ConsoleHandler();
        handler.setFormatter(new SimpleFormatter() {
            // SimpleFormatter 是 Java 1.4 提供的默认格式化器
        });
        logger.addHandler(handler);

        // ===== 输出到文件 =====
        try {
            FileHandler fileHandler = new FileHandler("app.log", true);
            fileHandler.setFormatter(new SimpleFormatter());
            logger.addHandler(fileHandler);
        } catch (IOException e) {
            logger.log(Level.WARNING, "无法创建日志文件", e);
        }

        // ===== 带参数的日志 =====
        String username = "minhat";
        int loginCount = 42;
        logger.log(Level.INFO, "用户 {0} 登录了 {1} 次",
            new Object[]{username, new Integer(loginCount)});

        // ===== 记录异常 =====
        try {
            throw new IllegalStateException("测试异常");
        } catch (Exception e) {
            logger.log(Level.SEVERE, "操作失败", e);
        }
    }
}
```

## 更多 Java 1.4 特性

```java
import java.util.*;
import java.net.*;
import java.nio.charset.*;

public class More14Features {

    public static void main(String[] args) throws Exception {

        // ===== LinkedHashMap：保持插入顺序 =====
        LinkedHashMap lhm = new LinkedHashMap();
        lhm.put("a", "1");
        lhm.put("c", "3");
        lhm.put("b", "2");
        System.out.println(lhm.keySet());  // [a, c, b]——按插入顺序！

        // ===== LinkedHashSet：保持插入顺序的 Set =====
        LinkedHashSet lhs = new LinkedHashSet();
        lhs.add("c");
        lhs.add("a");
        lhs.add("b");
        System.out.println(lhs);  // [c, a, b]

        // ===== IdentityHashMap：用 == 而非 equals 比较键 =====
        IdentityHashMap ihm = new IdentityHashMap();
        String k1 = new String("key");
        String k2 = new String("key");
        ihm.put(k1, "value1");
        ihm.put(k2, "value2");
        System.out.println(ihm.size());  // 2!——对象不同就是不同的 key

        // ===== InetSocketAddress：统一 IP + 端口 =====
        InetSocketAddress addr = new InetSocketAddress("localhost", 8080);
        System.out.println("Host: " + addr.getHostName());
        System.out.println("Port: " + addr.getPort());

        // ===== Charset：标准字符集支持 =====
        Charset utf8 = Charset.forName("UTF-8");
        ByteBuffer encoded = utf8.encode("你好, Java 1.4!");
        CharBuffer decoded = utf8.decode(encoded);
        System.out.println(decoded.toString());

        // ===== String.split()：正则拆分 =====
        String line = "a,b,c,,d";
        String[] parts = line.split(",");
        for (int i = 0; i < parts.length; i++) {
            System.out.println("parts[" + i + "]='" + parts[i] + "'");
        }
    }
}
```

# 奠基时代总结

从 1996 到 2002，Java 完成了从"实验性浏览器玩具"到"企业级平台"的蜕变。回顾这六年：

| 维度 | Java 1.0 的状态 | Java 1.4 的状态 |
|------|----------------|-----------------|
| 包数量 | 8 | 135 |
| 类数量 | 212 | 2,991 |
| 核心考点 | OOP 基础 | 断言、NIO、异常链、正则 |
| 开发效率 | 手写所有工具类 | Collections 框架覆盖大部分数据结构 |

这两个时代之间的鸿沟——**泛型、枚举、增强 for 循环、自动装箱、可变参数、注解**——将在下一个版本 Java 5 中被一次性填平。下一篇《Java 版本演进-现代 Java》见。
