let Promisee = require('./3_promisee')

let p = new Promisee((resolve, reject) => {
		// resolve('hello');
		setTimeout( () => resolve('hello'), 0 );
});

//对于promise来说，then之后要返回一个新的promise对象。
p.then( (val) => {
	console.log(val);
	return 'world';
})
.then((val) => {
	console.log(val);
	return 'over';
})