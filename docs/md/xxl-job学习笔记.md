# 为什么？

目前项目中，采用的是微服务框架，由于在微服务中，存在需要定时的任务。但如果定时任务维护在每个微服务下，当微服务部署多个实例的情况下，会出现定时任务多次执行的情况。并且在解决问题的基础上，希望能够实现动态修改任务的定时时间，可以通过页面对定时任务进行控制

# 是什么？

XXL-JOB是一个**轻量级分布式任务调度平台**

顾名思义，首先是 `任务调度平台` ，对项目中的定时任务进行调度管理的一个后台监控管理平台（类似于铁路行车调度后台管理系统）通过该平台提供的管理页面就可以实现对整个项目中的定时任务进行控制、调度的功能

其次是 `分布式` ，如上一节所说，当前的项目采用的是微服务框架，一个项目有多个微服务并且每个微服务可能存在多个实例，整个项目是一个非常庞大的分布式系统，针对分布式系统提出的任务调度平台自然就是分布式任务调度平台

平台主要分为两部分：

* 调度中心

  作用：统一管理任务调度平台上调度任务，负责触发调度执行，并且提供任务管理平台，现成的提供使用的一个管理员端（调度平台）Web项目

* 执行器

  作用：负责接收 `调度中心` 的调度并执行；可直接部署执行器，也可以将执行器集成到现有业务项目中

# 怎么用？

## 搭建调度中心

1)下载调度中心源码并解压（xxl-job-admin项目即为调度中心），项目结构如下：

```text
xxl-job-admin：调度中心
xxl-job-core：公共依赖
xxl-job-executor-samples：执行器Sample示例（选择合适的版本执行器，可直接使用，也可以参考其并将现有项目改造成执行器）
    ：xxl-job-executor-sample-springboot：Springboot版本，通过Springboot管理执行器，推荐这种方式；
    ：xxl-job-executor-sample-frameless：无框架版本；
```

2)初始化sql脚本，脚本位置： `/xxl-job/doc/db/tables_xxl_job.sql`

3)更改配置中心配置，配置文件位置： `/xxl-job/xxl-job-admin/src/main/resources/xxl-job-admin.properties`

配置项说明：

```text

### 调度中心JDBC链接：链接地址请保持和调度数据库的地址一致

spring.datasource.url=jdbc:mysql://127.0.0.1:3306/xxl_job?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=root_pwd
spring.datasource.driver-class-name=com.mysql.jdbc.Driver

### 报警邮箱

spring.mail.host=smtp.qq.com
spring.mail.port=25
spring.mail.username=xxx@qq.com
spring.mail.password=xxx
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.socketFactory.class=javax.net.ssl.SSLSocketFactory

### 调度中心通讯TOKEN [选填]：非空时启用；

xxl.job.accessToken=

### 调度中心国际化配置 [必填]： 默认为 "zh_CN"/中文简体, 可选范围为 "zh_CN"/中文简体, "zh_TC"/中文繁体 and "en"/英文；

xxl.job.i18n=zh_CN

## 调度线程池最大线程配置【必填】

xxl.job.triggerpool.fast.max=200
xxl.job.triggerpool.slow.max=100

### 调度中心日志表数据保存天数 [必填]：过期日志自动清理；限制大于等于7时生效，否则, 如-1，关闭自动清理功能；

xxl.job.logretentiondays=30
```

4）如果已经正确进行上述配置，可将项目编译打包部署。  
调度中心访问地址： `http://localhost:8080/xxl-job-admin` (该地址执行器将会使用到，作为回调地址) 默认登录账号 `admin/123456`

## 搭建执行器项目

1）确认pom文件中引入了 `xxl-job-core` 的依赖

2）执行器配置，样例项目中配置文件位置： `/xxl-job/xxl-job-executor-samples/xxl-job-executor-sample-springboot/src/main/resources/application.properties`

配置项说明：

```text

### 调度中心部署跟地址 [选填]：如调度中心集群部署存在多个地址则用逗号分隔。执行器将会使用该地址进行"执行器心跳注册"和"任务结果回调"；为空则关闭自动注册；

xxl.job.admin.addresses=http://127.0.0.1:8080/xxl-job-admin

### 执行器通讯TOKEN [选填]：非空时启用；

xxl.job.accessToken=

### 执行器AppName [选填]：执行器心跳注册分组依据；为空则关闭自动注册

xxl.job.executor.appname=xxl-job-executor-sample

### 执行器注册 [选填]：优先使用该配置作为注册地址，为空时使用内嵌服务 ”IP:PORT“ 作为注册地址。从而更灵活的支持容器类型执行器动态IP和动态映射端口问题。

xxl.job.executor.address=

### 执行器IP [选填]：默认为空表示自动获取IP，多网卡时可手动设置指定IP，该IP不会绑定Host仅作为通讯实用；地址信息用于 "执行器注册" 和 "调度中心请求并触发任务"；

xxl.job.executor.ip=

### 执行器端口号 [选填]：小于等于0则自动获取；默认端口为9999，单机部署多个执行器时，注意要配置不同执行器端口；

xxl.job.executor.port=9999

### 执行器运行日志文件存储磁盘路径 [选填] ：需要对该路径拥有读写权限；为空则使用默认路径；

xxl.job.executor.logpath=/data/applogs/xxl-job/jobhandler

### 执行器日志文件保存天数 [选填] ： 过期日志自动清理, 限制值大于等于3时生效; 否则, 如-1, 关闭自动清理功能；

xxl.job.executor.logretentiondays=30
```

3）执行器组件配置，样例项目中配置文件位置： `/xxl-job/xxl-job-executor-samples/xxl-job-executor-sample-springboot/src/main/java/com/xxl/job/executor/core/config/XxlJobConfig.java`

配置内容说明：

```java
@Bean
public XxlJobSpringExecutor xxlJobExecutor() {
    logger.info(">>>>>>>>>>> xxl-job config init.");
    XxlJobSpringExecutor xxlJobSpringExecutor = new XxlJobSpringExecutor();
    xxlJobSpringExecutor.setAdminAddresses(adminAddresses);
    xxlJobSpringExecutor.setAppname(appname);
    xxlJobSpringExecutor.setIp(ip);
    xxlJobSpringExecutor.setPort(port);
    xxlJobSpringExecutor.setAccessToken(accessToken);
    xxlJobSpringExecutor.setLogPath(logPath);
    xxlJobSpringExecutor.setLogRetentionDays(logRetentionDays);
    return xxlJobSpringExecutor;
}
```

4）创建任务JobHandler，项目中已提供的示例，位置： `/xxl-job/xxl-job-executor-samples/xxl-job-executor-sample-springboot/src/main/java/com/xxl/job/executor/service/jobhandler/SampleXxlJob.java` ，该实例采用的是 `Bean模式（方法形式）` ，可以参照创建自己的handler处理类

5）在调度中心对定时任务执行进行配置，配置规则详情：

```text
基础配置：
  - 执行器：任务的绑定的执行器，任务触发调度时将会自动发现注册成功的执行器, 实现任务自动发现功能; 另一方面也可以方便的进行任务分组。每个任务必须绑定一个执行器, 可在 "执行器管理" 进行设置;
  - 任务描述：任务的描述信息，便于任务管理；
  - 负责人：任务的负责人；
  - 报警邮件：任务调度失败时邮件通知的邮箱地址，支持配置多邮箱地址，配置多个邮箱地址时用逗号分隔；

触发配置：
  - 调度类型：
      无：该类型不会主动触发调度；
      CRON：该类型将会通过CRON，触发任务调度；
      固定速度：该类型将会以固定速度，触发任务调度；按照固定的间隔时间，周期性触发；
      固定延迟：该类型将会以固定延迟，触发任务调度；按照固定的延迟时间，从上次调度结束后开始计算延迟时间，到达延迟时间后触发下次调度；
  - CRON：触发任务执行的Cron表达式；
  - 固定速度：固件速度的时间间隔，单位为秒；
  - 固定延迟：固件延迟的时间间隔，单位为秒；

任务配置：
  - 运行模式：
      BEAN模式：任务以JobHandler方式维护在执行器端；需要结合 "JobHandler" 属性匹配执行器中任务；
      GLUE模式(Java)：任务以源码方式维护在调度中心；该模式的任务实际上是一段继承自IJobHandler的Java类代码并 "groovy" 源码方式维护，它在执行器项目中运行，可使用@Resource/@Autowire注入执行器里中的其他服务；
      GLUE模式(Shell)：任务以源码方式维护在调度中心；该模式的任务实际上是一段 "shell" 脚本；
      GLUE模式(Python)：任务以源码方式维护在调度中心；该模式的任务实际上是一段 "python" 脚本；
      GLUE模式(PHP)：任务以源码方式维护在调度中心；该模式的任务实际上是一段 "php" 脚本；
      GLUE模式(NodeJS)：任务以源码方式维护在调度中心；该模式的任务实际上是一段 "nodejs" 脚本；
      GLUE模式(PowerShell)：任务以源码方式维护在调度中心；该模式的任务实际上是一段 "PowerShell" 脚本；
  - JobHandler：运行模式为 "BEAN模式" 时生效，对应执行器中新开发的JobHandler类“@JobHandler”注解自定义的value值；
  - 执行参数：任务执行所需的参数；     
  
高级配置：
  - 路由策略：当执行器集群部署时，提供丰富的路由策略，包括；
      FIRST（第一个）：固定选择第一个机器；
      LAST（最后一个）：固定选择最后一个机器；
      ROUND（轮询）：；
      RANDOM（随机）：随机选择在线的机器；
      CONSISTENT_HASH（一致性HASH）：每个任务按照Hash算法固定选择某一台机器，且所有任务均匀散列在不同机器上。
      LEAST_FREQUENTLY_USED（最不经常使用）：使用频率最低的机器优先被选举；
      LEAST_RECENTLY_USED（最近最久未使用）：最久未使用的机器优先被选举；
      FAILOVER（故障转移）：按照顺序依次进行心跳检测，第一个心跳检测成功的机器选定为目标执行器并发起调度；
      BUSYOVER（忙碌转移）：按照顺序依次进行空闲检测，第一个空闲检测成功的机器选定为目标执行器并发起调度；
      SHARDING_BROADCAST(分片广播)：广播触发对应集群中所有机器执行一次任务，同时系统自动传递分片参数；可根据分片参数开发分片任务；
  - 子任务：每个任务都拥有一个唯一的任务ID(任务ID可以从任务列表获取)，当本任务执行结束并且执行成功时，将会触发子任务ID所对应的任务的一次主动调度。
  - 调度过期策略：
      - 忽略：调度过期后，忽略过期的任务，从当前时间开始重新计算下次触发时间；
      - 立即执行一次：调度过期后，立即执行一次，并从当前时间开始重新计算下次触发时间；
  - 阻塞处理策略：调度过于密集执行器来不及处理时的处理策略；
      单机串行（默认）：调度请求进入单机执行器后，调度请求进入FIFO队列并以串行方式运行；
      丢弃后续调度：调度请求进入单机执行器后，发现执行器存在运行的调度任务，本次请求将会被丢弃并标记为失败；
      覆盖之前调度：调度请求进入单机执行器后，发现执行器存在运行的调度任务，将会终止运行中的调度任务并清空队列，然后运行本地调度任务；
  - 任务超时时间：支持自定义任务超时时间，任务运行超时将会主动中断任务；
  - 失败重试次数；支持自定义任务失败重试次数，当任务失败时将会按照预设的失败重试次数主动进行重试；
```

详细参考：[官方文档](https://www.xuxueli.com/xxl-job/#二、快速入门)
