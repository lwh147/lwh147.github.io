> 本文参考[黑马程序员全面深入学习Java并发编程，JUC并发编程全套教程](https://www.bilibili.com/video/BV16J411h7Rd?p=1)
> 学习整理而成

# 进程与线程

## 进程

程序由指令和数据组成，但这些指令要运行，数据要读写，就必须将指令加载至CPU，数据加载至内存。在指令运行过程中还需要用到磁盘、网络等设备。进程就是用来加载指令、管理内存、管理IO的，即一个进程包含了这个应用程序运行的所有资源

当一个程序被运行，从磁盘加载这个程序的代码到内存当中，这时就开启了一个进程

进程可以视为一个程序的一个实例。大部分应用程序可以运行多个实例进程（如记事本、画图、浏览器等），但也有一些应用程序只能启动一个实例进程（如网易云音乐、360等）

## 线程

一个进程可以分为一个或者多个线程

一个线程就是一个指令流，将指令流中的一条条指令以一定的顺序交给CPU执行

## 二者对比

* 进程是操作系统进行资源分配的基础单位，而线程是CPU进行调度的基础单位

* 进程之间的资源是不互通的，是相互隔离的，所以进程之间是相互独立的，而线程之间的资源是可以共享的，因为它们共享进程的内存

* 一个进程可以包含多个线程，线程是进程的子集。比如一个拥有图形化操作界面的应用程序，主线程可以只负责应用程序的运行逻辑，而界面的绘制和更新可以交给另外一个线程

* 进程间的通信较为复杂而线程间的通信较为简单，因为它们共享进程的内存，多个线程可以访问同一个共享变量

* 线程更轻量，线程的上下文切换成本一般要比进程低

# 并行和并发

## 并发

**单核 CPU 下，线程是串行执行的**，操作系统中有一个组件叫任务调度器，将 CPU 的时间片（Windows下时间片最小约为15毫秒）分给不同的线程使用，
**只是由于 CPU 在线程间切换的非常快（时间片很短），所以给人一种多个应用在同时运行的感觉**。总结为一句话就是：**微观串行，宏观并行
**

一般我们将线程轮流使用 CPU 的做法称为【并发】（Concurrent）

## 并行

**多核 CPU 下**，每个核（core）都可以调度运行线程，这时候运行在不同的核上的线程是可以【并行】（parallel）的

## 两者区别

引用 Rob Pike 的一段描述：

* 【并发】（concurrent）是同一时间应对（dealing with）多件事情的能力
* 【并行】（parallel）是同一时间做（doing）多件事情的能力

# 线程基本应用

## 异步编程

同步和异步是什么？

从方法调用的角度来讲，如果：

* 需要等待方法结果返回才能继续运行就是【同步】
* 不需要等待方法结果返回就能继续运行就是【异步】

多线程可以让方法执行变为异步的

例如做饭的时候，在蒸米饭的过程中就可以去做其他事情，比如炒菜等，而不用一直站在电饭煲旁边等着米饭蒸熟之后再去炒菜，这就是并发

而如果家里有三个保姆，一个保姆专门负责蒸米饭，一个保姆专门负责炒菜，另一个保姆专门负责洗菜，互不干扰，这就是并行

> 同步在多线程中还有另外的意思，就是让多个线程步调一致

## 应用场景

### 异步调用

如果我们编程时需要读取磁盘文件时，假设读取操作花费了5s时间，如果没有多线程，那么意味着程序在这5s时间内什么都做不了，只能等待文件读取完成之后再继续执行

有了多线程我们就可以开启一个新的线程去读取文件，等文件读取完成之后再通知主线程，这时主线程再对读取的文件进行后续操作，避免阻塞程序运行的主线程

带有UI界面的程序开启多线程进行除UI绘制和更新之外的其他耗时操作，避免阻塞UI线程，大大提高了用户的使用体验

比如在进行文件上传的过程中，如果没有多线程就意味着用户必须等待当前文件上传完毕之后才能执行其他操作，那如果这个文件非常大呢，用户点击上传之后界面一动不动，使用体验非常差，这时使用多线程，开启一个文件上传的线程，并按照一定频率向UI线程汇报上传进度和上传结果，UI线程也实时更新上传进度，这时用户不但能够实时查看上传进度，还能进行其他操作

### 提高效率

因为线程是CPU进行调度的基本单位，所以在CPU具有多个核心的情况下，计算时可以利用多线程进行并行计算提高效率，例如下面的场景，执行三个计算，最后将计算结果汇总

```text
计算1 花费10ms
计算2 花费11ms
计算3 花费9ms
汇总  花费1ms
```

如果时串行执行，执行顺序就是上面给出的顺序，总共花费时间是 `10 + 11 + 9 + 1 = 31ms`

但如果是四核CPU，各个核心分别通过线程1执行计算1，通过线程2执行计算2，线程3执行计算3，那么这三个线程是并行的，花费时间取决于耗时最长的那个计算的线程执行时间，即11ms，最后加上汇总时间，共耗费12ms

> 多线程只有在多核CPU上才能提高效率，单核CPU等同于串行执行

# java线程

## 创建和运行线程

### 直接使用 `Thread`

```java
// 创建线程，构造方法的参数是给线程指定名称，推荐
Thread t1 = new Thread("t1") {
 public void run() {
   // 要执行的任务
 }
};
t1.start();
```

### 使用 `Runnable` 配合 `Thread`

使用 `Runnable` 是为了把【线程】和【任务】分开，即让 `Thread` 专门表示线程，让 `Runnable` 专门表示可运行的任务（线程要执行的代码）

```java
Runnable runnable = new Runnable() {
  public void run() {
    // 要执行的任务
  }
};
// 创建线程，第二个参数指定线程名称，推荐
Thread t1 = new Thread(runnable, "t1");
// 启动线程
t1.start();
```

Java8 以后可以使用 Lambda 表达式精简代码

```java
Runnable runnable = () -> {
    // 要执行的任务
};
// 创建线程，第二个参数指定线程名称，推荐
Thread t1 = new Thread(runnable, "t1");
// 启动线程
t1.start();
```

`Thread` 和 `Runnable` 的关系

* 直接重写 `Thread` 中的 `run()` 方法是把线程和任务合并在了一起，而使用 `Runnable` 将线程和任务分开了
* 使用 `Runnable` 更容易与线程池等高级 API 配合
* 使用 `Runnable` 让任务脱离了 `Thread` 继承体系，更灵活

### `FutureTask` 配合 `Thread`

`FutureTask` 能够接收 `Callable` 类型的参数，用来处理有返回结果的情况

```java
// 创建任务对象
FutureTask<Integer> task3 = new FutureTask<>(() -> {
    log.debug("hello");
    return 100;
});
// 创建和运行线程
new Thread(task3, "t3").start();
// 主线程阻塞，同步等待 task3 执行完毕的结果
Integer result = task3.get();
log.debug("获取到了结果：{}", result);

```

## 观察多个线程同时运行

主要是理解多个线程在执行过程中是 **交替执行** 并且 **执行顺序不受控制** 的，测试程序如下：

```java
public static void main(String[] args) {
    new Thread(() -> {
        while (true) {
            log.debug("task1 running...");
        }
    }, "t1").start();
    new Thread(() -> {
        while (true) {
            log.debug("task2 running...");
        }
    }, "t2").start();
}
```

## 查看进程线程的方法

### Windows

* 任务管理器
* `tasklist` 查看进程
* `taskkill` 杀掉进程

### Linux

* `ps -fe` 查看所有进程
* `ps -fT -p <PID>` 查看某个进程的所有线程
* `kill` 杀死进程
* `top` 按大写 `H` 切换是否显示线程
* `top -H -p <PID>` 查看某个进程的所有线程

### Java

* `jps` 命令查看所有 Java 进程
* `jstack <PID>` 查看某个 Java 进程的所有线程状态
* `jconsole` 查看某个 Java 进程中线程的运行情况（图形界面）

### Jconsole 远程监控配置

需要以如下方式运行你的 java 类

```text
java -Djava.rmi.server.hostname=ip地址 -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.port=连接端口 -Dcom.sun.management.jmxremote.ssl=是否启用安全连接 -Dcom.sun.management.jmxremote.authenticate=是否认证 [jar包名称]
```

修改 `/etc/hosts` 文件将 `127.0.0.1` 映射至主机名

如果要认证访问，继续以下步骤

复制 `jmxremote.password` 文件

修改 `jmxremote.password` 和 `jmxremote.access` 文件权限为 `600` 即文件所有者可读写

连接时填入 `controlRole` (用户名)， `R&D` (密码)

## 线程运行的原理

### 栈与栈帧

Java Virtual Machine Stacks (Java 虚拟机栈)

我们都知道 JVM 中由堆、栈、方法去所构成，其中栈内存是给谁用的呢？其实就是线程，每个线程启动后，虚拟机就会为其分配一块栈内存

* 每个栈由多个栈帧（Stack Frame）组成，对应着每次方法调用时所占用的内存
* 每个线程只能有一个活动栈帧，对应着当前正在执行的那个方法

### 线程上下文切换（Thread Context Switch）

因为以下一些原因导致 CPU 不再执行当前线程，转而执行另一个线程的代码

* 线程的 CPU 时间片用完
* 垃圾回收
* 有更高优先级的线程需要运行
* 线程自己调用了`sleep()`、`yield()`、`wait()`、`join()`、`lock()`等方法

当 Context Switch 发生时，需要有操作系统保存当前线程的状态，并恢复另一个线程的状态，Java 中对应的概念就是程序计数器（Program
Counter Register），它的作用是记住下一条 jvm 指令的执行地址，是线程私有的

* 状态包括程序计数器、虚拟机栈中每个栈帧的信息，如局部变量、操作数栈、返回地址等
* Context Switch 频繁发生会影响性能

# 常见方法

 方法名                | static   | 功能说明                                   | 注意                                                                                                                                                |
--------------------|----------|----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
 `start()`          |          | 启动一个新线程，在新的线程中运行 `run()` 方法中的代码        | `start()` 方法只是让线程进入就绪，里面的代码不一定立刻运行（CPU 的时间片不一定会立刻分配给它），每个线程对象的 `start()` 方法只能调用一次，如果调用了多次会出现 `IllegalThreadStateException`                        |
 `run()`            |          | 新线程启动后调用的方法                            | 如果在构造 `Thread` 对象时传递了 `Runnable` 参数，则线程启动后会调用 `Runnable` 中的 `run()` 方法，否则默认不执行任何操作，可以通过创建 `Thread` 的子类对象来覆盖默认行为                                   |
 `join()`           |          | 等待线程运行结束                               |                                                                                                                                                   |
 `join(long n)`     |          | 等待线程运行结束，最多等待 `n` 毫秒                   |                                                                                                                                                   |
 `getId()`          |          | 获取线程长整型的 `id`                          | `id` 唯一                                                                                                                                           |
 `getName()`        |          | 获取线程名称                                 |
 `setName(Stirng)`  |          | 修改线程名称                                 |
 `getPriority()`    |          | 获取线程优先级                                |
 `setPriority(int)` |          | 修改线程优先级                                | java 中规定线程优先级是1~10的整数，较大的优先级能够提高该线程被 CPU 调度的概率                                                                                                    |
 `getState()`       |          | 获取线程状态                                 | java 中线程使用六个 `Enum` 表示，分别为： `NEW` ， `RUNNABLE` ， `BLOCKED` ， `WAITING` ， `TIMED_WAITING` ， `TERMINATED`                                           |
 `isInterrupted()`  |          | 判断是否被打断                                | 不会清除打断标记                                                                                                                                          
 `isAlive()`        |          | 线程是否存活（还没有运行完毕）                        |                                                                                                                                                   |
 `interrupt()`      |          | 打断线程                                   | 如果被打断的线程正处于 `sleep()` ， `wait()` ， `join()` 调用的状态则会导致被打断的线程抛出 `InterruptedException` 并清除打断标记；如果打断的线程正在运行，则会设置打断标记； 处于 `park()` 调用状态的线程被打断但会设置线程标记 |
 `interrupted()`    | `static` | 判断当前线程是否被打断                            | 会清除打断标记                                                                                                                                           |
 `currentThread()`  | `static` | 获取当前正在执行的线程                            |                                                                                                                                                   |
 `sleep(long n)`    | `static` | 让当前执行的线程休眠 `n` 毫秒，休眠时间让出 CPU 的时间片给其他线程 |                                                                                                                                                   |
 `yield()`          | `static` | 提示线程调度器让出当前线程对CPU的使用                   | 主要是为了测试和调试                                                                                                                                        |

## `start()` 与 `run()`

### `start()`

启动一个新线程，在新的线程中运行 `run()` 方法中的代码

### `run()`

直接调用 `Thread` 对象中的 `run()` 方法，并没有创建新的线程，还是在当前线程中运行

## `yield()` 与 `sleep()`

### `yield()`

调用 `yield()` 会让当前线程从 `Running` 进入 `Runnable` 状态（就绪），然后调度执行其他同优先级的线程。如果这时没有同等优先级的线程，那么不能保证会让当前线程有暂停效果

具体的实现依赖于操作系统的任务调度器

### `sleep()`

调用 `sleep()` 会让当前线程从 `RUNNING` 进入 `TIME WAITING` 状态（阻塞）

其他线程可以使用 `interrupt()` 方法打断正在睡眠的线程，这时 `sleep()` 方法会抛出 `InterruptedException`

睡眠结束后的线程未必会立刻得到执行

建议使用 `TimeUnit.sleep()` 代替 `Thread.sleep()` 来获得更好的可读性

### 线程优先级

线程优先级会提示（hint）调度器优先调度该线程，但它仅仅是一个提示，调度器可以忽略

如果 CPU 比较忙，那么优先级高的线程会获得更多的时间片，但 CPU 闲时，优先级几乎没用

### 使用案例 - 防止 CPU 占用100%

在没有利用 CPU 进行计算时，不要让 `while(true)` 空转浪费 CPU 资源：

* 可以使用 `sleep()` 或 `yield()` 来让出 CPU 的使用权给其他程序
* 也可以使用 `wait()` 或 条件变量 达到类似的效果

不同的是，使用上面两种方式都需要加锁，并且需要相应的唤醒操作，一般适用于要进行同步的场景，而 `sleep()` 适用于无需锁同步的场景

## `join()` 方法详解

### 为什么需要 `join()` ？

执行下面的代码，打印出的 `r` 是什么？

```java
static int i=0;

public static void main(String[] args) throws InterruptedException {
    Thread t1 = new Thread(() -> {
        log.debug("task1 running...");
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        i++;
        log.debug("task1 finished.");
    }, "t1");
    t1.start();
    log.debug("线程t1的状态：{}", t1.getState());
    // t1.join();
    log.debug("i的值: {}", i);
    log.debug("main 运行结束");
}
```

打印出的 `r` 为 `0` ，分析如下：

* 主线程和线程 `t1` 是并行的，`t1` 线程需要 1s 后才会对 `i` 进行自增操作
* 主线程一开始就直接打印 `i` 的结果，所以只能打印出 `0`

解决方法

使用 `join()` ，加在 `t1.start()` 和输出 `i` 的语句之间即可

### 等待多个结果

下面的代码的 `cost` 大约多少秒？

```java
static int r1 = 0;
static int r2 = 0;

public static void main(String[] args){
  test2();
}

public static void test2() throws InterruptedException {
  Thread t1 = new Thread(()->{
    sleep(1);
    r1 = 10;
  }, "t1");
  Thread t2 = new Thread(()->{
    sleep(2);
    r2 = 20;
  }, "t2");
  long start = System.currentTimeMillis();
  t1.start();
  t2.start();
  t1.join();
  t2.join();
  long end = System.currentTimeMillis();
  log.debug("r1: {}, r2: {}, cost: {}", r1, r2, end - start);
}
```

分析如下：

* 第一次 join：等待 `t1` 总共花费 1s，但是同时 `t2` 也在运行，意味着 `t2` 已经运行了 1s
* 第二次 join：此时 `t2` 已经运行了 1s，所以只需再等待 1s
* 综上，`cost` 为 `2`

如果将 `t1.join()` 和 `t2.join()` 顺序颠倒呢？那么在等待 `t2` 运行的 2s 中 `t1` 已经运行结束， `t1` 无需等待，所以 `cost`
还是 `2`

此外，考虑到线程的执行时间是未知的，在等待线程返回结果时如果线程迟迟运行不能结束，那么主线程就会长时间阻塞，这时可以使用 `Thread.join(long t)`
来规定最大等待时间 `t` ，即如果需要等待的线程在指定时间内没有结束运行，则停止等待

## `interrupt()` 方法详解

### 打断 `sleep()` ， `wait()` ， `join()` 的线程

打断阻塞中的线程会以抛出错误的形式表示自己被打断，所以会清空打断状态，以 `sleep()` 的线程为例

```java
public static void main(String[] args) throws InterruptedException {
    Thread t1 = new Thread(() -> {
        log.debug("sleeping...");
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }, "t1");

    t1.start();
    // 让 t1 开始运行之后如果立即执行打断操作将会是线程正常运行状态下的打断而不是线程处于阻塞状态下的打断，所以这里让主线程睡眠一会等待 t1 进入睡眠之后再进行打断
    Thread.sleep(1000);
    log.debug("interrupt");
    t1.interrupt();
    log.debug("线程t1的打断标志：{}", t1.isInterrupted());
    log.debug("main 运行结束");
}
```

运行之后可以得到 `t1` 的打断状态为 `false` ，但是如果没有上面代码块中注释处的 `Thread.sleep(1000)` ，而让主程序在 `t1`
的正常运行期间打断 `t1` ，那么输出的打断状态为 `true`

### 打断正常运行的线程

打断正常运行的线程不会清空打断状态，与阻塞中的线程不同，正常运行的线程发现自己被打断后可以选择继续运行还是结束运行，即主线程调用了某个线程的打断操作只是告诉该线程我要打断你，至于该线程会不会被打断是该线程自己决定的

```java
public static void main(String[] args) throws InterruptedException {
    Thread t1 = new Thread(() -> {
        while(true){
          boolean b = Thread.currentThread().isInterrupted();
          if(b){
            log.debug("被打断了，我选择退出运行");
            break;
          }
        }
    }, "t1");

    t1.start();
    Thread.sleep(1000);
    log.debug("interrupt");
    t1.interrupt();
    log.debug("线程t1的打断标志：{}", t1.isInterrupted());
    log.debug("main 运行结束");
}
```

### 打断 `park()` 的线程

`park()` 是类 `LockSupport` 中的一个静态方法，当程序执行到了线程中的 `LockSupport.park()`
语句并且当前线程的被打断状态为 `false` 时，当前线程会和调用了 `sleep()` 、 `wait()` 等方法一样处于阻塞状态，不再继续执行，测试代码如下：

```java
public static void test() throws InterruptedException {
    Thread t1 = new Thread(() -> {
        log.debug("线程正在运行...");
        LockSupport.park();
        //1 log.debug("线程恢复运行，打断状态为：{}", Thread.currentThread().isInterrupted());
        //2 log.debug("线程恢复运行，打断状态为：{}", Thread.interrupted());
        LockSupport.park();
        log.debug("线程再次运行");
    }, "park");
    t1.start();

    TimeUnit.SECONDS.sleep(1);
    log.debug("主线程想要打断park线程");
    t1.interrupt();
}
```

> 注意观察分析理解代码中注释的两个语句之间区别以及对程序执行结果的影响

# 两阶段终止模式

参见[两阶段终止模式](#dp-ljdzz)

# 不推荐方法

下表列出的方法已经过时，容易破坏同步块代码，造成线程死锁

 方法名         | static | 功能说明       
-------------|--------|------------
 `stop()`    |        | 停止线程执行     
 `suspend()` |        | 挂起（暂停）线程执行 
 `resume()`  |        | 恢复线程执行     

# 主线程与守护线程

默认情况下，Java 进程需要等待所有线程都运行结束才会结束，有一种特殊的线程叫守护线程，只要其他非守护线程运行结束了，即使守护线程的代码没有执行完，也会强制结束

设置线程为守护线程的方法： `thread.setDaemon(true)`

举例

* jvm 垃圾回收器线程（Garbage Collector）就是守护线程
* Tomcat 中的 Acceptor 和 Poller 线程都是守护线程，所以 Tomcat 接收到 `shuntdown` 命令后，不会等待它们处理完当前请求

# 线程状态分类之五种状态

五种状态分类是站在 操作系统 层面进行分类的

![线程状态分类之五种状态](https://img2020.cnblogs.com/blog/2330281/202108/2330281-20210802175444161-2096314841.png)

【初始状态】仅在语言层面创建了对象，还未与操作系统线程关联

【可运行状态】（就绪状态）指该线程已经在操作系统层面创建（与操作系统线程相关联），可以由 CPU 进行调度执行

【运行状态】指获取了 CPU 时间片，正在被 CPU 执行的状态，当 CPU 时间片用完，会从【运行状态】转换至【可运行状态】，会导致线程的上下文切换

【阻塞状态】如果调用了阻塞 API，如 BIO 读写文件，这时该线程实际不会用到 CPU，会导致线程的上下文切换，进入【阻塞状态】，等 BIO
操作完毕，会由操作系统唤醒阻塞线程，转换至【可运行状态】，与可运行状态有所区别的是，对【阻塞状态】的线程来说只要它们一直不被唤醒，调度器就不会考虑调度它们

【终止状态】表示线程已经执行完毕，生命周期已经结束，不会再转换为其它状态

# 线程状态分类之六种状态

线程的六种状态是Java `Thread` 类中的状态枚举类 `State` 规定的

![Java中Thread的六种状态](https://img2020.cnblogs.com/blog/2330281/202108/2330281-20210803093646912-232903556.png)

`NEW` 线程刚被创建，但是还没有调用 `start()` 方法

`RUNNABLE` 调用了 `start()` 方法之后线程便进入该状态，注意，Java API 层面的 RUNNABLE 状态涵盖了 操作系统
层面的【可运行状态】、【运行状态】和【阻塞状态】（由于 BIO 导致的线程阻塞，在 Java 里无法区分，仍然认为是可运行）

`BLOCKED` 、 `WAITING` 、 `TIMED_WAITING` 都是 Java API 层面对【阻塞状态】的细分，后面会在状态转换一节详述

`TERMINATED` 线程运行结束时的状态

示例代码：

```java
/**
 * @description: java 中线程的六种状态测试
 * @author: lwh
 * @create: 2021/8/3 11:05
 * @version: v1.0
 **/
@Slf4j
public class TestThreadState {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
        }, "t1");
        Thread t2 = new Thread(() -> {
            while (true) {
                // do nothing
            }
        }, "t2");
        Thread t3 = new Thread(() -> {
            synchronized (TestThreadState.class) {
                try {
                    TimeUnit.SECONDS.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "t3");
        Thread t4 = new Thread(() -> {
            try {
                t2.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, "t4");
        Thread t5 = new Thread(() -> {
            synchronized (TestThreadState.class) {
                try {
                    TimeUnit.SECONDS.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "t5");
        Thread t6 = new Thread(() -> {

        }, "t5");

        t2.start();
        t3.start();
        t4.start();
        t5.start();
        t6.start();

        log.debug("t1的状态：{}", t1.getState());
        t1.start();
        log.debug("t2的状态：{}", t2.getState());
        log.debug("t3的状态：{}", t3.getState());
        log.debug("t4的状态：{}", t4.getState());
        log.debug("t5的状态：{}", t5.getState());
        log.debug("t6的状态：{}", t6.getState());
    }
}
```

# 应用示例——统筹

华罗庚的泡茶问题，合理安排洗茶壶、洗水壶、洗茶杯、拿茶叶、烧开水的前后顺序以及工作人数，使得效率最高

经过思考我们可以发现烧开水和洗水壶必须是串联执行的，所以我们这样安排，老王去洗水壶然后烧开水，小王去洗茶壶、洗茶杯、拿茶叶，等老王的水烧开之后泡茶，用Java代码的模拟实例如下：

```java
/**
 * @description: 喝茶
 * @author: lwh
 * @create: 2021/8/3 10:55
 * @version: v1.0
 **/
@Slf4j
public class TestHeCha1 {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            log.debug("老王洗水壶");
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            log.debug("老王烧水");
            try {
                TimeUnit.SECONDS.sleep(15);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, "老王");

        Thread t2 = new Thread(() -> {
            log.debug("小王洗茶壶");
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            log.debug("小王洗茶杯");
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            log.debug("小王拿茶叶");
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            log.debug("小王等水烧开");
            try {
                t1.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            log.debug("泡茶");
        }, "小王");

        t1.start();
        t2.start();
    }
}
```

# 重点掌握

* 线程创建
* 线程重要 API，如 `start`，`run`，`sleep`，`join`，`interrupt` 等
* 线程状态
* 应用方面:
    + 异步调用：主线程执行期间，其他线程异步执行耗时操作避免阻塞主线程
    + 提高效率：并行计算，缩短运算时间
    + 同步等待：`join`
    + 统筹规划：合理使用线程继续宁任务分配，达到最优解
* 原理方面:
    + 线程运行流程：栈、栈帧、上下文切换、程序计数器
    + `Thread` 两种创建方式的源码
* 模式方面
    + 两阶段终止模式

# 并发编程设计模式（Design Pattern）

<div id="dp-ljdzz"/>

## 两阶段终止模式

两阶段终止模式（Two Phase Termination）指的是在一个线程 `T1` 中如何“优雅”终止线程 `T2` ？这里的“优雅”指的是给 `T2`
一个料理后事的机会

### 错误思路

使用线程的 `stop` 方法停止线程：

`stop` 方法会真正杀死线程，如果这时线程锁住了共享资源，那么它被杀死之后没有机会去释放锁，其他线程也永远无法获取锁

使用 `System.exit(int)` 方法停止线程：

该方法会使整个程序结束

### 实现思路

![两阶段终止模式实现思路](https://img2020.cnblogs.com/blog/2330281/202108/2330281-20210802154758773-1776733765.png)

代码实现

```java
/**
 * @description: 两阶段终止模式
 * @author: lwh
 * @create: 2021/8/2 15:49
 * @version: v1.0
 **/
@Slf4j
public class TwoPhaseTermination {
    private Thread monitor;

    // 启动监控线程
    public void start() {
        monitor = new Thread(() -> {
            while (true) {
                boolean b = Thread.currentThread().isInterrupted();
                if (b) {
                    // 料理后事
                    log.debug("料理后事");
                    break;
                } else {
                    // 做数据记录
                    log.debug("做数据记录");
                    try {
                        TimeUnit.SECONDS.sleep(2);
                    } catch (InterruptedException e) {
                        // 捕获到打断异常，重新设置打断状态，在下一次循环中结束本线程
                        Thread.currentThread().interrupt();
                        e.printStackTrace();
                    }
                }
            }
        }, "moniter");

        monitor.start();

    }

    // 终止监控线程
    public void stop() {
        monitor.interrupt();
    }
}
```
