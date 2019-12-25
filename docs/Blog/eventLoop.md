# node 中的事件循环详解

## 前言
代码执行器在解析执行js脚本时，主进程为单线程，而node为了防止堵塞，利用子进程，事件回调等实现了一套自己的事件循环机制。这套机制简言之就是由微任务和宏任务相互穿插执行，从而形成的一个事件环


## 微任务(micro task)和宏任务(macro task)
我对这两者的理解，所谓宏任务，就是一个子进程，在主进程后依次执行，每个宏任务有它自己的一个先进先出事件队列，当事件队列中的事件执行完或者事件执行到达上限后，则跳出该宏任务。而微任务则是当一个宏任务执行结束过后，事件执行会检测此时是否存在微任务，如果存在就去先去清空微任务的执行队列再执行下一个宏任务。

常见的微任务和宏任务分别有：

micro task
- nextTick
- callback
- Promise.then
- process.nextTick
- Object.observe
- MutationObserver

macro task
- script代码块
- I/O
- timer
- UI rendering


## 事件循环

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

> When Node.js starts, it initializes the event loop, processes the provided input script (or drops into the REPL, which is not covered in this document) which may make async API calls, schedule timers, or call process.nextTick(), then begins processing the event loop.

以上是node官方对事件循环给出的解释，大概意思就是当Node.js启动时会初始化event loop, 每一个event loop都会包含按如图顺序六个循环阶段，事件队列在同步队列执行完后，首先会执行nextTick，等nextTick执行完成后，然后会先执行micro task， 等micro task队列空了之后，才会去执行macro task，如果中间添加了micro task加入了micro task队列，会继续去执行micro task队列，然后再回到macro task队列。js引擎存在monitoring process进程， 会不停的监听task queue。

## poll阶段

可以看到，其中的poll 在这个事件循环中起着承上启下，连接的重要作用。poll的存在，主要有如下两个主要的功能：
- 处理poll队列（poll quenue）的事件(callback);
- 执行timers的callback,当到达timers指定的时间时(不包括setImmediate);

当程序进入到poll阶段时：
- 如果代码未设定timer：
    - 如果poll队列不为空，那么优先执行自身callback队列，直至清空
    - 如果poll队列为空：
        - 如果代码已经被setImmediate()设定了callback, event loop将结束poll阶段进入check阶段，并执行check阶段的queue (check阶段的queue是 setImmediate设定的)
        - 如果代码没有设定setImmediate(callback)，event loop将阻塞在该阶段等待callbacks加入poll queue;
- 如果代码设定了timer:
    - 当poll队列为空时，执行到时的timer

## 举例

```js
let fs = require('fs');
setTimeout(()=>{
    Promise.resolve().then(()=>{
        console.log('then2');
    });
},0);
Promise.resolve().then(()=>{
    console.log('then1');
});
fs.readFile('./b.json',()=>{
    process.nextTick(()=>{
        console.log('nextTick');
    });
    setImmediate(()=>{
        console.log('setImmediate');
    })
});
// then1 then2 nextTick setImmediate
```
解析：当node执行完主线程时， setTimeout, Promise, fs.readFile将会被同步放入事件队列。主线程宏任务执行完成之后，优先执行微线程，所以会率先打印 then1 ,此时timer到期，再执行timer，则打印 then2。timer执行完之后，进入到轮训poll阶段，即执行io操作的回调。在该回调中，微任务process.nextTick将会在check之前执行。

## 场景

### process.nextTick() VS setImmediate()
>In essence, the names should be swapped. process.nextTick() fires more immediately than setImmediate()

来自官方文档有意思的一句话，从语义角度看，setImmediate() 应该比 process.nextTick() 先执行才对，而事实相反，命名是历史原因也很难再变。process.nextTick() 会在各个事件阶段之间执行，一旦执行，要直到nextTick队列被清空，才会进入到下一个事件阶段，所以如果递归调用 process.nextTick()，会导致出现I/O starving（饥饿）的问题，比如下面例子的readFile已经完成，但它的回调一直无法执行：
```js
const fs = require('fs')
const starttime = Date.now()
let endtime

fs.readFile('text.txt', () => {
  endtime = Date.now()
  console.log('finish reading time: ', endtime - starttime)
})

let index = 0

function handler () {
  if (index++ >= 1000) return
  console.log(`nextTick ${index}`)
  process.nextTick(handler)
  // console.log(`setImmediate ${index}`)
  // setImmediate(handler)
}

handler()
```
process.nextTick()的运行结果：
```
nextTick 1
nextTick 2
......
nextTick 999
nextTick 1000
finish reading time: 170
```
setImmediate()的运行结果：
```
setImmediate 1
setImmediate 2
finish reading time: 80
......
setImmediate 999
setImmediate 1000
```
这是因为嵌套调用的 setImmediate() 回调，被排到了下一次event loop才执行，所以不会出现阻塞

## 总结

- Node.js 的事件循环分为6个阶段
- Node.js中，microtask 在事件循环的各个阶段之间执行
- 递归的调用process.nextTick()会导致I/O 阻塞，官方推荐使用setImmediate()

[参考资料]

[深入理解js事件循环机制（Node.js篇）]('http://lynnelv.github.io/js-event-loop-nodejs')

[Node.js Event Loop 的理解 Timers，process.nextTick()](https://cnodejs.org/topic/57d68794cb6f605d360105bf)