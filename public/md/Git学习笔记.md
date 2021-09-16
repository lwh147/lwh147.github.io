# 常用命令

```text
# 与远程仓库同步信息
git fetch
# 查看本地分支情况
git branch
# 查看所有分支
git branch -a
# 查看所有分支以及分支追踪情况
git branch -vv
# 创建本地分支
git branch 分支名
# 当远程分支不存在本地分支时，创建并检出远程分支对应的本地分支，会自动设置远程追踪分支
git checkout 远程分支名
# 创建并检出本地分支
git checkout -b 分支名
# 删除分支
git branch -D 分支名

# 允许合并不相关历史
git pull origin dev --allow-unrelated-histories

# 设置本地分支的远程追踪分支
git branch --set-upstream-to=origin/分支名
# 设置追踪分支之后pull、push命令的origin默认都是当前分支的远程跟踪分支
```

Git命令详情：[Git 常用命令大全](https://blog.csdn.net/halaoda/article/details/78661334)

# 冲突解决

## 在线合并和本地合并

gitlab**网页上的merge操作**如果出现冲突，则会要求手动修改冲突文件并向源分支提交的方式解决冲突，从而**使源分支和目的分支互相合并**

在**本地执行的merge操作**则会在目的分支出现冲突，可以通过修改目的分支并提交到目的分支解决冲突，**不影响源分支**

## 本地合并方法

首先将源分支和目标分支同步远程仓库： `git fetch origin`

切换到目的分支执行： `git merge --no-ff 源分支名`

如果没有冲突，则执行： `git commit` 并 `push` ，合并完成
如果出现冲突，则执行： `git status` 查看冲突文件，解决冲突之后 `commit` 并 `push` ，合并完成

# 注意事项

当配置了SSH免密登录之后，克隆远程项目到本地时依旧提示输入密码，则检查是否是clone地址格式有误 `ssh@host:username/**/projectName.git`

日常开发过程中远程仓库有新的提交需要更新到本地时，应该**先提交再拉取更新**，否则如果存在冲突本地的更改会直接被覆盖，而且不能通过git历史记录回滚到未更新前的状态（因为没有提交生成版本信息），只能通过ide自带的文件历史保存记录进行恢复（如在idea中的项目根目录上右键->Local History），如果你使用的ide没有这个功能，那么恭喜，你中奖了

更加棘手的是，即使你通过ide自带的历史记录将文件内容恢复到了合并前的样子，也不能再重新执行合并操作了，更不能进行commit和push操作，因为在本地的git版本信息中你已经合并过最新的提交了，能够恢复是因为执行了ide的回滚操作而不是git的回滚操作，甚至git还会认为回滚操作是你对合并之后的项目做出的新的修改操作，此时如果直接commit再push就会产生丢失修改的问题（就是你将别人的代码和没了）

如果出现了这样的情况，只能先将你的修改保存起来，然后删除项目中的git版本控制文件（或者删除整个项目重新拉取），重新创建git版本控制信息并在拉取最新的代码之后，手动将自己的修改合并到项目中

# 常见问题

## 文件名太长无法处理：file name too long

在git bash中，运行命令： `git config --global core.longpaths true`

说明：--global是该参数的使用范围，如果只想对本版本库设置该参数，只要在上述命令中去掉--global即可

## 为已被纳入版本控制的文件添加.gitignore规则后使其生效

对于一些已经添加到git版本控制中的文件或文件夹，如果想取消其版本控制，在添加.gitignore规则后这些文件或文件夹还是会被追踪，提交时还会出现在commit列表中

这时应该先把本地的文件追踪缓存删除，重新执行add

```text
// 删除要取消追踪的文件或文件夹缓存
git rm -r --cached **/target
// 重新根据.gitignore添加要提交的文件
git add .

// 可以提交了
git commit -m "update .gitignore"
```
