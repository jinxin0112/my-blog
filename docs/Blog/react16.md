# 听《深入理解 React v16 新功能》记录

1. render 函数可以返回一个数组或字符串
2. render face 阶段的生命周期函数由于fiber的暂停重启机制，可能会被执行多次，所以这个阶段的生命周期函数应该是纯函数
3. static getDerivedStateFromProps 做成静态方法的原因就是，无法让其访问this，更无法直接操作state引起一些副作用，强制让Render face阶段的函数是一个纯函数
4. render face 阶段的出错会被 static getDerivedStateFromError 捕获，commit face 阶段会被 componentDidCatch 捕获
5. componentDidCatch 不会在服务端渲染中调用