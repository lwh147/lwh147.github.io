> 详细参考：[官方文档](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gateway-starter)

# 简单使用

## 引入依赖

```xml
<!-- 引入gateway依赖 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>

<!-- 需要配合注册到服务发现和注册中心才能正常使用 -->
<!-- 
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
 -->
```

## 基础配置示例

```yml
# 服务端口
server:
  port: 8080

spring:
  application:
    # 服务名
    name: service-gateway
  cloud:
    nacos:
      discovery:
        # nacos注册中心地址
        server-addr: 182.92.106.123:8848
    gateway:
      discovery:
        locator:
          # 是否启用注册到服务发现中心
          enabled: true
      # 是否开启网关服务
      enabled: true
      # 路由规则配置，可以配置多个路由规则
      routes:
      # 路由id，唯一，不重名
      - id: after_route
        # 目标uri，添加“lb://”前缀开启负载均衡
        uri: lb://https://example.org
        # 断言，即匹配规则，可以配置多个断言
        predicates:
        - Cookie=mycookie,mycookievalue
        # 该断言使用两个参数定义了 Cookie 路由谓词工厂，即匹配的请求需要携带一个 cookie，名称为 mycookie，值为 mycookievalue。
```

> 详细配置规则：[gateway配置规则](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/appendix.html)

> 更多路由断言规则：[gateway-request-predicates-factories](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gateway-request-predicates-factories)

# 过滤器 Filter

路由过滤器允许以某种方式修改传入的 `HTTP` 请求或传出的 `HTTP` 响应。路由过滤器的范围是特定的路由。 `Spring Cloud Gateway` 包括许多内置的 `GatewayFilter` 工厂。

```yml
spring:
  cloud:
    gateway:
      routes:
      - id: add_request_parameter_route
        uri: https://example.org
        filters:
        - AddRequestParameter=red, blue
```

这会将 `red=blue` 添加到所有匹配请求的下游请求的查询字符串中。

更多具体的过滤器配置规则详见：[gatewayfilter-factories](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gatewayfilter-factories)

# 全局过滤器 Global Filter

`GlobalFilter` 接口与 `GatewayFilter` 具有相似的作用。但是全局过滤器是**有条件地**应用于**所有路由**的特殊过滤器。

当请求与路由匹配时，过滤 Web 处理程序会将 `GlobalFilter` 的所有实例和 `GatewayFilter` 的所有特定于路由的实例添加到过滤器链中。这个组合过滤器链由 `org.springframework.core.Ordered` 接口排序，您可以通过实现 `getOrder()` 方法设置该接口。

由于 Spring Cloud Gateway 区分过滤器逻辑执行的“pre”和“post”阶段（参见下图），具有最高优先级的过滤器是“pre”阶段的第一个，“post”阶段的最后一个——阶段。

![How it works](https://img2020.cnblogs.com/blog/2330281/202109/2330281-20210907155605276-2035861222.png)

举个栗子：

```java
@Bean
public GlobalFilter customFilter() {
    return new CustomGlobalFilter();
}

public class CustomGlobalFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("custom global filter");
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
```

# 关于身份认证、授权以及鉴权

由于前后端分离项目存在跨域，所以以往的session存储会话信息的方式已经失效

> 原因是前端发起的每一个请求对于后端来说都是一个全新的请求，session也是新的，故不能通过session来保存会话信息

目前主流的解决方式是采用token的方式进行身份认证、授权和鉴权的

* 登录

  就是登录验证，客户端发送登录用户的账号密码至服务器端，服务器端在用户数据库中进行查找比对，对帐户信息进行认证

* 授权

  认证通过后，服务器端使用某种规则（目前较流行的为jwt）生成token返回给客户端，并在服务器端的数据库中保存一份，即授权

* 鉴权/认证

  授权完成之后，客户端将token保存在客户端，并在以后的每次请求头中都携带服务器端授予的token，服务器端也需要对每个请求（认证请求不需要）进行过滤，只有携带了本系统授予的合法token的请求才能得到响应，这叫鉴权

传统的token认证，即以token为令牌，服务端缓存下来，发给客户端。请求时根据请求携带的token来认证用户是否登陆以及取数据等。

## Token的时效性

token得设置有效期，不然用户就可以一直访问了。特别是如果token被窃取后，不会过期就很麻烦。所以需要设置过期时间。

而设置token有效期后又引发一个问题，一旦token过期，一般会要求用户重新登陆认证，用户体验差，于是人们想出了隐式地刷新token，让用户感觉不到。

**解决方案：**

在用户登录后的每一次请求鉴权过程中都去刷新服务端对应缓存信息的过期时间，这意味着用户只要在规定时间内与服务端发生一次交互，就会初始化用户的会话时长（延续了会话时长），如果用户一直处于未操作的状态，那么服务端缓存过期时间便不会进行初始化。此时如果发现token本身过期但是服务器端对应缓存没有过期时，说明用户一直处于活跃状态，只是token过期了而已，这时刷新token即可

## 并发问题

隐式地刷新token，需要考虑一个问题：如果在过期的时间点，一个页面同时发起多个请求过来，那么第一个请求服务端校验后发现token过期，便会刷新token，而后续的几个请求携带的仍然是旧token，就会被拒绝。如果这样，那页面上就会有部分资源无法显示，影响用户体验

**解决方案：**

在服务端缓存或数据库中，保存两份token，一份是当前有效的token，一份是上次失效的preToken。当在过期时间点有多个请求并发访问时，检查到请求头中的token已经失效，把preToken设置为当前失效的token，把token更新为新的token。之后的其他并发访问的请求，发现它们的token和缓存中已经刷新的token不一致，就去检查是否和preToken一致，如果一致，也可以允许访问。这样一来，并发访问就没问题了

## 遗留问题

### 另一种并发问题

在所有并发请求中的第一个得到处理的请求在执行刷新token的过程中（此时还没有刷新完成），恰巧还有其他携带失效token的请求也执行到了刷新token的步骤，此时会产生重复刷新token的问题

### 安全问题

我们都知道token需要存在于请求当中在网络中进行传输，如果token被其他人通过网络抓包抓获，那么这个人就能够冒充用户发出请求，出现中间人攻击的安全问题

除了网络抓包，token由于需要被存放到客户端 `local storage` 或者 `cookie` 中也会产生安全问题，如果客户端直接暴露在攻击之下，比如客户端感染了木马或者恶意软件，这时木马或者恶意软件想要获取token是非常容易的，此时任何安全措施都是无效的

所以主要有两点：

* 防止客户端被攻破
* 客户端未被攻破的情况下尽可能保证安全（中间人攻击）

针对第一点，没有有效的解决方法，只能靠用户自己，如果由于用户有着不良使用习惯致使电脑中了病毒，那谁都救不了，我们能做的就是尽可能在不影响用户体验的情况下完善校验规则，对请求层层把关，比如请求时除了要对token进行校验，还可以对请求的ip地址、设备信息等进行校验，再比如执行一些关键操作时需要额外的验证工作

针对第二点，使用HTTPS

# JWT（Json Web Token）

首先，JWT Token长这样：

```text
eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAKtWKi5NUrJSCgrxDY4P8fd29VPSUUqtKFCyMjQzMjc2s7A0NKgFAKViC04lAAAA.xpUNKcDCrgy7JtE4VRIooso2L6uSpnWzu4d6Mz6hvIq2nJiZzE9hfLySFm6aPFE35Npr9rrC40uHK2x7h1nKEQ
```

仔细观察可以发现一个JWT Token被两个 `.` 分为了三部分，这三部分一次是头部（Header）、负载（Payload）和签名（Signature）。头部和负载的源格式都为JSON形式，签名部分是为了检验头部和负载是否被篡改，用来对 `Base64` 加密后的头部和负载进行加密的

JWT的头部包含加密算法和Token类型信息

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

JWT的负载部分包含了一些规范规定的字段和用户自定义字段信息，如下面的 `id` ， `username` ， `role` 都是用户自定义字段，而 `exp` 是JWT规范中规定的 `有效期` ，和cookie中的exp意义类似

```json
{
  "id": "123456",
  "username": "admin",
  "role": "admin",
  "exp": "1544602234"
}
```

> 需要注意的是，Header和Payload的内容只经过了 `Base64` 编码，对客户端来说相当于明文信息，所以不能放置敏感信息

`Signature` 部分用来验证 JWT 是否被篡改，所以这部分会使用一个 `Secret` 将前两部分加密，逻辑如下:

```text
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

### Java中JWT的使用

```java
/**
  * 创建jwt
  */
public String createJWT(String id, String subject, long ttlMillis) throws Exception {
    SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256; //指定签名的时候使用的签名算法
    long nowMillis = System.currentTimeMillis();//生成JWT的时间
    Date now = new Date(nowMillis);
    Map<String,Object> claims = new HashMap<String,Object>();//创建payload的私有声明（根据特定的业务需要添加）
    claims.put("uid", "DSSFAWDWADAS...");
    claims.put("user_name", "admin");
    claims.put("nick_name","DASDA121");
    SecretKey key = generalKey();//生成签名的时候使用的秘钥secret,这个方法本地封装了的，一般可以从本地配置文件中读取，切记这个秘钥在任何场景都不应该流露出去
    //下面就是在为payload添加各种标准声明和私有声明了
    JwtBuilder builder = Jwts.builder() //设置jwt的body
            .setClaims(claims)          //如果有私有声明，一定要先设置这个自己创建的私有的声明，否则会覆盖之前的标准声明，例如：如果此设置在setExpiration之后，那么setExpiration将会被覆盖
            .setId(id)                  //设置jti(JWT ID)：是JWT的唯一标识，根据业务需要，这个可以设置为一个不重复的值，主要用来作为一次性token，从而回避重放攻击
            .setIssuedAt(now)           //iat: jwt的签发时间
            .setSubject(subject)        //sub(Subject)：代表这个JWT的主体，即它的所有人，这个是一个json格式的字符串，可以存放什么userid，roldid之类的，作为用户的唯一标志
            .signWith(signatureAlgorithm, key);//设置签名使用的签名算法和签名使用的秘钥
    if (ttlMillis >= 0) {
        long expMillis = nowMillis + ttlMillis;
        Date exp = new Date(expMillis);
        builder.setExpiration(exp);     //设置过期时间
    }
    return builder.compact();           //就开始压缩为xxxxxxxxxxxxxx.xxxxxxxxxxxxxxx.xxxxxxxxxxxxx这样的jwt
}

/**
  * 解密jwt
  */
public Claims parseJWT(String jwt) throws Exception{
    SecretKey key = generalKey();  //签名秘钥
    Claims claims = Jwts.parser()  //得到DefaultJwtParser
        .setSigningKey(key)         //设置签名的秘钥
        .parseClaimsJws(jwt).getBody();//设置需要解析的jwt
    return claims;
}

/**
  * 由字符串生成加密key
  */
public SecretKey generalKey(){
    String stringKey = Constant.JWT_SECRET;//本地配置文件中加密的密文
    byte[] encodedKey = Base64.decodeBase64(stringKey);
    SecretKey key = new SecretKeySpec(encodedKey, 0, encodedKey.length, "AES");// 根据给定的字节数组使用AES加密算法构造一个密钥
    return key;
}
```

> 特别注意在设置jwt body时**私有声明必须在标准声明之前**，否则私有声明无效
