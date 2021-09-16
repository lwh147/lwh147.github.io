# 好用的软件推荐



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

# 问题

## Win10任务栏BUG，鼠标悬停效果离开任务栏后依旧存在

打开任务管理器，找到并选中【Windows资源管理器】，点击右下角重新启动
