---
title: IOS「橡皮筋」问题解决
date: 2020-03-05
sidebar: auto
tags:
    - javascript
categories:
    - 前端技术
---

最近在做移动端页面的时候，遇到了 IOS 经典的「橡皮筋」（Bounce）问题，不知道苹果是出于什么思考出这么些反人类的特效，用过 iNoBounce 插件，由于这个插件的核心是使用 `-webkit-overflow-scrolling: touch;`，而恰恰这个 css 属性在常见的 chrome 浏览器中的不支持，所以对我来说似乎没啥 luan 用。

## 什么是「橡皮筋」问题

简而言之就是，可以滑动的元素，当滑动溢出时，会出现一个类似橡皮筋一样的先溢出后弹回的动画效果。当这个效果出现在 window 时，往下拉会看到页面背后的底色（通常为白色）再弹回，在某些统一主题的页面上，这个效果将会变得很糟糕。

## 解决办法： 滑动内置

解决这个问题的核心办法就是滑动内置，window 固定，让内层元素滑动，语言苍白，直接看代码吧：

```javascript
window.addEventListener('touchmove', e => {
    e.preventDefault(); // touchmove 的默认行为就是滚动
}); 

element.addEventListener('touchmove', e => {
    e.stopPropagation(); // 阻止冒泡让需要滚动的元素能够滚动
}); 
```

## 完善

使用这个解决办法会使滚动元素漏出父元素的底色，可以通过设置父元素的 background 达到主题统一。
