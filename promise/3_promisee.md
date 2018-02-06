### 第三阶段

.then()多个。


因为每个`then`都会返回一个promise，

上一个promise跑完之后，才可以执行下一个promise，这里

分析:现在先看一个then方法，`setTimeout`是异步方法，因此不会执行，
这里先看then方法。

这里我要一步一步分析一下:

先看只有一个`then`，使用`setTimeout`是异步方法，要进入`stack queue`，js代码直接执行同步任务。

```
p.then( (val) => {
	console.log(val);
	return 'world';
} )

```

先看看这段代码做了什么事情。

p.then是返回一个`Promisee`对象，而这个`Promisee`对象调用`next`函数。

这时候`state`是pending状态，因此走`handler = { onFulfill, onReject };`,
再调用函数存储下来。

现在`then`做的事情完成啦，主任务栈清空，执行`stack queue`中的函数。

这时执行`resolve('hello')`;

```
function fulfill(result) {
	state = FULFILLED;
	value = result;
	next(handler);
}
```
执行next(handler)，现在状态是`FULFILLED`，从而执行`onFulfill(value)`函数。
其中value是 hello，

```
 (val) => {
			resolve(onFulfill(val));
		 },
```

onFulFill(val) 是执行函数
```
(val) => {
	console.log(val);
	return 'world';
}
```

因此会打印hello, 而返回值为`world`，这时会调用新的`Promisee`，调用是新的promisee的`resolve('world')`，

再次走`fulfill('world')`函数，state为FULFILLED，value为`world`，再接着调用next()函数。

switch中调用的是FulFILLED，但是`onfunlfill`不存在，因此结束。




