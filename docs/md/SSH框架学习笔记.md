# SSH框架

## 版本问题

struts 2.3 对于 通配符+占位符 组合模式的 action 方法的动态调用是默认开启的，但 struts 2.5 为了更加安全和严谨，将其默认设置为关闭，所以需要在 struts2.5 版本的 struts.xml 中添加配置开启动态调用：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!-- 注意后面的dtd版本号与使用的struts版本号匹配 -->
<!DOCTYPE struts PUBLIC
        "-//Apache Software Foundation//DTD Struts Configuration 2.5//EN"
        "http://struts.apache.org/dtds/struts-2.5.dtd">
<struts>
    <!-- 1. 允许动态调用方法，通配符+占位符组合 -->
    <constant name="struts.enable.DynamicMethodInvocation" value="true"/>
    
    <package name="defaultPackage"  extends="struts-default">
       <!-- 2. 添加global-allowed-methods定义通配符使用规则 -->
        <global-allowed-methods>regex:.*</global-allowed-methods>
        <action name="test_*" class="com.ssh.action.TestActoin" method="{1}"/>
    </package>
</struts>
```

并且2.5版本的struts，web.xml文件中的配置是这样的：

```xml
<filter>
    <filter-name>struts2</filter-name>
    <filter-class>
      <!-- 注意这个类的位置 -->
      org.apache.struts2.dispatcher.filter.StrutsPrepareAndExecuteFilter
    </filter-class>
</filter>
```

而2.3版本是这样的：

```xml
<filter>
    <filter-name>struts2</filter-name>
    <filter-class>
      <!-- 注意这个类的位置 -->
      org.apache.struts2.dispatcher.ng.filter.StrutsPrepareAndExecuteFilter
    </filter-class>
</filter>
```

## XML格式问题

xml 文件中，标签属性值里的 '>', '<', '&' 等特殊符号需要转换成实体，否则会解析错误，比如在配置数据库的url时，多个参数之间使用 `&` 隔开， `&` 需要写成 `&amp; `

|实体|代表符号|
|--|--|
| `&lt; ` | < 小于号|
| `&gt; ` | > 大于号|
| `&amp; ` | & 和|
| `&apos; ` | ' 单引号|
| `&quot; ` | " 双引号|
