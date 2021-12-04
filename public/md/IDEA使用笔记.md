# 常见问题

## 突然识别不了 yml(或properties) 格式的文件

删除 `setting -> file -> types -> text` 中的 `application.yml` 即可

## 不能自动加载 yml(或properties) 配置文件

方法1： `resources` 文件夹上右键，选择 `Mark Directory As... -> Resources Root` 标记为资源根目录即可

方法2：打开 `Project Structure...` 选择 `Modules` ，选中对应maven模块的spring选项，在右边上方一排工具栏中找到绿色树叶按钮 `Customize Spring Boot...`
，点击后在弹出框中点击【加号】选中未被识别的配置文件，点击 `ok` 然后 `apply` 即可

方法3：以上两种方法都不起作用时，检查你的SpringBoot启动类类名是否匹配 `xxxApplication` 的命名规则（必须以Application结尾才能被IDEA自动识别）

> 与上面不同的是，这种情况是 IDEA 能够识别文件类型，但是没有被 Spring 自动加载为配置文件，即文件的图标没有变成 “绿色的树叶”

## Maven 模块显示灰色

使用 IDEA 搭建 Maven 多模块项目时容易出现 Maven 模块莫名其妙被忽略的问题（猜测可能是之前被删除过的模块重新创建之后就会被默认忽略），即在右侧的 Maven 工程目录中某个工程变成了灰色，导致该模块中的依赖全部报红

解决办法：

* 直接在灰色目录上`右键 -> unignore projects` 即可
* 打开 Maven 设置，在 `ignored files` 中找到被忽略项目取消选中 `apply` 即可
