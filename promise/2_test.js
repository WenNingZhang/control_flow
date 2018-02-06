let Promisee = require('./2_promisee.js');

let p = new Promisee((resolve, reject) => {
		// resolve('hello');
		setTimeout( () => resolve('hello'), 0);
});

p.then(console.log.bind(null, 'over'), console.log.bind(null, 'error'));