---
sidebar: auto
---
# 这里记录一些 有意思的问题

##  1
```js
var f = function g(){
    console.log(g);
    return 123;
}
typeof g(); //报错 g is not defined
```
作用域问题，g只在方法内有定义

##  2
```js
console.log(["1","2","3"].map(parseInt)); //[1,NaN,NaN]
```  
parseInt接受两个参数，而map的第二个参数为index索引

##  3
```js
console.log([typeof null, null instanceof Object]) //['object',false]
``` 
typeof undefined = 'undefined',typeof null = 'object',特殊情况(个人怀疑就是js设计时候的bug)。null肯定不是Object的实例，反而Object.prototype.\_\_proto\_\_ = null, null为原型链的顶端

##  4
```js
Object.prototype.name = 1;
console.log(1.0.name); //1
console.log(1.name);  //报错
console.log(Function.name);  //'Function'
``` 
1.0 这个是一个对象，会从原型链上去拿name。1.name 这个1是 数字，会报错。数据类型的构造函数自带name 属性，值为其数据类型字符串值 

##  5
```js
console.log((function(x){
    delete x;
    return x;
})(1)) // 1
``` 
delete 是操作对象的，这里删除不掉这个x 

##  6
```js
var end = Math.pow(2,53) //2的53次方
var start = end - 100;
var count = 0;
for(var i = start; i <= end; i++){
    count ++;
}
console.log(count);
``` 
浏览器卡死，2的53次方为浏览器最大安全数

##  7
```js
var arr = [1,2,3,undefined];
arr[10] = 10;
console.log(arr.filter(function(x){
    return x === undefined
})); // [undefined]
``` 
filter和map 不处理空的

##  8
```js
var one = 0.1;
var two = 0.2;

var a = 0.8;
var b = 0.6;
console.log([two - one === one, a - b === one]); //[true, false]
``` 
不要相信js的精度运算，会失精