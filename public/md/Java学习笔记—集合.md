# 继承关系

下图对Java中常用的Map类型集合继承关系进行了展示：

![Map集合简单框架](https://img-blog.csdnimg.cn/20201105111723581.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxNjc2Mjk0,size_16,color_FFFFFF,t_70#pic_center)

> 图中左上角带有“钉住”样式的框代表这是个接口

下图对Java中常用的集合继承关系进行了展示：

![Collection集合简单框架](https://img-blog.csdnimg.cn/20201105111723587.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxNjc2Mjk0,size_16,color_FFFFFF,t_70#pic_center)

> 图中左上角带有“钉住”样式的框代表这是个接口

# Collection

集合是存储对象数据的集合容器，集合比数组的优势：

* 集合可以存储任意类型的对象数据，数组只能存储同一种数据类型的数据
* 集合的长度是会发生变化的，数组的长度是固定的。
Collection是最基本的集合接口。

# List

**可以重复**，通过索引取出加入数据，**顺序与插入顺序一致**，**可以含有null元素**。
实现List接口的有Vector、ArrayList和LinkedList，至于Stack这里不再赘述，他们的优缺点整理如下：

**ArrayList**：**查询速度快**，**增删改慢**，因为是一种类似数组的形式进行存储，因此它的**随机访问速度极快**；

**Vector**：与ArrayList相同，**查询速度快**，**增删改慢**；

**LinkedList**：**增删速度快**，**查询稍慢**；

ArrayList与Vector的区别：

* 如果集合中的元素数量大于当前集合数组的长度时，Vector的增长率是目前数组长度的100%，而ArryaList增长率为目前数组长度的50%。所以，如果集合中使用数据量比较大的数据，用Vector有一定优势
* **Vector是线程同步**的而**ArrayList是线程不同步**，所以Vector线程安全，但是因为每个方法都加上了synchronized，所以Vector在效率上小于ArrayList
 

# Set

Set集合中的数据是**无序且唯一的**（与Map类似）, 实现类都**不是线程安全的类**。可以通过Set set = Collections.sysnchronizedSet(Set对象)来实现线程安全

**HashSet**：是Set接口（Set接口是继承了Collection接口的）最常用的实现类，底层使用了哈希表散列算法。他的优点是查询以及插入速度非常快，因为相当于根据数组下标直接存取。但是他适用于较少量的数据操作，因为数据量多的情况下冲突的可能性会大大增加从而大大降低其速度。因为采用了哈希算法，所以他要求所有存在于哈希表中的对象元素必须实现equals和hashCode方法来判断两个对象是否相等，规则为：

* equals比较为true
* hashCode值相同

**TreeSet**：也是Set接口的一个实现类，也拥有set接口的一般特性，但是不同的是他也实现了SortSet接口，它底层采用的是红黑树算法。
Tree最重要的就是它的两种排序方式：自然排序和客户化排序

**自然排序**：实现了Comparable接口，所以TreeSet可以调用对象的ComparableTo()方法来比较集合的大小，然后进行升序排序，这种排序方式叫做自然排序。其中实现了Comparable接口的还有BigDecimal、BigInteger、Byte、Double、Float、Integer、Long、Short（按照数字大小排序）、Character（按照Unicode值的数字大小进行排序）String（按照字符串中字符的Unicode值进行排序）类等。

**客户化排序**：其实就是实现java.util. Comparator<Type>接口提供的具体的排序方式，<Type> 是具体要比较对象的类型，他有个compare的方法，如compare(x, y)返回值大于0表示x大于y，以此类推，当我们希望按照自己的想法排序的时候可以重写compare方法。

# Map

Java的Map(映射)是一种把键对象和值对象进行映射的集合，其中**每一个元素都包含了键对象和值对象**，其中值对象也可以是Map类型的数据，因此，Map支持多级映射，**Map中的键是唯一的，但值可以不唯一**，Map集合有两种实现，一种是利用哈希表来完成的叫做HashMap，它和HashSet都是利用哈希表来完成的，区别其实就是在哈希表的每个桶中，HashSet只有key，而HashMap在每个key上挂了一个value；另一种就是TreeMap，它实现了SortMap接口，也就是使用了红黑树的数据结构，和TreeSet一样也能实现自然排序和客户化排序两种排序方式，而哈希表不提供排序。

**HashMap**：哈希表的实现原理中，先采用一个数组表示位桶，每个位桶的实现在1.8之前都是使用链表，但当每个位桶的数据较多的时候，链表查询的效率就会不高，因此在1.8之后，当位桶的数据超过阈值（8）的时候，就会采用红黑树来存储该位桶的数据（在阈值之前还是使用链表来进行存储），所以，哈希表的实现包括数组+链表+红黑树，在使用哈希表的集合中我们都认为他们的增删改查操作的时间复杂度都是O(1)的，不过常数项很大，因为哈希函数在进行计算的代价比较高, HashMap和Hashtable类似，不同之处在于**HashMap是非同步的，并且允许null，即null value和null key**。但是将HashMap视为Collection时（values()方法可返回Collection），其迭代子操作时间开销和HashMap 的容量成比例。因此，如果迭代操作的性能相当重要的话，不要将HashMap的初始化容量设得过高，或者load factor过低。

**HashTable**：Hashtable继承Map接口，实现一个key-value映射的哈希表。**任何非空（non-null）的对象都可作为key或者value，并且他是线程安全的，所以在性能上略低于HashMap**。

**LinkedHashMap**：LinkedHashMap继承于HashMap，**HashMap是无序的**，当我们希望有顺序地去存储key-value时，就需要使用LinkedHashMap了，他的存储顺序**默认为插入顺序**。LinkedHashMap其实就是可以看成HashMap的基础上，多了一个双向链表来维持顺序。他的静态内部类Entry相比HashMap多了before和after两个前后节点的指针属性，所以在插入数据时依然是按照HashMap的插入方法，并且数据的实际物理存储顺序也是随机的，但是插入时通过维护每个Entry的前后指针指向，我们就可以通过指针按照我们希望的顺序去迭代遍历数据。

## `HashMap` 和 `Hashtable` 的区别

### 命名

`HashMap` 采用标准的驼峰命名方法，而 `Hashtable` 不是

### 继承关系

`Hashtable` 继承自 `Dictonary` 抽象类，而 `HashMap` 继承自 `AbstractMap` 抽象类， `AbstractMap` 实现了 `Map` 接口

> 相同的是这两个类都实现了 `Cloneable` 和 `Serializable` 接口

> 单从这个两个实现类以及父类的命名规则上来看， `HashMap` 相比较 `Hashtable` 也更加合理不是吗？

### 线程安全

`Hashtable` 更加注重安全，在修改方法上都加了 `synchronized` 关键字，所以其修改方法都是线程安全的，但是速度较慢

`HashMap` 则更加注重速度，所以它没有任何保证线程安全的措施

### Null 存储策略

`Hashtable` 更加注重安全，所以不允许key为 `null` 或者value为 `null`

```java
// 摘自Hashtable源码，jdk1.8
public synchronized V put(K key, V value) {
    // Make sure the value is not null
    if (value == null) {
        // value为null抛出空指针异常
        throw new NullPointerException();
    }

    // Makes sure the key is not already in the hashtable.
    Entry<?,?> tab[] = table;
    // 没有对key判空便调用其hashCode()方法，若key为null会空指针
    int hash = key.hashCode();
    int index = (hash & 0x7FFFFFFF) % tab.length;

    ...
}
```

`HashMap` 则同时允许key或value为 `null` ，但是 `key==null` 的节点只会存在一个且一定被存储在下标为 `0` 的位置

```java
// 摘自HashMap源码，jdk1.8
static final int hash(Object key) {
    int h;
    // key为null时返回值都是0
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

> 因此， 使用 `HashMap` 的 `get(key)` 方法获取到的结果为 `null` 时可能有两种情况：1.map中不存在该key；2.map中存在该key但是value为 `null` ，故不能使用 `get` 方法判断key是否存在，需要使用 `containsKey` 方法

### 容量设定规则

常见的散列函数（将任意长度的输入转换为固定长度的输出的函数）有除留余数法、平方取中法、基数转换法、折叠法等等，其中除留余数法是最常用的也是比较简单的散列函数（至于其它的有兴趣可以去了解）， `Hashtable` 和 `HashMap` 均使用的是除留余数法，只不过计算过程有所区别

除留余数法是什么？其实就是取余运算，取余为什么能够作为散列函数？假设有如此取余运算： `h(x) ＝ x mod M` ，不论关键码 `x` 取值为多少，使用 `x` 对 `M` 取余得到的结果 `h(x)` 必定满足 `0 <= h(x) < M` ，这 `M` 妥妥的不就是散列表的长度吗？

# 常见问题

## `UnsupportedOperationException` 异常

```java
public class test {
  public static void main(String[] args) {

    String[] arr = new String[3];
    arr[0] = "1";
    arr[1] = "2";
    arr[2] = "3";

    // 调用Arrays中的asList方法将String[]转化为List<String>
    List<String> list = Arrays.asList(arr);

    System.out.println("list: " + list.toString());
    // 为list添加一个元素，报错
    list.add("f");
    System.out.println("list: " + list.toString());
    // 删除list中的一个元素，报错
    list.remove(2);
    System.out.println("list: " + list.toString());
  }
}
```

将 `String[]` 转化为 `List<String>` 的时候，是不能对转化出来的结果进行 `add` ， `remove` 操作的，因为它并不是我们熟悉的 `ArrayList` ，而是 `Arrays` 里面的**内部类**

先来看看 `asList` 方法的源码：

![asList](https://img2020.cnblogs.com/blog/2330281/202109/2330281-20210917095516221-1859915796.png)

再看看 `Arrays` 中的这个内部类： `ArrayList`

![Arrays内部类ArrayList](https://img2020.cnblogs.com/blog/2330281/202109/2330281-20210917094902498-499962382.png)

可以看到这个 `ArrayList` 继承了 `AbstractList` 类，但是它并没有重写 `AbstractList` 的 `add` 和 `remove` 方法，以 `add` 为例，在调用时其实就是调用的 `AbstractList` 的 `add` 方法，下面再来看看 `AbstractList` 的 `add` 方法：

![AbstractList的add方法](https://img2020.cnblogs.com/blog/2330281/202109/2330281-20210917095823769-1086905442.png)

解决办法：

```java
List<String> list = new ArrayList<String>(Arrays.asList(arr));
```
