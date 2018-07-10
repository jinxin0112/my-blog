# SQL 写法记录

## SQL标准写法

1.关键字大写    

2.库、表、字段需要加上反引号

## 增-INSERT
INSERT INTO 表 (字段列表)VALUES(值列表)

INSERT INTO `user_table` (`ID`, `username`, `password`) VALUES(0, 'jinxin', '123456')

## 删-DELETE

## 改-UPDATE

## 查-SELECT
SELECT 什么 FROM 表

SELECT * FROM `user_table`;