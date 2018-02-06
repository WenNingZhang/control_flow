### 第二阶段-->解决promise异步问题

如果将上述代码改成这样
```
let p = new Promisee((resolve, reject) => {
		setTimeout( () => resolve('hello'), 0);
});

p.then(console.log.bind(null, 'over'), console.log.bind(null, 'error'));
```

这样发现 promise 竟然没打印出来， 而原生的promise是可以的。而promise是支持异步的解决方案而闻名，因此这个问题要解决的。

#### 分析下原因

因为`setTimeout( () => resolve('hello'), 0);`是异步的。

当程序执行到这里后，发现是异步的，就往下执行啦，当执行p.then时，这时state=PENDING，因此什么也没打印出来

主任务栈执行完后，`task queue`的任务出栈，再去执行`resolve('hello')`;

#### 预备知识

解析对象

```
var o = {p: 42, q: true};
var {p, q} = o;

console.log(p); // 42
console.log(q); // true

```

#### 解决方案

+ 当执行到`pending`状态后，通过一个变量对象`handler`把`console.log.bind(null, 'over'), console.log.bind(null, 'error')`存储下来 。
+ 先执行主任务栈，主任务栈清空后，`task queune`的任务出栈后再执行存下来的函数，就可以啦。

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