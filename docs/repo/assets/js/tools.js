/**
 * 工具类
 **/
function Tools() {
    const tools = this;

    //---------------------------------- 字符串处理 --------------------------------------//

    /**
     * 将字符串中所有字母小写化
     **/
    this.camelCase = function (str) {
        if (!str) {
            throw new Error('argument "str" is required !');
        }
        return str.replace(/^[_.\- ]+/, '')
                  .toLowerCase()
                  .replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());
    };

    /**
     * 根据参数名paramName获取浏览器地址的参数值，失败返回null
     * @param paramName 参数名
     * @return {string|null}
     */
    this.getUrlParam = function (paramName) {
        if (!paramName) {
            throw new Error('argument "paramName" is required !');
        }
        //构造一个含有目标参数的正则表达式对象
        let reg = new RegExp('(^|&)' + paramName + '=([^&]*)(&|$)');
        //匹配目标参数
        let r = window.location.search.substr(1).match(reg);
        //对参数进行解码并返回
        return r != null ? decodeURIComponent(r[2]) : null;
    };

    //---------------------------------- 日期处理 --------------------------------------//

    /**
     * 将时间戳转换为常用日期格式
     * @param timestamp 时间戳，单位ms，长度为13位
     * @return {string} yyyy:mm:dd hh:mm:ss格式化的日期
     **/
    this.timestampToTime = function (timestamp) {
        if (!timestamp) {
            throw new Error('argument "timestamp" is required !');
        }
        let date = new Date(parseInt(timestamp));
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        return Y + M + D + h + m + s;
    };

    /**
     * 判断给定的时间是昨天、今天、明天、还是后天
     * @param datetime 日期时间或日期
     * @return {number} 0今天、1明天、2后天、-1昨天、-2其他
     */
    this.isTodayOrOther = function (datetime) {
        if (!datetime) {
            throw new Error('argument "datetime" is required !');
        }
        // 获取今天零时的时间戳
        let today0 = new Date(new Date().toLocaleDateString()).getTime();
        // 获取datetime的时间戳
        let timestamp = new Date(datetime).getTime();
        // 计算datetime距今天零时的天数
        const oneDayMs = 1000 * 24 * 60 * 60;
        let result = (timestamp - today0) / oneDayMs;
        if (result >= -1) {
            if (result < 0) {
                return -1;
            } else if (result < 1) {
                return 0;
            } else if (result < 2) {
                return 1;
            } else if (result < 3) {
                return 2;
            } else {
                return -2;
            }
        }
        return -2;
    };

    /**
     * 将给定的时间戳转换为当天的xx小时:xx分:xx秒
     * @param datetime 日期时间
     * @return {string}
     */
    this.datetimeToTimeOfTheDay = function (datetime) {
        if (!datetime) {
            throw new Error('argument "datetime" is required !');
        }
        let date = new Date(datetime);
        return date.getHours() + ':' + date.getMinutes() + ':' + date.getMilliseconds();
    };

    /**
     * 将给定的时间戳转换为星期几
     * @param datetime 日期时间或日期
     * @return {string}
     */
    this.getWeek = function (datetime) {
        if (!datetime) {
            throw new Error('argument "datetime" is required !');
        }
        let day = new Date(datetime);
        let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return week[day.getDay()];
    };

    //---------------------------------- 数据存取 --------------------------------------//

    /**
     * 将键值对信息存入session
     * @param obj 要存储的数据对象
     */
    this.saveData2Ses = function (obj) {
        if (!obj) {
            throw new Error('argument "obj" is required !');
        }
        // 遍历kv对象属性
        Object.keys(obj).forEach(key => {
            // 将键值对存入sessionStorage
            let value = obj[key];
            if (value instanceof Object) {
                // 值如果是对象则需要序列化之后存储
                window.sessionStorage.setItem(key, JSON.stringify(value));
            } else {
                // 其他类型直接存储
                window.sessionStorage.setItem(key, value);
            }
        });
    };

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
    this.setCookie = function (key, value, exhours) {
        if (!key || !value || !exhours) {
            throw new Error('all arguments are required !');
        }
        let exp = new Date();
        exp.setTime(exp.getTime() + exhours);
        //设置cookie
        document.cookie = key + '=' + value + '; expires=' + exp.toUTCString() + '; path=/';
    };

    /**
     * 获取 cookie
     * @param key
     * @returns {string|null}
     */
    this.getCookie = function (key) {
        if (!key) {
            throw new Error('argument "key" is required !');
        }
        let arr, reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
        if (!document.cookie) {
            return null;
        }
        arr = document.cookie.match(reg);
        return arr ? unescape(arr[2]) : null;
    };

    /**
     * 删除cookie
     * @param key
     * @return
     **/
    this.deleteCookie = function (key) {
        if (!key) {
            throw new Error('argument "key" is required !');
        }
        let exp = new Date();
        document.cookie = key + '=; ' + exp.toUTCString();
    };

    //---------------------------------- 对象处理 --------------------------------------//

    /**
     * 提取对象数组中每个对象的指定属性值(一个或多个)，只能提取对象的顶层属性值，不能深入提取属性的属性值
     * @param arr
     * @param keys 要提取的属性名称数组
     * @return {Array} 新的数组，数组元素为拥有所有要提取属性的一个对象
     */
    this.extractPropsFromObjArray = function (arr, keys) {
        if (!arr || !keys) {
            throw new Error('all arguments are required !');
        }
        if (keys instanceof Array) {
            let colDatas = [];
            arr.forEach(obj => {
                let colData = {};
                // 遍历要提取的属性数组提取值
                keys.forEach(key => {
                    // 判断对象是否有该属性，不包括原型属性
                    if (obj.hasOwnProperty(key)) {
                        colData[key] = obj[key];
                    } else {
                        throw new Error('Array element object has no property named "' + key + '" !');
                    }
                });
                colDatas.push(colData);
            });
            return colDatas;
        } else {
            throw new Error('argument "keys" must be instance of Array !');
        }
    };

    /**
     * 提取对象数组中每个对象的指定属性值(一个或多个)为特定值的对象，只能提取对象的顶层属性值，不能深入提取属性的属性值
     * @param arr
     * @param props 对象，给定属性和值
     * @return {Array} 新的数组，数组元素为拥有所有指定属性且属性值与所给值相等的一个对象
     */
    this.extractObjFromObjArrayByProps = function (arr, props) {
        if (!arr || !props) {
            throw new Error('all arguments are required !');
        }
        if (props instanceof Object) {
            let newObjs = [];
            arr.forEach(obj => {
                let keysOfProps = Object.keys(props);
                for (let key of keysOfProps) {
                    if (obj[key] !== props[key]) {
                        return;
                    }
                }
                // 1. Object.assign()
                // newObjs.push(Object.assign({}, obj))
                // 2. 使用展开运算符
                newObjs.push({...obj});
            });
            return newObjs;
        } else {
            throw new Error('argument "props" must be an instance of Object !');
        }
    };
}

export default {
    Tools: new Tools
};