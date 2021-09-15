# 依赖和依赖管理

## 依赖管理

依赖管理（dependencyManagement），顾名思义，是用来管理继承自该项目的所有子项目的默认依赖信息的，这部分的依赖信息**不会被立即解析**，而是当子项目声明一个依赖（必须描述 group ID和 artifact ID 信息，如果 group ID 和artifact ID 以外的一些信息没有描述，则通过 group ID 和 artifact ID 匹配到这里的依赖，并使用这里的依赖信息）时，才会对被使用到的依赖信息进行解析

一般在我们项目顶层的 POM 文件中，我们会看到 dependencyManagement 元素，通过它来管理 jar 包的版本，**让子项目中引用一个依赖而不用显式的列出版本号，Maven会沿着父子层次向上走，直到找到一个拥有dependencyManagement元素的项目，然后它就会使用在这个dependencyManagement元素中指定的版本号**

## 依赖

依赖（dependencies）元素描述了项目相关的所有依赖，这些依赖组成了项目构建过程中的一个个环节。它们**自动从项目定义的仓库中下载**

相对于 dependencyManagement，所有声明在 dependencies 里的依赖都会**自动引入**并默认被所有继承了该项目的子项目继承

更多请参考：[dependencies与dependencyManagement的区别](https://blog.csdn.net/liutengteng130/article/details/46991829)

# 继承

继承是为了让依赖能够得到充分复用，和Java中的继承概念类似，Maven 中的继承分为单继承和多继承

## 单继承

使用 `parent` 标签来定义继承关系的就是单继承，因为 `parent` 标签只能存在一个

对于单继承，顾名思义，当前模块只能继承一个父模块的依赖，但是有些情况下我们是需要继承多个父模块的依赖的，比如微服务项目需要同时引入 SpringBoot 和SpringCloud 两者的依赖进行统一管理，这种情况就需要使用多继承

## 多继承

多继承的依赖引入方式和普通的依赖引入方式类似，不同之处在于需要指定 `type` 为 `pom` ， `scope` 为 `import`

```xml
<dependencyManagement>
    <dependencies>
        <!-- 此处继承了father 和 monther 两个项目，type为pom，scope 为 import -->
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>maven-father</artifactId>
            <version>1.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>maven-monther</artifactId>
            <version>1.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

引入之后在该模块或其子模块中就可以对 father 或 monther 模块中的依赖引入使用而不需要指定版本

# 跳过测试

执行命令时加上 `-Dmaven.test.skip=true` 参数或

```xml
<properties>
	<maven.test.skip>true</maven.test.skip>
</properties>
```

# 统一JDK版本和编码

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <maven.compiler.encoding>UTF-8</maven.compiler.encoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

> 在 IDEA 的 `Project Structure...` 选项中对项目的 JDK 版本和编码进行修改只是暂时在 IDEA 的项目设置文件中进行了修改，并不会对 POM 文件进行修改，更不会影响 Maven 编译打包时实际的 JDK 版本和编码，重新打开项目又会变成默认的

# 日志相关依赖总结

日志依赖体系我感觉比较复杂，目前还没彻底搞清楚各种包之间到底是什么关系，下面将自己的测试结果和理解记录一下（可能并不正确）

首先，如果想在代码中使用 `@Slf4j` 注解使用自动注入的 log 对象进行日志输出，则必须引入以下依赖：

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.10</version>
</dependency>
```

通过观察 lombok 的依赖jar包结构我们可以发现，所有自动注入日志对象的注解都位于该 jar 包的 `lombok/extern` 目录下

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

`extern` 目录下的每个文件夹都代表了一种日志类别，常见的有 CommonLog、Log4j 和 Slf4j 等，这里我只列出了这三种

所以，不管我们使用 CommonLog、Log4j 还是 Slf4j 用作日志记录的工具，只要想使用自动注入的日志对象，就必须引入该 jar 包，否则可以不用引入该 jar 包

接下来，为了让注解能够正常工作（非必要），准确来说是为了真正的能够使用日志记录功能，我们需要引入所使用日志的接口类以及接口实现类，这里以 `Slf4j` 为例（阿里巴巴开发手册推荐使用Slf4j进行日志记录），其实现有 `slf4j-simple` 、 `slf4j-log4j12` 、 `logback-classic` 等（应该还有其他的吧）：

```xml
<!-- 以下三个依赖任选一个即可 -->

<!-- 需要配置才能正常运行（classpath下有配置xml） -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>1.7.25</version>
</dependency>

<!-- 或 -->

<!-- 需要配置才能正常运行（classpath下有配置xml） -->
<dependency>
  <groupId>ch.qos.logback</groupId>
  <artifactId>logback-classic</artifactId>
  <version>1.2.3</version>
</dependency>

<!-- 或 -->

<!-- 不需要配置便能正常运行，但只能打印信息，不能将日志记录到文件以及格式化输出等相关配置 -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-simple</artifactId>
    <version>1.7.0</version>
</dependency>
```

上面的三个依赖任选一种就可以使用日志打印功能了，它们都是针对 `slf4j-api` 进行实现的，所以这三个依赖分别都依赖了 `slf4j-api` ，不需要再引入 `slf4j-api` 依赖，我看网上好多例子都是一股脑把各种日志依赖全引入，运气好了能正常运行，运气差了可能就会出现 “类路径上发现多个日志绑定” 的错误，这也是导致我觉得日志依赖复杂的原因之一吧

> 特别的， `slf4j-simple` 只是简单实现了日志打印功能，并不能进行文件记录、输出级别、输出格式等相关配置，使用的是写死的默认配置，就跟他的名字一样 “simple”，而 `slf4j-log4j12` 和 `logback-classic` 都需要进行配置才能使用

# 常见问题
