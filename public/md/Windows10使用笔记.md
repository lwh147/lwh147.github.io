# Windows 10 安装

微软官方教程（制作U盘安装介质）：https://www.microsoft.com/zh-cn/software-download/windows10/

可以自己搜索KMS工具进行破解，或者在淘宝上10块钱（左右）买个Key

# 好用的软件推荐

## 系统清理优化

[Geek Uninstaller](https://geekuninstaller.com/)：极简的软件卸载工具（几MB的一个exe程序），支持卸载完成后清除注册表内容，也支持卸载 Windows Store Apps

[Dism++](https://www.chuyu.me/zh-Hans/)：强大的 Windows
系统优化工具，最好用的就是它把用户使用、调整频率较高的选项集合到了一起，让我们可以使用它快速地完成电脑的自定义设置和优化，而不需要一层层地打开在不同位置的设置选项（又是注册表又是组策略啊等）逐个调整，极大地方便了我们的操作（比如彻底禁用小娜、关闭Windows
Defender、自定义右键菜单等等优化点）

[Wise Registry Cleaner](https://www.wisecleaner.com.cn/wise-registry-cleaner.html)：注册表清理和整理软件

## 系统防护

[火绒安全](https://www.huorong.cn/)：界面简洁无广告，功能全面，安全工具中的垃圾清理、启动项管理和右键菜单管理功能非常不错，鉴于 Windows Defender 偶尔抽风狂占CPU但又不想裸奔，推荐使用火绒代之

## 硬件相关

[鲁大师](https://www.ludashi.com/)：娱乐大师，在硬件的检测和识别方面相比较其它软件还是不错的（甚至在缺少驱动程序的情况下也能准确识别硬件型号），在驱动管理方面，比驱动精灵、驱动人生什么的好，小白使用还是比较推荐的，最后没事也可以跑跑分娱乐娱乐

[AIDA64](https://getintopc.com/softwares/aida64-engineer-extreme-6-10-5200-download/)：比较专业的硬件检测和评测工具，这里提供的下载链接国内访问速度较慢，需要梯子

[MSI Afterburner](https://cn.msi.com/Landing/afterburner/graphics-cards)：微星提供的免费显卡超频软件，除此之外还提供游戏内硬件信息监控和显示以及高质量视频录制等功能

## 其它

[GifCam](http://blog.bahraniapps.com/gifcam/#download)：简单小巧的GIF录制工具，国内访问较慢

[draw.io](https://github.com/jgraph/drawio-desktop/releases/)：一款免费开源的绘图工具，拥有大量免费素材和模板，在免费程序里算是相当不错的，由于它本身就是个在线工具，所以也可以直接在线使用：https://www.draw.io/

[v2rayN](https://github.com/2dust/v2rayN/releases)：梯子，使用方法[在这里](https://www.sky350.com/374.html)，获取免费节点关键词【v2rayN免费节点每天更新】

[DevToys](https://www.microsoft.com/zh-hk/p/devtoys/9pgcv4v3bk4w?activetab=pivot:overviewtab)：是一个适用于开发人员的工具箱, 可以用它处理与开发相关的一些任务比如 格式化 JSON、JWT 解码、图片压缩、字符串处理， 哈希生成器等等

# 网站推荐

## 软件下载

[MSDN](https://msdn.itellyou.cn/)：提供系统镜像和各种办公、设计工具软件的下载

[吾爱破解](https://www.52pojie.cn/)：顾名思义

[Get Into PC](https://getintopc.com/)：与上面的一样，国内访问较慢

[LDTools](https://ldtstore.com.cn/ldtools/)：本文提到的大部分工具软件都可以在这里找到并下载，整合了许多工具软件的下载地址

## 壁纸下载

[Wallhaven](https://wallhaven.cc/)：非常好的壁纸网站

## 程序开发相关

[Ubuntu Pastebin](https://paste.ubuntu.com/)：用于短期分享自己的代码或其它文本信息，带有代码高亮功能

[阿里巴巴矢量图标库](https://www.iconfont.cn/search/index?q=corn&page=3)：国内功能很强大且图标内容很丰富的矢量图标库，提供矢量图标下载、在线存储、格式转换等功能，阿里巴巴体验团队倾力打造，设计和前端开发的便捷工具

# 驱动管理

## N/A驱动残留文件清理

如果使用的是N卡，可以参考[这篇文章](https://www.chiphell.com/thread-1011795-1-1.html)对驱动残留文件进行清除，简单清理的话可以删除 `C:\Program Files\NVIDIA Corporation\Installer2` 文件夹中的内容

如果使用的是A卡，可以删除 `C:\AMD` 文件夹，这里存放的都是AMD软件的安装临时文件

## 禁止Win10自动更新驱动

在桌面的【此电脑】上【右键】点击【属性】，在打开的设置窗口中找到【高级系统设置】并打开

![禁止自动更新驱动1](https://img2022.cnblogs.com/blog/2330281/202202/2330281-20220224230504495-264762734.png)

搜索并打开【组策略】管理器

![禁止自动更新驱动2](https://img2022.cnblogs.com/blog/2330281/202202/2330281-20220224230513530-1494871479.png)

## 手动更新驱动程序

不需要下载各种软件，Win10提供了自动更新驱动程序的途径，搜索打开【设备管理器】，按如下步骤更新驱动程序

![驱动更新](https://img2022.cnblogs.com/blog/2330281/202202/2330281-20220224230652486-515173847.png)

# 更改用户名

参考：[Win10如何更改C:\Users\下的用户名](https://blog.csdn.net/wls666/article/details/103334152?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-7.channel_param&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-7.channel_param)

# 通过修改hosts文件访问Github

打开[IP查询网站](https://www.ipaddress.com/)查询下列四个地址的IP地址：

```text
# 主站点
github.com
# 网页资源站点，头像等
assets-cnd.github.com
# 安全认证站点
gibhut.global.ssl.Fastly.net
# 仓库代码源文件站点
raw.githubusercontent.com
```

> 如果遇到隶属于Github的其它域名的网站打不开，也可以按照此方法查询域名的IP地址后配置到hosts文件当中试试

用记事本打开hosts文件，位于 `C:\Windows\System32\drivers\etc\hosts` ，添加如下内容：

```text
# GitHub Start
140.82.114.4	github.com
185.199.110.153	assets-cnd.github.com
199.232.69.194	gibhut.global.ssl.Fastly.net
185.199.110.133	raw.githubusercontent.com
# GitHub End
```

> 上面的所有IP地址需要改为你自己查询到的IP地址

如果提示没有权限，在hosts文件上【右键】->【属性】->【安全】，找到并选择【Users】点击【编辑】，在【完全控制】权限后**打上对勾**，【应用】->【确定】

![更改权限](https://img2020.cnblogs.com/blog/2330281/202109/2330281-20210915102303752-910226131.gif)

如果提示文件只读，在hosts文件上【右键】->【属性】，**取消选中**【只读】，【应用】->【确定】

![只读](https://img2020.cnblogs.com/blog/2330281/202109/2330281-20210915102322686-304002150.gif)

打开命令行，执行 `ipconfig /flushdns` 命令刷新DNS缓存

打开浏览器试试

> 通过修改hosts文件这种方式访问不稳定，有时候很快，有时候很慢

# 批处理文件编写

## 关闭命令回显

```bat
@                    # 关闭单行回显
@echo off            # 从本行开始关闭回显，本命令不会回显，因为加了@
@echo on             # 从下一行开始打开回显，本命令不会回显，因为加了@
echo off             # 从下一行开始关闭回显，本命令会回显
echo on              # 从下一行开始打开回显，本命令会回显
echo.                # 输出一个"回车换行"，一般就是指空白行，本命令会回显
```

上述命令虽然关闭了命令回显但是命令的执行结果还是会显示，如果还要隐藏命令的执行结果，可以使用输出重定向，例如： `ping localhost > nul`

## 暂停执行

执行 `pause` 命令时，批处理文件将暂停运行并显示：请按任意键继续 . . .

## 按任意键退出

```bat
@echo off
echo 按任意键退出...
pause > nul
exit
```

# 问题总结

## Win10任务栏BUG，鼠标悬停效果离开任务栏后依旧存在

打开任务管理器，找到并选中【Windows资源管理器】，点击右下角重新启动

## 删除文件时提示文件不存在

参考：[电脑删除时提示文件不存在该怎么办？](https://www.jb51.net/diannaojichu/323838.html)

## 桌面应用图标变白框

参考：[win10软件应用白框图标处理, 恢复](https://blog.csdn.net/wh583114708/article/details/80677500?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-3.channel_param&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-3.channel_param)
