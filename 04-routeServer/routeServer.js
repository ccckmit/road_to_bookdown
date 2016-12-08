var fs = require('mz/fs');
var showdown = require('showdown');
var koa = require('koa');
var serve = require('koa-static');
var route = require('koa-route');
var path = require('path');

function *view(book, file) { // view(mdFile):convert *.md to html
	var fullpath = path.join(__dirname, "/user/"+book+"/"+file);
	var fstat = yield fs.stat(fullpath);
	if (fstat.isFile()) {
		if (this.path.endsWith(".md")) {
			this.type = "html";
			var md = yield fs.readFile(fullpath, "utf8");
			this.body = converter.makeHtml(md);
		} else {
			this.type = path.extname(this.path);
			this.body = fs.createReadStream(fullpath);
		}
	}
}

var app = koa();
var converter = new showdown.Converter();
converter.setOption('tables', true);

app.use(serve(path.join(__dirname, '')));

app.use(route.get('/view/:book/:file', view));


if (!module.parent) app.listen(3000);
console.log('listening on port 3000');
