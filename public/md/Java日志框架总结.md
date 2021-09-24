> 原文：[廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/1252599548343744/1264738932870688)

我们经常见到的日志库有 `JDK Logging` 、 `Commons Logging` 、 `Log4j` 、 `SLF4J` 和 `Logback` 等，那么它们之间到底有什么区别和联系？

# JDK Logging

首先，Java标准库内置了日志包 `java.util.logging` ，我们可以直接用

可以看到， `JDK Logging` 支持设定日志的输出级别，JDK 的 Logging 定义了七个日志级别，但是配置不太方便，需要在JVM启动时传递参数进行指定，所以该日志用的不是很多，了解一下即可

# Commons Logging 和 Log4j

和Java标准库提供的日志不同， `Commons Logging` 是一个第三方日志库，它是由Apache创建的日志模块

`Commons Logging` 的特色是，它可以挂接不同的日志系统，并通过配置文件指定挂接的日志系统。默认情况下， `Commons Logging` 自动搜索并使用 `Log4j` ，如果没有找到 `Log4j` ，再使用 `JDK Logging` ，所以只引入 `Commons Logging` 的情况下其实底层是使用 `JDK Logging` 进行日志记录，但是调用的是 `Commons Logging` 提供的日志API

> 由于 `Commons Logging` 目前使用也不是很多所以如何使用 `Commons Logging` 这里不再赘述，了解一下即可

既然 `Commons Logging` 可以挂接不同的日志系统，那么也可以将 `Log4j` 作为 `Commons Logging` 这个 “日志接口” 真正的 “日志实现”（类似于接口不同的实现）

当使用 `Log4j` 作为 “日志实现” 时，也只需要按照 `Commons Logging` 的写法写，不需要改动任何代码就可以得到 `Log4j` 的日志输出，但是我们需要引入 `Log4j` 的相关依赖库并对其进行配置

> 这里说的 `Log4j` 其实是 `Log4j2` ，并不是最初的 `Log4j` ， `Log4j2` 和 `Log4j` 是一个作者，只不过 `Log4j2` 是重新架构的一款日志组件，他抛弃了之前 `Log4j` 的不足，吸取了优秀的 `Logback` 的设计重新推出的一款新组件， `Log4j2` 的社区活跃很频繁而且更新的也很快，所以接下来举例使用的是 `Log4j2` ，需要注意的是它们之间的使用方式是有较大区别的

需要引入的依赖：

```text
commons-logging-1.2
log4j-api-2.x
log4j-core-2.x
log4j-jcl-2.x
```

以XML配置为例，使用 `Log4j` 的时候，我们把一个 `log4j2.xml` 的文件放到 `classpath` 下就可以让 `Log4j` 读取配置文件并按照我们的配置来输出日志。下面是一个配置文件的例子：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration>
	<Properties>
        <!-- 定义日志格式 -->
		<Property name="log.pattern">%d{MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36}%n%msg%n%n</Property>
        <!-- 定义文件名变量 -->
		<Property name="file.err.filename">log/err.log</Property>
		<Property name="file.err.pattern">log/err.%i.log.gz</Property>
	</Properties>
    <!-- 定义Appender，即目的地 -->
	<Appenders>
        <!-- 定义输出到屏幕 -->
		<Console name="console" target="SYSTEM_OUT">
            <!-- 日志格式引用上面定义的log.pattern -->
			<PatternLayout pattern="${log.pattern}" />
		</Console>
        <!-- 定义输出到文件,文件名引用上面定义的file.err.filename -->
		<RollingFile name="err" bufferedIO="true" fileName="${file.err.filename}" filePattern="${file.err.pattern}">
			<PatternLayout pattern="${log.pattern}" />
			<Policies>
                <!-- 根据文件大小自动切割日志 -->
				<SizeBasedTriggeringPolicy size="1 MB" />
			</Policies>
            <!-- 保留最近10份 -->
			<DefaultRolloverStrategy max="10" />
		</RollingFile>
	</Appenders>
	<Loggers>
		<Root level="info">
            <!-- 对info级别的日志，输出到console -->
			<AppenderRef ref="console" level="info" />
            <!-- 对error级别的日志，输出到err，即上面定义的RollingFile -->
			<AppenderRef ref="err" level="error" />
		</Root>
	</Loggers>
</Configuration>
```

> 上例中使用的是 `Log4j2` ，如果使用 `1.x` 版本即 `Log4j` ，使用此配置文件会出错，因为两者在依赖和配置上都有一定区别，具体参考[这里](https://www.cnblogs.com/KylinBlog/p/7841217.html)

# SLF4J 和 Logback

> 阿里巴巴开发手册推荐使用SLF4J进行日志记录

前面介绍了 `Commons Logging` 和 `Log4j` 这一对好基友，它们一个负责充当日志API，一个负责实现日志底层，搭配使用非常便于开发

`SLF4J` 类似于 `Commons Logging` ，也是一个日志接口，而 `Logback` 类似于 `Log4j` ，是一个日志的实现。

为什么有了 `Commons Logging` 和 `Log4j` ，又会蹦出来 `SLF4J` 和 `Logback` ？这是因为对 `Commons Logging` 的接口不满意，有人就搞了 `SLF4J` 。因为对 `Log4j` 的性能不满意，有人就搞了 `Logback` ，所以说比较推荐使用 `SLF4J` 和 `Logback` 进行日志记录

> 前文中也提到了 `Log4j` 的作者在吸取了 `Logback` 的设计之后重新推出了 `Log4j2`

在 `Commons Logging` 中，我们要打印日志，有时候得这么写：

```java
int score = 99;
p.setScore(score);
log.info("Set score " + score + " for Person " + p.getName() + " ok.");
```

拼字符串是一个非常麻烦的事情，所以 `SLF4J` 的日志接口改进成这样了：

```java
int score = 99;
p.setScore(score);
logger.info("Set score {} for Person {} ok.", score, p.getName());
```

`SLF4J` 的日志接口传入的是一个带占位符的字符串，用后面的变量自动替换占位符，所以看起来更加自然

使用 `SLF4J` 和 `Logback` 和前面讲到的使用 `Commons Logging` 加 `Log4j` 是类似的，首先要引入它们的依赖，然后把 `logback.xml` 放到 `classpath` 下

需要引入的依赖：

```xml
<!-- 该依赖包含了logback-core、slf4j-api依赖 -->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.x</version>
</dependency>
```

配置样例如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

	<appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
		<encoder>
			<pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
		</encoder>
	</appender>

	<appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<encoder>
			<pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
			<charset>utf-8</charset>
		</encoder>
		<file>log/output.log</file>
		<rollingPolicy class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy">
			<fileNamePattern>log/output.log.%i</fileNamePattern>
		</rollingPolicy>
		<triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
			<MaxFileSize>1MB</MaxFileSize>
		</triggeringPolicy>
	</appender>

	<root level="INFO">
		<appender-ref ref="CONSOLE" />
		<appender-ref ref="FILE" />
	</root>
</configuration>
```

它的接口实际上和 `Commons Logging` 几乎一模一样：

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class Main {
    final Logger logger = LoggerFactory.getLogger(getClass());
}
```

经过上面的讲述，我们必须清楚一点： `Commons Logging` 和 `SLF4J` 是不同的日志标准，它们分别规定了一套日志的行为抽象接口，但并不是日志系统的具体实现

> 原文：[Java日志框架](https://www.cnblogs.com/xrq730/p/8619156.html)

> 这点其实和[JetCache](https://www.cnblogs.com/lwh147/p/15176574.html)、[SpringCloudStream](https://www.cnblogs.com/lwh147/p/15206463.html)框架的思想是相同的，同时这也是它们为什么能够称作 “xx框架” 的原因）

对应的， `Log4j` 是 `Commons Logging` 的具体实现， `Logback` 是 `SLF4J` 的具体实现

# SLF4J的其它实现

除了 `Logback` 之外， `SLF4J` 还有其它的实现，比如 `slf4j-simple` ， `Log4j` 虽然不直接实现 `SLF4J` ，但是有一个将 `Log4j` 适配了 `SLF4J` 的新实现 `slf4j-log4j12`

当采用 `slf4j-simple` 作为 `SLF4J` 的实现时，依赖如下：

```xml
<!-- SLF4J的简单日志实现 -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-simple</artifactId>
    <version>1.x</version>
</dependency>
```

`slf4j-simple` 只是简单实现了日志打印功能，并不能进行文件记录、输出格式等相关配置，使用的都是默认配置，就跟它的名字一样 “simple”，开箱即用，它只能和 `JDK Logging` 一样在启动JVM时添加参数对日志输出级别进行设置，所以如果你的项目只是简单的打印信息，可以使用这个实现

> 另外，使用 `slf4j-simple` 输出的信息颜色都是红色的

当采用 `slf4j-log4j12` 作为 `SLF4J` 的实现时，依赖如下：

```xml
<!-- 适配了SLF4J的Log4j实现 -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>1.x</version>
</dependency>
```

使用这种方式做日志记录时必须进行配置，否则运行会报错: `Please initialize the log4j system properly.` 即编写 `log4j.xml` 文件放到 `classpath` 下

> 需要注意使用与 `Log4j` 的版本对应的配置规则，比如 `Log4j` 版本为 `2.x` 时（即使用的是 `Log4j2` ），默认的配置文件名为 `log4j2.xml` ，上例中使用的是 `1.x` ，所以配置文件名为 `log4j.xml`

# 使用 `@Slf4j` 注解自动生成 `log` 对象

我们都知道通过使用 `Lombok` 包中的 `@Data` 等注解可以自动为我们生成getter、setter等方法，其实它还带有 `@Slf4j` 注解，能帮助我们自动生成 `log` 对象

观察 `Lombok` 的依赖jar包结构我们可以发现，该 jar 包的 `lombok/extern` 目录下有各种自动生成日志对象的注解

```text
> maven: org.projectlombok:lombok:1.18.10
  > lombok-1.18.10.jar
    > lombok
      > extern
        ...
        > slf4j
          > @Slf4j
        > apachecommons
          > @CommonsLog
        > log4j
          > @Log4j
          > @Log4j2
        ...
```

所以如果需要使用 `@Slf4j` 注解自动生成log对象，需要引入 `lombok` 依赖：

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>x</version>
</dependency>
```

# 常见问题

## 日志配置文件报错： `URI is not registered (Settings | Languages & Frameworks | Schemas and DTDs）`

参考：https://blog.csdn.net/c_learner_/article/details/107228678

## `Class path contains multiple SLF4J bindings`

依赖中引入了多个 `SLF4J` 的实现时会出现这个警告，但 `SLF4J` 会选择其中一个进行绑定，不影响正常使用，如果要避免这个警告则需要检查Maven依赖项排除多余的日志实现仅保留一个即可
