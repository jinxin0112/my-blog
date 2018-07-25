# ES6

## 1.解构赋值
分解一个对象的结构。
### 1.1 数组的解构
```
let arr = [1, 2, 3];
let a = arr[0];
let b = arr[1];
let c = arr[2];
// 等价于
let [a, b, c] = arr;
```
### 1.2 对象的解构
```
let { name, age } = { name: 'jw', age: 25 };
console.log(name, age); // jw 25
```

### 1.3 解构的重命名
```
let { name: myName, age: myAge } = { name: 'jw', age: 25 }
console.log(myName, myAge); // jw 25
```
### 1.4 复杂的解构
```
let [
    { name: myName, age: myAge },
    { hobby: [sleep] },
    address
] = [
        { name: 'jw', age: 25 },
        { hobby: ['sleep', 'coding'] },
        '回龙观'
    ]
console.log(myName, myAge, sleep, address);
```
### 1.5 默认解构
```
let { name, age = 8 } = { name: 'jw' };
console.log(name, age);
```

> 当对象中没有此属性时会采用默认值

### 1.6 省略解构
```
let [, , address] = ['jw', 25, '回龙观 '];
console.log(address);
```

### 1.7 应用场景
```
function ajax(options) {
    var method = options.method || "get";
    var data = options.data || {};
    //.....
}
function ajax({ method = "get", data }) {
    console.log(method, data);
}
ajax({
    method: "post",
    data: { "name": "jw" }
});
```


## 2.展开运算符
### 2.1 展开数组
```
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let result = [...arr1, ...arr2];
console.log(result); // [ 1, 2, 3, 4, 5, 6 ]
```
### 2.2 对象展开
```
let name = {name:'jw'};
let age = {age:8};
let result = {...name,...age}
console.log(result);// { name: 'jw', age: 8 }
```
### 2.3 应用场景
```
function max() {
    console.log(Math.max(...arguments));
}
max(1, 3, 4);
```

> 将类数组进行展开,当然我们也可以用这种方式将类数组转化成数组

## 3.对象的拷贝
### 3.1 浅拷贝
- Object.assign
```
var nameObj = { name: { school: 'jw' } };
var ageObj = { age: 25 };
var obj = {};
Object.assign(obj, nameObj, ageObj);
console.log(obj);
```
- 对象展开
```
var nameObj = { name: { school: 'jw' } };
var ageObj = { age: 25 };
console.log({ ...nameObj, ...ageObj });
```

### 3.2 深拷贝
- JSON.parse&&JSON.stringify
```
var nameObj = { name: { school: 'jw' } };
var ageObj = { age: 25 };
console.log(JSON.parse(JSON.stringify({ ...nameObj, ...ageObj })));
```
- 递归拷贝
```
function deepClone(obj){
    if(typeof obj !== 'object') return obj;
    if(obj === null) return obj;
    if(obj instanceof RegExp) return new RegExp(obj); 
    if(obj instanceof Date) return new Date(obj);
    let o = new obj.constructor();
    for(let key in obj){
        o[key] = deepClone(obj[key]);
    }
    return o;
}
```

## 4.Object.defineProperty
### 4.1基础用法
```
let school = {name:''}
let val;
Object.defineProperty(school, 'name', {
  enumerable: true, // 可枚举,
  configurable: true, // 可配置
  get() {
    // todo
    return val;
  },
  set(newVal) {
    // todo
    val = newVal
  }
});
school.name = 'jw';
console.log(school.name);
```

### 4.2 响应式变化
```
let obj = { name: 'zfpx',age:'99',name:{name:1}};
function defineReactive(obj,key,value){
    Object.defineProperty(obj,key,{
        get(){
            return value;
        },
        set(newValue){
            value = newValue;
            alert('视图需要更新')
        }
    })
}
function observe(obj){
    if(typeof obj !== 'object') return
    for(let key in obj){
        defineReactive(obj,key,obj[key]);
        observe(obj[key])
    }
}
observe(obj);
```

## 5.proxy应用
### 5.1基础用法
```
let obj = {name:'zfpx'}
let proxy = new Proxy(obj,{
    get(target,key){
        return target[key];
    },
    set(target,key,value){
        // 属性发生变化
        obj[key] = value;
    }
});
```

### 5.2 响应式变化
```
let obj = {name:{name:'zfpx'}}
function $set(obj,fn){
    let proxy = new Proxy(obj,{
        set(target,key,value){
            alert('属性变化');
            target[key] = value;
        }
    });
    fn(proxy)
}
$set(obj.name,(proxy)=>{
    proxy.name = 'jw';
});
```



## 6.Symbol
第七种数据类型:null undefined object boolean string number
### 6.1 永远不相等的Symbol
```
let symbo1 = Symbol();
let symbo2 = Symbol();
console.log(symbo1 === symbo2);
console.log(typeof symbol === 'symbol')
```
### 6.2 Symbol.for
记录symbol
```
let s = Symbol.for('zhufeng');
let s1 = Symbol.for('zhufeng');
console.log(s === s1);
```
### 6.3 Symbol.keyFor
```
let s = Symbol.for('zhufeng');
let desc = Symbol.keyFor(s);
console.log(desc); // 查找描述
```

### 6.4 内置Symbol.iterator
```
let obj = {0:1,1:2,length:2,[Symbol.iterator]:function *(){
    let index = 0;
    while(index !== this.length){
        yield this[index++]
    }   
}};
let arr = [...obj];
console.log(arr);
```

## 7.模板字符串
### 7.1 模板字符串
模板字符串用反引号(数字1左边的那个键)包含，其中的变量用${}括起来
```
let name = 'JiangWen';
let age = 28;
let result = `My name is ${name} . I am ${age} years old`;
console.log(result); // My name is JiangWen . I am 28 years old
```

### 7.2 模板字符串实现
```
let name = 'JiangWen';
let age = 28;
let result = 'My name is ${name} . I am ${age} years old';
result = result.replace(/\$\{([^}]*)\}/g,function(){
    return eval(arguments[1]);
});
console.log(result);
```

### 7.3 模板字符串换行
```
let name = 'JiangWen';
let age = 28;
let userInfo = [name, age];
let lis = userInfo.map(function (info) {
    return `<li>${info}</li>`
});
let ul = `
    <ul>
        ${lis.join('')}
    </ul>
`;
console.log(ul);
```

### 7.4 模板标签
```
let name = 'JiangWen';
let age = 28;
function tag(strings) {
    let values = Array.prototype.slice.call(arguments, 1);
    let result = '';
    for (let key in values) {
        result += strings[key] + values[key].toString().toUpperCase();
    }
    result += strings[strings.length - 1];
    return result;
}
let result = tag`My name is ${name} . I am ${age} years old`;
console.log(result);
```

> 我们可以自定义模板字符串的呈现方式

## 8.数组的常见方法
```
Array.prototype.myReduce = function (fn, prev) {
  for (let i = 0; i < this.length; i++) {
    if (typeof prev === 'undefined') {
      prev = fn(this[i], this[i + 1], i + 1, this);
      ++i; // 保证下次取值时是正确的结果
    } else {
      prev = fn(prev, this[i], i, this);
    }
  }
  return prev;
}
```

> find/map/reduce/filter/forEach/findIndex/every/some
### Array.from
类数组转化成数组
```
let obj = {0:1,1:2,length:2}
console.log(Array.from(obj));
```

> [...obj] 这种形式为什么不行呢？

## 9.集合
### 9.1 Set
一个Set是一堆东西的集合,Set有点像数组,不过跟数组不一样的是，Set里面不能有重复的内容
```
var books = new Set();
books.add('js');
books.add('js');//添加重复元素集合的元素个数不会改变
books.add('html');
books.forEach(function(book){//循环集合
    console.log(book);
})
console.log(books.size);//集合中元数的个数
console.log(books.has('js'));//判断集合中是否有此元素
books.delete('js');//从集合中删除此元素
console.log(books.size);
console.log(books.has('js'));
books.clear();//清空 set
console.log(books.size);
```

### 9.2 数组去重
```
let arr = [1,2,3,4,5,4,3,2,1];
let set = new Set([...arr]);
console.log([...set]);
```

### 9.3 ∩ && ∪ && 差集
```
let arr1 = [1,2,3,4,5];
let arr2 = [4,5,6,7,8];

// 并集 
function union(arr1,arr2){
    return [...new Set([...arr1,...arr2])];
}
console.log(union(arr1,arr2));

// 交集
function intersection(arr1,arr2){
    return arr1.filter(item=>new Set(arr2).has(item));
}
console.log(intersection(arr1,arr2));

// 差集
function difference(arr1,arr2){
    return arr1.filter(item=>!new Set(arr2).has(item));
}
console.log(difference(arr1,arr2));
```

### 9.4 Map
可以使用 Map 来组织这种名值对的数据
```
var books = new Map();
books.set('js',{name:'js'});//向map中添加元素
books.set('html',{name:'html'});
console.log(books.size);//查看集合中的元素
console.log(books.get('js'));//通过key获取值
books.delete('js');//执照key删除元素
console.log(books.has('js'));//判断map中有没有key
books.forEach((value, key) => { //forEach可以迭代map
    console.log( key + ' = ' + value);
});
books.clear();//清空map
```

## 10.Class
### 10.1 类的继承方式
#### 10.1.1 继承实例属性
```
function Parent(){
    this.name = 'zfpx';
}
Parent.prototype.eat = function(){
    console.log('吃饭');
}
function Child(){
    Parent.call(this);
    this.age = 9
}
let child = new Child();
console.log(child);
```
#### 10.1.2 继承公有属性
- 方案(1)
```
function Parent(){
    this.name = 'zfpx';
}
Parent.prototype.eat = function(){
    console.log('吃饭');
}
function Child(){
    this.age = 9
}
// Child.prototype.__proto__ = Parent.prototype;
Object.setPrototypeOf(Child.prototype,Parent.prototype);
let child = new Child();
child.eat(); 
```

- 方案(2)
```
function Parent(){
    this.name = 'zfpx';
}
Parent.prototype.eat = function(){
    console.log('吃饭');
}
function Child(){
    this.age = 9
}
Child.prototype = Object.create(Parent.prototype,{constructor:{value:Child}});
let child = new Child();
child.eat();
```

#### 10.1.3 继承全部属性
```
function Parent(){
    this.name = 'zfpx';
}
Parent.prototype.eat = function(){
    console.log('吃饭');
}
function Child(){
    this.age = 9
}
Child.prototype = new Parent();
let child = new Child();
child.eat();
```


### 10.2 ES6中的类
```
class Parent {
    constructor(){
        this.name = 'zfpx';
    }
    static p(){
        return '嘿嘿'
    }
    eat(){
        console.log('eat');
    }
}
class Child extends Parent{
    constructor(){
        super();
        this.age = 9;
    }
}
```

## 10.3 类的实现
### 10.3.1 类的调用检测
```
function _classCallCheck(ctor, inst) {
    if (!(inst instanceof ctor)) {
        throw TypeError("Class constructor " + ctor.name + " cannot be invoked without 'new'");
    }
}
let Child = (function () {
    return function Child() {
        _classCallCheck(Child, this);
    }
})();
Child();
```
### 10.3.2 公有属性定义
```
function defineProperty(target,property){
    for (let i = 0; i < property.length; i++) {
        Object.defineProperty(target, property[i].key, {
            enumerable: true,
            writable: true,
            ...property[i]
        });
    }
}
function _createClass(ctor, protoProperties, staticProperties) {
    if(protoProperties.length){
        defineProperty(ctor.prototype,protoProperties);
    }
    if(staticProperties.length){
        defineProperty(ctor,staticProperties);
    }
}
let Child = (function () {
    function Child() {
        _classCallCheck(Child, this);
    }
    _createClass(Child, [
        {
            key: 'cry',
            value: function () {
                console.log('哭');
            }
        }
    ], [
            {
                key: 'myName',
                value: function () {
                    return '孩子'
                }
            }
        ]);
    return Child;
})();
let child = new Child;
```

### 10.3.3 类的继承
```
function _classCallCheck(ctor, inst) {
    if (!(inst instanceof ctor)) {
        throw TypeError("Class constructor " + ctor.name + " cannot be invoked without 'new'");
    }
}
function defineProperty(target,property){
    for (let i = 0; i < property.length; i++) {
        Object.defineProperty(target, property[i].key, {
            enumerable: true,
            writable: true,
            ...property[i]
        });
    }
}
function _createClass(ctor, protoProperties, staticProperties) {
    if(protoProperties.length){
        defineProperty(ctor.prototype,protoProperties);
    }
    if(staticProperties.length){
        defineProperty(ctor,staticProperties);
    }
}
let Parent = (function(){
    function Parent(){
        _classCallCheck(Child, this);
    }
    return Parent;
})();
function _inherits(Child,Parent){
    Child.prototype = Object.create(Parent.prototype,{constructor:{value:Child}});
    Child.__proto__ = Parent;
}
let Child = (function (Parent) {
    _inherits(Child,Parent);
    function Child() {
        Parent.call(this);
        _classCallCheck(Child, this);
    }
    _createClass(Child, [
        {
            key: 'cry',
            value: function () {
                console.log('哭');
            }
        }
    ], [
            {
                key: 'myName',
                value: function () {
                    return '孩子'
                }
            }
        ]);
    return Child;
})(Parent);
let child = new Child;
```

## 11.装饰器应用


## 12.箭头函数应用

## 13.模板字符串
### 13.1 模板字符串
模板字符串用反引号(数字1左边的那个键)包含，其中的变量用${}括起来
```
let name = 'JiangWen';
let age = 28;
let result = `My name is ${name} . I am ${age} years old`;
console.log(result); // My name is JiangWen . I am 28 years old
```

### 13.2 模板字符串实现
```
let name = 'JiangWen';
let age = 28;
let result = 'My name is ${name} . I am ${age} years old';
result = result.replace(/\$\{([^}]*)\}/g,function(){
    return eval(arguments[1]);
});
console.log(result);
```

### 13.3 模板字符串换行
```
let name = 'JiangWen';
let age = 28;
let userInfo = [name, age];
let lis = userInfo.map(function (info) {
    return `<li>${info}</li>`
});
let ul = `
    <ul>
        ${lis.join('')}
    </ul>
`;
console.log(ul);
```

### 13.4 模板标签
```
let name = 'JiangWen';
let age = 28;
function tag(strings) {
    let values = Array.prototype.slice.call(arguments, 1);
    let result = '';
    for (let key in values) {
        result += strings[key] + values[key].toString().toUpperCase();
    }
    result += strings[strings.length - 1];
    return result;
}
let result = tag`My name is ${name} . I am ${age} years old`;
console.log(result);
```