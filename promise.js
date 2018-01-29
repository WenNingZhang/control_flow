'use strick';

const PENDING   = Symbol();
const FULFILLED   = Symbol();
const REJECT   = Symbol();

function Promisee(fn) {
	//对fn做检查，判断fn是否为函数
	if (typeof fn !== 'function') {
		throw new Error('resolver should be a function');
	}

	let state = PENDING;	//默认是悬挂状态
	let value = null;		//和callback不一样，resolve和reject的第一个参数都是`value`,就一个参数而已
	let handler = { };

	function fulfill(result) {
		state = FULFILLED;
		value = result;
		handler.onFulfill(result);
	}
	function reject(error) {
		state = REJECT;
		value = error;
		handler.onReject(error);
	}

	this.then = function(onFulfill, onReject) {
		switch(state) {
			case FULFILLED:
				onFulfill(value);
				break;
			case REJECT:
				onReject(value);
				break;
			case PENDING:
				handler = { onFulfill, onReject };
		}
	}

	fn(fulfill, reject);
}


let p = new Promisee((resolve, reject) => {
		resolve('hello');
		// setTimeout( () => resolve('hello'), 0);
});

p.then(console.log.bind(null, 'over'), console.log.bind(null, 'error'));
