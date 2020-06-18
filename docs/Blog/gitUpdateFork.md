---
title: 如何更新 fork 的仓库
date: 2020-06-18
sidebar: none
tags:
  - git
categories:
  - 工具使用
---

难得最近比较闲，登了下 github 发现自己以前 fork 的仓库别人都已经更新了十万八千里的个版本了。问题来了，如何将我 fork 的仓库更新同步到源库呢

google 了下，基本上的解决方法都是提一个 源库 => fork 库的 pull request，本来打算就办了，发现这个方法有两个弊端：

- fork 库会多出一个 merge commit，历史不干净，如果这个时候再从 fork 库提 pull request 回源库的话，这个 commit 也会带回去
- 需要在网页上去点点点，麻烦

继续 google ...... 发现了一个更好的方案

直接上 git 命令：

```

# 首先克隆我们的 github 项目到本地
git clone git@github.com:我们的github名/developer-note.git

# 关联开源项目，注意这个`upstream`就代表关联上一级仓库，而`origin`表示我们自己的远程库
git remote add upstream git@github.com:BrucePhoebus/developer-note.git

# 先拉取最新源项目更新，此时我们在本地 master 分支
git pull upstream master

```

值得一提的是，使用这种方法更新 fork库的话，再往源库提 pull request 需要新切分支，避免后续在 master pull 的时候产生冲突，从而产生不应有的 conflict merge commit 