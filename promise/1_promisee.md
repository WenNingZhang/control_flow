### 第一阶段

实现一个同步promise逻辑。

#### 预备知识

#### 1. 使用`Symbol`创建常量。

 + Symbol是完全不一样的东西。一旦创建就不可更改，不能对它们设置属性。
 + 另一方面，每个Symbol是独一无二的，不与其他Symbol重复(即使是使用相同的Symbol创建)。

#### 2. promise的三种状态

+ `pending`(悬挂状态，默认是悬挂状态)
+ `fulfilled`(已成功)
+ `rejected`(以失败)

#### 代码逻辑

执行下面代码的逻辑是:
```
let p = new Promisee((resolve, reject) => {
		resolve('hello');
});
```

----> 执行1_promisee.js中的37行代码`fn(fulfill, reject)`，这时实参是函数
```
(resolve, reject) => {
		resolve('hello');
}
```
形参是fn，然后调用fn函数，实际上调用函数中的`resolve('hello')`，
而这个函数对应的是promisee.js中的
```
	function fulfill(result) {
		state = FULFILLED;
		value = result;
	}
```
函数。

下一篇文章解决promise的异步问题