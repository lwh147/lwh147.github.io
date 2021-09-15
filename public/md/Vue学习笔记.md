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

**vue 实例对象中的异步回调函数参数必须使用箭头函数**

箭头函数的this指向为创建时所在对象，即当前vue实例对象使用function声明的函数this指向为函数运行时上层对象，因为是异步，所以当回调函数运行时处于独立运行环境，其上层对象为window对象，即此时this指向window对象
