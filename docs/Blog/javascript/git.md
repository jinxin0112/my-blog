# 常用git命令集合

> 📝记录一些常用的 git 命令。 部分摘至 [廖学峰git教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)

### 远端仓库

- 添加远端仓库
```
    $ git remote add origin [git url]
```

### 标签

- 创建标签
```
    $ git tag v1.0
```
- 给历史commit 补标签（f52c633是commit id）
```
    $ git tag v1.0 f52c633
```
- 查看标签
```
    $ git tag
```
- 附加选项: -a 别名 ，-m 附加信息
```
    $ git tag -a v1.0 -m "some message..."
```
- 推送
```
    $ git push origin master --tags
```