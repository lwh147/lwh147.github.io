> 有关JetCahce的更多内容请参考[官方文档](https://github.com/alibaba/jetcache/wiki/Home_CN)

# 是什么？

## 缓存数据库

### Redis

Remote Dictionary Server(Redis) 是一个开源的**使用 ANSI C 语言编写**、遵守 BSD 协议、支持网络、可基于内存、分布式、可选持久性的键值对(Key-Value)存储数据库，是跨平台的非关系型数据库，并提供多种语言的 API

Redis 通常被称为数据结构服务器，因为值（value）可以是字符串(String)、哈希(Hash)、列表(list)、集合(sets)和有序集合(sorted sets)等类型

### Tair

Tair是由**淘宝自主开发的Key/Value结构数据存储系统**，提供快速访问的内存（MDB引擎）/持久化（LDB引擎）存储服务，基于高性能、高可用的分布式集群架构，满足读写性能要求高及容量可弹性伸缩的业务需求

## Redis的Java客户端

### Jedis

是老牌的Redis的Java实现客户端，提供了**比较全面的Redis命令的支持**。底层使用**阻塞的I/O**，且其方法调用都是**同步的**，程序流需要等到sockets处理完I/O才能执行，不支持异步。Jedis客户端实例**不是线程安全的**，所以需要通过连接池来使用Jedis。

### Lettuce

相比较Jedis，Lettuce基于优秀**Netty NIO框架**构建，**支持Redis的高级功能**，如Sentinel，集群，流水线，自动重新连接和Redis数据模型。

### Redission

使使用者对Redis的关注分离，提供很多**分布式相关操作服务**，例如，**分布式锁**，分布式集合，可通过Redis**支持延迟队列**，也是**基于Netty框架**的事件驱动的通信层

### Spring Data Redis

Spring Data Redis是Spring大家族的一部分，提供了在Srping应用中通过简单的配置访问Redis服务，对Reids底层开发包(Jedis, JRedis, RJC)进行了高度封装，**RedisTemplate**提供了Redis各种操作、异常处理及序列化，支持发布订阅。

## 缓存框架

### Spring Cache

Spring Cache 是 Spring 自带的缓存方案，使用简单，既**可以使用本地缓存**，**也可以使用 Redis**，但是只能选其一

它在Spring Data Redis的基础上**利用AOP实现了基于注解的缓存功能**，并且进行了合理的抽象，业务代码不用关心底层是使用了什么缓存框架，只需要简单地加一个注解，就能实现缓存功能，常用的有三个注解：

* `@Cacheable`
* `@CacheEvict`
* `@CachePut`

### Jetcache

JetCache是一个**基于Java的缓存系统的封装，它提供统一的API和注解来简化缓存的使用**。JetCache提供了比SpringCache更加强大的注解，可以原生的支持**TTL（Time To Live）**、**两级缓存**、**缓存自动刷新**，还提供了Cache接口用于手工缓存操作。 当前有四个实现，RedisCache、TairCache（此部分未在github开源）、CaffeineCache(in memory)和一个简易的LinkedHashMapCache(in memory)，要添加新的实现也是非常简单的。

> 如果有了解过[SpringCloudStream](https://www.cnblogs.com/lwh147/p/15206463.html)，那么这里的统一的API和注解其实相当于Stream的通道（Channel），缓存的具体实现（RedisCache、TairCache）相当于绑定器（Binder）实现

# JetCache的全部特性

通过统一的API访问Cache系统

通过注解实现声明式的方法缓存，支持TTL和两级缓存

通过注解创建并配置Cache实例

针对所有Cache实例和方法缓存的自动统计

Key的生成策略和Value的序列化策略是可以配置的

分布式缓存自动刷新，分布式锁 (2.2+)

异步Cache API (2.2+，使用Redis的lettuce客户端时)

Spring Boot支持

# JetCache的使用要求

JetCache需要**JDK1.8**、**Spring Framework4.0.8以上版本**。**Spring Boot为可选，需要1.1.9以上版本**。如果不使用注解（仅使用jetcache-core），Spring Framework也是可选的

# 依赖怎么选？

`jetcache-anno-api` ：定义jetcache的注解和常量，不传递依赖。如果你想把Cached注解加到接口上，又不希望你的接口jar传递太多依赖，可以让接口jar依赖 `jetcache-anno-api` 。

`jetcache-core` ：核心api，完全通过编程来配置操作Cache，不依赖Spring。两个内存中的缓存实现 `LinkedHashMapCache` 和 `CaffeineCache` 也由它提供。

`jetcache-anno` ：基于Spring提供 `@Cached` 和 `@CreateCache` 注解支持。

`jetcache-redis` ：使用jedis提供Redis支持。

`jetcache-redis-lettuce` （需要JetCache2.3以上版本）：使用lettuce提供Redis支持，实现了JetCache异步访问缓存的的接口。

`jetcache-starter-redis` ：Spring Boot方式的Starter，基于Jedis。

`jetcache-starter-redis-lettuce` （需要JetCache2.3以上版本）：Spring Boot方式的Starter，基于Lettuce。

# JetCache的基本使用（SpringBoot）

在上一节可以看到JetCache的众多具体实现，在本节内容中，我将针对基于SpringBoot整合JetCache并使用Jedis客户端来连接Redis的使用方式进行讲解，也就是使用第六种依赖进行举例讲解

> 如果需要集群、读写分离、异步等其他特性的支持则需要使用lettuce客户端；未使用SpringBoot的配置方式请参考官方文档

使用JetCache进行缓存的方式有两种，一种是**创建缓存实例**，另一种是**创建方法缓存**

## POM

```xml
<!-- springboot依赖 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<!-- jetcache依赖 -->
<dependency>
    <groupId>com.alicp.jetcache</groupId>
    <artifactId>jetcache-starter-redis</artifactId>
</dependency>
```

## 基本配置

```yml
jetcache:
  # 统计间隔，时间单位为分钟，0表示不统计
  statIntervalMinutes: 15
  # 是否把area添加到cacheName前作为key前缀
  areaInCacheName: false
  # 本地缓存配置
  local:
    default:
      # 缓存类型为linkedhashmap，还可以为caffeine
      type: linkedhashmap
      # key转换器，当前只有一个实现，fastjson
      keyConvertor: fastjson
      # 本地缓存元素限制
      # limit: 100
      # 全局过期时间，默认无穷大
      # expireAfterWriteInMillis: 100000
  # 远程缓存配置
  remote:
    default:
      # 缓存类型，采用redis，还支持tair
      type: redis
      # key转换器
      keyConvertor: fastjson
      # 序列化策略配置，可选java和kryo
      valueEncoder: java
      # 反序列化策略
      valueDecoder: java
      # 下面都是redis的配置
      poolConfig:
        minIdle: 5
        maxIdle: 20
        maxTotal: 50
      host: localhost
      port: 6379
      password: 123456
```

> 有关配置的详细说明请看[这里](https://github.com/alibaba/jetcache/wiki/Config_CN)

## 添加启动类注解

`@EnableMethodCache` ， `@EnableCreateCacheAnnotation` 这两个注解分别激活 `@Cached` 和 `@CreateCache` 注解

```java
@SpringBootApplication
// 激活@Cached系列注解
@EnableMethodCache(basePackages = "org.example.jetcache")
// 激活@CreateCache注解
@EnableCreateCacheAnnotation
public class MySpringBootApp {
    public static void main(String[] args) {
        SpringApplication.run(MySpringBootApp.class);
    }
}
```

## 创建缓存实例 `@CreateCache`

该注解是一个属性注解，用于创建一个缓存的实例对象，通过操作缓存实例对象来完成对缓存的操作，用起来和 Map 一样，和 RedisTemplate 相似，eg:

```java
@Service
@Slf4j
public class UserServiceImpl implements UserService {
  /**
    * 创建缓存实例，默认使用远程缓存，过期时间为永不过期
    **/
  @CreateCache
  private Cache<Long, User> userCache;

  ...

  public User getUserById(Long id) {
      // 手动查询缓存
      User user = userCache.get(id);
      if (Objects.isNull(user)) {
          // 缓存中没有数据，查数据库
          // 这里新建一个user代表去查了数据库
          User user1 = new User(id, "zhangsan", 0, new Date(), 0);
          log.info("模拟查询数据库获取到的用户：{}", user1);
          userCache.put(user1.getId(), user1);
          // 也可以单独指定缓存失效时间
          // userCache.put(user1.getId(), user1, 100, TimeUnit.SECONDS);
          return user1;
      }
      // 缓存中有数据，直接返回
      return user;
  }

  public Boolean deleteUserById(Long id) {
      // 手动操作缓存对象完成缓存的删除
      userCache.remove(id);
      // 数据库删除操作...
      log.info("模拟删除用户id：{}", id);
      return true;
  }

  public Boolean updateUser(User user) {
      // 手动完成缓存的更新操作
      userCache.put(user.getId(), user);
      // 数据库更新操作...
      log.info("模拟更新用户：{}", user);
      return true;
  }
}
```

`@CreateCache` 注解主要有以下属性

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
public @interface CreateCache {
    ...

    // 指定缓存的唯一名称，默认会使用类名+方法名，name会被用于远程缓存的key前缀
    String name() default "$$undefined$$";
    // 指定时间单位，默认为秒
    TimeUnit timeUnit() default TimeUnit.SECONDS;
    // 指定远程缓存过期时间，默认无穷大
    int expire() default -2147483648;
    // 指定本地缓存过期时间，默认无穷大
    int localExpire() default -2147483648;
    // 指定缓存类型，默认使用远程缓存
    CacheType cacheType() default CacheType.REMOTE;
    // 指定本地缓存元素限制
    int localLimit() default -2147483648;

    ...
}
```

下面的例子创建了一个两级缓存（本地+远程），指定缓存的名称为 `UserService.userCache.` ，远程缓存的过期时间为100，默认时间单位为秒，所以是100s，本地缓存过期时间未配置则默认永不过期，本地缓存中元素的个数限制在50个：

```java
@CreateCache(
        name = "UserService.userCache.",
        expire = 100,
        cacheType = CacheType.BOTH,
        localLimit = 50)
private Cache<Long, User> userCache;
```

> 有关 `Cache` 接口的详细API说明请参考[这里](https://github.com/alibaba/jetcache/wiki/CacheAPI_CN)

> 有关 `@CreateCache` 注解的详细说明请参考[这里](https://github.com/alibaba/jetcache/wiki/CreateCache_CN)

## 创建方法缓存 `@Cached`

使用 `@Cached` 可以为一个方法添加上缓存，与Spring Cache类似， `@Cached` 也是通过Spring AOP生成代理，来支持缓存功能，其用法也和Spring Cache中的 `@Cacheable` 注解类似，eg：

```java
@Cached(name = "UserService.userCache.",
        key = "#id",
        expire = 100,
        cacheType = CacheType.BOTH,
        localLimit = 50)
public User getUserById(Long id) {
    User user = new User(id, "zhangsan", 0, new Date(), 0);
    log.info("模拟查询数据库获取到的用户：{}", user);
    return user;
}
```

可以看到， `@Cached` 注解的配置属性和 `@CreateCache` 是基本相同，比较特别的就是需要使用Spring的SpEL脚本自己指定缓存key的生成策略，最终缓存的键是由 `name` 和 `key` 拼接而成的，上例中最终创建的缓存的键为 `UserService.userCache.{#id}`

除了创建方法缓存的注解，JetCache也提供了与 Spring Cache 相对应的缓存更新、删除等操作的方法注解：

`@CacheInvalidate` ：让缓存失效

```java
@CacheInvalidate(
        name = "UserService.userCache.",
        key = "#id")
public Boolean deleteUserById(Long id) {
    // 数据库操作...
    log.info("模拟删除用户id：{}", id);
    return true;
}
```

`@CacheUpdate` ：更新缓存， `value` 属性是用来更新缓存的值，使用SpEL表达式指定

```java
@CacheUpdate(
        name = "UserService.userCache.",
        key = "#user.id",
        value = "#user")
public Boolean updateUser(User user) {
    // 数据库操作...
    log.info("模拟更新用户：{}", user);
    return true;
}
```

> 有关 `@Cached` 、 `@CacheUpdate` 以及 `@CacheInvalidate` 注解的更多说明请参考[这里](https://github.com/alibaba/jetcache/wiki/CacheAPI_CN)

## 两者对比

使用注解创建方法缓存的方式使用起来比较方便，方法被调用时会自动根据参数执行相应的缓存操作而不需要在业务逻辑中出现缓存操作的相关逻辑代码，使业务代码更加简洁明了

但是，虽然方法缓存的使用方法简单，但是不支持自由度较高的缓存操作逻辑（比如加锁）或异步操作，如果需要用到这些功能则必须使用创建缓存实例的方式进行缓存的操作

所以，如果只是为了引入缓存，并且业务场景也只是对缓存进行一些简单的增删改查操作，那么可以选择使用方法缓存，但如果需要使用缓存完成更加复杂的业务逻辑或者需要异步操作缓存则需要考虑使用创建缓存实例的方式

## 注意事项

### 缓存时间

关于缓存的超时时间，有多个地方指定的时候澄清说明一下：

* `Cache.put()` 等方法指定了超时时间，则以此时间为准
* `Cache.put()` 等方法未指定超时时间，则使用创建Cache实例时指定的超时时间，Cache实例的超时时间通过在 `@CreateCache` 和 `@Cached` 上的 `expire` 属性指定
* 如果还没有指定，则使用yml中定义的全局配置，例如 `@Cached(cacheType=local)` 使用 `jetcache.local.default.expireAfterWriteInMillis` 作为全局配置，如果仍未指定则是默认的无穷大

### 序列化

**被缓存的对象必须实现可序列化接口**，否则在创建缓存时会出错，前面例子中的User类是这样的：

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User implements Serializable {
    ...
}
```

## 自动刷新缓存

在介绍自动刷新之前我们先来了解一下为什么要有自动刷新功能，**它解决了什么问题**？这就不得不提到缓存的三大问题之一：缓存雪崩，那么问题又来了，**什么是缓存雪崩**？

### 缓存雪崩

其实这个问题在之前的Redis技术分享会中已经讲过了，在这里我再简单描述一下

我们都知道缓存是具有时效性的，即在创建缓存时都会指定它的过期时间，一旦超过这个时间那么这个缓存就会失效，接下来对这个数据的查询就会去查数据库

缓存雪崩就是指**大批量的缓存数据**恰好在**同一个时间点失效**，导致在这个时间点对这部分失效数据的**大量查询请求全部涌向后台数据库**，引起数据库压力过大甚至宕机的情况

这就是缓存雪崩，那么怎么避免缓存雪崩呢？很简单的一个办法就是设置缓存永不过期，不过这种方式太浪费资源了，有没有其他办法？

### 解决办法

首先，分析一下缓存雪崩发生的条件，第一个条件是大量的缓存在同一个时间点失效，第二个条件就是这些失效的缓存数据是被频繁访问的数据

如果这些失效的缓存数据不常被访问，那么过期了也不会产生大量请求，所以对于不常访问的缓存不用执行其他操作

但是对于需要被频繁访问的缓存，我们完全可以延长它的过期时间让它在活跃的期间不会过期，如果它变得不活跃了，这时让它自动过期也不会产生影响

所以，需要一个定时任务，隔一段时间去判断哪些缓存是活跃的，哪些是不活跃的，对于活跃的缓存延长它的过期时间，也就是刷新；对于不活跃的缓存不执行任何操作，就让它自动过期就好了

### JetCahce的缓存刷新策略

JetCache中的自动刷新策略是这样的：对于开启了自动刷新的缓存，JetCahce在创建缓存的时候也会创建一个以一定时间间隔运行的定时任务，这个定时任务的主要工作就是判断这个缓存是否是一个活跃缓存，如果是，就执行刷新，重置缓存过期时间；否则停止刷新

判断一个缓存是否是活跃的指标是该缓存上一次访问时间与当前时间的差值，当这个差值大于某个阈值的时候就判定为不活跃缓存，停止刷新；反之执行刷新

> 特别的，如果一个不活跃的缓存在它还没有过期前被激活则又会开始执行自动刷新，也就是说停止刷新后的缓存如果在失效之前再次被访问又会重新激活自动刷新任务，而不是完全任由它自动过期

在JetCache中，开启自动刷新缓存功能的方式有两种

#### 创建缓存实例时设置自动刷新

```java
@CreateCache
private Cache<Long, String> userCache;

@PostConstruct
public void init(){
    // newPolicy方法指定了定时任务的执行时间间隔
    // stopRefreshAfterLastAccess方法指定了停止刷新缓存的时间阈值
    RefreshPolicy policy = RefreshPolicy.newPolicy(1, TimeUnit.MINUTES)
                          .stopRefreshAfterLastAccess(30, TimeUnit.MINUTES);
    userCache.config().setLoader(this::loadOrderSumFromDatabase);
    userCache.config().setRefreshPolicy(policy);
}
```

`newPolicy(1, TimeUnit. MINUTES)` 方法指定了定时任务的执行时间间隔为【1分钟】

`stopRefreshAfterLastAccess(30, TimeUnit. MINUTES)` 方法指定了停止刷新缓存的时间阈值为【30分钟】，即如果这个缓存在30分钟内没有被访问过就停止刷新

#### 使用 `@CacheRefresh` 注解

```java
@Cached(name = "UserService.userCache.",
        key = "#id",
        expire = 100,
        cacheType = CacheType.BOTH,
        localLimit = 50)
// refresh指定了定时任务的执行时间间隔
// stopRefreshAfterLastAccess方法指定了停止刷新缓存的时间阈值
@CacheRefresh(
        refresh = 1,
        stopRefreshAfterLastAccess = 30
        timeUnit = TimeUnit.MINUTES)
public User getUserById(Long id) {
    User user = new User(id, "zhangsan", 0, new Date(), 0);
    log.info("模拟查询数据库获取到的用户：{}", user);
    return user;
}
```

`@CacheRefresh` 注解的 `refresh` 属性指定了定时任务的执行时间间隔

`@CacheRefresh` 注解的 `stopRefreshAfterLastAccess` 属性指定了停止刷新缓存的时间阈值

## 统计功能

既然使用了缓存，那么对缓存的监控是必不可少的，JetCahce也提供了对缓存的监控功能，让开发者根据缓存的使用情况做出相应的调整优化措施，当遇到问题时也能够通过查看统计数据快速准确地定位问题

### 开启统计

当yml中的 `jetcache.statIntervalMinutes` 大于 `0` 时，通过 `@CreateCache` 和 `@Cached` 配置出来的Cache自带监控功能，JetCache会按指定的时间定期通过logger输出统计信息，默认输出信息类似如下：

```text
2017-01-12 19:00:00,001 INFO  support.StatInfoLogger - jetcache stat from 2017-01-12 18:59:00,000 to 2017-01-12 19:00:00,000
cache                                                |       qps|   rate|           get|           hit|          fail|        expire|avgLoadTime|maxLoadTime
-----------------------------------------------------+----------+-------+--------------+--------------+--------------+--------------+-----------+-----------
default_AlicpAppChannelManager.getAlicpAppChannelById|      0.00|  0.00%|             0|             0|             0|             0|        0.0|          0
default_ChannelManager.getChannelByAccessToten       |     30.02| 99.78%|         1,801|         1,797|             0|             4|        0.0|          0
default_ChannelManager.getChannelByAppChannelId      |      8.30| 99.60%|           498|           496|             0|             1|        0.0|          0
default_ChannelManager.getChannelById                |      6.65| 98.75%|           399|           394|             0|             4|        0.0|          0
default_ConfigManager.getChannelConfig               |      1.97| 96.61%|           118|           114|             0|             4|        0.0|          0
default_ConfigManager.getGameConfig                  |      0.00|  0.00%|             0|             0|             0|             0|        0.0|          0
default_ConfigManager.getInstanceConfig              |     43.98| 99.96%|         2,639|         2,638|             0|             0|        0.0|          0
default_ConfigManager.getInstanceConfigSettingMap    |      2.45| 70.75%|           147|           104|             0|            43|        0.0|          0
default_GameManager.getGameById                      |      1.33|100.00%|            80|            80|             0|             0|        0.0|          0
default_GameManager.getGameUrlByUrlKey               |      7.33|100.00%|           440|           440|             0|             0|        0.0|          0
default_InstanceManager.getInstanceById              |     30.98| 99.52%|         1,859|         1,850|             0|             0|        0.0|          0
default_InstanceManager.getInstanceById_local        |     30.98| 96.40%|         1,859|         1,792|             0|            67|        0.0|          0
default_InstanceManager.getInstanceById_remote       |      1.12| 86.57%|            67|            58|             0|             6|        0.0|          0
default_IssueDao.getIssueById                        |      7.62| 81.40%|           457|           372|             0|            63|        0.0|          0
default_IssueDao.getRecentOnSaleIssues               |      8.00| 85.21%|           480|           409|             0|            71|        0.0|          0
default_IssueDao.getRecentOpenAwardIssues            |      2.52| 82.78%|           151|           125|             0|            26|        0.0|          0
default_PrizeManager.getPrizeMap                     |      0.82|100.00%|            49|            49|             0|             0|        0.0|          0
-----------------------------------------------------+----------+-------+--------------+--------------+--------------+--------------+-----------+-----------
```

输出的统计信息以缓存的 `name` 为统计单位（所以在创建缓存时需要指定合适的name），统计的数据主要有每秒钟访问次数（QPS）、总共访问次数（GET）、缓存命中次数（HIT）以及命中率（RATE）等

### 配置统计信息输出到独立的日志文件

此外，如果想要让jJetCache的日志输出到独立的文件中，在使用logback的情况下可以这样配置：

```xml
<!-- 输出日志到文件 -->
<appender name="JETCACHE_LOGFILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <!-- 日志文件名 -->
    <file>jetcache.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <!-- 日志文件后缀 -->
        <fileNamePattern>jetcache.log.%d{yyyy-MM-dd}</fileNamePattern>
        <maxHistory>30</maxHistory>
    </rollingPolicy>
    <!-- 输出格式化样式 -->
    <encoder>
        <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
    </encoder>
</appender>
<!-- 输出级别控制 -->
<logger name="com.alicp.jetcache" level="INFO" additivity="false">
    <appender-ref ref="JETCACHE_LOGFILE" />
</logger>
```

# JetCache的高级特性

高级特性之后有时间再进行讲解，有兴趣的话可以去查看官方文档进行学习

## 异步API

[官方文档](https://github.com/alibaba/jetcache/wiki/AdvancedCacheAPI_CN)

## 不严格的分布式锁支持

[官方文档](https://github.com/alibaba/jetcache/wiki/CacheAPI_CN)
