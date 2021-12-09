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

# 常见问题

## IDEA中Maven依赖莫名报错或找不到

有时候有些依赖你确定已经导入了但是会报错找不到，此时先关闭所有IDEA窗口重启IDEA，重新打开项目，检查问题是否解决，如果没解决，根据错误信息排查错误

如果修改过后或确定配置没问题但还是有错，执行IDEA的删除缓存操作： `File` ➡ `Invalidate Caches / Restart...`

如果都不行，换个Maven版本试试

## IDEA中更改 `settings.xml` 文件不生效

在 `settings.xml` 中配置了自定义Maven仓库信息，也在IDEA中指定使用上述Maven配置文件，但是刷新重载之后不自动下载新增依赖，提示 `Could not find xxx in 你配置的Maven仓库` 或者 `Could not find xxx in Maven中央仓库` 或者 `Could not find xxx in 你其他配置文件中的仓库地址` 又或者只有 `Could not find xxx`

* 如果你只有一个配置文件，注释掉或删除 `settings.xml` 文件中其它Maven仓库的配置
* 如果你针对不同的Maven仓库有不同的配置文件，即有多个配置文件的情况下，不要使用 `settings.xml` 作为配置文件名，删除Maven默认的 `settings.xml` 配置文件或将其更名为 `settings-default.xml` 或其它名称，然后为当前项目指定其配置文件

进行完上述步骤之后，在本地Maven仓库中找到错误中找不到的xxx.jar包目录，将其删除，最后执行Maven刷新操作重载依赖

> 诚然，删除整个本地仓库也是相同的效果，但是并不推荐，除非出现了大量jar包错误，即使这种情况也不必清空整个本地Maven仓库，只需要删除出错jar包目录即可，并不需要删除全部，当然如果你想清理一下本地Maven仓库重新下载也是可以的

如果还是不行，执行IDEA的删除缓存操作： `File` ➡ `Invalidate Caches / Restart...`

如果都不行，换个Maven版本试试
