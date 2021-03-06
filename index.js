'use strict';

const http = require("http"),
	cheerio = require('cheerio'),
	eventproxy = require('eventproxy'),
	superagent = require("superagent"),
	async = require('async');

let ep = new eventproxy();

let topics = ['19552521'],	// 主题数组
	pageUrls = [],	// 分页url
	result = [];	// 结果数组

let url = 'https://www.zhihu.com/topic/19552521/questions?page=';
for (let i = 1; i <= 50; i++) {
    let currUrl = url + i;
    pageUrls.push(currUrl);
}

let pageUrlCount = 0;

let crawlPage = (url, callback) => {
    // 设定一个500-1500毫秒之间的时延，不然会导致request过于频繁，不过这个时间间隔还没找到合适值
    let delay = parseInt(Math.random() * 1000 + 500);

    pageUrlCount++;
    console.log('现在的并发数是', pageUrlCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');

    httpRequest(url, process);

    setTimeout(() => {
        pageUrlCount--;
        callback(null, url + ' content call back');
    }, delay);
}

// 线程太多也会导致request过于频繁，如果是pageUrls超过50，线程为5就会有一定概率炸了
async.mapLimit(pageUrls, 2, (url, callback) => {
    crawlPage(url, callback);
}, (err, res) => {
    console.log(res);
}); 

// 当所有 'QuestionUrl' 事件完成后的回调触发下面事件
ep.after('QuestionUrl', pageUrls.length * 20, (quesUrls) => {
    

    let quesUrlCount = 0;

    let crawlEach = (url, callback) => {

        // 设定一个500-1500毫秒之间的时延，不然会导致request过于频繁，不过这个时间间隔还没找到合适值
    	let delay = parseInt(Math.random() * 900 + 500);

    	quesUrlCount++;
    	console.log('现在的并发数是', quesUrlCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');

    	httpRequest(url, parseEach);

    	setTimeout(() => {
        	quesUrlCount--;
        	callback(null, url + ' content call back');
        }, delay);
    };

    async.mapLimit(quesUrls, 5, (url, callback) => {
    	crawlEach(url, callback);
    }, (err, res) => {
    	console.log(res);
    	console.log(result);
    }); 

})

// http 请求
function httpRequest(url, callback) {
    superagent.get(url)
        .end((err, pres) => {
            if (err) {
                console.log(err);
            }
            callback(pres.text, url);
        })
}

// 主处理函数
function process(data) {

    let $ = cheerio.load(data);
    let questions = $('.feed-item .question-item-title a').toArray();
    questions.forEach((ques) => {
        let url = 'https://www.zhihu.com' + ques.attribs.href;
    	ep.emit('QuestionUrl', url);
	})
}

// 解析每个问题
function parseEach(data, url) {

    let $ = cheerio.load(data);
    let title = $('#zh-question-title .zm-item-title').text().replace(/(^\s+)|(\s+$)/g, "");
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
    }
    
}
