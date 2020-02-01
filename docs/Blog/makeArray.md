--- 
title: 创建数组方法的 3 种方法
date: 2020-1-22
sidebar: 'auto'
tags:
 - javascript
categories: 
 - 前端技术
---


本文旨在对创建不定长不定内容数组的方法总结

## Array + fill

```javascript
const arr = Array(Math.max(0, length)).fill(0);
```

缺点：

1. 需要对 length 合法性进行判断
2. 只能使用 fill 填充同样的数组项
3. 如果填充的是一个 mutable 数据会有隐患

## Array + keys + spread

```javascript
const arr = [...Array(Math.max(0,length).keys()];
```

原理是利用 Array.prototype.keys 得到一个迭代器；

缺点：

1. 依然需要判断 length 合法性
2. 数组项只能是索引的值

## Array.from

```javascript
const arr = Array.from({ length }, (_, i) => i);
```

原理是模拟一个类数组传给 Array.from 转成数组；

优点：

1. 如果 length 不合法会当 0 处理，所以不用判断 length；
2. 数组项的内容可以定制。
