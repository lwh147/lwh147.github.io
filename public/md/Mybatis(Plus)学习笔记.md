# 传参

## 单个参数

当Mapper接口方法的参数只有一个时，需要指定sql标签的 `parameterType` 属性为该参数的类型，然后进行引用， `parameterType` 分为三种类型：

* 基本数据类型（`String`、`Integer`、`Long`等）
* JavaBean
* Map

对于基础数据类型采用 `#{参数名}` 获取参数的内容，可以使用 `@Param` 注解给参数起别名
对于JavaBean采用 `#{属性名}` 或 `#{参数名.属性名}` （由于只有一个参数，大可不必采用这种方式）获取参数内容，由于使用不到参数名，不需要起别名
对于 `Map` 则采用 `#{key}` 的方式获取，由于使用不到参数名，也不需要起别名

## 多个参数

多个参数传参时不需要指定 `parameterType` 属性（写了也没用），通常有两种方式

### 使用下标

```java
public List<XXXBean> getXXXBeanList(String xxId, String xxCode); 
```

```xml
<select id="getXXXBeanList" resultType="XXBean">
    select t.* from tableName t where id = #{0} and name = #{1}
</select>
```

使用 `#{index}` 对参数进行引用，index从0开始

### 使用 `@Param(别名)` 注解（推荐使用)

```java
public List<XXXBean> getXXXBeanList(@Param("id") String id, @Param("code") String code, @Param("bean")Bean bean);
```

```xml
<select id="getXXXBeanList" resultType="XXBean">
    select t.* from tableName t where id = #{id} and name = #{code} and type = #{bean.type}
</select>
```

# PageHelper插件使用注意事项

只有紧跟在 `PageHelper.startPage()` 方法后的第一个 Mybatis 的查询（Select）方法会被分页，并且只有从 由原始查询结果集转换而来的Page对象 中才能获取正确的 总条目数total 和 总页数pages，即不能对查询回来的结果集进行处理之后再转换为Page对象提取分页信息，应该先提取分页信息，再对数据进行处理，或者将查询结果集的拷贝拿去做处理

# Plus多了什么？

强大的 CRUD 操作：内置通用 Mapper、通用 Service，仅仅通过少量配置即可实现单表大部分 CRUD 操作，更有强大的条件构造器，满足各类使用需求，和tk.mybaits类似

支持主键自动生成：支持多达 4 种主键策略（内含分布式唯一 ID 生成器 - Sequence），可自由配置，完美解决主键问题

内置分页插件：基于 MyBatis 物理分页，开发者无需关心具体操作，配置好插件之后，写分页等同于普通 List 查询

更加强大的内置代码生成器：采用代码或者 Maven 插件可快速生成 Mapper 、 Model 、 Service 、 Controller 层代码，支持模板引擎，极大的提升了开发效率

# 自定义ID生成器（Plus）

在现代的分布式系统中，我们需要自定义id生成器以满足生成的id在整个分布式系统中的唯一性和高效性，下面对使用MyBaits-Plus进行自定义id生成器的相关步骤进行说明

使用主键注解 `@TableId` 并配置 `type = ASSIGN_ID` ，MyBaits-Plus默认使用接口 `IdentifierGenerator` 的 `nextId` 方法进行id的生成和插入，故如果要实现自己的id生成策略，则自己编写一个Spring组件并实现 `IdentifierGenerator` 接口的 `nextId` 方法即可，代码示例如下：

```java
@Component
public class MyIDGenerator implements IdentifierGenerator {
    @Override
    public Number nextId(Object entity) {
        // 你的id生成策略
    }
}
```

补充阅读：[分布式ID生成算法-雪花算法](https://www.jianshu.com/p/1af94260664a)

# 配置注意事项

映射器接口类必须打上 `@Mapper` 注解或配置 `@MapperScan`

如果在 Mapper 中有自定义方法(XML 中有自定义实现)，需要配置 `spring.mybatis(mybatis-plus).mapper-locations` ，告诉 Mapper 所对应的 XML 文件位置

`spring.mybatis(mybatis-plus).configuration.mapUnderscoreToCamelCase` 配置是否开启自动驼峰命名规则（camel case）映射，即从经典数据库列名 A_COLUMN（下划线命名） 到经典 Java 属性名 aColumn（驼峰命名） 的映射

> 这项配置在 mybatis 中默认是 `false` ，而 MyBaits-Plus 中默认是 `true`

# 分页问题

不论是PageHelper分页插件还是MyBaits-Plus内置的分页插件，其实现原理都是拦截执行的sql后自动帮你拼接上 `LIMIT` 分页条件，这样在一对多的连接查询中可能会产生如下问题：

比如现在有一个商品的基本信息表和存储商品图片、视频等的资源表，基本信息表只存储了商品的文字描述信息，属于一对多的关系，表的示意结构如下

**表1——商品基本信息表**

id|name|desc|...|
-----|-----|-----|-----|
1|商品1|好商品|...|
2|商品2|好商品|...|
3|商品3|好商品|...|

**表2——商品资源表**

id|goodId(外键，参考表1id)|type(1代表视频，2代表图片)|url|...|
-----|-----|-----|-----|-----|
1|1|1|https://test/test.mp4|...|
2|1|2|https://test/test.jpg|...|
3|2|1|https://test/test.mp4|...|
4|2|2|https://test/test.jpg|...|
5|3|2|https://test/test.jpg|...|

现在要分页查询商品信息，要求包含商品的图片和视频，此时如果使用左连接查询，sql大概是这个样子： `select * from goods t1 left join goods_resource t2 on t1.id = t2.id where ... limit 0, 10` ，假设查询第1页，页大小为10，会出现什么问题呢？

首先我们先去掉 `limit` 也去掉 `where` ，执行左连接之后的结果是这样的:

id|name|desc|...|id(1)|goodId|type|url|...|
-----|-----|-----|-----|-----|-----|-----|-----|-----|
1|商品1|好商品|...|1|1|1|https://test/test.mp4|...|
1|商品1|好商品|...|2|1|2|https://test/test.jpg|...|
2|商品2|好商品|...|3|2|1|https://test/test.mp4|...|
2|商品2|好商品|...|4|2|2|https://test/test.jpg|...|
3|商品3|好商品|...|5|3|2|https://test/test.jpg|...|

很明显得到的结果是有问题的，一个商品本应该只有一条记录，对应表中的一行，但是由于需要连表查询商品的资源信息，进行左连接之后形成的结果是由多的那个表的记录数决定的，而 `limit` 是在连表之后才执行的，所以查询的结果就出现了问题，实际意义上的一个商品却对应了多条数据

针对这种问题，需要对查询拆分分步执行，即先去商品基本信息表中进行分页查询，获取商品基本信息的集合，然后遍历查询集合分别查找（或者根据商品id批量查找）这10个商品的资源信息进行组合得到最终结果，这样就没有任何问题了

# 分步查询

针对分步查询，MyBatis也提供了支持，具体分为以下两种：

## association

`association`是MyBatis中提供的一个XML标签，它主要用来支持表关系为一对一时的子查询（分步执行的，并不是连接查询）

比如一个人和身份证之间是一对一的，如果要查询人的基本信息和身份证信息，就可以使用该标签：

```xml
<resultMap id="associationResultMap" type="com.test.db.Person">
<id column="id" jdbcType="INTEGER" property="id" />
<result column="name" jdbcType="VARCHAR" property="name" />
<result column="sex" jdbcType="VARCHAR" property="sex" />
<result column="birthday" jdbcType="DATE" property="birthday" />
<association property="idCard" column="card_id" javaType="com.test.db.IdCard">
    <id column="cid" jdbcType="INTEGER" property="id" />
    <result column="number" jdbcType="VARCHAR" property="number" />
    <result column="address" jdbcType="VARCHAR" property="address" />
    <result column="expiredTime" jdbcType="DATE" property="expiredtime" />
</association>
</resultMap>

<select id="findPersonByName" parameterType="java.lang.String" resultMap="associationResultMap">
select p.*,card.id as cid,card.number as number,card.expiredTime expiredTime from person p,id_card card where p.card_id=card.id and name=#{name,jdbcType=VARCHAR}
</select>
```

## collection

# 其它问题

## Parameter 'XXX' not found. Available parameters are [arg1, arg0, param1, param2]

在传递多个参数的时候，Mapper中需要使用 `@Param(参数别名)` 对参数进行注解，避免产生歧义，如

```java
List<User> select(@Param("uuid")String uuid, @Param("name")String name);
```

## There is no getter for property named "xxx" in class "xxx"

原因有以下两种：

* xml文件中的引用属性名与Bean中的属性名不符
*  `parameterType` 属性未指定

## 增删改操作返回的影响行数

使用sql重复进行 `UPDATE` 操作的时候，如 `UPDATE test SET cid = '5244'` 执行两次的时候发现，第二次 `UPDATE` 语句返回的影响行数为 `0` ，但是使用MyBatis的时候，结果却不是这样的，执行两次的时候，发现 `UPDATE` 返回的影响行数始终是 `1`

原因是使用MyBatis返回来的是条件匹配到的行数，所以返回的始终是 `1` ，如果想要返回受影响的行数，需要在MyBatis连接数据库的时候加上参数： `jdbc:mysql://${jdbc.host}/${jdbc.db}?useAffectedRows=true`
