'use strict';

const request = require('request');
const cheerio = require('cheerio');

let url = 'https://www.zhihu.com/topic/19569535';

httpRequest(url, process);

// http 请求
function httpRequest(url, callback) {
	request(url, (err, resp, body) => {
		if(!err && resp.statusCode == 200){
			callback(body, url);
		}
	})
}

// 主处理函数
function process(data){

	let $ = cheerio.load(data);
	let questions = $('.feed-item .content h2 a').toArray();
	questions.forEach((ques) => {
		let url = 'https://www.zhihu.com' + ques.attribs.href;
		httpRequest(url, parseEach);
	})
}

// 解析每个问题
function parseEach(data, url) {

	let $ = cheerio.load(data);
	let title = $('#zh-question-title .zm-item-title').text().replace(/(^\s+)|(\s+$)/g,"");
	let answer = $('#zh-question-answer-num').attr('data-num') || 0;
	let follow = $('#zh-question-side-header-wrap').text().match(/\d+/ig)[0];

	let ques = {
		title: title,
		url: url,
		answer: Number(answer),
		follow: Number(follow)
	}

	console.log(ques);

}