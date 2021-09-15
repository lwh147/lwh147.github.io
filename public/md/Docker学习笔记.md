# Docker简介

![Docker图标](https://img-blog.csdnimg.cn/20201109085401966.png#pic_center)

其实Docker的思想比较容易理解，首先从Docker的图标可以看出，图标中一只可爱的蓝鲸上面放着一堆箱子，那么很容易就能联想到，这里的每一个箱子就相当于一个容器，在容器中我们可以放置各种各样的东西，而这些容器之间互不干扰、相互隔离

今天开发应用程序所需要的不仅仅是编写代码。在每个生命周期阶段，**工具之间的多种语言、框架、体系结构以及不连续的接口都会带来极大的复杂性**。我们时常在开发和发行环境之间产生各种各样的矛盾，出现 **“开发环境和测试环境下都运行正常啊，为什么发行的时候就出问题了？”** 等类似的问题

Docker简化并加速了工作流程，同时使开发人员可以自由选择每个项目的工具，对应用程序堆栈和部署环境进行了创新，引入了称之为**容器**的行业标准方法。**容器是软件的标准化单元，它使开发人员将应用程序与环境隔离开来**，从而解决“在我的机器上能正常工作”的问题

## 核心概念

Docker其实是基于虚拟机的思想实现了应用程序的容器化，在Docker中，每个应用程序单独运行在一个专门为其创建的运行环境下，这个运行环境非常精简、轻量化（可以理解为一个精简的操作系统，同时包含了运行目标程序所必需的文件和依赖），相当于为每个应用程序都创建了一个虚拟机，每个应用程序都运行在不同的虚拟机上，互不干扰，互相隔离，从而实现了容器化

在Docker中有三个重要的概念，分别是**镜像**（Image）、**仓库**（Repository）和**容器**（Container），下面将分别对这三个概念进行讲解

## 镜像

听到镜像我们很容易联想到安装虚拟机时需要的系统镜像文件（ISO），没错，其实Docker中的镜像（Image）和操作系统镜像是类似的，甚至可以理解为一种非常轻量化的操作系统镜像，它描述了应用程序运行的基本环境和必须的文件以及依赖

另外，也可以将镜像理解为类（Class）

## 仓库

所谓仓库，其实就是镜像文件存放的地方，其概念上和Maven仓库类似，镜像仓库里存放了非常多的别人已经制作好的各种镜像文件（就好比Maven仓库提供了各种依赖包一样）

可以使用 `docker pull` 命令将镜像仓库中的镜像拉取到本地使用，默认的仓库是Docker的官方仓库 [Docker Hub](https://hub.docker.com/)，

> 如果你对镜像的制作过程不是非常了解，那么建议使用Docker官方仓库中应用程序官方提供的镜像

由于墙的存在，有时候从Docker官方仓库拉取镜像的速度可能会非常慢，这时候可以配置一下国内加速的Docker镜像仓库地址，详见 [设置加速镜像仓库](#speedup) 一节

## 容器

容器就是镜像的运行时，一个镜像可以运行产生多个容器（类比使用同一个系统镜像文件创建了不同的虚拟机；一个类可以实例化生成多个对象）

> 需要注意的是，在Docker中，我们能够通过修改容器的相关内容，并通过对容器执行 `commit` 操作使其变为镜像（其实也可以类比笔记本厂商们制作自己的操作系统镜像）

# Docker的安装和使用

##  安装Docker

本文是基于CentOS 7.8安装的Docker

> Docker官方建议在Ubuntu中安装，因为Docker是基于Ubuntu发布的，而且一般Docker出现的问题Ubuntu是最先更新或者打补丁的。在很多版本的CentOS中是不支持更新最新的一些补丁包的

更新yum包

```text
yum update	# Ununtu中可以使用apt-get命令安装
```

安装依赖软件包

```text
yum install -y yum-utils device-mapper-persistent-data lvm2
```

配置阿里云镜像地址

```text
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

安装Docker社区版，ee版是企业版收费，ce是社区版免费

```text
yum install docker-ce
```

查看Docker版本确认是否安装成功

```text
docker -v
```

出现以下内容则安装成功：

![Docker版本](https://img-blog.csdnimg.cn/20201109093728793.png#pic_center)

##  设置加速镜像仓库

<div id="speedup"/>

如果下载缓慢或者失败时需要设置镜像

编辑Docker配置文件，如果没有文件创建即可

```text
vi /etc/docker/daemon.json
```

添加如下内容

```json
{
    "registry-mirrors": [
        "https://docker.mirrors.ustc.edu.cn",
        "https://registry.docker-cn.com"
    ]
}
```

重新加载配置文件 `systemctl daemon-reload` 并重启docker

##  Docker的启动与停止

Docker的启动与停止

```text
# systemctl命令是系统服务管理器指令
systemctl start docker	  # 启动docker
systemctl stop docker	  # 停止docker
systemctl restart docker  # 重启docker
```

查看Docker运行状态

```text
systemctl status docker
```

运行结果输出示例：

![docker运行状态](https://img-blog.csdnimg.cn/20201109094521883.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxNjc2Mjk0,size_16,color_FFFFFF,t_70#pic_center)

配置开机启动

```text
systemctl enable docker
```

##  Docker常用命令

查看Docker概要信息

```text
docker info
docker stats  # 查看docker内存及cpu占用信息
```

查看Docker帮助文档

```text
docker --help
```

镜像文件操作

```text
docker search 关键字       # 搜索镜像
docker pull 镜像名:版本    # 拉取指定版本的镜像到本地，不指定版本默认latest
docker build -t='标签' 指定目录  # 根据指定目录下的Dockerfile文件制作镜像
docker images             # 查看本地镜像
docker rmi 镜像名/镜像id   # 删除镜像
```

创建并启动容器

```text
docker run [参数列表]

-p         指定端口映射  宿主机端口:容器端口
--name     指定容器名
-d         后台运行
-v         文件目录挂载配置  宿主机文件目录:容器内文件目录
-e         指定容器启动时的参数
--restart  指定docker重启时该容器的启动策略，可设置为always
```

查看容器运行情况

```text
# 查看正在运行的容器
docker ps
# 查看所有容器
docker ps -a
```

启动/停止容器

```text
docker start 容器名称/容器id
docker stop 容器名称/容器id
```

删除容器

```text
docker rm 容器名称/容器id
```

进入容器

```text
docker exec -it [容器名称] bash
```

> 可以在 `/var/lib/docker` 目录下对 images 和 container 相关信息做出修改，需要停止 Docker

## 阅读更多

* [Docker常用命令](https://blog.csdn.net/LucasLi2016/article/details/105160478)
* [Docker官方文档](https://www.docker.com/why-docker)
* [Docker入门](https://blog.csdn.net/LucasLi2016/article/details/105157685)
* [Docker最新版19.03 详细教程](https://blog.csdn.net/qq_37242520/article/details/107041331)
 

# Gitlab简介与部署

Gitlab是一个利用 Ruby on Rails 开发的开源应用程序，实现一个自托管的Git项目仓库，可通过Web界面进行访问公开的或者私人项目。它拥有与Github类似的功能，能够浏览源代码，管理缺陷和注释。可以管理团队对仓库的访问，它非常易于浏览提交过的版本并提供一个文件历史库。它还提供一个代码片段收集功能可以轻松实现代码复用，便于日后有需要的时候进行查找。

**Gitlab是开源的**，这意味着我们可以在自己的服务器上（或者一个公司在自己的服务器上）部署自己的Gitlab，提供一个面向个人（或者公司内部）的**私密代码仓库**。

##  基于Docker部署Gitlab

由于Gitlab是一个数据库支持的Web应用，所以安装时涉及到非常多的基础软件的安装，所以这里我们选择基于Docker部署Gitlab

获取镜像

```text
# 拉取docker社区免费版镜像
docker pull gitlab/gitlab-ce
```

配置容器挂载目录（便于管理数据、日志等）

```text
mkdir -p /root/gitlab/log
mkdir -p /root/gitlab/data
mkdir -p /root/gitlab/etc
```

创建并启动容器

```text
docker run -d --name gitlab \
-p 10443:443 \
-p 10080:80 \
-p 10022:22 \
-v /root/gitlab/etc:/etc/gitlab \
-v /root/gitlab/log:/var/log/gitlab \
-v /root/gitlab/data:/var/opt/gitlab \
gitlab/gitlab-ce:latest
```

命令解读：

```text
# 注意这里，将容器中的22(ssh)端口映射到宿主机10022端口，80(容器，http) -> 10080(宿主机)，443同理
--publish 10443:443
--publish 10022:22 
--publish 10080:80
```

> 22和80，443端口映射可以自定义，注意不要与其他进程端口号冲突即可

> 如果你使用的是阿里云服务器，通过网络访问（http、ssh、https）需要去实例控制台配置Linux实例的安全组规则，开放10080端口、10020、10443端口（或者你自定义的映射端口），否则不能正常访问

至此，Gitlab的部署已经完成

## 访问Gitlab

通过网络访问： `http://宿主机ip:10080` ，本地访问地址为： `http://localhost:10080` ，首页如下：

![gitlab首页](https://img-blog.csdnimg.cn/20201109100857924.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxNjc2Mjk0,size_16,color_FFFFFF,t_70#pic_center)

Gitlab默认管理员用户名为 `root` ，密码为： `5iveL!fe`

##  Gitlab简单使用

###  创建组和用户

根据Gitlab网页导航进行相关设置即可，这里不再赘述，可以参考[Gitlab用户和组管理](https://www.cnblogs.com/zangxueyuan/p/9222014.html)

###  配置SSH免密登录

生成SSH公钥和私钥对

```text
# 默认生成路径为 ~/.ssh/id_rsa.pub
ssh-keygen -t rsa -C 'xxx@xxx.com' [-f 目标生成路径]
```

复制公钥到Gitlab中

打开 `~/.ssh/id_rsa.pub` ( `~` 表示用户目录，windows是: `C:\Users\当前用户名` ，linux是: `/home/当前用户名/` )，复制其中的内容

![生成结果](https://img-blog.csdnimg.cn/20201109104033178.png#pic_center)

打开Gitlab, 找到 `Profile Settings-->SSH Keys--->Add SSH Key` , 并把上一步中复制的内容粘贴到Key所对应的文本框，在Title对应的文本框中给这个sshkey设置一个名字，点击Add key按钮，即可完成操作

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201109104226986.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxNjc2Mjk0,size_16,color_FFFFFF,t_70#pic_center)

更多请参考：[Gitlab配置SSH连接key](https://www.cnblogs.com/hafiz/p/8146324.html)

# 基于Docker部署Mysql

## 获取镜像

```text
# 拉取mysql镜像，这里我指定版本为5.7
docker pull mysql:5.7
```

## 配置容器挂载目录

这步操作是为了便于管理数据、日志等

```text
mkdir -p /root/docker/mysql/data
mkdir -p /root/docker/mysql/logs
mkdir -p /root/docker/mysql/conf

# 在/root/docker/mysql/conf中创建 *.cnf 文件(叫什么都行)
```

## 创建并启动容器

```text
docker run -p 3306:3306 --name mysql -d \
-v /root/docker/mysql/conf:/etc/mysql/conf.d \
-v /root/docker/mysql/logs:/logs \
-v /root/docker/mysql/data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=123456 \
mysql:5.7
```

至此，mysql的部署已经完成

# 基于Docker部署Nacos

## 获取镜像

```text
# 拉取Nacos镜像
docker pull nacos/nacos-server
```

## 配置持久化（Mysql为例）

获取nacos配置数据库mysql版sql脚本，可以下载最新版本的nacos解压后在 `/conf` 目录下找到 `nacos-mysql.sql`

在mysql数据库中新建数据库 `nacos-config` 并运行上面脚本

> 处于数据库安全考虑，可以选择单独给nacos创建一个只拥有nacos-config数据库操作权限的角色

## 创建并启动容器

```text
docker run -d --name nacos -p 8848:8848 \
-e MODE=standalone \
-e JVM_XMS=384m \
-e JVM_XMX=384m \
-e JVM_XMN=128m \
-e SPRING_DATASOURCE_PLATFORM=mysql \
-e MYSQL_SERVICE_HOST=ip \
-e MYSQL_SERVICE_DB_NAME=nacos-config \
-e MYSQL_SERVICE_USER=nacos \
-e MYSQL_SERVICE_PASSWORD=123456 \
nacos/nacos-server
```

命令解读：

```text
# 设置单机启动
-e MODE=standalone \

# 由于nacos占用内存较大，所以对运行内存等参数进行配置
-e JVM_XMS=384m \
-e JVM_XMX=384m \
-e JVM_XMN=128m \

# 配置数据库连接
-e SPRING_DATASOURCE_PLATFORM=mysql \
-e MYSQL_SERVICE_HOST=mysql服务地址 \
-e MYSQL_SERVICE_DB_NAME=nacos-config \
-e MYSQL_SERVICE_USER=用户名 \
-e MYSQL_SERVICE_PASSWORD=密码 \
```

至此，nacos的部署已经完成，浏览器输入 `http://ip:8848/nacos` 即可访问，默认账号密码均为 `nacos`

更多请参考 [使用Docker部署Nacos](https://www.jianshu.com/p/8c6076f8f843)

# 基于Docker部署Redis

## 获取镜像

```text
# 拉取redis镜像
docker pull redis
```

## 配置容器挂载目录

这一步是为了便于管理数据、日志等

```text
# 在该目录下放置redis.conf配置文件
mkdir -p /root/docker/redis/conf
# 数据目录
mkdir -p /root/docker/redis/data
```

## 创建并启动容器

```text
docker run -d -p 6379:6379 \
-v /root/docker/redis/conf/redis.conf:/etc/redis/redis.conf \
-v /root/docker/redis/data:/data \
--name myredis redis \
redis-server /etc/redis/redis.conf \
--appendonly yes \
--requirepass "123456"
```

命令解读：

```text
# 指定redis配置文件
redis-server /etc/redis/redis.conf \

# 开启持久化存储
--appendonly yes \

# 配置连接密码
--requirepass "123456"
```

至此，redis的部署已经完成，可以使用redis desktop manager进行远程访问

更多请参考 [基于Docker部署Redis](https://www.cnblogs.com/cmt/p/14553189.html)

> 所有服务的端口最好都不要设置为默认端口，并且账号密码也都不要使用默认的，因为我的数据库以及Redis都被入侵过

# Dockerfile

前面所说的都是如何使用别人制作好的镜像，我们当然也可以通过Dockerfile制作自己的镜像

## 是什么？

Docker 通过从 Dockerfile 中读取指令来自动构建镜像，Dockfile 是一个包含构建指定镜像所需的所有命令的文本文件，Dockerfile 遵循特定的格式和指令集，可以在 [Dockfile参考](https://docs.docker.com/engine/reference/builder/) 中查看学习这些指令

## 怎么做？

学习指令集这种东西的最佳方式就是看例子，去学习别人写的Dockerfile，就和学习Java或其他编程语言一样，可以通过阅读大佬或一些框架的代码进行学习，这里我们以SpringBoot后端项目制作为Docker镜像为场景对Dockerfile内容进行举例（为了尽可能说明Dockerfile中的命令，给出的例子比较复杂）如下：

```dockerfile
FROM debian:stretch

ARG DEBIAN_FRONTEND=noninteractive
ARG JAVA_VERSION=8
ARG JAVA_UPDATE=172
ARG JAVA_BUILD=11
ARG JAVA_PACKAGE=jdk
ARG JAVA_HASH=a58eab1ec242421181065cdc37240b08

ENV LANG C.UTF-8
ENV JAVA_HOME=/opt/jdk
ENV PATH=${PATH}:${JAVA_HOME}/bin

RUN set -ex \
 && apt-get update \
 && apt-get -y install ca-certificates wget unzip \
 && wget -q --header "Cookie: oraclelicense=accept-securebackup-cookie" \
         -O /tmp/java.tar.gz \
         http://download.oracle.com/otn-pub/java/jdk/${JAVA_VERSION}u${JAVA_UPDATE}-b${JAVA_BUILD}/${JAVA_HASH}/${JAVA_PACKAGE}-${JAVA_VERSION}u${JAVA_UPDATE}-linux-x64.tar.gz \
 && CHECKSUM=$(wget -q -O - https://www.oracle.com/webfolder/s/digest/${JAVA_VERSION}u${JAVA_UPDATE}checksum.html | grep -E "${JAVA_PACKAGE}-${JAVA_VERSION}u${JAVA_UPDATE}-linux-x64\.tar\.gz" | grep -Eo '(sha256: )[^<]+' | cut -d: -f2 | xargs) \
 && echo "${CHECKSUM}  /tmp/java.tar.gz" > /tmp/java.tar.gz.sha256 \
 && sha256sum -c /tmp/java.tar.gz.sha256 \
 && mkdir ${JAVA_HOME} \
 && tar -xzf /tmp/java.tar.gz -C ${JAVA_HOME} --strip-components=1 \
 && wget -q --header "Cookie: oraclelicense=accept-securebackup-cookie;" \
         -O /tmp/jce_policy.zip \
         http://download.oracle.com/otn-pub/java/jce/${JAVA_VERSION}/jce_policy-${JAVA_VERSION}.zip \
 && unzip -jo -d ${JAVA_HOME}/jre/lib/security /tmp/jce_policy.zip \
 && rm -rf ${JAVA_HOME}/jar/lib/security/README.txt \
       /var/lib/apt/lists/* \
       /tmp/* \
       /root/.wget-hsts

ADD test.jar t.jar

RUN bash -c 'touch /t.jar'

ENTRYPOINT ["java", "-jar", "/t.jar"]
```

我们将打包好的test.jar和上述Dockerfile放到同一个目录下，然后执行：

```docker
docker build -t testImage:v1.0 .
```

这个命令的作用是让 Docker 执行 Dockerfile 中的指令制作镜像，其中 `-t testImage:v1.0` 表示制作的目标镜像名称为 `testImage` ，冒号后指定了镜像的 `tag` ， `tag` 可以任意命名，但是一般用来标识当前镜像的版本等重要信息

注意在命令的最后有一个表示当前目录的 `.` ，这个表示打包的上下文在当前目录

Docker根据Dockerfile和上下文构建镜像，构建的上下文可以是文件系统指定位置的PATH，也可以是Git存储仓库的URL。需要特别注意的是，构建上下文是**递归处理**的，构建过程中做的第一件事就是将整个上下文（递归地）发送给构建进程，也就是说PATH或URL下的任何文件，包括子目录中的文件都会在构建时被加载（即使你在Dockerfile中只用到了一个文件）

所以一般情况下最好将一个**空目录**作为构建的上下文，并将Dockerfile保存到此目录中，仅添加构建时需要的文件即可

> 可以通过将 `.dockerignore` 文件添加到上下文目录来排除文件和目录，类似 `.gitignore`

通常情况下，Dockerfile 位于构建上下文的根目录中，前面的例子就是这样做的，但是也可以通过在 `docker build` 命令后添加 `-f` 参数来指定文件系统中任何位置的Dockerfile，如：

```docker
docker build -f /path/to/a/Dockerfile .
```

下面对Dockerfile中的结构和指令进行相关说明，上面例子中每行开头的大写字母都是Dockerfile的一个指令，有 `FROM` 、 `ARG` 、 `ENV` 等，其含义如下表所示：

指令|含义|实例
-----|-----|-----
FROM|初始化一个新的构建阶段并为后续指令设置基础镜像，有效的Dockerfile必须以FROM指令开始| `FROM debian:stretch` 表示以 `debian:stretch` 作为基础镜像进行构建
ARG|ARG类似于常量声明和定义，仅限 在ARG之后出现的并与ARG处于同一构建阶段 中的其他命令 的参数中 对其进行引用|比如定义 `ENV JAVA_HOME=/opt/jdk` ，之后RUN命令中的 `${JAVA_HOME}` 都会被 `/opt/jdk` 代替，但仅限于同一构建阶段
ENV|ENV指令用于设置镜像的环境变量，相当于Shell中的 `export` 命令|例子中的ENV指令对java环境变量进行了设置
RUN|表示构建镜像时执行的命令，可以通过 `&&` 将脚本连接在一行执行减少镜像的层数提高容器运行速度|例子中RUN后的一系列命令完成了jdk的下载和安装
ADD|表示将构建上下文中的文件或目录复制到目标镜像中的文件或目录|上例中表示将上下文中的test.jar复制并重命名为目标镜像中的t.jar
ENTRYPOINT|容器启动时执行的命令|上例中表示创建的容器启动时执行 `java -jar t.jar` 命令，即运行jar包程序

其他Dockerfile命令、更多的使用样例以及最佳实践请参考 [官方文档](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#general-guidelines-and-recommendationss)

# 减少镜像体积

在上一节刚刚学会了使用Dockerfile制作镜像，不妨先试一试

如果你已经试过了，我相信你大概率会注意到制作出来的镜像体积非常大，明明只是一个几MB、几十MB的应用程序制作成镜像之后结果体积达到了几百MB甚至1个GB还多，就这还好意思说轻量化？易于传播？（不过相比较虚拟机系统镜像好像确实小了一点是吧😅）

要减少镜像的体积，关键在于**构建方式**和**基础镜像的选择**

## 构建方式

要想大幅度缩减镜像的体积，采用多阶段构建（Multi-Stage Build）的构建方式是必须的

但是基本上我们都会选择从官方镜像库中拉取基础环境镜像（在Dockerfile中是基础镜像，但是对于程序来说可以称之为运行环境镜像）进行构建，并且大多数编程语言的官方都会提供对应的运行环境镜像，比如JAVA、GCC、GO、NODEJS等，除非你要使用到的语言比较小众，需要自己构建运行环境镜像，这时候你必须了解多阶段构建方式的详细内容

所以对于大部分人来说，如何选择官方提供的运行环境镜像作为构建时的基础镜像更重要，所以这里不对多阶段构建的相关知识进行讲解，如果你感兴趣，可以参考 [官方文档](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#use-multi-stage-builds) 或 [这篇文章](https://fuckcloudnative.io/posts/docker-images-part1-reducing-image-size/#2-%E5%A4%9A%E9%98%B6%E6%AE%B5%E6%9E%84%E5%BB%BA)

## 基础镜像的选择

要做出选择，首先我们要了解Docker中的基础镜像都有哪些，这里的基础镜像指的是最基础的系统级镜像，常见的如CentOS、Ubuntu、Debian、Busybox、Alpine、Scratch等，它们之间的区别和说明如下表所示：

基础镜像|说明|
-----|-----|
Scratch| `ls` 、 `ps` 、 `ping` 等命令都没有，Shell也没有，也无法使用 `docker exec` 进入容器，无法查看网络堆栈信息等，完全为空的镜像，一切从0开始，大小几乎为0|
Alpine|相比较Scratch大了几MB，但是集成了最常用的Linux命令和工具|
Busybox|与Alpine类似|
Debian|主流的Linux发行版本之一，比较完善的基础镜像，镜像大小为40MB左右|
CentOS|主流的Linux发行版本之一，比较完善的基础镜像，镜像大小为200MB左右|
Ubuntu|主流的Linux发行版本之一，比较完善的基础镜像，镜像大小为80MB左右|

> Debian、CentOS以及Ubuntu之间的区别主要是由于产品发展路线造成的差异，这里不进行详细对比，进一步了解需自行查询相关资料

即使我们不需要自己手动构建运行环境镜像，也需要了解这些镜像之间的区别，因为官方往往会针对每一种基础镜像构建不同的镜像供我们选择，它们是通过镜像的 `tag` 进行区分的，下面以jdk为例

打开 [Docker Hub](https://hub.docker.com/) 搜索 java，搜索结果中第一个就是官方镜像

![搜索结果](https://img2020.cnblogs.com/blog/2330281/202109/2330281-20210901223835949-2144289653.png)

> 由于版权问题，Docker中的jdk为openjdk，在官方镜像描述中可以看到 `DEPRECATED; use "openjdk" (or other jDK implementations) instead` 说明，但是使用起来与Oracle jdk并无功能上的差异

点击进入官方镜像首页下拉至 Image Variants 标题可以看到 `tag` 的命名规则和相关解释

![openjdk标签说明](https://img2020.cnblogs.com/blog/2330281/202109/2330281-20210901223822636-1488161994.png)

官方提供的镜像除了以版本信息进行区分之外，还以其制作时依赖的基础镜像进行区分，openjdk除了提供基于alpine镜像的版本还提供基于windows镜像和oracle linux镜像等其他版本

综上所述，一般来说选择提供了你所需要的所有命令的最小运行环境镜像进行构建即可

## 区分生产环境和开发环境

除了前面所说的两个重要因素，镜像还存在生产环境和开发环境之分，这里以Java为例，官方镜像存在 jdk 和 jre 两个版本，如下图所示：

![jre和jdk版本](https://img2020.cnblogs.com/blog/2330281/202109/2330281-20210901223813745-527459998.png)

我们都知道jdk包含了java虚拟机和开发者工具集，而jre只包含了java虚拟机即java运行环境，所以jre占用空间更小，Docker是用来部署应用程序的，并不涉及开发，所以我们可以不选择jdk版本而选择jre版本使最后构建的镜像进一步减小
