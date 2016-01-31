'use strict';

const request = require('request');
const cheerio = require('cheerio');
const eventproxy = require('eventproxy');
const async = require('async');

let topics = ['19552521'];	// 主题数组
let result = [];	// 结果数组

// 对主题进行遍历，取每个主题前 10 页问题
topics.forEach((topic) => {
	let url = 'https://www.zhihu.com/topic/' + topic + '/questions?page=';
	for(let i = 1; i <= 10; i++){
		let currUrl = url + i;
		httpRequest(currUrl, process);
	}
})

// http 请求
function httpRequest(url, callback) {
	let delay = parseInt((Math.random() * 10000000) % 2000, 10);
	setTimeout(() => {
		request(url, (err, resp, body) => {
			if(!err && resp.statusCode == 200){
				callback(body, url);
			}
		})
	}, delay);
}

// 主处理函数
function process(data){

	let $ = cheerio.load(data);
	let questions = $('.feed-item .question-item-title a').toArray();
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
	let follow = $('#zh-question-side-header-wrap').text().match(/\d+/ig) || 0;

	let ques = {
		title: title,
		url: url,
		answer: Number(answer),
		follow: Number(follow)
	}

	if (answer < 20 && follow > 100) {
		result.push(ques);
		console.log(ques);
	};	
}


