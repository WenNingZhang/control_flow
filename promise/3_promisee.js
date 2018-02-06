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
	let handler = { };

	function fulfill(result) {
		state = FULFILLED;
		value = result;
		next(handler);
	}

	function reject(error) {
		state = REJECT;
		value = error;
		next(handler);
	}

	function next({onFulfill, onReject}) {
		switch(state) {
			case FULFILLED:
				onFulfill && onFulfill(value);
				break;
			case REJECT:
				onReject && onReject(value);
				break;
			case PENDING:
				handler = { onFulfill, onReject };
		}
	}

	this.then = function(onFulfill, onReject) {
		// then方法返回一个promise，
		// next({onFulfill, onReject});
		// 因为返回值为`promise`, 因此下一个promise要在这一个promise执行完成之后才可以。
		// .then要在上一个promise跑完之后，才能执行下一个promise。
		// 因此要上一次的promise放到这一次的promise里面。
		return new Promisee( (resolve, reject) => {
			next({
				onFulfill: (val) => {
					resolve(onFulfill(val));
				},
				onReject: (err) => {
					reject(onReject(err));
				}
			});
		});
	}

	fn(fulfill, reject);
}







