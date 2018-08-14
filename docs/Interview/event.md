# 浏览器事件机制中事件触发的三个阶段

## 我的理解

浏览器事件触发分为三个阶段，分别是： 
1. 捕获阶段
2. 目标阶段
3. 冒泡阶段

捕获阶段是事件从根节点流向目标节点，途径各种DOM并捕获上面所注册的事件，其作用主要在于建立传播路径，在冒泡阶段根据这个路径，回溯到根节点。

当事件抵达目标节点时，就到了目标阶段，事件在目标节点上触发。

当目标节点的事件触发完成后，根据事件捕获阶段的路径，一层一层向上执行，直至回到根节点。




## 大佬总结

事件触发三阶段

document 往事件触发处传播，遇到注册的捕获事件会触发
传播到事件触发处时触发注册的事件
从事件触发处往 document 传播，遇到注册的冒泡事件会触发
事件触发一般来说会按照上面的顺序进行，但是也有特例，如果给一个目标节点同时注册冒泡和捕获事件，事件触发会按照注册的顺序执行。

```js
    // 以下会先打印冒泡然后是捕获
    node.addEventListener('click',(event) =>{
        console.log('冒泡')
    },false);
    node.addEventListener('click',(event) =>{
        console.log('捕获 ')
    },true)
```

注册事件

通常我们使用 addEventListener 注册事件，该函数的第三个参数可以是布尔值，也可以是对象。对于布尔值 useCapture 参数来说，该参数默认值为 false 。useCapture 决定了注册的事件是捕获事件还是冒泡事件。对于对象参数来说，可以使用以下几个属性
capture，布尔值，和 useCapture 作用一样
once，布尔值，值为 true 表示该回调只会调用一次，调用后会移除监听
passive，布尔值，表示永远不会调用 preventDefault
一般来说，我们只希望事件只触发在目标上，这时候可以使用 stopPropagation 来阻止事件的进一步传播。通常我们认为 stopPropagation 是用来阻止事件冒泡的，其实该函数也可以阻止捕获事件。stopImmediatePropagation 同样也能实现阻止事件，但是还能阻止该事件目标执行别的注册事件。
```js
node.addEventListener('click',(event) =>{
	event.stopImmediatePropagation()
	console.log('冒泡')
},false);
// 点击 node 只会执行上面的函数，该函数不会执行
node.addEventListener('click',(event) => {
	console.log('捕获 ')
},true)
```

事件代理

如果一个节点中的子节点是动态生成的，那么子节点需要注册事件的话应该注册在父节点上

```html
<ul id="ul">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
</ul>
<script>
	let ul = document.querySelector('##ul')
	ul.addEventListener('click', (event) => {
		console.log(event.target);
	})
</script>
```

事件代理的方式相对于直接给目标注册事件来说，有以下优点
- 节省内存
- 不需要给子节点注销事件