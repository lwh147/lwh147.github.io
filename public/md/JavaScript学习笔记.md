# 正则表达式

## 修饰符

|修饰符|	含义|
|--|--|
|i|ignore - 不区分大小写
|g|global - 全局匹配

## 基本字符匹配规则

|字符|描述|
|--|--|
|[ABC]|匹配A或B或C|
|[A-Z]|匹配字符A或B或C或... 或Z|
|.|匹配除换行符（\n、\r）之外的任何单个字符，要匹配 . 使用转义字符 \\.|
|\d|匹配数字0-9|
|\s|匹配所有空白符，包括换行|
|\S|匹配所有非空白符，包括换行|
|\w|匹配字母、数字、下划线，等价于 [A-Za-z0-9_ ]|
|\t|匹配制表符|
|\r|匹配回车符|
|\n|匹配换行符|

## 特殊字符

|特别字符	|描述|
|--|--|
|$|匹配输入字符串的结尾位置。如果设置了 RegExp 对象的 Multiline 属性，则 \$ 也匹配 '\n' 或 '\r'。要匹配 $ 字符本身，请使用 \\\$
|( )|标记一个子表达式的开始和结束位置。子表达式可以获取供以后使用。要匹配这些字符，请使用 '\\(' 和 '\\)' 。
|* |匹配前面的子表达式零次或多次。要匹配 * 字符，请使用 \\*。
|+|匹配前面的子表达式一次或多次。要匹配 + 字符，请使用 \\+。
|.|匹配除换行符 \n 之外的任何单字符。要匹配 . ，请使用 \\. 。
|[|标记一个中括号表达式的开始。要匹配 [ ，请使用 \\[。
|?|匹配前面的子表达式零次或一次，或指明一个非贪婪限定符。要匹配 ? 字符，请使用 \\?。
|\ |将下一个字符标记为或特殊字符、或原义字符、或向后引用、或八进制转义符。例如， 'n' 匹配字符'n'。'\\n' 匹配换行符。序列 '\\\\' 匹配 '\\'，而 '\\(' 则匹配 '('。
|^|匹配输入字符串的开始位置，除非在方括号表达式中使用，当该符号在方括号表达式中使用时，表示不接受该方括号表达式中的字符集合。要匹配 ^ 字符本身，请使用 \\^。
|{|标记限定符表达式的开始。要匹配 {，请使用 \{。
|\||指明两项之间的一个选择。要匹配 \|，请使用 \\\|。

## 限定符

|字符	|描述
|--|--|
|{n}|	n 是一个非负整数。匹配确定的 n 次。例如，'o{2}' 不能匹配 'Bob' 中的 'o'，不能匹配 'Booob'，但是能匹配 'food' 中的两个 o。
|{n, }| n 是一个非负整数，至少匹配n 次。
|{n, m}| m 和 n 均为非负整数，其中 n <= m，最少匹配 n 次且最多匹配 m 次。

## 使用示例

去除字符串中的所有空格

```javascript
str.replace(/\s/g, '')
```

去除左右空格

```javascript
str.replace(/(^\s*)|(\s*$)/g, '')
```

# 快速修改对象属性名

有些时候我们会碰到后端数据对象中的属性名和前端不对应的问题，这时候我们可以通过以下步骤解决：

1. JSON.stringify()把对象转成json字符串；

2. 使用正则的replace()方法替换属性名；

3. JSON.parse()把json字符串转成对象。

当要修改多个属性名时，多次调用replace方法，可以链式调用

> 谨慎使用，有可能会把值的部分内容替换掉

# 常用数字操作

```javascript
// 1.只保留整数部分（丢弃小数部分）
parseInt(5.1234) // 5
// 2.向下取整（<= 该数值的最大整数）和parseInt()一样
Math.floor(5.1234) // 5
// 3.向上取整（有小数，整数就+1）
Math.ceil(5.1234)

// 4.四舍五入（小数部分）
Math.round(5.1234) // 5
Math.round(5.6789) // 6
// 5.绝对值
Math.abs(-1) // 1
// 6.返回两者中的较大值
Math.max(1, 2) // 2
// 7.返回两者中的较小值
Math.min(1, 2) // 1
// 8.随机数（0-1）
Math.random()
// 9.进行四舍五入并设置要保留的小数位数，toFixed返回的是字符串，如果需要number，调用parseFloat
parseFloat((1.01 + 0.1).toFixed(2)) // 1.01
```

# 常用数组操作

```javascript
// 消息字符反转
this.message.split("").reverse().join("")

// 给数组添加数据
// 1.push方法，向数组的末尾添加数据
arr.push('a', 'b')
console.log(arr) // a,b
// 2.unshift方法，向数组的开头添加数据
arr.unshift('1')
console.log(arr) // 1,a,b

// 删除数组数据
// 1.pop方法，删除数组末尾的一个数据
arr.pop()
console.log(arr) // 1,a
// 2.shift方法，删除数组开头的一个数据
arr.shift()
console.log(arr) // a

// 更改数组数据
// splice方法的第一个参数是要删除或添加元素的位置，第二个参数是要删除元素的个数，第三个及以后的参数是要添加的元素。
// 该方法会改变原数组
arr.splice(0, 1, 'a', 'b', 'c')
console.log(arr) // a,b,c

// 数组的查询提取
// slice方法的第一个参数是提取元素的开头下标(包含)，第二个参数是提取元素的结尾下标(不包含)
// 注意的是slice方法只是提取数据，并不会改变原数组。
var arr1 = arr.slice(0, 2)
console.log(arr1) // a,b
console.log(arr) // a,b,c
```

# Cookie、SessionStorage操作

```javascript
/**
 * 设置或者删除cookie
 *
 * ----------Cookie属性项说明----------
 * NAME=VALUE    键值对，可以设置要保存的 Key/Value，注意这里的 NAME 不能和其他属性项的名字一样
 * Expires        过期时间，在设置的某个时间点(ms)后该 Cookie 就会失效（不指定该属性值或者属性值
 *              小于0时，cookie生命周期为会话周期；指定为0时，cookie无效，代表立即删除该cookie）
 * Domain        生成该 Cookie 的域名，如 domain="www.baidu.com"
 * Path            该 Cookie 是在当前的哪个路径下生成的，如 path=/wp-admin/
 * Secure        如果设置了这个属性，那么只会在 SSH 连接时才会回传该 Cookie
 *
 * @param key
 * @param value
 * @param exhours 过期时间，单位ms
 */
function setCookie(key, value, exhours) {
    if (!key || !value || !exhours) {
        throw new Error('all arguments are required !')
    }
    let exp = new Date();
    exp.setTime(exp.getTime() + exhours)
    //设置cookie
    document.cookie = key + "=" + value + "; expires=" + exp.toUTCString() + '; path=/'
}

/**
 * 获取 cookie
 * @param key
 * @returns {string|null}
 */
function getCookie(key) {
    if (!key) {
        throw new Error('argument "key" is required !')
    }
    let arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)")
    if (!document.cookie) {
        return null
    }
    arr = document.cookie.match(reg)
    return arr ? unescape(arr[2]) : null
}

/**
 * 将键值对信息存入session
 * @param obj 要存储的数据对象
 */
function saveData2Ses(obj) {
    if (!obj) {
        throw new Error('argument "obj" is required !')
    }
    // 遍历kv对象属性
    Object.keys(obj).forEach(key => {
        // 将键值对存入sessionStorage
        let value = obj[key]
        if (value instanceof Object) {
            // 值如果是对象则需要序列化之后存储
            window.sessionStorage.setItem(key, JSON.stringify(value))
        } else {
            // 其他类型直接存储
            window.sessionStorage.setItem(key, value)
        }
    })
}

/**
 * 删除cookie
 * @param key
 * @return
 **/
function deleteCookie(key) {
    if (!key) {
        throw new Error('argument "key" is required !')
    }
    let exp = new Date()
    document.cookie = key + "=; " + exp.toUTCString()
}
```

# 常用时间操作

```javascript
/**
 * 将时间戳转换为常用日期格式
 * @param timestamp 时间戳，单位ms，长度为13位
 * @return {string} yyyy:mm:dd hh:mm:ss格式化的日期
 **/
function timestampToTime(timestamp) {
    if (!timestamp) {
        throw new Error('argument "timestamp" is required !')
    }
    let date = new Date(parseInt(timestamp))
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = date.getDate() + ' '
    let h = date.getHours() + ':'
    let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
    let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
    return Y + M + D + h + m + s
}

/**
 * 判断给定的时间是昨天、今天、明天、还是后天
 * @param datetime 日期时间或日期
 * @return {number} 0今天、1明天、2后天、-1昨天、-2其他
 */
function isTodayOrOther(datetime) {
    if (!datetime) {
        throw new Error('argument "datetime" is required !')
    }
    // 获取今天零时的时间戳
    let today0 = new Date(new Date().toLocaleDateString()).getTime()
    // 获取datetime的时间戳
    let timestamp = new Date(datetime).getTime()
    // 计算datetime距今天零时的天数
    const oneDayMs = 1000 * 24 * 60 * 60
    let result = (timestamp - today0) / oneDayMs
    if (result >= -1) {
        if (result < 0) {
            return -1
        } else if (result < 1) {
            return 0
        } else if (result < 2) {
            return 1
        } else if (result < 3) {
            return 2
        } else {
            return -2
        }
    }
    return -2
}

/**
 * 将给定的时间戳转换为当天的xx小时:xx分:xx秒
 * @param datetime 日期时间
 * @return {string}
 */
function datetimeToTimeOfTheDay(datetime) {
    if (!datetime) {
        throw new Error('argument "datetime" is required !')
    }
    let date = new Date(datetime);
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getMilliseconds()
}

/**
 * 将给定的时间戳转换为星期几
 * @param datetime 日期时间或日期
 * @return {string}
 */
function getWeek(datetime) {
    if (!datetime) {
        throw new Error('argument "datetime" is required !')
    }
    let day = new Date(datetime)
    let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return week[day.getDay()]
}
```

# 字符串操作

```javascript
/**
 * 将字符串中所有字母小写化
 **/
function camelCase(str) {
    if (!str) {
        throw new Error('argument "str" is required !')
    }
    return str
        .replace(/^[_.\- ]+/, '')
        .toLowerCase()
        .replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase())
}

/**
 * 根据参数名paramName获取浏览器地址的参数值，失败返回null
 * @param paramName 参数名
 * @return {string|null}
 */
function getUrlParam(paramName) {
    if (!paramName) {
        throw new Error('argument "paramName" is required !')
    }
    //构造一个含有目标参数的正则表达式对象
    let reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)")
    //匹配目标参数
    let r = window.location.search.substr(1).match(reg)
    //对参数进行解码并返回
    return r != null ? decodeURIComponent(r[2]) : null
}
```

# 对象处理

```javascript
/**
 * 提取对象数组中每个对象的指定属性值(一个或多个)，只能提取对象的顶层属性值，不能深入提取属性的属性值
 * @param arr
 * @param keys 要提取的属性名称数组
 * @return {Array} 新的数组，数组元素为拥有所有要提取属性的一个对象
 */
function extractPropsFromObjArray(arr, keys) {
    if (!arr || !keys) {
        throw new Error('all arguments are required !')
    }
    if (keys instanceof Array) {
        let colDatas = [];
        arr.forEach(obj => {
            let colData = {}
            // 遍历要提取的属性数组提取值
            keys.forEach(key => {
                // 判断对象是否有该属性，不包括原型属性
                if (obj.hasOwnProperty(key)) {
                    colData[key] = obj[key]
                } else {
                    throw new Error('Array element object has no property named "' + key + '" !')
                }
            })
            colDatas.push(colData)
        })
        return colDatas
    } else {
        throw new Error('argument "keys" must be instance of Array !')
    }
}

/**
 * 提取对象数组中每个对象的指定属性值(一个或多个)为特定值的对象，只能提取对象的顶层属性值，不能深入提取属性的属性值
 * @param arr
 * @param props 对象，给定属性和值
 * @return {Array} 新的数组，数组元素为拥有所有指定属性且属性值与所给值相等的一个对象
 */
function extractObjFromObjArrayByProps(arr, props) {
    if (!arr || !props) {
        throw new Error('all arguments are required !')
    }
    if (props instanceof Object) {
        let newObjs = []
        arr.forEach(obj => {
            let keysOfProps = Object.keys(props)
            for (let key of keysOfProps) {
                if (obj[key] !== props[key]) {
                    return
                }
            }
            // 1. Object.assign()
            // newObjs.push(Object.assign({}, obj))
            // 2. 使用展开运算符
            newObjs.push({
                ...obj
            })
        })
        return newObjs
    } else {
        throw new Error('argument "props" must be an instance of Object !')
    }
}
```

# 常见问题

**1. Promise对象执行了 .then 又执行了 .catch**

Promise会自动捕获内部异常， `then` 函数中如果有异常代码，Promise就会自动捕获，这样就会造成不仅执行了 `then` 函数又执行了 `catch` 函数的现象，也就是说 `catch` 不仅对Promise对象的异步操作内容本身的异常进行捕获，也会捕获 `resolve` 或 `rejected` 或 `then` 回调函数中的错误
