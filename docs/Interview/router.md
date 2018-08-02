# 单页应用路由设计

> 一个单页面应用，有6张页面，F、E、A、B、C、D。 页面ABCD构成了一个冗长的用户验证过程。目前A、B、C对应用户验证过程的第1步，第2步，第3步。 页面F是首页，E是某张业务相关页面。用户到达页面E后，系统发现用户没有认证，触发验证流程，到达页面A，然后开始A->B->C->D流程。 页面D是验证结果页面（验证成功页面）。 请问，如果到达页面D后，如何让用户点击返回可以返回页面F，而忽略中间流程（注：用户可能根本没有到达过F，比如微信分享直接进入了E）

# 我的理解

此题不会。根据答大佬总结，在console里模拟了下执行过程，大概是
```javascript
    history.pushState({},'e','http://localhost:3333/e')
    history.pushState({},'a','http://localhost:3333/a')
    history.pushState({},'b','http://localhost:3333/b')
    history.pushState({},'c','http://localhost:3333/c')
    history.pushState({},'d','http://localhost:3333/d')
    history.go(-4)
    history.replaceState({},'f','http://localhost:3333/f')
    history.pushState({},'d','http://localhost:3333/d')
```
之前都是用的别人封好的路由库，还是要更深的掌握底层的原理

# 大佬总结

这个问题初一看是对单页面路由架构的考察。也是一个很好的引入问题，可以考察非常多方面。 比如说：如何实现页面切换动画？ A、B、C都是表单的话，如何缓存用户输入完成的表单数据？……回到问题，因为history api提供了push/pop/replace三种操作，无论是其中的任何一种都无法实现上述的效果。 一个路由系统，首先要监听浏览器地址的变化，然后根据变化渲染不同的页面。1. 在页面到达D后，关闭对路由变化页面渲染的监听。 2. 路由系统要进行多次POP，可以用history.go(-n)实现； 3. 路由栈清空到只剩下一张页面时，将这张页面替换为F。 4. PUSH一张页面D。 5. 如果在HTML上有一个类似「轮播图」的设计，就是每一张页面是一张轮播图，将轮播图设置成只有「F」和「D」。 5. 恢复路由监听。 这个问题的另一个考点是，在上述完整的计算过程当中，需要知道当前历史记录中的页面数，页面数可以通过localStorage实现，在ls中维护一个变量，每次push的时候+1，并写入history.state。 POP的时候读取history.state将变量重置

注意的点：
- 在ABCD验证流程阶段，不能使用replace，否则用户在BCD 阶段不能返回上一个流程
- 到达F之后，不能再点返回，让用户再次看到 验证流程， D 到 F 不能push

[附]：[history正确打开方式](https://developer.mozilla.org/zh-CN/docs/Web/API/History)