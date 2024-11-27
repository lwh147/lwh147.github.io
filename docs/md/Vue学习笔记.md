# 快速删除node_modules文件夹

在全局安装rimraf模块，然后通过其命令来快速删除node_modules目录

```text
npm install rimraf -g
rimraf node_modules
```

# Element-UI

对集中分布的 input 元素排列布局，可以使用 `<el-row>` 结合 `<el-col  :span="11" :offset="1">` 进行布局设置

分页组件中的 page-size 属性是指每页显示条目个数，而不是实际查询到的某页条目个数，例：

```text
:total="40"
:page-count="4"
:page-size="10"
```

如果使 page-size = "1"，则页码 page-count 会变为40

select 默认不是100%宽度的，加个 size-full 的类，宽度写成100%，在需要用100%宽度的时候给select加上即可

# 常见问题

**1. VUE实例对象中的异步回调函数参数必须使用箭头函数**

箭头函数的this指向为创建时所在对象，即当前vue实例对象使用function声明的函数this指向为函数运行时上层对象，因为是异步，所以当回调函数运行时处于独立运行环境，其上层对象为window对象，即此时this指向window对象

**2. VUE项目在IDEA中 `@` 符号无法识别**

> 参考：[VUE前端项目@符号无法识别](https://blog.csdn.net/weixin_44022996/article/details/134580063)

**3. npm install报错缺少python问题及解决**

> 参考：[npm install报错缺少python问题及解决](https://www.jb51.net/javascript/290521vgk.htm)

**4. Node Sass version 6.0.0 is incompatible with^4.0.0**

> 参考：[Node Sass version 6.0.0 is incompatible with^4.0.0](https://blog.csdn.net/qq_43610311/article/details/116736803?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-116736803-blog-127817605.pc_relevant_multi_platform_whitelistv4&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-116736803-blog-127817605.pc_relevant_multi_platform_whitelistv4&utm_relevant_index=1)

**5. Failed at the node-sass@4.13.1 postinstall script.**

> 参考：[Failed at the node-sass@4.13.1 postinstall script.](https://blog.csdn.net/qq_46199553/article/details/126265140)
