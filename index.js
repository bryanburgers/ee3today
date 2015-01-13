"use strict";

var http = require('http');
var fs = require('fs');
var replaceStream = require('replacestream');
var zlib = require('zlib');

var answer = process.env.ANSWER;
var port = parseInt(process.env.PORT, 10);

var cssFile = './css/no.css';
var htmlFile = './html/no.html';

if (answer === 'yes') {
	cssFile = './css/yes.css';
	htmlFile = './html/yes.html';
}

var css = fs.readFileSync(cssFile);

http.createServer(function (req, res) {
	var host = req.headers.host;
	var proto = req.headers['x-forwarded-proto'] || 'http';

	if (host === 'www.ee3.today' || (proto === 'http' && host === 'ee3.today')) {
		res.writeHead(301, { 'Location': 'https://ee3.today/' });
		res.end('<a href="https://ee3.today/">Redirect to https://ee3.today</a>');
		return;
	}

	if (req.url === '/') {
		var stream = fs.createReadStream(htmlFile)
			.pipe(replaceStream('{{{style}}}', css));
		if (req.headers['accept-encoding'] && req.headers['accept-encoding'].match(/\bgzip\b/)) {
			res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8', 'Content-Encoding': 'gzip' });
			stream.pipe(zlib.createGzip()).pipe(res);
		}
		else {
			res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
			stream.pipe(res);
		}
	}
	else if (req.url === '/favicon.ico') {
		res.writeHead(200, {'Content-Type': 'image/x-icon'});
		fs.createReadStream('./_root/favicon.ico')
			.pipe(res);
	}
	else if (req.url === '/robots.txt') {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		fs.createReadStream('./_root/robots.txt')
			.pipe(res);
	}
	else if (req.url === '/humans.txt') {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		fs.createReadStream('./_root/humans.txt')
			.pipe(res);
	}
	else if (req.url === '/no.css.map') {
		res.writeHead(200, {'Content-Type': 'application/json'});
		fs.createReadStream('./css/no.css.map')
			.pipe(res);
	}
	else if (req.url === '/yes.css.map') {
		res.writeHead(200, {'Content-Type': 'application/json'});
		fs.createReadStream('./css/yes.css.map')
			.pipe(res);
	}
	else {
		res.writeHead(404, {'Content-Type': 'text/html'});
		fs.createReadStream('./html/404.html').pipe(res);
	}
}).listen(port);
console.log("Listening on port " + port);
