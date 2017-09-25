let fs = require('fs');
let http = require('http');

let isExists = file => {
	return new Promise( (resolve,reject) => {
		fs.stat(file, (err, stats) => {
			if (err) {
				reject(err);
			} else {
				resolve(stats);
			}
		});
	})
}

let readFile = file => {
	return new Promise( (resolve,reject) => {
		fs.readFile(file, 'utf8', (err, data) => {
			if (err || file.indexOf('..') != -1) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	})
}

let server = http.createServer( (req, res) => {
	console.log('Request received: '+req.url);
	let fileToLoad = '.'+req.url;

	if (fileToLoad == './') {
		fileToLoad = './index.html';
	}

	isExists(fileToLoad)
		.then( () => readFile(fileToLoad) )
		.catch( () => {
			res.statusCode = 404;
			return 'error 404';
		})
		.then( content => {
			res.write(content);
			res.end();
		})
});

server.listen(7777);
console.log(`Server started at port ${server.address().port}`);
