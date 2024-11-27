# 性能优化

如果你经常启动非常多的服务或打开非常多的工程和文件导致IDEA经常运行在 `low memory` 状态下，
可通过设置IDEA占用的最大内存（默认为2048MB）来改善，位于 `Help -> Change Memory Setting`
，建议按照500MB为梯度逐渐增加并测试是否够用（设置为2560MB的我在日常使用过程中已经没有再碰到这个问题了，所以也不需要设置得非常大）

# `@SuppressWarnings` 注解使用详解

> 参考：[@SuppressWarnings注解用法详解](https://blog.csdn.net/xiaohanzhong/article/details/80886560)

# 常见问题

**1. 突然识别不了 yml(或properties) 格式的文件**

删除 `setting -> file -> types -> text` 中的 `application.yml` 即可

**2. 不能自动加载 yml(或properties) 配置文件**

方法1： `resources` 文件夹上右键，选择 `Mark Directory As... -> Resources Root` 标记为资源根目录即可

方法2：打开 `Project Structure...` 选择 `Modules`
，选中对应maven模块的spring选项，在右边上方一排工具栏中找到绿色树叶按钮 `Customize Spring Boot...`
，点击后在弹出框中点击【加号】选中未被识别的配置文件，点击 `ok` 然后 `apply` 即可

方法3：以上两种方法都不起作用时，检查你的SpringBoot启动类类名是否匹配 `xxxApplication` 的命名规则（必须以Application结尾才能被IDEA自动识别）

> 与上面不同的是，这种情况是 IDEA 能够识别文件类型，但是没有被 Spring 自动加载为配置文件，即文件的图标没有变成 “绿色的树叶”

**3. Maven 模块显示灰色**

使用 IDEA 搭建 Maven 多模块项目时容易出现 Maven 模块莫名其妙被忽略的问题（猜测可能是之前被删除过的模块重新创建之后就会被默认忽略），即在右侧的
Maven 工程目录中某个工程变成了灰色，导致该模块中的依赖全部报红

解决办法：

* 直接在灰色目录上`右键 -> unignore projects` 即可
* 打开 Maven 设置，在 `ignored files` 中找到被忽略项目取消选中 `apply` 即可

**4. Mapper.xml中不显示数据库和字段提示**

> 参考：https://blog.csdn.net/qq_62479530/article/details/128395464

**5. Command line is too long. Shorten command line for xxx or also for Spring Boot default configuration**

> 参考：[项目启动报命令过长](https://blog.csdn.net/m0_53151031/article/details/127363499)
