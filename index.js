'use strict';

var request = require('request');

var url = 'https://www.zhihu.com/question/33946642';

request(url, (err, resp, body) => {
	console.log(body);
})