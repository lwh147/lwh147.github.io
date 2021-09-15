详细参考：[官方文档-中文](https://www.springcloud.cc/spring-cloud-dalston.html#_spring_cloud_stream)、[官方API文档](https://docs.spring.io/spring-cloud-stream/docs/3.1.3/reference/html/)

# 为什么？

我们都知道消息中间件的产品非常多，各有各的优势和劣势，在技术选型过程中我们往往需要通过各方面的比较、筛选，最后确定一个适用于当前系统的消息中间件来使用，但是随着系统的更新迭代和消息中间件的发展，渐渐的可能当时的选择已经不是现在或者未来的最佳选择，甚至需要将多个消息中间件一起配合使用才能满足系统的需求，这时候如果需要替换系统中的消息中间件，由于不同的消息中间件之间的接口差异，需要修改大量的代码去完成这件事，工作量非常大

为了解决上述问题，Spring Cloud Stream出现了

# 是什么？

Spring Cloud Stream 是一个框架，用于构建与共享消息系统连接的高度可扩展的事件驱动微服务

使用消息实现事件通信的概念被称为消息驱动架构，也被称为消息驱动架构。使用这类架构可以构建高度解耦的系统，该系统能够对变化做出响应，且不需要与特定的库或者服务紧密耦合

该框架最大的特点是抽象了消息传递平台的细节，因此可以在支持的消息队列中随意切换（现支持 Kafka 和 RabbitMQ），即该框架通过提供统一的编程接口实现了对不同消息中间件的操作，屏蔽掉了不同的消息中间件使用时的差异，同时 Spring CLoud Stream 为一些供应商的消息中间件产品提供了个性化的自动化配置实现，引入了发布-订阅、消费组、分区三个核心概念

# 核心概念

Spring Cloud Stream提供了一些简化了消息驱动的微服务应用程序编写的抽象和原语，下面将对其进行介绍

## 应用模型

Spring Cloud Stream的应用模型如下图所示

![Spring Cloud Stream 应用模型](https://www.springcloud.cc/images/SCSt-with-binder.png)

Spring Cloud Stream应用程序和消息中间件之间通过绑定器（Binder）进行关联，绑定器基于特定的消息中间件实现，并为Spring Cloud Stream应用程序提供**统一的编程接口**，也就是通道（Channel，分为Inputs和Outputs），屏蔽掉了不同消息中间件使用时的差异，抽象了消息传递平台的细节

## 绑定器（Binder）

绑定器是Spring Cloud Stream的核心部分，就是在绑定器中完成了对特定消息中间件编程接口的封装和抽象，通过向应用程序暴露统一的编程接口（通道），使得在使用时不必考虑各种不同的消息中间件的使用方法。当需要更换消息中间件时，也只需要更换绑定器或进行配置即可而不需要更改应用逻辑，也就是说应用程序可以通过相同的代码使用不同类型的中间件

所以如果想要使用其他消息中间件（目前Stream提供了RabbitMQ和Kafka的绑定器实现），只需要实现对应消息中间件的绑定器即可，Stream会自动检测并使用类路径中找到的绑定器，对于更复杂的用例，Stream也支持在运行时选择绑定器，甚至为不同的通道使用不同的绑定器

## 通道（Channel）

通道就是Stream为应用程序提供的统一编程接口，通过这一套接口即可操作任何实现了绑定器的消息中间件

在应用模型图中我们可以看到通道分为两种，一种是消费通道（Inputs），一种是生产通道（Outputs），在使用时我们通过在应用程序中定义对应的通道来实现消息的生产和消费，具体的使用方法会在之后进行讲解

## 小结

到这里为止Stream最核心的思想概念已经讲完了，下面的都是一些具体实现方案和应用上的内容，但是我还是觉得有必要再对其进行一些总结说明

举个不太恰当的例子，其实类似Spring Cloud Stream、JetCache等框架的核心思想（或者说设计理念）与USB接口是类似的

就拿鼠标来说吧，不同鼠标厂商的主控芯片设计都是不同的，但是为什么你随便买个鼠标都能用？就是因为这些厂商都通过提供各自的驱动程序使得各自原本不同的芯片都能够通过相同的USB总线与电脑进行通讯，屏蔽了芯片之间的差异，所以你的电脑只要有USB接口，你想用罗技的鼠标是可以的，想用雷蛇的也没问题，就算随便买一个USB接口的鼠标也可以用，这里的驱动程序就相当于Stream中的绑定器，而USB总线充当了通道的角色，不同厂商的鼠标可以当作不同的中间件产品，只要某个鼠标厂商通过驱动程序使自己生产的鼠标支持USB总线协议，那就能用（当然这个举例缺乏严谨性，但是我的重点在于让你理解Stream的设计理念）

抽象的概念往往难以理解，所以需要将抽象的概念与具体的应用场景相结合或者通过类比的方式去尝试理解概念，这种学习方式我觉得是非常必要也是非常有效果的

## 发布-订阅模式

Stream将所有的消息模型都抽象成为了发布-订阅模型，两个应用程序在运行时将主题（Topic）声明为它们的输入和输出，也就是说每个通道（Channel）在使用时都有特定的主题与之关联，如下图所示：

![发布订阅模型](https://www.springcloud.cc/images/SCSt-sensors.png)

为输入指定主题代表该应用程序订阅了指定主题的消息，为输出指定主题则代表该应用程序会发布指定主题的消息

使用RabbitMQ作为消息中间件的Stream应用中，交换机（Exchange）充当了主题的角色；而在Kafka中本身就是有主题这个概念的，所以它们刚好对应

发布订阅通信模型降低了生产者和消费者的复杂性，并允许将新应用程序添加到消息系统中而不会中断现有消息流

例如，您可以添加一个计算显示和监视最高温度值的应用程序。然后，您可以再添加另一个故障检测的应用程序，它们都只需要通过订阅同一个消息主题就能够获取所需的消息而不需要对消息发布者做出更改，如果是点对点模型，每当消息系统中出现了新的消费者，那么生产者的相关配置也必须更改

通过共享主题即发布订阅模式而不是点对点队列进行所有通信减少了微服务之间的耦合

## 消费者组

在现代的微服务架构体系中，为了应对高并发场景达到高可用，一个服务都会部署多个实例，对于同一个服务而言，不同的实例之间业务逻辑是完全相同的，所以一个消息应该只能被同一服务的一个实例所消费，不然会存在消息被多次消费，同一业务被执行多次的问题，为了解决这个问题，Stream提供了消费者组概念（与Kafka消费者组相似并受到启发）

![消费者组示意图](https://www.springcloud.cc/images/SCSt-groups.png)

通过为同一微服务的不同实例指定相同的组名（Group）来表明该组中的所有实例属于一个微服务，订阅了某一主题消息的所有组都会收到改主题的消息，但是每个组中只有一个成员能够消费消息，并且每个组中的消息的消费策略是可以实现负载均衡的

> 在使用RabbitMQ作为消息中间件时，消息分组的原理就是为属于不同的组创建了不同的消息队列，并对消费策略进行了规定，从而实现了消息分组功能

## 消息分区

通过引入消息分组的概念，已经解决了消息被同一服务的多个实例消费多次的问题，实现了一个消息只能被同一组实例中一个实例消费，但是问题又来了，最终这个消息由组内哪个实例去消费是无法确定的，因为实现了负载均衡，这样的话对于一些业务场景是不合适的

比如一些用于监控的服务，为了统计某段时间内某个指标的变化情况，需要传感器的所有测量数据都由相同的应用实例进行处理

这时候消息分区功能就应运而生，如下图所示：

![消息分区原理](https://www.springcloud.cc/images/SCSt-partitioning.png)

# 常用注解介绍

Spring Cloud Stream提供了许多预定义的注解，用于声明绑定的输入和输出通道，以及如何收听频道，下面将对一些常用的注解进行介绍

## 定义通道 `@Input` 和 `@Output`

使用这两个注解在接口中可以定义任意数量的输入和输出通道：

```java
public interface Barista {

    @Input
    SubscribableChannel orders();

    @Output
    MessageChannel hotDrinks();

    @Output
    MessageChannel coldDrinks();

    ...
}
```

使用上面的接口作为 `@EnableBinding(Barista.class)` 注解的参数将会分别触发绑定三个通道（orders、hotDrinks和coldDrinks），通道名称默认为方法名

同时也可以给 `@Input` 和 `@Output` 注解传递参数来自定义通道名称：

```java
public interface Barista {
    ...
    @Input("inboundOrders")
    SubscribableChannel orders();
}
```

在上述例子中被创建和绑定通道名为 `inboundOrders`

> 不通过 `spring.cloud.stream.bindings.<channelName>.destination` 指定通道所绑定中间件的目标名称时（RabbitMQ中目标为交换机，Kafka中目标为主题），默认使用通道名称作为中间件中的目标名称

## 触发绑定 `@EnableBinding`

`@EnableBinding` 注解可以将一个或者多个上述接口类作为参数，这些接口类包含了表示可绑定组件（通常是消息通道）的方法

```java
...
@Import(...)
@Configuration
@EnableIntegration
public @interface EnableBinding {
    ...
    Class<?>[] value() default {};
}
```

> 使用Stream生产或消费消息必须触发与相应通道的绑定，否则不能正常使用消息服务，另外该接口自带有 `@Configuration` 注解

## 消息监听 `@StreamListener`

`@StreamListener` 注解在其他Spring消息传递注解（例如 `@MessageMapping` ， `@JmsListener` ， `@RabbitListener` 等）之后创建，基本使用方式如下:

```java
// 触发绑定
@EnableBinding(Sink.class)
public class VoteHandler {

  @Autowired
  VotingService votingService;

  // 根据通道名称监听通道，使用Message类型接收消息
  @StreamListener(Sink.INPUT)
  public void handle(Message<String> message) {
    log.info("频道[{}]监听信息为:[{}]", Sink.INPUT, message.getPayload());
    // 消息处理
    // ...
    // 消息反序列化为vote对象进行使用
    votingService.record(vote);
    // do other things...
  }
}
```

## `@Source` ， `@Sink` 和 `@Processor`

为了方便服务于最常见的用例，涉及输入通道，输出通道或两者，Spring Cloud Stream提供了开箱即用的三个预定义接口

`Source` 可用于具有单个输出通道的应用程序，它的源码如下：

```java
public interface Source {

  String OUTPUT = "output";

  @Output(Source.OUTPUT)
  MessageChannel output();

}
```

`Sink` 可用于具有单个输入通道的应用程序，它的源码如下：

```java
public interface Sink {

  String INPUT = "input";

  @Input(Sink.INPUT)
  SubscribableChannel input();

}
```

`Processor` 可用于分别具有单个输出和输入通道的应用程序，它的源码如下：

```java
public interface Processor extends Source, Sink {
}
```

# 基础应用

本节将介绍Spring Cloud Stream的编程模型，即如何编写代码使用Spring Cloud Stream（以RabbitMQ中间件为例，如需使用Kafka只需替换相应依赖，更改相关配置项即可，但是请注意也有某些内容只针对RabbitMQ适用）

## Maven依赖

```xml
<dependencies>
    ...
    <!-- 该依赖的绑定器实现为RabbitMQ -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-cloud-starter-stream-rabbit</artifactId>
    </dependency>
    ...
</dependencies>
```

## 基础配置

生产者和消费者都要对RabbitMQ或者kafka服务器地址、账密进行配置，例：

```
# RabbitMQ服务器配置
spring:
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest
    virtual-host: /
```

> 其他更加全面的配置可以参考[官方文档](https://docs.spring.io/spring-cloud-stream/docs/3.1.3/reference/html/)，本文只对示例中涉及到的相关配置项进行了说明

## 生产者—发布消息

对于每个**被绑定的接口**（@EnableBinding），Spring Cloud Stream将生成一个实现该接口的Bean，调用其中一个Bean的@Input或@Output注解方法将返回相关的绑定通道

以下示例中的Bean在调用其 `sayHello` 方法时在输出通道上发送消息，它在注入的 `Source Bean` 上调用 `output()` 来访问目标通道并发送消息

```java
@EnableBinding(Source.class)
public class SendingBean {
    // 1. 属性注入
    // @AutoWired
    private Source source;

    // 2. 构造器注入
    @Autowired
    public SendingBean(Source source) {
        this.source = source;
    }

    public void sayHello(String payload) {
         source.output().send(MessageBuilder.withPayload(payload).build());
    }
}
```

通道方法也可以直接注入

```java
@EnableBinding(Source.class)
public class SendingBean {
    // 1. 属性注入
    // @AutoWired
    private MessageChannel output;

    // 2. 构造器注入
    @Autowired
    public SendingBean(MessageChannel output) {
        this.output = output;
    }

    public void sayHello(String payload) {
        output.send(MessageBuilder.withPayload(payload).build());
    }
}
```

如果在通道定义接口中指定了通道的名称，则应使用指定的名称而不是方法名称，如下：

```java
// 定义消息发布通道
public interface CustomSource {
    ...
    @Output("customOutput")
    MessageChannel output();
}

// 触发绑定
@EnableBinding(CustomSource.class)
public class SendingBean {
    // 1. 属性注入
    // @AutoWired
    // @Qualifier("customOutput")
    private MessageChannel output;

    // 2. 构造器注入
    @Autowired
    public SendingBean(@Qualifier("customOutput") MessageChannel output) {
        this.output = output;
    }

    public void sayHello(String payload) {
         this.output.send(MessageBuilder.withPayload(payload).build());
    }
}
```

生产者的配置：

```yml
# spring.cloud.stream.bindings.<channelName>.destination
# channelName 代表定义的通道名称
# destination 代表通道所绑定中间件的目标名称（RabbitMQ中目标为交换机，Kafka中目标为主题）
spring:
  cloud:
    stream:
      bindings:
        output:
          # 这里指定 output 通道绑定到RabbitMQ的 testExchange 交换机上
          destination: testExchange

# 本文中并未对spring.cloud.stream.bindings.<channelName>.consumer.prefix
```

> 注意，如果没有在配置中指定通道所绑定中间件的目标名称，默认会使用通道名称作为所绑定中间件的目标名称

以RabbitMQ为例，如果没有上述配置，因为 `Sink.INPUT ≠ Source.OUTPUT` ，所以上例会分别创建以 `Sink.INPUT` 和 `Source.OUTPUT` 值为名的两个交换机，消费者监听消息的交换机和生产者发布消息的交换机不一致，导致消费者无法接收到消息，有两种解决办法：

1. 在配置中指定两个通道所绑定中间件的目标名称为同一个，即让Stream中的通道绑定到同一个交换机上，推荐
2. 让 `Sink.INPUT = Source.OUTPUT` ，这种方式增加了生产者和消费者之间的耦合性，不推荐

## 消费者—订阅消费消息

当使用提供的Sink接口时，消费者如下：

```java
@Slf4j
// 触发绑定，绑定通道
@EnableBinding(Sink.class)
public class TestConsumer {
    // 监听消息通道
    @StreamListener(Sink.INPUT)
    public void consumer(Message<String> message) {
        // do somethings ...
        log.info("接收到了消息：" + message.getPayload());
    }
    
}
```

配置文件如下：

```yml
# spring.cloud.stream.bindings.<channelName>.destination
# channelName 代表定义的通道名称
# destination 代表通道所绑定中间件的目标名称（RabbitMQ中目标为交换机，Kafka中目标为主题）
spring:
  cloud:
    stream:
      bindings:
        input:
          # 这里指定 input 通道绑定到RabbitMQ的 testExchange 交换机上
          destination: testExchange
```

> 消费者的 destination 可以配置多个将其绑定到多个目标，以逗号分割

## 消费者组

使用消费者组非常简单，不需要更改业务代码，只需要为消费者增加如下配置即可：

```yml
# 为当前实例指定消费者组，对于一条消息，同一个消费者组中只会有一个实例接收到该消息并进行消费，并实现了负载均衡
spring.cloud.stream.bindings.<channelName>.group=testGroup
```

Stream中消费者组的概念和Kafka中消费者组的概念类似并受到启发，所以中间件为Kafka时就对应其消费者组概念，但在RabbitMQ中消费者组对应的则是消息队列，并且会持久化队列

> 默认情况下，当未指定组名时，Spring Cloud Stream 会为该实例分配一个匿名独立的单个成员消费者组，在RabbitMQ中该组（也就是队列）会自动删除，即不会持久化

## 消息分区

> 开启消息分区的消费者必须指定其消费者组，否则会报错，因为不指定消费者组时默认为其创建单个成员的消费者组，此时开启消息分区无意义

消息分区功能使用也比较简单，在需要进行分区的消费者配置中增加如下配置：

生产者

```yml
# 分区键SpEL表达式
spring.cloud.stream.bindings.<channelName>.producer.partitionKeyExpression=headers['partitionKey']
# 开启消息分区的实例数量
spring.cloud.stream.bindings.<channelName>.producer.partitionCount=2
```

消费者1

```yml
# 开启消息分区
spring.cloud.stream.bindings.input.consumer.partitioned=true
# 开启消息分区的实例数量
spring.cloud.stream.instanceCount=2
# 当前实例下标/索引号，从0开始
spring.cloud.stream.instanceIndex=0
```

消费者2

```yml
# 开启消息分区
spring.cloud.stream.bindings.input.consumer.partitioned=true
# 开启消息分区的实例数量
spring.cloud.stream.instanceCount=2
# 当前实例下标/索引号，从0开始
spring.cloud.stream.instanceIndex=1
```

更改生产者即发送者的代码，将特定的消息发送给特定的实例进行处理，使用上例生产者中的分区键表达式时生产者可以这样写：

```java
/**
 * 生产者
 */
@Slf4j
@EnableBinding(Source.class)
public class TestProducer {
    // 自动注入消息通道Bean
    @AutoWired
    private Source source;

    public void send(String message) {
        // 获取消息发布通道
        MessageChannel output = source.output();
        // 向分区中下标/索引为1的实例发送消息
        source.output().send(MessageBuilder.withPayload(message).setHeader("partitionKey", 1).build());
        // 向分区中下标/索引为0的实例发送消息
        source.output().send(MessageBuilder.withPayload(message).setHeader("partitionKey", 0).build());
    }
}
```

消息分区的原理是这样的，我们可以将这些需要收集特定消息的服务实例放到一个数组 `partition` 中，每个实例在这个数组中都有自己的实例下标 `index` ，也就是索引号，通过 `partition[index]` 即可找到这个实例，如果某个消息发布者要求消息被指定的服务实例接受，可以规定 `partitionKeyExpression` ， `partitionKeyExpression` 是一个SpEL表达式，它根据消息发布者发布的消息进行匹配提取分区键 `partitionKey` ，然后根据分区键计算对应消息消费者实例的索引号，默认的计算公式是 `key.hashCode() % partitionCount` ，获得了消费者实力索引号，我们就能够找到指定的实例并将消息交给它，这样就实现了将消息发送给指定的实例消费的功能

> 如果Spel表达式不能满足需求，是可以通过实现接口进行自定义的，根据匹配结果计算索引号的计算公式也可以进行自定义，如需要可以参考[消息分区](https://www.springcloud.cc/spring-cloud-dalston.html#_partitioning)

## 条件消费

### 自动内容类型处理

相比较其他消息传递注解， `@StreamListener` 添加了内容类型管理和类型强制转化功能，用于通过绑定通道进行数据转换，并且在这种情况下，将应用到使用了 `@StreamListener` 注解的方法。以下是处理消息体为Vote类型的应用程序的示例：

```java
@EnableBinding(Sink.class)
public class VoteHandler {

  @Autowired
  VotingService votingService;

  // 支持直接将消息体根据类型反序列化为对应类型对象
  @StreamListener(Sink.INPUT)
  public void handle(Vote vote) {
    votingService.record(vote);
    // do other things...
  }
}
```

与其他Spring消息传递方法一样，方法参数可以用@Payload，@Headers和@Header注解

```java
@StreamListener(value = Sink.INPUT)
public void handle(@Payload Vote vote, @Headers Map headers, @Header(name = "name") Object name) {
    log.info(headers.get("contentType").toString());
    log.info("name : {}", name.toString());
    log.info("Received from {} channel vote: {}", Sink.INPUT, vote.toString());
}
```

对于有返回数据或者说需要继续生产消息的方法，必须使用 `@SendTo` 注解来指定方法返回的数据的输出绑定目的地：

```java
@EnableBinding(Processor.class)
public class TransformProcessor {

  @Autowired
  VotingService votingService;

  @StreamListener(Processor.INPUT)
  @SendTo(Processor.OUTPUT)
  public VoteResult handle(Vote vote) {
    return votingService.record(vote);
  }
}
```

### 将消息分派到多个方法

通过注解的 `condition` 属性中的SpEL表达式指定分派条件后，程序会对每个消息进行评估，匹配的所有处理方法将在同一个线程中被调用，使用 `@StreamListener` 将消息分派到多个方法的的示例如下。在此示例中，带有标题type值为foo的所有消息将被分派到 `receiveFoo` 方法，所有带有标题type值为bar的消息将被分派到 `receiveBar` 方法

```java
@EnableBinding(Sink.class)
public class TestPojoWithAnnotatedArguments {

    @StreamListener(target = Sink.INPUT, condition = "headers['type']=='foo'")
    public void receiveFoo(@Payload FooPojo fooPojo) {
       // handle the message
    }

    @StreamListener(target = Sink.INPUT, condition = "headers['type']=='bar'")
    public void receiveBar(@Payload BarPojo barPojo) {
       // handle the message
    }
}
```

## 延时消息

有时候我们希望一个消息不是立即被发送而是延迟n时间之后再被发出，比如订单超时未支付处理等

> 注意，这里我们介绍的是通过RabbitMQ延时插件实现延时消息的方式，也就是说实现方式依赖于RabbitMQ

为RabbitMQ安装好延时插件（新增了一种类型为 delayed 的交换机）之后，在消息生产者的配置文件中增加如下配置：

```yml
// 开启消息延迟功能，可以看到配置项由rabbit前缀进行修饰
spring.cloud.stream.rabbit.bindings.<channelName>.producer.delayed-exchange=true
```

生产者发送消息时指定延时时间：

```java
@EnableBinding(Source.class)
public class SendingBean {
    @AutoWired
    private Source source;

    public Boolean sayHello(String payload) {
        // 获取消息投递通道
        MessageChannel output = testOutput.output();
        // 发送延时消息并返回发送结果
        return output.send(MessageBuilder.withPayload(payload).setHeader("x-delay", 5000).build());
    }
}
```

## 消费失败处理

在消息系统中，可能因为网络异常、数据库操作异常、第三方接口调用异常以及程序本身BUG等原因致使消息消费失败，针对消息消费失败的情况，Stream提供了一系列解决方案，下面逐一对其进行介绍

### 自动重试

由于 Spring Cloud Stream 本身就集成了 Spring Retry 项目，所以默认就有失败重试机制，默认的重试次数为3次，若需要调整重试的次数和间隔时间可以通过以下配置实现：

```yml
# 最大重试次数，默认值为3，设置为1代表不重试
spring.cloud.stream.bindings.<channelName>.consumer.max-attempts=3
# 首次重试时间间隔，默认为1000ms即1s
spring.cloud.stream.bindings.<channelName>.consumer.back-off-initial-interval=1000
# 相邻两次重试之间的间隔时间倍数，默认为2，即第二次重试与第一次重试时间间隔为首次重试时间间隔的2倍，第三次与第二次又是前者的2倍
spring.cloud.stream.bindings.<channelName>.consumer.back-off-multiplier=2
# 重试的最大时间间隔，默认为10000ms即10s
spring.cloud.stream.bindings.<channelName>.consumer.back-off-max-interval=10000
```

### 局部异常处理

局部异常处理就是针对某一个通道进行处理，需要定义一个处理方法，并在该方法上添加 `@ServiceActivator` 注解，并指定注解的 `inputChannel` 属性为需要进行异常处理的通道，格式为 `{destination}.errors` ，举例如下：

```java
@Slf4j
@EnableBinding(Sink.class)
public class TestConsumer {

    @StreamListener(Sink.INPUT)
    public void consumer(Message<String> message) {
        // do somethings ...
        log.info("接收到的消息：" + message.getPayload() + "，time = " + System.currentTimeMillis());
        throw new RuntimeException("消息消费失败");
    }

    // 局部异常处理
    @ServiceActivator(inputChannel = "testExchange.errors")
    public void error(Message<?> message) {
        log.info("消息消费失败触发局部异常处理");
    }

}
```

### 全局异常处理

全局异常处理可以对所有通道发生的异常做出统一处理，所有通道发生的异常都会被封装为ErrorMessage对象并被放到一个专门收集异常消息的通道中，这个通道就是 `errorChannel` ，所以使用 `@StreamListener` 监听异常消息通道就可以实现全局异常处理：

```java
@Slf4j
@EnableBinding(Sink.class)
public class TestConsumer {

    @StreamListener(Sink.INPUT)
    public void consumer(Message<String> message) {
        // do somethings ...
        log.info("接收到的消息：" + message.getPayload() + "，time = " + System.currentTimeMillis());
        throw new RuntimeException("消息消费失败");
    }

    // 全局异常处理
    @StreamListener("errorChannel")
    public void error(ErrorMessage errorMessage) {
        log.error("发生异常. errorMessage = {}", errorMessage);
    }
}
```

在发生错误的时候，虽然负载均衡策略是局部handler，会将错误交给n个错误处理实例中的1个进行处理，但是所有错误都会桥接到全局handler上，即发生异常时，如果同时定义了全局异常处理和局部异常处理，那么两个都会执行一遍

解决办法：

1. 升级spring cloud stream 版本（>=3.1.0）
2. 用原生mq写
3. 查看github issues里的操作

### 死信队列

> 本小节的内容也仅适用于消息中间件为RabbitMQ时，可以看到所有配置项前都有rabbit进行限定，更多配置参考[官方文档](https://docs.spring.io/spring-cloud-stream-binder-rabbit/docs/3.1.3/reference/html/spring-cloud-stream-binder-rabbit.html#_rabbitmq_consumer_propertiess)

使用死信队列（DLQ）进行异常处理也是比较常用的方式之一，当消息消费失败时会被发布到死信队列，我们可以很方便地通过RabbitMQ提供的Web控制台查看死信队列中的信息并根据具体原因做出针对性的处理

开启死信队列的配置项如下：

```yml
# 是否自动声明死信队列（DLQ）并将其绑定到死信交换机（DLX），默认是false
spring.cloud.stream.rabbit.bindings.<channelName>.consumer.auto-bind-dlq=true
```

有些消息可能具有时效性，为了避免消息进入死信队列后堆积，可以设置消息过期时间如下：

```yml
# 消息过期时间，单位ms，默认无限制
spring.cloud.stream.rabbit.bindings.<channelName>.consumer.dlq-ttl=1000000
```

如果想要看到消息进死信队列的具体原因，开启如下配置：

```yml
# 当为true时，死信队列接收到的消息的headers会增加异常信息和堆栈跟踪，默认false
spring.cloud.stream.rabbit.bindings.<channelName>.consumer.republish-toDlq=false
```

如果想重新消费进入死信队列的消息，可以使用RabbitMQ的方式进行消费：

```java
@Slf4j
@EnableBinding(Sink.class)
public class TestConsumer {

    @StreamListener(Sink.INPUT)
    public void consumer(Message<String> message) {
        // do somethings ...
        log.info("接收到的消息：" + message.getPayload() + "，time = " + System.currentTimeMillis());
        throw new RuntimeException("消息消费失败");
    }

    /**
    * 再次消费死信队列中的消息
    *
    * concurrency  开启几个线程去处理数据
    */
    @RabbitListener(
            bindings = @QueueBinding(
                    value = @Queue("testExchange.dlq")
                    , exchange = @Exchange("DLX")
                    , key = "testExchange"
            ),
            concurrency = "1-5"
    )
    public void handleDlq(Message failedMessage) throws InterruptedException {
        Thread.sleep(10);
        // do somethings ...
        log.info("重新消费死信队列中的消息，消息内容: {}，", failedMessage);
        log.info("消息体: {}", new String( (byte[])failedMessage.getPayload()));
    }
}
```
