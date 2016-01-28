'use strict';

const superagent = require('superagent');

superagent.get('https://www.baidu.com')
	.end(function(err, res) {
		console.log(res);
	})