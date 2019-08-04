# redux 源码笔记 📝

- isPlainObject => 是否是普通对象

```js
// 是否是普通对象
export default function isPlainObject(obj) {
  // 如果不是一个对象或者为null 就直接返回false
  // 注意 typeof null === 'object'
  if (typeof obj !== 'object' || obj === null) return false;

  let proto = obj;

  // 循环往上找直至拿到Object.prototype
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  // 判断被检查的对象是否由 Object 构造
  return Object.getPrototypeOf(obj) === proto;
}
```

