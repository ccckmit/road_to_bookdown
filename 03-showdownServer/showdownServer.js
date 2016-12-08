var fs = require('mz/fs');
var showdown  = require('showdown');
var koa = require('koa');
var serve = require('koa-static');
var path = require('path');

var app = koa();
var converter = new showdown.Converter();
converter.setOption('tables', true);

function *view(next) {
	yield next;
	if (this.path.startsWith("/view/")) { // convert *.md to html
	  var tpath = this.path.replace("/view/", "/user/");
		var fullpath = path.join(__dirname, tpath);
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
}

var rootpath = path.join(__dirname, '');
console.log("rootpath=%s", rootpath);
app.use(serve(rootpath));

app.use(view);

if (!module.parent) app.listen(3000);
console.log('listening on port 3000');
