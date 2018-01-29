'use strict';

const PENDING = Symbol();
const FULFILLED = Symbol();
const REJECTED = Symbol();

function Promisee(fn) {
  if (typeof fn != 'function') {
    throw new Error('resolver should be a function!');
  }

  let state = PENDING;
  let value = null;
  let handler = [];

  function fulfill(result) {
    state = FULFILLED;
    value = result;
    handler.forEach(next);
    handler = null;
  }

  function reject(err) {
    state = REJECTED;
    value = err;
    handler.forEach(next);
    handler = null;
  }

  function resolve(result) {
    try {
      let then = typeof result.then == 'function' ? result.then : null;
      if (then) {
        then.bind(result)(resolve, reject);
        return;
      }
      fulfill(result);
    } catch(err) {
      reject(err);
    }
  }

  function next({onFulfill, onReject}) {
    switch(state) {
      case FULFILLED:
        onFulfill && onFulfill(value);
        break;
      case REJECTED:
        onReject && onReject(value);
        break;
      case PENDING:
        handler.push({onFulfill, onReject});
    }
  }

  this.then = function (onFulfill, onReject) {
    return new Promisee((resolve, reject) => {
      next({
        onFulfill: (val) => {
          try {
            resolve(onFulfill(val));
          } catch (err) {

          }
        }, 
        onReject: (err) => {
          reject(onReject(val));
        }
      });
    });
  }  

  fn(resolve, reject);
}


let p = new Promisee((resolve, reject) => {
		// resolve('hello');
		setTimeout( () => resolve('hello'), 0);
});

var sleep = (sec) => {
	return new Promisee( (resolve, reject) => {
		setTimeout( () => resolve(sec), sec * 1000);
	});
}

//对于promise来说，then之后要返回一个新的promise对象。
p.then( (val) => {
	console.log(val);
	return sleep(1);
})
.then((val) => {
	console.log(val);
	return 'over';
})







