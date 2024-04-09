# 常用注解使用规范

写这部分内容是因为Swagger注解有的属性设置后无效，有的属性设置后会使可读性降低（页面显示效果不好），所以在这记录一下个人认为比较简洁的设置方式

## `@Api`

**设置 tags 属性即可**，value 会被 tags 替代没卵用，tags 属性的内容会被显示到 Controller 类名前

## `@ApiOperation`

**只指定 value 属性**对接口进行简单描述即可，该属性会显示到请求路径之后，设置 tags 属性会在页面上单独将该方法显示出来，比较乱，不推荐设置

## `@ApiParam`

不需要指定 name，**指定 value 和 required 即可**，name 的作用是更改参数的显示名称，这样的话前端会将 name 的值而不是实际的参数名称当作传参时的参数名称，容易产生混淆，自找麻烦，并且 name 属性对于使用了 @RequestBody 注解的参数不起作用

## `@ApiModel`

**添加 description 属性即可**，该属性会被添加到 models 列表中 model 的 description 字段，value 作用和上述的 name 作用类似，会对 model 改名显示，容易产生混淆

## `@ApiModelProperty`

value 为属性的简单描述，example 指定该属性的示例值，required指定是否为必须，**三个属性都可以指定**

# 控制器注解的位置

Swagger是一个用来生成接口文档的工具，既然是生成接口文档，那么就不必关心业务的具体实现，平时在开发过程中也都是先定义接口，需要的时候再去创建Controller实现对应业务的接口，所以**Swagger关于控制器的注解如 `@Api` 、 `@ApiOperation` 等都可以放到 Controller 的接口文件中**

这样做的好处有：

* 接口实现类不用关心不属于业务范畴的（接口文档生成）相关操作
* 接口实现类的内容更加简洁
* 针对开放Api，Swagger的注解可以替代注释的角色，相当于写接口文档的同时又写了注释，一举两得
* 为[Controller 层实现 Feign 调用接口](https://www.cnblogs.com/lwh147/p/15167380.html)提供更好的服务
 

# 常见问题

使用Swagger时由于Swagger会默认设置 `Models` 属性的默认值为空字符串 `""` ，而在生成文档的解析过程中又只对 `null`
进行了判断而没有对空字符串进行判断，导致测试时出现许多莫名奇妙的 `java.lang. NumberFormatException: For input string: ""` 错误

解决办法:

首先排除swagger2中 `swagger-models-1.5.20` 版本的依赖

```xml
<dependency>

    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <exclusions>
        <exclusion>
            <groupId>io.swagger</groupId>
            <artifactId>swagger-models</artifactId>
        </exclusion>
    </exclusions>

</dependency>
```

然后添加 `>= 1.5.21` 版本，这些版本已解决只判断 `null` 不判断 `""` 的问题

```xml
<dependency>

    <groupId>io.swagger</groupId>
    <artifactId>swagger-models</artifactId>
    <version>1.5.21</version>

</dependency>
```
