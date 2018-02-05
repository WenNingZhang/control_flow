let Promisee = require('./1_promisee');

let p = new Promisee((resolve, reject) => {
		resolve('hello');
});

p.then(console.log.bind(null, 'over'), console.log.bind(null, 'error'));