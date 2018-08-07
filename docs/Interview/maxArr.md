# 找出一个具有最大和的连续子数组

## 题目
首先 , 我们看一下题目
给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

示例:

输入: [-2,1,-3,4,-1,2,1,-5,4],

输出: 6

解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。

中文版 题目: https://leetcode-cn.com/problems/maximum-subarray/description/

英文版 题目: https://leetcode.com/problems/maximum-subarray/description/

## 我的答案

```js
let arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
function maxArr(arr) {
    let maxSum = arr[0];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i; j < arr.length; j++) {
            let curSum = 0;
            for (let k = i; k <= j; k++) {
                curSum += arr[k];
            }
            maxSum = curSum > maxSum ? curSum : maxSum
        }
    }
    return maxSum
}
console.log(maxArr(arr));
```

## 大佬总结

```js
var maxSubArray = function (nums) {
    let maxSum = nums[0];
    let dpCurrent = nums[0];
    for (let i = 1; i < nums.length; i++) {
        dpCurrent = Math.max(nums[i], nums[i] + dpCurrent);
        maxSum = Math.max(maxSum, dpCurrent);
    }
    return maxSum;
};
```
状态转移公式
```
nums 是我们的源数组 nums[i] 就是我们的当前元素
currentMax[i]   记录 我们以i 结尾的子序列里 最大的一个子序列

那么 currentMax [i] = max(currentMax[i - 1] + nums[i], nums[i])
```

[附]变态版算法
```js
var maxSequence = function(arr){
    return arr.reduce(function(p,c){
        c = Math.max((p&0xFFFF)+c,0);
        return (Math.max(p>>16,c)<<16)+c;
    },0)>>16;
}
```