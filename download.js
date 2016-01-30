'use strict';

const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

const downloadDir = 'download';		// 下载文件存放目录	

const url = 'https://www.zhihu.com/question/37787176';

request(url, (err, resp, body) => {
	if(!err && resp.statusCode == 200){
		process(body);
	}
})

// 主处理函数
function process(data) {
	const $ = cheerio.load(data);
	const imgs = $('.zm-editable-content img').toArray();

	imgs.forEach((img) => {
		const imgsrc = img.attribs.src;
		if(!imgsrc.startsWith('//zhstatic')){
			const filename = getFileName(imgsrc);
			downloadImg(imgsrc, filename, () => {
				console.log(filename + ' done.');
			});
		}
	})
}

// 根据路径获取文件名
function getFileName(url) {
	const filename = path.basename(url);
	return filename;
}

// 下载图片，如果下载文件夹不存在，则创建
function downloadImg(uri, filename, callback) {
	request.head(uri, (err, resp, body) => {
		if(err){
			console.log('err: ' + err);
			return false;
		}
		if(!fs.existsSync(downloadDir)){
			fs.mkdirSync(downloadDir);
		}
		request(uri).pipe(fs.createWriteStream(downloadDir + '/' + filename)
			.on('close', callback));
	})
}