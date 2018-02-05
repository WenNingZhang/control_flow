'use strick';

const PENDING   = Symbol();
const FULFILLED   = Symbol();
const REJECT   = Symbol();

module.exports = Promisee;

function Promisee(fn) {
	//对fn做检查，判断fn是否为函数
	if (typeof fn !== 'function') {
		throw new Error('resolver should be a function');
	}

	let state = PENDING;	//默认是悬挂状态
	let value = null;		//和callback不一样，resolve和reject的第一个参数都是`value`,就一个参数而已

	function fulfill(result) {
		state = FULFILLED;
		value = result;
	}
	function reject(error) {
		state = REJECT;
		value = error;
	}

	this.then = function(onFulfill, onReject) {
		switch(state) {
			case FULFILLED:
				onFulfill(value);
				break;
			case REJECT:
				onReject(value);
				break;
		}
	}
	fn(fulfill, reject);
}


