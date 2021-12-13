> [官方文档](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans)

# Spring的核心思想

## 控制反转 - IoC

> 参考：[架构师之路(39)---IoC框架](https://blog.csdn.net/wanghao72214/article/details/3969594)

### IoC理论的背景

我们都知道在C++中，程序员需要时刻注意内存管理，比如对象的析构函数（Destruction Function），对于一些通过 `new` 或者内存申请函数（malloc）创建的变量使用完后需要手动释放等，Java相比较C++的一大优势就是提供了垃圾回收器（Garbage Recycler），GC可以让Java自动释放存储空间，无需程序员做任何操作，这样可以提高项目的效率，让编程变得更加简单，使得程序员不必关心内存管理工作而将更多的精力放到业务代码的编写上

对象的生命周期一般包含创建、初始化、使用和销毁，前文中提到的GC只是让程序员跳过了对象的销毁（释放）阶段，那么能不能将对象的创建和初始化阶段也交给一个类似GC的第三方来完成？如果能，那么程序员的精力就可以完全放到业务代码的编写上，这对于生态环境较好并且本身就在业务处理方面使用广泛的Java来说绝对又是一个新的提升

### 举个例子

> 这个例子是我在一篇文章中看到的，具体的文章没有找到，之后如果找到了再补充引用

正常情况下你是如何找女朋友的？常见的情况是，你到处去看哪里有长得漂亮身材又好的mm，然后打听她们的兴趣爱好、qq号、电话号等，想办法认识她们，投其所好送其所要...，这个过程是复杂深奥的，你必须自己行动起来去参与每个环节

传统的程序开发也是如此，在一个对象中，如果要使用另外的对象，首先必须创建它（ 到处找），然后可能还需要初始化一下（检查身高、长相、兴趣爱好等），使用完之后还要将对象销毁（额，这个... 分手？），比如数据库连接Connection等

### 什么是控制反转

假如现在你没有时间自己耗费精力去寻找符合条件的女朋友，这时候就要在你和女朋友之间引入一个第三者：婚姻介绍所。婚介所管理了很多男男女女的资料，你可以向婚介提出一个列表，告诉它我想找个什么样的女朋友，比如长得像迪丽热巴、唱歌像周杰伦、速度像博尔特、技术是阿里P8级别之类的，然后婚介所就会按照你的要求，提供一个mm，接下来你只需要去和她深入交流就行了，简单明了，寻找符合条件的女朋友的整个过程不再由自己控制，而是由婚介这样一个类似容器的机构来完成

Spring所倡导的开发方式就是如此，所有交由Spring管理的Bean都会在Spring容器中登记，告诉Spring你是个什么东西，你需要什么东西，然后Spring会在系统运行到适当的时候，把你要的东西主动给你，同时也把你交给其他需要你的东西。所有的类的创建、初始化和销毁都由Spring来控制，也就是说控制对象生存周期的不再是程序员，而是Spring，Spring的本质就是一段程序，所以对象生命周期的控制权在程序员和程序之间发生了反转，称为控制反转（Inversion of Control - IoC）

## 依赖注入 - DI

有了控制反转这个好想法，自然要付诸行动去实现它

简单思考一下，要实现控制反转就是需要实现一个程序，这个程序能够自动创建和初始化需要的对象，那么我们只需要编写一个能够根据类文件自动创建对象的程序就可以了呗？

简单来说是这样的，但是我们都知道在使用面向对象方法设计的软件系统中，底层是由N多个对象组成的，所有的对象通过彼此的合作最终实现了系统的运行逻辑，在这种模式下，对象之间的依赖关系非常复杂，比如创建某一个对象时该对象又依赖其它好几个对象

所以，要实现控制反转，并不是简单的对象的创建，这个程序还需要具备处理复杂依赖关系的能力，需要在系统运行中，动态的向某个对象提供它所需要的其他它象，在Spring中这一点是通过依赖注入（Dependency Injection - DI）来实现的

比如对象 A 需要操作数据库，以前我们总是要在 A 中自己编写代码来获得一个 `connection` 对象，有了Spring我们就只需要告诉Spring，A 中需要一个 `connection` ，至于这个 `connection` 怎么构造，何时构造，A 不需要知道。在系统运行时，Spring会在适当的时候制造一个 `connection` ，然后像打针一样，注射到 A 当中，这样就完成了对各个对象之间依赖关系的处理

A 需要依赖 `connection` 才能正常运行，而这个 `connection` 是由Spring注入到 A 中的，依赖注入的名字就这么来的

那么依赖注入又是如何实现的呢？

Java 1.3 之后一个重要特征是反射（Reflection），它允许程序在运行的时候动态的生成对象、执行对象的方法、改变对象的属性，Spring其实就是通过反射来执行依赖注入最终实现控制反转的

> 其它绝大部分框架的底层实现也都会用到反射，反射也是进行框架编程所必须掌握的技术

# IoC容器和Bean简介

## IoC容器

Spring中有两种IoC容器， `BeanFactory` 与 `ApplicationContext` ，简单来说， `BeanFactory` 接口提供了IoC容器的最基本功能定义以及配置框架， `ApplicationContext` 接口是 `BeanFactory` 接口的一个子接口，它在继承了 `BeanFactory` 所有功能的基础上增加了更多企业特定的功能，所以 `ApplicationContext` 是 `BeanFactory` 的完整超集，增加的功能列表如下：

* Spring AOP支持
* 消息资源处理（用于国际化）
* 事件发布，也可以成为消息通知
* 应用层特定上下文，例如用于Web应用程序的`WebApplicationContext`

总的来说 `ApplicationContext` 的Bean生命周期囊括了 `BeanFactory` 的Bean生命周期，所以之后关于Bean生命周期的讲解，没有特殊提示，我们默认都是对 `ApplicationContext` 的Bean生命周期进行讲解

> 使用时到底选哪个？参考官方建议：[BeanFactory or ApplicationContext?](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#context-introduction-ctx-vs-beanfactory)

## Bean

在Spring中，**构成应用程序主干并由Spring IoC容器管理的对象称为Bean**，Bean是由Spring IoC容器实例化、组装和管理的对象，IoC容器中使用的**配置元数据**反映了由容器管理的Bean的信息以及它们之间的依赖关系

> **元数据——用于解释或帮助理解信息的数据**，配置元数据就是作为应用程序开发人员告知Spring IoC容器如何实例化、配置和组装应用程序中的对象所进行的一系列配置形成的配置文件

在Spring中，配置元数据传统上以简单而直观的、被大家所熟知的XML文件格式提供，之后Spring又提供了基于Java的容器配置方式（如 `@Bean` 、 `@Configuration` 等）以及基于注解的依赖配置方式（如 `@Autowired` ），甚至在Java6-8中已经将Bean的部分生命周期方法（初始化和销毁）和依赖注入相关注解写入Java了标准（ `JSR-250` 和 `JSR-330` ）

# Bean的生命周期

## Bean一生初体验

关于Bean的生命周期是什么这里不再赘述，我们开门见山，直接上流程图：

![Bean生命周期](https://img2020.cnblogs.com/blog/2330281/202109/2330281-20210924230913733-1435929627.png)

初次了解Bean生命周期的话，对于上图的内容肯定是一知半解的，所以在这个阶段我们要**不求甚解**，先了解一下，大概知道Bean从出生到销毁都经历了哪些阶段就好，至于图中调用的方法的具体意义下面将一步一步地进行分析并做出相关解释和说明

## Bean生命周期的定义层面

细心的同学可能会发现上图中的流程主要被分为了两部分：

* 以蓝色为底色的位于图中间位置的主要流程
* 分布在主要流程两侧的次要流程用流程

按主次之分的话是这样的，但是这里并不是为了强调流程的主次关系，根据Spring的官方文档来理解，在Spring中可以**从两个层面去定义Bean的生命周期**：

### Bean自身层面

从方法调用的角度上来看，Bean自身层面的生命周期中包含的都是Bean自身方法的调用流程，比如调用Bean自身构造器、Setter等

从方法作用范围的角度上来看，Bean自身层面的生命周期中调用的方法只对当前Bean生效（毕竟调用的就是Bean自身的方法），比如上面所讲到的方法都只作用于当前Bean，并不会作用于IoC容器中的其它Bean

所以**图中蓝色部分代表的是Bean自身层面的生命周期流程**，该流程中的相关配置和生命周期回调接口主要用来让开发人员针对某个单独的Bean自定义其属性或行为，具体使用方法在[自定义Bean的属性或行为](#CustomizingBean)一节讲解

其中绿色部分（包含构造器注入、属性注入、Setter注入以及PostConstruct和PreDestroy）表示该功能只需要通过配置或添加注解即可使用

白色部分（包含xxxAware、InitializingBean和DisposableBean）表示使用的时候需要Bean自身去实现这些接口

### IoC容器层面

从方法调用的角度上来看，IoC容器层面的生命周期中包含的都是实现了IoC容器级扩展接口的后处理器方法调用流程

> 容器级接口通常称为 “后处理器（PostProcessor）”

从方法作用范围的角度上来看，IoC容器层面的生命周期中调用的方法默认对容器中所有Bean生效（当然你可以自己规定过滤规则），这就是它们被称为**容器级**扩展接口的原因

这些扩展接口就像拦截器一样，它们的本质也是Spring提供的容器级Bean拦截器，但是它们不会拦截自己（即实现了后处理器的Bean是不会被后处理器处理的）

所以**图中除蓝色部之外的剩余部分代表Bean在IoC容器层面的生命周期**，该流程中相关的后处理器接口（各种PostProcessor接口）主要用来让开发人员扩展或自定义IoC容器的功能或行为，具体意义和使用方法在[IoC容器扩展接口](#IoCExtendPoints)一节讲解

图中也使用不同的颜色对不同的后处理器接口进行了区分

<div id="CustomizingBean" />

## 自定义Bean的属性或行为

### Bean自身层面的生命周期流程

这一节将按照Bean自身层面的生面周期流程（蓝色部分流程图）对Bean的一些配置方式和生命周期回调接口进行详细说明

> 建议对照流程图进行阅读

Bean自身层面的生命周期流程主要有五个重要节点：

* 【实例化】 在此阶段通过Bean的构造函数或者工厂方法实例化Bean，同时完成**构造器注入**

* 【属性填充】 在此阶段对Bean的属性进行填充，先进行**属性注入**后进行**Setter注入**

* 【初始化】 对Bean设置了所有必要的属性之后执行初始化工作

* 【使用】 在此阶段可以从容器中获取Bean对象进行使用

* 【销毁】 Bean最终被销毁（被回收）之前执行的销毁工作

比较特别的是，在初始化完成之后，Bean的生命周期会根据其作用域的不同而产生分歧：

* 当Bean的作用域为 `Singleton` 时，Bean会被放入Spring IoC容器中交由Spring管理，之后有使用到该Bean的时候只需要拿来用即可，当容器销毁时该Bean才会被销毁，在这种模式下，**当第一次创建完成Bean之后每当从Spring中获取该Bean时拿到的都是同一个对象**
* 当Bean的作用域为 `Prototype` 时，Bean在初始化完成之后就交给了调用者，Spring不再继续管理该Bean，销毁时自然也不会由Spring销毁而是交给GC，所以这种模式下，**每当从Spring容器中获取Bean时都会重新创建一个新的对象**

> Bean的作用域还有另外三种，但是不常用，这里不再赘述

### 三种注入方式（Dependency Injection）

因为日常开发过程中我们接触到的最多的部分就是有关Bean的注入方式的部分，所以这部分单独拿出来在之后的章节进行说明，详见[三种依赖注入方式](#3WaysOfInjection)

### 自定义Bean初始化逻辑（Initialization Callbacks）

在Bean设置了所有必要的属性之后，就来到了Bean的初始化阶段，如图中所示，Spring一共在初始化阶段提供了三种自定义初始化逻辑的方式：

#### `@PostConstruct`

`@PostConstruct` 是JSR250标准中规定的用来指定Bean初始化方法的注解，同时也是Spring官方最推荐的使用方式，使用方法如下：

```java
@Component
public class ExampleBean {
    @PostConstruct
    public void init() {
        // your initialization logic
    }
}
```

#### `InitializingBean`

`InitializingBean` 是一个Bean级生命周期回调接口，它也用于让用户添加自己的Bean初始化逻辑，实现 `InitializingBean` 接口的 `afterPropertiesSet()` 方法即可：

```java
@Component
public class ExampleBean implements InitializingBean {
    @Override
    public void afterPropertiesSet() {
        // your initialization logic
    }
}
```

> Spring官方并不建议使用 `InitializingBean` 接口，因为它与Spring是强耦合的，即脱离了Spring或换做其它框架就不能使用了，相反由Java标准提供的 `@PostConstruct` 的方式不与任何框架耦合，只要框架支持该注解就能正常使用，很显然Spring是支持的

#### `init-method`

配置 `init-method` 属性有两个途径，第一个途径是使用最原始的基于XML配置元数据的配置方式，通过 `<bean>` 标签的 `init-method` 属性指定：

```xml
<!-- 也可以使用容器级 `<beans>` 标签的 `default-init-method` 属性指定全局的默认Bean初始化方法名 -->
<beans default-init-method="init">
    <!-- 单独为某个bean指定的init-method优先级高于全局默认 -->
    <bean id="exampleInitBean" class="examples.ExampleBean" init-method="init"/>
</beans>
```

第二个途径是使用Spring提供的基于Java的 `@Bean` 注解， `@Bean` 是一个方法级注解，是对XML `<bean/>` 元素的直接模拟，该注解的 `initMethod` 属性指定了Bean的初始化方法：

```java
@Configuration
public class AppConfig {
    ...
    // 等同于<bean id="beanExample" class="com.example.BeanExample" init-method="init">
    @Bean(name="beanExample", initMethod = "init")
    public BeanExample getBean() {
        return new BeanExample();
    }

    ...
}

public class BeanExample {
    ...

    public void init() {
        // your initialization logic
    }

    ...
}
```

> 需要注意的是，如果 `@Bean` 注解创建的Bean的名称（默认与方法名称相同，也可以通过 `name` 属性指定）和XML配置文件中配置的Bean对象的id相同，那么Spring会优先采用XML配置文件中的作为对象管理而忽略Bean注解创建的对象，具体分析见:[Spring源码分析 为什么xml定义的bean优先于注解定义的bean ?](https://blog.csdn.net/levena/article/details/52268472)

> 关于 `@Bean` 注解的更多使用方法请参考 [Using the @Bean Annotation](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-java-bean-annotation)

以上三种初始化方法是可以同时使用的，也就是说如果为Bean配置了多个初始化方式，并且每种方式都配置了不同的方法名，那么会按照图中的顺序对各个初始化方法进行调用： `@PostConstruct` **→**`InitializingBean`**→** `init-method`

> 但是，如果为多个初始化方式配置了相同的方法名（例如为 `init-method` 属性配置的方法名为 `init()` ，且同时该方法上也加了 `@PostConstruct` 注解），则该方法只会运行一次

### 自定义Bean销毁逻辑（Destruction Callbacks）

Spring IoC容器被销毁时，Bean就进入了销毁阶段，与Bean的初始化阶段类似，也有三种方式来自定义Bean的销毁逻辑，和C++中对象的析构函数比较类似，所以Spring官方文档中也称之为 `Destruction`

#### `@PreDestroy`

`@PreDestroy` 也是JSR250标准中规定的用来指定Bean销毁（析构）方法的注解，同时也是Spring官方最推荐的使用方式，使用方法：

```java
@Component
public class ExampleBean {
    @PreDestroy
    public void destroy() {
        // your destroy logic
    }
}
```

#### `DisposableBean`

`DisposableBean` 和 `InitializingBean` 类似，也是一个Bean级生命周期回调接口，它也用于让用户添加自己的Bean销毁逻辑，实现 `DisposableBean` 接口的 `destroy()` 方法即可：

```java
@Component
public class ExampleBean implements DisposableBean {
    @Override
    public void destroy() {
        // your destroy logic
    }
}
```

> 同样的，不建议使用 `DisposableBean` 接口，推荐使用 `@PreDestroy` 注解

#### `destroy-method`

配置 `destroy-method` 属性同样也是有两个途径

XML配置文件：

```xml
<!-- 也可以使用容器级 `<beans>` 标签的 `default-destroy-method` 属性指定全局的默认Bean销毁方法名 -->
<beans default-destroy-method="destroy">
    <!-- 单独为某个bean指定的destroy-method优先级高于全局默认 -->
    <bean id="exampleInitBean" class="examples.ExampleBean" destroy-method="destroy"/>
</beans>
```

`@Bean` 注解：

```java
@Configuration
public class AppConfig {
    ...
    // 等同于<bean id="beanExample" class="com.example.BeanExample" destroy-method="destroy">
    @Bean(name="beanExample", destroyMethod = "destroy")
    public BeanExample getBean() {
        return new BeanExample();
    }

    ...
}

public class BeanExample {
    ...

    public void destroy() {
        // your destroy logic
    }

    ...
}
```

> 注意事项与初始化阶段类似，也可以配置多个，按图中顺序调用，但方法名不能相同，如果方法名相同也会只调用一次

### 其它生命周期回调接口

`BeanNameAware.setBeanName()` ：Bean级生命周期接口，实现该方法可以获取和自定义Bean名称

```java
@Component
public class ExampleBean implements BeanNameAware {
    @Override
    public void setBeanName(String s) {
        // your logic
    }
}
```

`BeanFactoryAware.setBeanFactory()` ：Bean级生命周期接口，实现该方法可以获取和自定义BeanFactory

```java
@Component
public class ExampleBean implements BeanFactoryAware {
    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        // your logic
    }
}
```

`ApplicationContextAware.setApplicationContext()` ：Bean级生命周期接口，实现该方法可以获取和自定义ApplicationContext

```java
@Component
public class ExampleBean implements ApplicationContextAware {
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        // your logic
    }
}
```

> ApplicationContextAware接口是ApplicationContext容器所独有的，所以这也是一个ApplicationContext与BeanFactory的区分点

<div id="IoCExtendPoints" />

## IoC容器扩展接口

> 参考：[【Spring杂烩】探讨Spring中Bean的生命周期](https://blog.csdn.net/SnailMann/article/details/86074599)

### IoC容器层面的生命周期流程

现在重点关注图中的非蓝色部分，可以发现图中根据接口名称将这些扩展接口分为了三类： `BeanFactoryPostProcessor` 、 `InstantiationAwareBeanPostProcessor` 、 `BeanPostProcessor`

当Bean的生命周期到达不同的节点前后，这些扩展接口就会被调用，触发调用的时机在流程图中已经比较清晰，这里不再赘述

需要注意的是，**在Bean实例化策略上**， `BeanFactory` 只有在从容器中获取Bean时（调用 `getBean` ）才会实例化Bean，即采用懒加载（lazy-init）的方式进行实现，运行时效率较低但是节约内存资源；而 `ApplicationContext` 则在容器启动的时候对所有Bean都进行实例化，使用的时候直接获取即可，运行速率较高但是比较耗费内存资源

所以 `ApplicationContext` 容器在启动后就会创建所有Bean对象，不受图中【通过 `getBean()` 调用某一个Bean】触发条件的影响，而在 `BeanFactory` 中只有【通过 `getBean()` 调用某一个Bean】之后才会创建要获取的Bean

> 使用 `ApplicationContext` 时，懒加载行为可由 `<bean/>` 元素上的 `lazy-init` 属性控制，如 `<bean ... lazy-init="true">` 配置开启懒加载；还可以通过容器级 `<beans/>` 元素上的 `default-lazy-init` 属性来控制所有Bean是否懒加载；其它配置方式暂不清楚，待补充

下面将描述这些接口的具体作用

### `BeanPostProcessor`

`BeanPostProcessor` 接口主要用来让用户提供自己的（或覆盖容器默认的）Bean**初始化前后逻辑**，如果希望在Spring容器完成Bean初始化的前后实现一些自定义处理逻辑，可以通过实现这个后处理器接口来实现，如下：

```java
@Component
public class MyBeanPostProcessor implements BeanPostProcessor {

    // Bean初始化之前执行，这里只是简单的返回了bean本身，并没有进行修改操作
    public Object postProcessBeforeInitialization(Object bean, String beanName) {
        // your logic
        return bean;
    }

    // Bean初始化之后执行，这里只是简单的返回了bean本身，并没有进行修改操作
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        // your logic
        return bean;
    }
}
```

> 后处理器接口一般不是由当前Bean去实现的，而是独立于Bean（虽然后处理器注册到容器中的形式还是Bean），即不是由业务需要的Bean去实现这些接口的，而是通常会找一个专门的Bean去实现这些接口

> 特别的， `ApplicationContext` 容器会通过反射机制自动识别定义的 `BeanFacotryPostProcessor` 、 `InstantiationAwareBeanPostProcessor` 、 `BeanPostProcessor` 等后置处理器，并自动将它们注册到应用上下文中。而 `BeanFactory` 则要在代码中手工调用 `addBeanPostProcessor()` 等方法进行注册

可以配置多个 `BeanPostProcessor` 实例，并且可以通过实现 `Ordered` 接口并设置 `order` 属性来控制这些 `BeanPostProcessor` 实例运行的顺序，有关更多细节，请参阅[BeanPostProcessor](https://docs.spring.io/spring-framework/docs/5.3.10/javadoc-api/org/springframework/beans/factory/config/BeanPostProcessor.html)和[Ordered](https://docs.spring.io/spring-framework/docs/5.3.10/javadoc-api/org/springframework/core/Ordered.html)接口的JavaDoc

`InstantiationAwareBeanPostProcessor` 是 `BeanPostProcessor` 的子接口，它继承并扩展了 `BeanPostProcessor` 接口的行为，使用它可以提供自己的（或覆盖容器默认的）Bean**实例化前后或属性填充前逻辑**

```java
@Component
public class MyInstantiationAwareBeanPostProcessor implements InstantiationAwareBeanPostProcessor {

    /**
     * 在Bean实例化之前，BeanFactoryPostProcessor之后调用，可以自定义实例化Bean，如果返回的Object不为null则会使用返回的bean对象
     **/
    @Override
    public Object postProcessBeforeInstantiation(Class<?> beanClass, String beanName) throws BeansException {
        // your logic
        return null; // 可以返回任何对象
    }

    /**
     * 实例化之后，postProcessProperties前调用，如果返回false，则不会执行postProcessProperties方法
     **/
    @Override
    public boolean postProcessAfterInstantiation(Object bean, String beanName) throws BeansException {
        // your logic
        return true;
    }

    /**
     * 属性填充前调用
     **/
    @Override
    public PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName) throws BeansException {
        // your logic
        return pvs; // 这里什么都没做
    }
}
```

除此之外，如果需要更改实际的Bean定义(即定义Bean的相关配置元数据)，需要使用 `BeanFactoryPostProcessor`

### `BeanFactoryPostProcessor`

`BeanFactoryPostProcessor` 接口称为工厂后处理器接口，在Spring容器启动之后被调用，此接口的语义与 `BeanPostProcessor` 的语义相似，但有一个主要区别：

`BeanFactoryPostProcessor` 对Bean的**配置元数据**进行操作

也就是说，Spring IoC容器允许 `BeanFactoryPostProcessor` 读取配置元数据，并在容器实例化除 `BeanFactoryPostProcessor` 实例之外的任何Bean之前更改它，**按需对某个Bean的元数据**进行修改、赋值等操作

```java
@Component
public class MyBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
    /**
     * 工厂后处理器方法，容器启动后调用，可以直接对工厂中的可配置Bean的配置元数据进行操作
     **/
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory configurableListableBeanFactory) throws BeansException {
        // your logic
    }
}
```

同样的，可以配置多个 `BeanFactoryPostProcessor` 实例，并且可以通过实现 `Ordered` 接口并设置 `order` 属性来控制这些 `BeanFactoryPostProcessor` 实例运行的顺序，有关更多细节，请参阅[BeanFactoryPostProcessor](https://docs.spring.io/spring-framework/docs/5.3.10/javadoc-api/org/springframework/beans/factory/config/BeanFactoryPostProcessor.html)接口的JavaDoc。

## 代码验证

本节的代码主要是对Bean生命周期的一些列扩展接口调用链的验证，Bean的属性填充流程验证在[这里](#BeanAutowiredCode)

新建一个 `HelloImpl` 作为一个Bean定义，实现了 `Hello` 接口， `Hello` 接口为空接口

```java
/**
 * @description: HelloBean
 * @author: lwh
 * @create: 2021/9/22 14:50
 **/
@Slf4j(topic = "Bean生命周期")
public class HelloImpl implements Hello, BeanNameAware, BeanFactoryAware, ApplicationContextAware, InitializingBean, DisposableBean {
    private final String name = "helloImpl";

    /**
     * Bean级生命周期接口BeanFactoryAware实现
     *
     * @param beanFactory
     **/
    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        log.info("BeanFactoryAware - setBeanFactory()");
    }

    /**
     * Bean级生命周期接口BeanNameAware实现
     *
     * @param s
     **/
    @Override
    public void setBeanName(String s) {
        log.info("BeanNameAware - setBeanName()");
    }

    /**
     * Bean级生命周期接口DisposableBean实现
     **/
    @Override
    public void destroy() throws Exception {
        log.info("DisposableBean - destroy()");
    }

    /**
     * Bean级生命周期接口InitializingBean实现
     **/
    @Override
    public void afterPropertiesSet() throws Exception {
        log.info("InitializingBean - afterPropertiesSet()");
    }

    /**
     * Bean级生命周期接口ApplicationContextAware实现
     **/
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        log.info("ApplicationContextAware - setApplicationContext()");
    }

    /**
     * Bean自身后初始化方法，使用@PostConstruct注解指定
     **/
    @PostConstruct
    public void postConstruct() {
        log.info("{} - postConstruct()", name);
    }

    /**
     * Bean自身前置销毁方法，使用@PreDestroy注解指定
     **/
    @PreDestroy
    public void preDestroy() {
        log.info("{} - preDestroy()", name);
    }

    /**
     * Bean自身后初始化方法，使用@Bean注解指定，与XML配置方式等价
     **/
    public void init2() {
        log.info("{} - init-method", name);
    }

    /**
     * Bean自身前置销毁方法，使用@Bean注解指定，与XML配置方式等价
     **/
    public void destroy2() {
        log.info("{} - destroy-method", name);
    }
}
```

实现工厂后处理器 `BeanFacotryPostProcessor`

```java
/**
 * @description: 工厂后处理器接口实现
 * @author: lwh
 * @create: 2021/9/22 15:18
 **/
@Component
@Slf4j(topic = "Bean生命周期")
public class MyBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
    /**
     * 工厂后处理器方法，容器启动后调用，可以直接对工厂中的可配置Bean元数据进行操作
     *
     * @param configurableListableBeanFactory
     * @return
     **/
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory configurableListableBeanFactory) throws BeansException {
        log.info("MyBeanFactoryPostProcessor - postProcessBeanFactory()");
    }
}
```

实现 `BeanPostProcessor`

```java
/**
 * @description: BeanPostProcessor 容器级后处理器接口实现
 * @author: lwh
 * @create: 2021/9/22 15:10
 **/
@Component
@Slf4j(topic = "Bean生命周期")
public class MyBeanPostProcessor implements BeanPostProcessor {
    private final String name = "helloImpl";

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if (name.equals(beanName)) {
            log.info("MyBeanPostProcessor - postProcessBeforeInitialization()");
        }
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (name.equals(beanName)) {
            log.info("MyBeanPostProcessor - postProcessAfterInitialization()");
        }
        return bean;
    }
}
```

实现 `InstantiationAwareBeanPostProcessor` 接口

```java
/**
 * @description: InstantiationAwareBeanPostProcessor 容器级后处理器接口实现
 * @author: lwh
 * @create: 2021/9/17 11:30
 **/
@Component
@Slf4j(topic = "Bean生命周期")
public class MyInstantiationAwareBeanPostProcessor implements InstantiationAwareBeanPostProcessor {
    private final String name = "helloImpl";

    /**
     * 实例化之前调用，可以自定义实例化Bean
     *
     * @param beanClass
     * @param beanName
     * @return Object 自定义实例化的Bean对象，不为null则会被使用
     **/
    @Override
    public Object postProcessBeforeInstantiation(Class<?> beanClass, String beanName) throws BeansException {
        if (name.equals(beanName)) {
            log.info("MyInstantiationAwareBeanPostProcessor - postProcessBeforeInstantiation()");
        }
        return null;
    }

    /**
     * 实例化之后，属性填充前调用
     *
     * @param bean
     * @param beanName
     * @return
     **/
    @Override
    public boolean postProcessAfterInstantiation(Object bean, String beanName) throws BeansException {
        if (name.equals(beanName)) {
            log.info("MyInstantiationAwareBeanPostProcessor - postProcessAfterInstantiation()");
        }
        return true;
    }

    /**
     * 实例化之后，属性填充前，在postProcessAfterInstantiation方法后调用
     *
     * @param pvs
     * @param bean
     * @param beanName
     * @return
     **/
    @Override
    public PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName) throws BeansException {
        if (name.equals(beanName)) {
            log.info("MyInstantiationAwareBeanPostProcessor - postProcessProperties()");
        }
        return pvs;
    }
}
```

启动类

```java
/**
 * @description: 启动类
 * @author: lwh
 * @create: 2021/9/17 10:58
 **/
@SpringBootApplication
public class AppStarter {
    public static void main(String[] args) {
        SpringApplication.run(AppStarter.class);
    }

    @Bean(name = "helloImpl", initMethod = "init2", destroyMethod = "destroy2")
    public HelloImpl test() {
        return new HelloImpl();
    }
}
```

启动运行并关闭容器后得到如下结果：

```text
2021-09-24 22:52:04.595  INFO 9456 --- [           main] Bean生命周期                                 : MyBeanFactoryPostProcessor - postProcessBeanFactory()
2021-09-24 22:52:04.838  INFO 9456 --- [           main] Bean生命周期                                 : MyInstantiationAwareBeanPostProcessor - postProcessBeforeInstantiation()
2021-09-24 22:52:04.845  INFO 9456 --- [           main] Bean生命周期                                 : MyInstantiationAwareBeanPostProcessor - postProcessAfterInstantiation()
2021-09-24 22:52:04.845  INFO 9456 --- [           main] Bean生命周期                                 : MyInstantiationAwareBeanPostProcessor - postProcessProperties()
2021-09-24 22:52:04.845  INFO 9456 --- [           main] Bean生命周期                                 : BeanNameAware - setBeanName()
2021-09-24 22:52:04.845  INFO 9456 --- [           main] Bean生命周期                                 : BeanFactoryAware - setBeanFactory()
2021-09-24 22:52:04.845  INFO 9456 --- [           main] Bean生命周期                                 : ApplicationContextAware - setApplicationContext()
2021-09-24 22:52:04.845  INFO 9456 --- [           main] Bean生命周期                                 : MyBeanPostProcessor - postProcessBeforeInitialization()
2021-09-24 22:52:04.845  INFO 9456 --- [           main] Bean生命周期                                 : helloImpl - postConstruct()
2021-09-24 22:52:04.846  INFO 9456 --- [           main] Bean生命周期                                 : InitializingBean - afterPropertiesSet()
2021-09-24 22:52:04.846  INFO 9456 --- [           main] Bean生命周期                                 : helloImpl - init-method
2021-09-24 22:52:04.846  INFO 9456 --- [           main] Bean生命周期                                 : MyBeanPostProcessor - postProcessAfterInitialization()
2021-09-24 22:52:06.703  INFO 9456 --- [extShutdownHook] Bean生命周期                                 : helloImpl - preDestroy()
2021-09-24 22:52:06.703  INFO 9456 --- [extShutdownHook] Bean生命周期                                 : DisposableBean - destroy()
2021-09-24 22:52:06.703  INFO 9456 --- [extShutdownHook] Bean生命周期                                 : helloImpl - destroy-method
```

与图中执行顺序完全一致

<div id="3WaysOfInjection" />

# 三种依赖注入方式

> 参考：[【Spring杂烩】一起探讨@Autowired属性注入, 设值注入和构造注入的注入时机](https://blog.csdn.net/SnailMann/article/details/87930143)

## 哪三种

属性注入（最常用）、构造器注入和Setter注入

## 具体过程

在Bean的生命周期的讲解过程中其实已经涉及到了这三种注入方式的具体过程

首先在Bean实例化阶段通过Bean的构造方法执行构造器注入

其次在Bean的属性填充阶段，首先使用反射完成Bean的属性注入，然后扫描Setter注入完成Bean的Setter注入

<div id="BeanAutowiredCode" />

## 代码验证

新建空的 `Hello` 接口

分别实现三个Bean： `Hello1` 、 `Hello2` 、 `Hello3` ，它们都实现了接口 `Hello`

```java
/**
 * @description: 用作属性注入的Bean
 * @author: lwh
 * @create: 2021/9/17 11:01
 **/
@Slf4j(topic = "Bean注入流程")
@Data
@Component("hello1")
public class Hello1 implements Hello {
    private String name = "hello1";

    public Hello1() {
        log.info("{} - Constructor", name);
    }
}

/**
 * @description: 用作构造器注入的Bean
 * @author: lwh
 * @create: 2021/9/17 11:05
 **/
@Slf4j(topic = "Bean注入流程")
@Data
@Component("hello2")
public class Hello2 implements Hello {
    private String name = "hello2";

    public Hello2() {
        log.info("{} - Constructor", name);
    }
}

/**
 * @description: 用作set注入的Bean
 * @author: lwh
 * @create: 2021/9/17 11:09
 **/
@Slf4j(topic = "Bean注入流程")
@Data
@Component("hello3")
public class Hello3 implements Hello {
    private String name = "hello3";

    public Hello3() {
        log.info("{} - Constructor", name);
    }
}
```

新建 `HelloTest` 类使用三种不同的注入方式进行注入

```java
/**
 * @description: 测试类
 * @author: lwh
 * @create: 2021/9/17 11:11
 **/
@Slf4j(topic = "Bean注入流程")
@Component
public class HelloTest {
    public String name = "helloTest";

    /**
     * 属性注入
     **/
    @Resource(name = "hello1")
    private Hello hello;

    /**
     * 构造器注入
     **/
    @Autowired
    public HelloTest(@Qualifier("hello2") Hello hello) {
        this.hello = hello;
        log.info("{} - Constructor - hello={}", name, this.hello.toString());
    }

    /**
     * set注入
     **/
    @Resource
    public void setHello(Hello hello3) {
        this.hello = hello3;
        log.info("{} - setHello() - hello={}", name, this.hello.toString());
    }

    /**
     * 初始化阶段
     **/
    @PostConstruct
    public void init() {
        log.info("{} - init() - hello={}", name, hello.toString());
    }

    /**
     * Bean准备好后调用
     **/
    public void getHello() {
        log.info("{} - getHello() - hello={}", name, this.hello.toString());
    }
}
```

可以选择实现 `InstantiationAwareBeanPostProcessor` 后处理器接口方便观察三种Bean注入方式的注入时机

```java
/**
 * @description: 打印Bean的生命周期
 * @author: lwh
 * @create: 2021/9/17 11:30
 **/
@Component
@Slf4j(topic = "Bean生命周期")
public class MyInstantiationAwareBeanPostProcessor implements InstantiationAwareBeanPostProcessor {

    @Override
    public Object postProcessBeforeInstantiation(Class<?> beanClass, String beanName) throws BeansException {
        if ("helloTest".equals(beanName)) {
            log.info("{} - 实例化前", beanName);
        }
        return null;
    }

    @Override
    public boolean postProcessAfterInstantiation(Object bean, String beanName) throws BeansException {
        if ("helloTest".equals(beanName)) {
            log.info("{} - 实例化后", beanName);
        }
        return true;
    }

    @Override
    public PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName) throws BeansException {
        if ("helloTest".equals(beanName)) {
            log.info("{} - 填充属性前", beanName);
        }
        return pvs;
    }

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if ("helloTest".equals(beanName)) {
            log.info("{} - 初始化前", beanName);
        }
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if ("helloTest".equals(beanName)) {
            log.info("{} - 初始化后", beanName);
        }
        return bean;
    }
}
```

启动类

```java
/**
 * @description: 启动类
 * @author: lwh
 * @create: 2021/9/17 10:58
 **/
@SpringBootApplication
@Slf4j
public class AppStarter {
    public static void main(String[] args) {
        SpringApplication.run(AppStarter.class);
    }

    @Resource
    private HelloTest helloTest;

    /**
     * 打印helloTest的最终注入结果
     **/
    @PostConstruct
    public void test() {
        helloTest.getHello();
    }
}
```

启动运行得到如下结果：

```text
2021-09-24 23:05:30.584  INFO 6260 --- [           main] Bean生命周期                                 : helloTest - 实例化前
2021-09-24 23:05:30.587  INFO 6260 --- [           main] Bean注入流程                                 : hello2 - Constructor
2021-09-24 23:05:30.588  INFO 6260 --- [           main] Bean注入流程                                 : helloTest - Constructor - hello=Hello2(name=hello2)
2021-09-24 23:05:30.589  INFO 6260 --- [           main] Bean生命周期                                 : helloTest - 实例化后
2021-09-24 23:05:30.589  INFO 6260 --- [           main] Bean生命周期                                 : helloTest - 填充属性前
2021-09-24 23:05:30.589  INFO 6260 --- [           main] Bean注入流程                                 : hello1 - Constructor  // 注意这一步表示属性注入，是通过反射直接注入的，hello1在hello3之前被创建就说明属性注入在Setter注入之前
2021-09-24 23:05:30.589  INFO 6260 --- [           main] Bean注入流程                                 : hello3 - Constructor
2021-09-24 23:05:30.589  INFO 6260 --- [           main] Bean注入流程                                 : helloTest - setHello() - hello=Hello3(name=hello3)
2021-09-24 23:05:30.589  INFO 6260 --- [           main] Bean生命周期                                 : helloTest - 初始化前
2021-09-24 23:05:30.589  INFO 6260 --- [           main] Bean注入流程                                 : helloTest - init() - hello=Hello3(name=hello3)
2021-09-24 23:05:30.589  INFO 6260 --- [           main] Bean生命周期                                 : helloTest - 初始化后
2021-09-24 23:05:30.590  INFO 6260 --- [           main] Bean注入流程                                 : helloTest - getHello() - hello=Hello3(name=hello3)
```

## `@Resource`

Spring不但支持自己定义的 `@Autowired` 注解，还支持JSR-250规范定义的 `@Resource`

`@Resource` 注解由J2EE提供，和 `@Autowired` 都可以用来装配Bean，都可以写在字段上或者是写在setter方法上，但是它们有所不同，先来介绍一下 `@Resource`

`@Resource` 默认是按照byName自动注入，有两个重要的属性， `name` 和 `type`

Spring将 `@Resource` 注解的 `name` 属性解析为Bean的名字， `type` 属性则解析为Bean的类型。所以如果指定name属性，则使用byName的自动注入策略；指定type属性则使用byType的自动注入策略；如果既不指定name也不指定type属性，这时通过反射机制根据变量名使用byName自动注入策略

使用 `@Resource` 时的具体装配规则如下：

* 如果同时指定了name和type属性，则从Spring上下文中找到唯一匹配的Bean进行装配，如果没有找到，则会抛出异常

* 如果指定了name属性，则从Spring上下文中查找名称（id）匹配的Bean进行装配，**找不到则抛出异常**，不会尝试byType装配方式

* 如果指定type属性，则从Spring上下文中找到类型匹配的唯一Bean进行装配，**找不到或者是找到多个抛出异常**，不会尝试byName装配方式

* 如果既没有指定name属性，也没有指定type属性，则默认通过反射机制根据变量名先按照byName进行装配，如果没有匹配，则回退为按照byType的方式进行装配，如果匹配则自动装配，否则报错

与 `@Autowired` 的区别：

首先， `@Autowired` 由spring提供，跟Spring强耦合，如果换成JFinal等其他框架，功能就会失效，而 `@Resource` 是JSR-250提供的，它是Java标准，绝大部分框架都支持，也就是说如果换做其他类似Spring的框架也可以使用而不需要更改代码

> 所以推荐使用 `@Resource` 注解在字段上，这个属性是属于J2EE的，可以减少对Spring的耦合，并且不会有警告（强迫症福音）

其次，在装配规则上：

* `@Autowired` 只按照byType注入
* `@Autowired` 只有一个属性 `required`，默认为 `true`，表示依赖的对象必须存在，如果要允许为空，可以设置为 `false`
* `@Autowired` 如果想使用byName的方式进行装配，必须结合 `@Qualifier` 注解进行使用
* `@Autowired` 可以打到构造器上实现构造器注入而 `@Resource` 不支持

> 详细参考：[@Autowired和@Resource的区别](https://www.zhihu.com/question/39356740)
