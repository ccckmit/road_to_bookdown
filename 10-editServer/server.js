var fs = require('mz/fs');
var showdown = require('showdown');
var handlebars = require('handlebars');
var koa = require('koa');
var serve = require('koa-static');
var route = require('koa-route');
var parse = require('co-body');
var path = require('path');

var converter = new showdown.Converter();
converter.setOption('tables', true);

var userPath = path.join(__dirname, 'user');

var render = { 
  view:handlebars.compile(fs.readFileSync("render/view.html", "utf8")),
}

var getFilePath=function(book, file) {
	return path.join(userPath, "/book/"+book+"/"+file);
}

function *view(book, file) { // view(mdFile):convert *.md to html
  var bookPath = path.join(userPath, "/book/"+book);
	var filePath = path.join(userPath, "/book/"+book+"/"+file);
	var fstat = yield fs.stat(filePath);
	if (fstat.isFile()) {
		if (this.path.endsWith(".md")) {
			this.type = "html";
			var md = yield fs.readFile(filePath, "utf8");
			var bookJson = yield fs.readFile(bookPath+"/book.json", "utf8");
			var bookObj = JSON.parse(bookJson);
			bookObj.book = book;
			bookObj.file = file;
			bookObj.md = md;
			bookObj.html = converter.makeHtml(md);
			var page = render.view(bookObj);
			this.body = page;
		} else {
			this.type = path.extname(this.path);
			this.body = fs.createReadStream(filePath);
		}
	}
}

function response(res, code, msg) {
  res.status = code;
  res.set({'Content-Length':''+msg.length,'Content-Type':'text/plain'});
  res.body = msg;
	if (code !== 200) console.log('response error : ', code, msg);
}

function *save(book, file) { // save markdown file.
  var res = this.response;
  var post = yield parse(this);
  console.log("save:%s/%s\npost=%j", book, file, post);
	var filePath = getFilePath(book, file);
//  console.log("save:filePath=", filePath);
//	var md = yield fs.readFile(filePath, "utf8");	
  yield fs.writeFile(filePath, post).then(function() {
    response(res, 200, 'write success!');
  }).catch(function() {
    response(res, 403, 'write fail!'); // 403: Forbidden
  });
}

var app = koa();

app.use(serve(path.join(__dirname, 'web')));
app.use(serve(userPath));

app.use(route.get('/', function*() { this.redirect('/view/markdown/README.md') }));
app.use(route.get('/view/:book/:file', view));
app.use(route.post('/save/:book/:file', save));


if (!module.parent) app.listen(3000);
console.log('listening on port 3000');
