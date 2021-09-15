# 控制器参数绑定规则

所有的请求参数都会被放到一个map中，以参数名称作为key，参数值作为value
请求体中的内容只有在需要的时候才会读取

## 不加任何注解

此时控制器参数的值都会从请求参数（请求的 `params` 属性值）中进行匹配和绑定，不会考虑请求体

### Java基础包装类型

对于类型是**Java基础包装类型**（Integer、String、Long等）的控制器参数，默认会将控制器参数名称作为key去map中查找，如果找到了，会将value强制转换为控制器参数对应的类型，转换成功则绑定成功，转换失败则报类型转换异常；如果没有找到则不会绑定，也不会报错，只是在控制器中对应的参数值为 `null`

### Java原始数据类型

对于类型是**Java原始数据类型**（int、long等）的控制器参数，如果没有找到匹配参数，由于框架在没有找到与控制器参数匹配的请求参数时默认行为是将控制器参数初始化为 `null` ，而原始数据类型不能初始化为 `null` ，所以会报错，所以推荐使用包装类型作为控制器参数

### 自定义Java Bean

对于类型是**自定义Java Bean**的控制器参数，框架会将请求参数与控制器参数对象的属性进行绑定，就是依次将控制器参数的属性名作为key去map中查找，将匹配的参数值绑定到该对象的属性值上，相当于把这个对象的所有属性写在了控制器参数列表上

对于类型是其他Java内置对象类型（Map、List等）的控制器参数，框架会按照Java Bean绑定规则进行处理，此时没有任何意义，不推荐使用也不会使用这种方式

> 特别的，对于请求参数中有多个同名参数的情况，框架只会尝试将找到的第一个名称匹配的请求参数与控制器参数进行绑定，如果类型不匹配则会报错而不会继续查找下一个名称匹配的参数

> 如果想要得到所有同名参数的值，只能使用数组类型（[]）的参数进行绑定（List等集合类型不行），例如请求参数为： `name = 1，name = 2` ，那么对应的控制器参数类型应该为 `String[] name` 或 `int[] name` ，需要注意的是所有同名请求参数的参数值都必须能转换为数组的元素类型才能绑定成功，如果将上例中第二个name参数值改为 `l2ajj` ，此时控制器参数类型声明如果使用 `int[] name` 就会报错，因为字符串 `12ajj` 不能转换为整型，此时只能使用 `String[] name` 接收参数

## `@RequestParam` 注解

`@RequestParam` 注解的源码如下：

```java
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequestParam {
    // 指定该控制器参数对应的请求参数名称
    @AliasFor("name")
    String value() default "";
    // 指定该控制器参数对应的请求参数名称
    @AliasFor("value")
    String name() default "";

    // 指定该参数是否必须，默认为必须
    boolean required() default true;

    // 指定该参数的默认值
    String defaultValue() default "\n\t\t\n\t\t\n\ue000\ue001\ue002\n\t\t\t\t\n";
}
```

`required` 和 `defaultValue` 字段的作用比较容易理解，这里不再过多赘述

特别的，在指定了 `name` 或 `value` （他俩的作用是一样的）后，框架不会对控制器参数的类型进行判断，而是简单的先根据指定名称去找请求参数，找到了直接转换为控制器参数类型，转换失败则报错，如果没找到也报错（因为加了注解之后默认是必须的，除非指定required=false），不会出现将请求参数值绑定到控制器参数对象属性中的情况

## `@RequestBody` 注解

`@RequestBody` 注解源码如下：

```java
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequestBody {
    boolean required() default true;
}
```

使用 `@RequestBody` 注解的情况比较简单，该注解在控制器的参数列表中只能出现一次（因为Servlet中设计的RequestBody只能被读取一次），作用是将请求体中的数据对象解析为被 `@RequestBody` 注解的参数类型，Spring的Web框架中默认采用JSON作为请求和响应体的数据类型，所以处理逻辑的伪代码大致如下：

```java
// 示例控制器
public String testAction(@RequestBody TestClass obj){
    // ...
    return "Hellow, World!";
}

// 处理逻辑
String jsonStr = request.getRequestBody();
// Spring默认采用JSON工具类的是Jackson
ObjectMapper mapper = new ObjectMapper();
obj = mapper.readValue(jsonStr, TestClass.class);
```

所以使用RequestBody传数据的时候需要注意所传输的JSON是否能够被反序列化为控制器参数类型，否则就会出错

## 路径参数

使用 `@PathVariable` 注解进行路径参数绑定，比较简单，注解源码如下：

```java
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface PathVariable {
    @AliasFor("name")
    String value() default "";

    @AliasFor("value")
    String name() default "";

    boolean required() default true;
}
```

## 混合使用

以上四种类型的控制器参数可以以任意组合情况出现，但是需要注意的是被 `@RequestBody` 注解的参数至多只能有一个，每种形式都会按照对应的规则去进行绑定

# 扫描包路径的配置

我们都知道需要被 Spring 管理的类必须带有 `@Component` 或 `@Service` 或 `@Controller` 或 `@Configuration` 或 `@Repository` 注解，这样就产生了一个问题，Spring 怎么定位这些打了注解的类？如果说 Spring 默认将整个项目都扫描一遍去寻找需要管理的类，是不是效率有些低？

SpringBoot 默认的扫描基础包路径是**启动类所在包及其子包**，但是实际开发过程中，各个项目现在基本都采用 maven 多模块的形式，并且还需要引入一些公司自己的基础依赖框架，这可能就会出现部分打了注解需要被 Spring 扫描并进行管理的类所在的包不在启动类所在包下，导致默认配置下这些类扫描不到不能被加载的问题

这时候就需要开发者手动对需要被扫描到的包路径进行配置了，可以在启动类上的 `@SpringBootApplication` 注解中使用 scanBasePackages 属性指定： `@SpringBootApplication(scanBasePackages = {"basePackage1, basePackage2, ... "})` ，因为 scanBasePackages 属性接收的是字符串数组，所以可以配置多个扫描基础包路径

除此之外，也可以使用 `@ComponentScan` 注解的 basePackages 属性指定，用法和 @SpringBootApplication 注解一致（还有@ComponentScans注解，顾名思义）

# 日期时间处理

> 最好在数据库连接后加上参数 `serverTimezone=Asia/Shanghai` 指定数据库时区

## 使用Jackson

**单独使用Jackson时默认将Date类型格式化为时间戳输出**，但是在SpringBoot中，默认配置环境下对Jackson的默认时间格式化格式进行了覆盖：

* 序列化：默认使用 `yyyy-MM-dd'T'HH: MM:ss. SSSZ`（ISO-8601格式）

* 反序列化：支持 `yyyy-MM-dd'T'HH:mm:ss. SSSZ` 和 `yyyy-MM-dd`

效果如下：

```text
// SpringBoot中Jackson的默认格式化格式
{
    ...

    "updateTime": "2021-08-18T02:40:35.126+0000"

    ...
}
// 直接调用updateTime的toString输出
updateTime = Wed Aug 18 10:40:35 GMT+08:00 2021
```

> 如果只指定格式化格式，由于采用的时区不一致，Json中Date比Date对象早了8个小时，这样日期时间由后端传到前端的时候会早8个小时

解决方案：

1. 在yml中进行配置，重新指定Jackson的日期时间格式序列化格式和时区

```yml
spring:
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss # 默认是yyyy-MM-dd'T'HH: MM:ss. SSSZ
    time-zone: GMT+8
```

2. 在POJO类属性上添加注解

```java
@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") // 反序列化 只限定前台入参格式
@JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss") // 序列化和反序列化时都采用这个格式
private Date modifyDate;
```

第一种方式是全局配置，即前后端所有交互数据中的日期时间格式都必须为配置的格式，这样虽然得到了高度统一，但是在灵活性上有所缺失，例如某些字段只需要记录到日期即可，并不需要后面详细的时间，但是如果采用全局配置的方式，在前端往后端传输日期时，也必须加上时间

**第二种方式比较推荐**，它相比全局写死日期时间格式的方式更加灵活一些，就是麻烦一点

此外，针对第一种配置方式，由于在进行其它序列化方式配置时（如配置Long序列化为String）需要对类 `WebMvcConfigurationSupport` （继承并重写，已废弃）或 接口 `WebMvcConfigurer` （实现接口，推荐）中的 `extendMessageConverters` 方法进行重写或添加自定义实现，会覆盖 `@EnableAutoConfiguration` 关于 WebMvcAutoConfiguration 的配置，配置文件中关于jackson的时间格式化配置将会失效，所以在使用第一种方式时需要注意项目是否还通过以上方式进行了其它序列化方式的配置，如果有那么推荐统一在 `extendMessageConverters` 方法中进行配置

> 请求参数中的日期分隔符不能使用 `-` 而必须使用 `/` ，如果日期分隔符为 `-` 会在url编码和解码的过程中出现问题，请求体中没有此限制

## 使用Fastjson

尽管SpringBoot默认的序列化和反序列化工具是Jackson，但也可以进行配置使用Fastjson

```java
@Configuration
public class HttpMessageConverterConfig {

    @Bean
    public HttpMessageConverters fastJsonHttpMessageConverters() {
        FastJsonHttpMessageConverter fastConverter = new FastJsonHttpMessageConverter();
        FastJsonConfig fastJsonConfig = new FastJsonConfig();
        fastJsonConfig.setSerializerFeatures(SerializerFeature.PrettyFormat);
        fastConverter.setFastJsonConfig(fastJsonConfig);
        HttpMessageConverter<?> converter = fastConverter;
        return new HttpMessageConverters(converter);
    }
}
```

同样的，关于日期时间格式化格式的规定也有两种方式

1. 直接在上述配置类中进行配置

2. POJO类里面Date类型的属性上要加注解（注意和Jackson区分）

```java
@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") // 反序列化 只限定前台入参格式
@JSONField(timezone = "GMT+8", format="yyyy-MM-dd HH:mm:ss") // 注意是JSONField
private Date samplingTime;
```

> Fastjson 1.1.26 版本存在Date类型转换的bug，避免使用该版本

# 打包部署

## 单模块项目打包

单模块项目结构比较简单，由于只有一个pom文件，所以打包方式必须是 jar（推荐） 或者 war

war包是JavaWeb程序打的包，war包里面包括写的代码编译成的class文件、依赖的包、配置文件、所有的网站页面（包括html，jsp等等），一个war包可以理解为是一个web项目，里面是项目的所有东西

与war包不同的是，jar包不仅用于压缩和发布，而且还用于部署和封装库、组件和插件程序，并可被像编译器和 JVM 这样的工具直接使用，在 JAR 中包含特殊的文件，如 manifests 和 部署描述符，用来指示工具如何处理特定的 jar，可以将这些jar包引入到你的项目中，可以直接使用这些jar包中的类和属性，这些jar包一般放在lib目录下

> 模块的默认打包方式为jar

因为SpringBoot内置了tomcat，不同于普通web程序，拥有servlet运行环境，所以可以直接打包后通过 `java -jar packaged.jar` 运行

> 若打成war包基于tomcat进行部署，则需要排除SpringBoot内置tomcat并且添加servlet-api依赖

打包操作也比较简单，直接双击maven可视化工具中的package打包即可

## 多模块项目打包

首先要了解maven多模块项目的一些知识，然后要清楚不同的pom文件的打包方式，主要分为两种：

* pom文件所属module没有代码，只是用来集中管理子模块中依赖版本信息的，打包方式应为pom

* pom文件所属module有代码，打包方式应为jar（不能采用 war 方式打包，因为多模块项目各个模块都会被其他模块所依赖，这正是 jar 包区分于 war 包的特点）

在启动类所在模块的pom文件中添加以下内容

```xml
<build>
    <!-- 可以指定最终打包生成的文件名称 -->
    <finalName>test</finalName>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <!-- 指定Main Class为程序指定启动类做为全局的唯一入口 -->
                <mainClass>你的主启动类全路径</mainClass>
                <layout>ZIP</layout>
            </configuration>
            <executions>
                <execution>
                    <goals>
                    	<!--把依赖的包都打包到生成的Jar包中-->
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

参考：[SpringBoot+Maven多模块项目（创建、依赖、打包可执行jar包部署测试）完整流程](https://blog.csdn.net/baidu_41885330/article/details/81875395?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.control)

# `@Autowired` 和 `@Resource` 的区别

正常情况下我想大家应该只见过或者只使用过@Autowired注解，但是不知道大家有没有发现使用@Autowired注解总是会有警告提示，这对于强迫症的我来说非常难受，所以这才发现了能够替代@Autowired的注解@Resource，使用@Resource不会警告，那么他们两个到底有什么区别？

`@Autowired` 注解跟Spring强耦合，如果换成JFinal等其他框架，功能就会失效
`@Resource` 是JSR-250提供的，它是Java标准，绝大部分框架都支持

`@Autowired` 只包含一个参数： `required` ，表示是否开启自动准入，默认是true
`@Resource` 包含七个参数，其中最重要的两个参数是： `name` 和 `type` ，用来单独或同时指定需要自动装配的Bean的名称和类型

`@Autowired` 默认按照byType自动装配，找不到匹配的Bean就会报错，找到多个匹配的Bean时需要 `@Qualifier` 或者 `@Primary` 配合使用
`@Resource` 默认按照byName自动装配，找不到匹配的Bean时会按照type进行自动装配，如果按照type找不到或者找到多个匹配的Bean会直接报错

`@Autowired` 如果要使用byName，需要使用@Qualifier或者@Primary一起配合，并且只能在byType找到多个同类型Bean的条件下执行，如果byType找不到至少一个类型匹配的Bean就会直接报错而不再通过byName的方式进行装配
`@Resource` 如果指定了name，则按byName装配，找不到name匹配的就报错；如果指定了type，则按byType装配，找不到类型匹配的或者找到多个类型匹配的Bean也会直接报错；不配置时默认先byName后byType；如果同时指定了name和type则寻找name和type同时匹配的Bean进行装配

`@Autowired` 能够用在：构造器、方法、参数、成员变量和注解上
`@Resource` 能用在：类、成员变量和方法上

详细参考：[@Autowired和@Resource的区别](https://www.zhihu.com/question/39356740)

# 关于统一异常处理

## 问题描述

对于前端，服务器内的NullPointerException等异常直接返回是不合适的，需要对此类的RuntimeException进行转换，将不同的RuntimeException进行翻译之后返回前端，比如针对MethodArgumentNotValidException，可以直接告诉前端是请求参数错误；针对其它的前端不需要知道具体细节的异常可以模糊地告诉前端：系统执行出现错误，至于具体的错误原因可以通过日志进行定位分析和解决，所以需要对系统运行过程中出现的一些异常进行统一的封装处理，而统一异常处理有两种方式：

## `@RestControllerAdvice`

该方法使用比较简单

```java
/**
 * @description: 自定义全局异常处理
 * @author: lwh
 * @create: 2021/4/30 17:31
 **/
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    public static final String OTHER_EXCEPTION_PREFIX = "其他异常：";

    /**
     * 捕获自定义异常
     *
     * @param commonException
     * @return com.lwh147.rtms.backstage.common.response.CommonResponse<?>
     **/
    @ExceptionHandler(CommonException.class)
    public CommonResponse<?> handleBusinessException(CommonException commonException) {
        log.error("【全局自定义异常处理】发生自定义异常：{}", commonException.getMessage());
        commonException.printStackTrace();
        return CommonResponseUtil.failed(commonException.getCode(), commonException.getMessage());
    }

    /**
     * 保证异常都会被捕获
     */
    @ExceptionHandler(Exception.class)
    public CommonResponse<?> illegalArgumentException(Exception exception) {
        log.error("【全局自定义异常处理】发生其他异常：{}", exception.getMessage());
        exception.printStackTrace();
        return CommonResponseUtil.failed(OTHER_EXCEPTION_PREFIX + exception.getMessage());
    }
}
```

但是个人认为这不是最合适的方法，使用这种方法必须通过维护这个类来对各种异常进行处理，后期维护可能不太方便，这里不再赘述

## 实现 `HandlerExceptionResolver` 接口

首先定义一个异常转换接口IExceptionConverter，该接口有一个convert方法，通过实现该接口的convert方法实现将不同的RuntimeException转换为自定义CommonException，此写法可以针对不同的RuntimeException单独编写转换类继承该接口并实现其具体的转换操作，最后统一通过一个基于单例模式实现的异常类型转换池ExceptionConverterPoolSingleton来维护这些异常类型转换对象

对于所有的异常进行判断，如果是自定义异常类型，直接进行处理；否则根据异常类型在异常类型转换池中调用对应异常类型的转换对象的转换方法对异常类型进行转换后再做处理

如果使用者想自定义异常类型转换类，可以通过实现异常转换接口的转换方法进行实现，也就是说只需要添加新的实现类而不需要去更改原本的类

IExceptionConverter接口：

```java
/**
 * 异常转换接口，将需要的异常类型转换为CommonException
 */
public interface IExceptionConverter<T extends Exception> {

    CommonException convert(T exception);
}

```

类型转换池单例模式实现举例：

```java
/**
 * 单例模式的 异常类型转换池
 */
@Slf4j
public class ExceptionConverterPoolSingleton {

    private static final String PACKAGE_NAME = "com.lwh147";

    private HashMap<Type, IExceptionConverter> pool;

    private static ExceptionConverterPoolSingleton exceptionConverterPoolSingleton;

    private ExceptionConverterPoolSingleton() {
        this.init();
    }

    public static ExceptionConverterPoolSingleton newInstance() {
        if (exceptionConverterPoolSingleton == null) {
            synchronized (ExceptionConverterPoolSingleton.class) {
                exceptionConverterPoolSingleton = new ExceptionConverterPoolSingleton();
            }
        }
        return exceptionConverterPoolSingleton;
    }

    //容器启动后扫描指定包下（com.lwh147）的实现了IExceptionConverter接口的类，创建实例放入pool，转换时去pool中查找
    private void init() {
        pool = new HashMap<>();
        Reflections reflections = new Reflections(PACKAGE_NAME);
        Set<Class<? extends IExceptionConverter>> classes = reflections.getSubTypesOf(IExceptionConverter.class);
        for (Class<? extends IExceptionConverter> clazz : classes) {
            IExceptionConverter exceptionConverter = newInstance(clazz);
            Type type = ((ParameterizedType) clazz.getGenericInterfaces()[0]).getActualTypeArguments()[0];
            pool.put(type, exceptionConverter);
        }
    }

    private IExceptionConverter newInstance(Class<? extends IExceptionConverter> clazz) {
        try {
            Constructor[] constructors = clazz.getDeclaredConstructors();
            AccessibleObject.setAccessible(constructors, true);
            for (Constructor con : constructors) {
                if (con.isAccessible()) {
                    return (IExceptionConverter) con.newInstance();
                }
            }
            throw new RuntimeException("异常转换器无法初始化完成，无构造方法" + clazz.getTypeName());
        } catch (Exception e) {
            throw new RuntimeException("异常转换器无法初始化完成" + clazz.getTypeName(), e);
        }
    }

    public CommonException convert(Exception e) {
        IExceptionConverter converter = pool.get(e.getClass());
        if(converter != null){
            return converter.convert(e);
        }
        log.error("系统未处理的Exception:", e);
        return CommonError.SYSTEM_ERROR.toException(e);
    }
}
```

实现HandlerExceptionResolver接口并重写resolveException方法实现统一异常处理：

```java
/**
 * 统一异常处理
 */
@Slf4j
@Component
public class ExceptionResolver implements HandlerExceptionResolver {

    private ExceptionConverterPoolSingleton exceptionConverterPoolSingleton;

    public ExceptionResolver() {
        this.exceptionConverterPoolSingleton = ExceptionConverterPoolSingleton.newInstance();
    }

    @Override
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception e) {
        // 你的处理逻辑...
    }

    ...
}
```

其实大部分的工具类都可以采用这种设计模式来提高效率（如BeanCopyUtils）

## 优化

是不是可以进一步封装为只需配置的异常处理？

# RequestBody只能读取一次

## 问题描述

当出现问题时为了方便快速定位问题所在，我们会为了记录日志而编写拦截器对请求进行拦截，并对请求体信息进行打印，由于ServletRequest自身的getInputStream()和getReader()方法只能被调用一次，即ServletRequest的请求体只能被读取一次，在打印请求体的拦截器执行之后，当ServletRequest到达Controller层，读取请求体（不为空的）时就会出错

## 解决办法

为了解决上述问题，可以编写一个过滤器对原本的ServletRequest对象进行替换，替换为自定义的可重复读的ServletRequest对象

> 为什么使用过滤器而不是拦截器？
> 因为拦截器是基于AOP对访问Controller方法的请求进行拦截的，他依赖于Web框架的实现，过滤器是依赖于Servlet的，与Web框架无关，所以它可以过滤任何请求，包括访问静态资源的请求，参考：[过滤器和拦截器](https://blog.csdn.net/zxd1435513775/article/details/80556034)

在过滤过程中判断请求提是否为空，针对请求体不为空的请求，使用一个继承自HttpServletRequestWrapper的RepeatableReadingHttpServletRequestWrapper类将RequestBody保存至该类的body属性中，重写父类的getInputStream()和getReader()方法，在过滤器的过滤方法中使用改造后的RepeatableReadingHttpServletRequestWrapper替换原来的ServletRequest对象

RepeatableReadingHttpServletRequestWrapper实现举例：

```java
public class RepeatableReadingHttpServletRequestWrapper extends HttpServletRequestWrapper {
    private final String body;

    public RepeatableReadingHttpServletRequestWrapper(HttpServletRequest request) throws IOException {
        super(request);
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader bufferedReader = null;
        try {
            InputStream inputStream = request.getInputStream();
            if (inputStream != null) {
                bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                char[] charBuffer = new char[128];
                int bytesRead = -1;
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                    stringBuilder.append(charBuffer, 0, bytesRead);
                }
            } else {
                stringBuilder.append("");
            }
        } catch (IOException ex) {
            throw ex;
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException ex) {
                    throw ex;
                }
            }
        }
        body = stringBuilder.toString();
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(body.getBytes());
        ServletInputStream servletInputStream = new ServletInputStream() {

            @Override
            public boolean isFinished() {
                return false;
            }

            @Override
            public boolean isReady() {
                return false;
            }

            @Override
            public void setReadListener(ReadListener readListener) {

            }

            public int read() throws IOException {
                return byteArrayInputStream.read();
            }
        };
        return servletInputStream;
    }

    @Override
    public BufferedReader getReader() throws IOException {
        return new BufferedReader(new InputStreamReader(this.getInputStream()));
    }

    public String getBody() {
        return this.body;
    }
}
```

Filter接口实现举例：

```java
@Slf4j
public class RepeatedlyReadFilter implements Filter {
    private String excludedSuffix = "/upload";

    public RepeatedlyReadFilter() {
    }

    public RepeatedlyReadFilter(String excludedSuffix) {
        this.excludedSuffix = excludedSuffix;
    }

    @Override
    public void init(FilterConfig config) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        ServletRequest requestWrapper = null;
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        if (this.ixExcluded(httpServletRequest)) {
            chain.doFilter(request, response);
            return;
        }
        if (request instanceof HttpServletRequest) {
            requestWrapper = new RepeatableReadingHttpServletRequestWrapper(httpServletRequest);
        }
        if (null == requestWrapper) {
            chain.doFilter(request, response);
        } else {
            chain.doFilter(requestWrapper, response);
        }
    }

    private boolean ixExcluded(HttpServletRequest request) {
        if (StringUtils.isEmpty(excludedSuffix)) {
            return false;
        }
        return request.getServletPath().endsWith(excludedSuffix);
    }

    @Override
    public void destroy() {

    }

}
```

# 常见问题

## 测试

SpringBoot项目可以有多个配置文件 `application-[配置名].yml` ，可以在IDEA启动选项的 `active profiles` 选项进行指定，也可以在默认配置文件中进行指定： `spring.profiles.active: 配置名`

## 传参

请求参数params对象中的参数值为 `undefined` 时url中不会出现该参数，即该参数不会被发送

## 注解

`@Controller` 、 `@Service` 、 `@Repository` 注解应该打到实现类上，必要时指定 Bean 名称

针对 Controller 层可以将除 `@Controller` 注解外的其它注解（比如@GetMapping）打到接口类上（[点击](https://www.cnblogs.com/lwh147/p/15167380.html)查看原因）；而 Service、Repository 层注解都必须打到实现类上，因为这些 Bean 会被依赖，接口只是一个行为规范，并不能被实例化当作依赖注入，而且我们需要的是具体的实现，一个接口可能有多个实现，所以也会避免一些不必要的问题

## 其他

**A component required a bean of type 'xxx' that could not be found**

如果type不是自己创建的Bean类型：

没有对项目中某个依赖框架进行配置，即没有添加 `@Configuration` 或 `@Bean` 注解的配置Bean，例如引入JetCache框架必须要进行配置，否则会报该错误

如果type是自己创建的Bean类型：

* 检查是否添加将Bean交由Spring管理的注解，如 `@Controller`、 `@Service`、`@Component`等
* 如果不是上述原因，检查是否需要配置 `@ComponentScan` 指定扫描包但是并没有指定
* 如果没有上述两个问题，检查是否存在依赖循环

**线程安全的ServletRequest获取方式**

```java
  ((ServletRequestAttributes) (RequestContextHolder.currentRequestAttributes())).getRequest();
```

SpringBoot整合Thymeleaf项目，配置和路径等都无误但是访问视图404，检查SpringBoot版本和Thymeleaf版本是否匹配
