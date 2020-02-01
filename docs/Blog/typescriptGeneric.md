--- 
title: typescript 常用工具泛型
date: 2019-12- 13
sidebar: 'auto'
tags:
 - typescript
categories: 
 - 前端技术
---


本文将介绍一些 typescript 中常用的工具泛型的使用和实现，部分在 typescript 内部已经实现

## 关键字

在介绍这些泛型之前我们先理解一些 ts 中常用的关键字

- `keyof` : keyof 可以用来取得一个对象接口的所有 key 值, 得到一个联合类型.
- `typeof` : 推导变量类型.
- `in` : in 则可以遍历枚举类型.
- `infer` : 表示在 extends 条件语句中待推断的类型变量.
- `never` : 可靠的，代表永远不会发生的类型.
- `readonly` : 将属性标记为只读.

## Partial

Partial 作用是将传入的属性变为可选项

```typescript
type Partial<T> = { [k in keyof T]?: T[k] };
```

## Required

Required 作用是将传入属性变为必须项

```typescript
type Required<T> = { [k in keyof T]-?: T[k] };
```

## Readonly

Readonly 作用是将传入属性都标记为只读

```typescript
type Readonly<T> = { readonly [k in keyof T]: T[k] };
```

## Mutable

将传入属性的 readonly 标记移除

```typescript
type Mutable<T> = { -readonly [k in keyof T]: T[k] };
```

## 学习记录

将 K 中所有的属性的值转化为 T 类型

```typescript
type 学习记录<K extends keyof any, T> = { [P in K]: T };
```

## Pick

从 T 中取出 一系列 K 的属性

```typescript
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
```

## Exclude

从 T 中排除 U

```typescript
type Exclude<T, U> = T extends U ? never : T;
```

## Extract

从 T 中提取 U

```typescript
type Extract<T, U> = T extends U ? T : never;
```

## Omit

用之前的 Pick 和 Exclude 进行组合, 实现忽略对象某些属性功能

```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

## ReturnType

获取函数的返回类型

```typescript
type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R
	? R
	: never;
```

## Parameters

获取函数的参数类型

```typescript
type Parameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any
	? P
	: never;
```
