var fs = require('mz/fs');
var showdown = require('showdown');
var handlebars = require('handlebars');
var koa = require('koa');
var serve = require('koa-static');
var route = require('koa-route');
var path = require('path');

var render = { 
  view:handlebars.compile(fs.readFileSync("view.html", "utf8")),
}

function *view(book, file) { // view(mdFile):convert *.md to html
  var bookPath = path.join(__dirname, "/user/"+book);
	var filePath = path.join(__dirname, "/user/"+book+"/"+file);
	var fstat = yield fs.stat(filePath);
	if (fstat.isFile()) {
		if (this.path.endsWith(".md")) {
			this.type = "html";
			var md = yield fs.readFile(filePath, "utf8");
			var bookJson = yield fs.readFile(bookPath+"/book.json", "utf8");
			var book = JSON.parse(bookJson);
			book.html = converter.makeHtml(md);
			var page = render.view(book);
			console.log("page=", page);
			this.body = page;
		} else {
			this.type = path.extname(this.path);
			this.body = fs.createReadStream(filePath);
		}
	}
}
/*
var md = fs.readFileSync("user/markdown/markdown.md", "utf8");
var viewHtml   = fs.readFileSync("view.html", "utf8");
var viewRender = handlebars.compile(viewHtml);

var bookJson = fs.readFileSync("user/markdown/book.json", "utf8");
var book = JSON.parse(bookJson);
book.html = converter.makeHtml(md);

var html = viewRender(book);
fs.writeFileSync("user/markdown/markdown.html", html);
*/
var app = koa();
var converter = new showdown.Converter();
converter.setOption('tables', true);

app.use(serve(path.join(__dirname, '')));

app.use(route.get('/view/:book/:file', view));


if (!module.parent) app.listen(3000);
console.log('listening on port 3000');
