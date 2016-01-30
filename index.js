'use strict';

const request = require('request');
const cheerio = require('cheerio');

const url = 'https://www.zhihu.com/question/39943474';

request(url, (err, resp, body) => {
	if(!err && resp.statusCode == 200){
		process(body);
	}
})

// 主处理函数
function process(data) {

	const $ = cheerio.load(data);
	const answerNum = $('#zh-question-answer-num').attr('data-num') || 0;
	const followNum = $('#zh-question-side-header-wrap').text().match(/\d+/ig);

	console.log('回答人数: ' + answerNum);
	console.log('关注人数: ' + followNum);

}