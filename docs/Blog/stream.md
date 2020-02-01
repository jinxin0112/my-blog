--- 
title: node 中的流(stream) 
date: 2018-1-2
sidebar: 'auto'
tags:
 - node
categories: 
 - 前端技术
---


流(stream) 在node 中即是最重要的一部分也是相对较难的一部分，本文将详解流的一些正确打开方式

## 简介

什么是流？用node官方的一句话来描述就是：“流(stream)是一种在Node.js中处理流式数据的抽象接口”。就像它的名字一样，流就好比数据像水一样的流动，在文件I/O、 网络I/O 中数据的传输都可以称为流。流可以分类为四种：
- 可读流 (Readable)
- 可写流 (Writable)
- 可读可写流 (Duplex)
- 转换流 (Transform)

在node中，流处理的数据就是buffer或字符串，其中，可读流和可写流都会在一个内部的缓冲器中存储数据，等待被消费；而Duplex和 Transform 可读又可写，所以它们各自维护着两个相互独立的内部缓冲器用于读取和写入，这使得它们在维护数据流时，读取和写入两边都可以各自独立地运作。

## 用法

所有的流都是 EventEmitter 的实例，所以不同流的用法，其实就是通过订阅发布不同的事件。以可读流为例，可读流的事件有：'data', 'readable', 'error', 'close', 'end'
- data : 会在流将数据传递给消费者时触发
- readable : 事件将在流中有数据可供读取时触发
- error : 事件可以在任何时候在可读流实现上触发。通常这会在底层系统内部出错从而不能产生数据，或当流的实现试图传递错误数据时发生
- close : 当流或其底层资源被关闭时触发
- end : 事件将在流中再没有数据可供消费时触发 

具体代码如下：

### 创建一个可读流
```js
    const fs = require('fs');

    let rs = fs.createReadStream('a.txt', {
        flags: 'r', // 操作符 r 是读取
        encoding: 'utf8', // 编码，默认null，就是buffer
        mode: 0o666, // 权限 可读可写
        autoClose: true, // 读取完成后自动关闭
        highWaterMark: 3, // 每次读取多少 默认是64*1024
        start: 0, // 开始位置
        end: 3 // 结束位置
    })

```
### 事件监听
```js
    // data
    rs.on('data', data => {
        console.log(data); 
    });
    // end
    rs.on('end', ()=>{ 
        console.log('end');
    })
    // error
    rs.on('error', err => {
        console.log(err);
    });
    // open
    rs.on('open', () => {
        console.log('文件打开了');
    });
    // close
    rs.on('close', () => {
        console.log('文件关闭了');
    });
```
### 暂停和恢复
```js
// pause
    rs.on('data', data => { 
        console.log(data);  // 只会读取一次就暂停了，此时只读到了123
        rs.pause();     // 暂停读取，会暂停data事件触发
    });
    // resume
    setInterval(() => {
        rs.resume();    // 恢复data事件, 继续读取，变为流动模式
                        // 恢复data事件后，还会调用rs.pause，要想再继续触发，把setTimeout换成setInterval持续触发
    }, 3000);
```

## 原理

node 中 stream 模块提供了一些基础的API，用于构建实现了流接口的对象，它本身主要用于开发者创建新类型的流实例，下面，我们就来根据流的原理自己实现一个简陋版的可读流
```js
    let {Readable} = require('stream');
    // 默认fs.createReadStream自己实现了一个_read 调用的fs.read
    class MyStream extends Readable{
    constructor(){
        super();
        this.index = 9;
    }
    _read() { // 如果想自己实现可读流 需要继承Readable
        this.push(this.index--+'');
        if(this.index == 0){
        this.push(null);
        }
    }
    }
    let myStream = new MyStream();
    myStream.on('data',(data)=>{
    console.log(data.toString());
    });
    myStream.on('end',function () {
    console.log('end');
    })
```


## 总结

以上已经简单的介绍流的一些使用和原理，相对完整的stream只是冰山一角，API虽然枯燥，但是重点是理解这个可控I/O的思维方式。建议大家在学习的时候可以多看看node中stream的源码，体会大佬们的思考过程。