# 浅谈Promise

## 状态

要搞清Promise ，首先要知道Promise的三个状态
- pending (等待态)
- resolved 或 fulfilled (成功态)  
- rejected (失败态)

其中，pending 可以转换到 resolved 或者 rejected，但是，resolved 不能转化为 rejected，rejected 也不能转换为 resolved。也就是说一个状态，一旦成功就不会再失败，一旦失败就不会再成功。新Promise实例默认状态为 pending。

## then

每个Promise 实例都有then 方法，then 方法有另两个参数，分别是成功的回调和失败的回调。同一个实例可以有多个then 方法，当成功时，会调用所有then的成功方法，失败时，会调用所有then的失败方法。

另外，then方法是异步的，它还有一个逼格更高的名字叫微任务，与宏任务相对应，是跟事件环有关的，这里不做详细描述。

## 简单实现

明白了以上两个概念，基本上就可以去实现一个简陋版的Promise，代码如下
```js
    class Promise {
        constructor(executor) {
            this.value = undefined;
            this.reason = undefined;
            this.status = 'pending';
            let resolve = value => {
                this.value = value;
                this.status = 'resolved';
            }
            let reject = reason => {
                this.reason = reason;
                this.status = 'rejected';
            }
            executor(resolve, reject);
        }
        then(onFulfilled, onRejected) {
            if (this.status === 'resolved') {
                onFulfilled(this.value);
            }
            if (this.status === 'rejected') {
                onRejected(this.reason);
            }
        }
    }
```
## error

当同步执行到executor时，其内部有可能会报错，而当内部报错的时候，Promise的状态就为rejected失败态，执行传入的reject方法。这里可以使用try catch捕获，则代码为：
```js
    try{
        executor(resolve, reject);
    }catch(e){
        reject(e);
    }
```
## 异步状态修改
在executor中修改Promise状态，往往会遇到异步的方式，比如
```js
    let promise = new Promise((resolved, rejected) => {
        setTimeout(()=>{
            resolved('ok');
        },1000);
    })

    promise.then((data)=>{
        console.log(data);
    },(err)=>{
        console.log(err);
    });
```
当遇到此类情况时，如果是我们刚刚的方案，then会在resolve方法之前执行，所以当1秒后成功，并不会触发then 中的成功回调，那应该怎样处理这种情况呢？

事实上，这里可以通过事件的发布订阅去处理，当执行到then的时候，先去判断当前Promise的状态，如果是pending，那么就将成功和失败的回调存起来，当异步的resolve或者reject触发过后，再将存储好的成功或失败方法依次拿出来执行，有了这个思路过后，可以声明两个数组来进行存储：
```js
    constructor(executor) {

        this.value = undefined;
        this.reason = undefined;
        this.status = 'pending';
        this.onResolvedCallbacks = []; // 存放成功回调
        this.onRejectedCallbacks = []; // 存放失败回调
                ...
    }
```

在then 中添加状态为pending的判断，当状态为pending是，将传入的成功和失败回调存入声明好的数组中：
```js
    then(onFulfilled, onRejected) {

        if (this.status === 'resolved') {
            onFulfilled(this.value);
        }
        if (this.status === 'rejected') {
            onRejected(this.reason);
        }
        if (this.status === 'pending') {
            this.onResolvedCallbacks.push(() => {
                onFulfilled(this.value);
            });
            this.onRejectedCallbacks.push(() => {
                onRejected(this.reason);
            });
        }
    }
```

而在resolve和reject中，需要添加对回调函数数组的依次执行：
```js
    let resolve = value => {
        if (this.status === 'pending') {
            this.value = value;
            this.status = 'resolved';
            this.onResolvedCallbacks.forEach(fn => fn());
        }
    }
    let reject = reason => {
        if (this.status === 'pending') {
            this.reason = reason;
            this.status = 'rejected';
            this.onRejectedCallbacks.forEach(fn => fn());
        }
    }
```

## 链式调用

### 使用
Promise用来处理回调地狱，使用的就是then的链式调用，使代码看上去更容易维护。首先来看下链式调用的使用方式

在node中通常会使用fs 模块来执行文件读取，fs 提供了同步读取和异步读取，以异步为例，可以将这个链式读取Promise化：
```js
    const fs = require('fs');

    function readFlie(url, encoding) {
        return new Promise((resolved, rejected) => {
            fs.readFile(url, encoding, (err, data) => {
                if (err) {
                    rejected(err);
                } else {
                    resolved(data);
                }
            });
        })
    }

    readFlie('./a.txt', 'utf8').then((data) => {
        return readFlie(data, 'utf8')
    }).then((data) => {
        return data
    }).then((data) => {
        console.log(data);
    });
```
值得注意的是，then中如果返回的是一个promise，那么下一个then 为这个promise的执行结果，如果then中返回的一个普通值，那么该值将会当做参数传入下一个then 的成功回调函数，如果then中抛出一个错误，那么接下来的then必要写错误回调去捕获这个抛出的错误，也可以使用catch去统一处理，所有的错误只能被捕获一次。另外，如果then中成功和失败的回调都没写的话，那么值会穿透该then 到达下一个then。    
### 实现
要实现链式调用，主要是看当一个then执行过后，返回的数据结果是不是一个新的promise，根据promise A+ 规范，需要在then 中加一个promise2 予以返回，并且需要判断then中回调执行结果与这个promise2的关系，如下：
```js
   then(onFulfilled, onRejected) {

        let promise2 = new Promise((resolve, reject) => {
            if (this.status === 'resolved') {
                try {
                    let x = onFulfilled(this.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e)
                }
            }
            if (this.status === 'rejected') {
                try {
                    let x = onRejected(this.reason);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e)
                }
            }
            if (this.status === 'pending') {
                this.onResolvedCallbacks.push(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                });
                this.onRejectedCallbacks.push(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                });
            }
        });
        return promise2;
    }
```
其中的resolvePromise就是判断promise2 与 then中回调执行返回 x关系的函数，如下：
```js
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        reject(new TypeError('x can not be promise2'))
    }
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {
                    resolvePromise(promise2, y, resolve, reject) // 递归直到解析为普通值为止
                }, err => {
                    reject(err)
                });
            } else {
                resolve(x)
            }
        } catch (e) {
            reject(e);
        }
    } else {
        resolve(x);
    }
}
```

其实写到这里，基本上已经实现了一个符合 promise A+ 规范的方案，另外再补充几个Promise的方法

## catch
捕获then链上未被捕获的错误，通常catch 放在then 链的最后，也可以放中间，但是不建议这样做，程序会抛出警告，实现如下：
```js
    catch(onRejected) {
        return this.then(null, onRejected);
    }
```

## all 
传入一堆promise,然后返回一个新的promise，当这一堆promise 都成功了，执行新promise的then方法的成功回调，返回值是一个数组，反之如果有一个失败就失败了，执行失败回调：
```js
    Promise.all = function (promises) {
        return new Promise((resolve, reject) => {
            let arr = [];
            let i = 0;
            function processData(index, data) {
                arr[index] = data;
                if (++i == promises.length) {
                    resolve(arr);
                }
            }
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(data => { // data是成功的结果
                    processData(i, data);
                }, reject);
            }
        })
    }
```

## race
传入一堆promise，然后返回一个新的promise，谁先执行完，就以谁为新promise的结果
```js
    Promise.race = function (promises) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(resolve, reject);
            }
        })
    }
```

[github]：[https://github.com/kingDuiDui/Promise](https://github.com/kingDuiDui/Promise)

[参考文档]：
[Promise A+ 规范](https://promisesaplus.com/)
