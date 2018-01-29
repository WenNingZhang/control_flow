
### 第一阶段
```
let p = new Promise((resolve, reject) => {
		resolve('hello');
		// reject('world');
});

p.then(console.log.bind(null, 'over'), console.log.bind(null, 'error'));

```

这是原生的promise，下面会通过代码实现这个东西。

因为使用`promise`关键字会把原生的promise覆盖掉，这里定义函数为`promisee`。

promise的三种状态`pending`(悬挂状态，默认是悬挂状态)，`fulfilled`(已成功)，`rejected`(以失败)。

```
Function#bind is for just that situation: It lets you create a new function that, when called, will call the original with this set to the value you give.
```
bind函数解析


### 第二阶段-->解决promise异步问题

```
let p = new Promisee((resolve, reject) => {
		setTimeout( () => resolve('hello'), 0);
});

p.then(console.log.bind(null, 'over'), console.log.bind(null, 'error'));
```

这样发现promise 竟然没打印出来， 而原生的promise是可以的。而promise是支持异步的解决方案而闻名，因此这个问题要解决的。

分析一下原因:

因为`setTimeout( () => resolve('hello'), 0);`是异步的。

当程序执行到这里后，发现是异步的，就往下执行啦，当执行p.then时，这时state=PENDING，因此什么也没打印出来

主任务栈执行完后，`task queue`的任务出栈，再去执行`resolve('hello')`;

解决方案: 

当执行到`pending`状态后，通过一个变量`handler`把`console.log.bind(null, 'over'), console.log.bind(null, 'error')` 。先执行主任务栈，主任务栈清空后，`task queune`的任务出栈后再执行存下来的函数，就可以啦。

接下来问题又出现啦。

```
let p = new Promisee((resolve, reject) => {
		resolve('hello');
		// setTimeout( () => resolve('hello'), 0);
});

p.then(console.log.bind(null, 'over'), console.log.bind(null, 'error'));
```

注释`setTimeout`后，又报错啦，这是因为在调用fulfill函数后，handler中还没有保存then中的函数。

在`promise2中`对函数进行一次改写。改写成`next`，这样就可以啦。




### 第三阶段---> .then()多个。这里的实现还是不懂的，回来再看。

promise3.js

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
})

```

先看看这段代码做了什么事情。

p.then是返回一个`Promisee`对象，而这个`Promisee`对象调用`next`函数。

这时候`state`是pending状态，因此走`handler = { onFulfill, onReject };`,
把调用函数存储下来。



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

再次走`fulfill('world')`函数，state为FULFILLED，value为`world`，在接着调用next()函数。

switch中调用的是FulFILLED，但是`onfunlfill`不存在，因此结束。







这里先要理解一个东西

```
new Promisee( (resolve, reject) => {
		setTimeout( () => resolve('hello'), 0);
})
```

其中 fn 为实参，而 (resolve, reject) => { setTimeout( () => resolve('hello'), 0)} 是形参。

其中fn(fulfill, reject)相当于调用函数`{ setTimeout( () => resolve('hello'), 0)}`，而`fulfill, reject`是实参，两个函数，把函数传进去，而resolve('hello'),相当于调用
fulfill(result)函数。



### 第四阶段---> 返回一个promise对象，执行。






































