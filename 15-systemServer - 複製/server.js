var fs      = require('mz/fs');
var co      = require('co');
var koa     = require('koa');
var serve   = require('koa-static');
var route   = require('koa-route');
var cobody  = require('co-body');
var path    = require('path');
var session = require('koa-session');
var app     = koa();
var M       = require("./lib/model");
var V       = require("./lib/view");

var response=function(self, code, msg) {
	var res = self.response;
  res.status = code;
  res.set({'Content-Length':''+msg.length,'Content-Type':'text/plain'});
  res.body = msg;
  if (code !== 200) console.log('response error : ', code, msg);
}

var isPass = function(self) {
  return typeof(self.session.user)!=='undefined';
}

var parse = function *(self) {
	var json = yield cobody(self);
	return JSON.parse(json);
}

var view = function *(book, file) { // view(mdFile):convert *.md to html
  console.log("view:book=%s file=%s", book, file);
  if (file.endsWith(".md")) {
    var bookObj = yield M.getBook(book);
    var fileObj = yield M.getBookFile(book, file);
		if (typeof fileObj !== 'undefined') {
			var page = V.viewRender(bookObj, fileObj);
			this.body = page;
		}
	} else {
		this.type = path.extname(this.path);
		this.body = fs.createReadStream(M.getFilePath(book, file));
	}
}

var save = function *(book, file) { // save markdown file.
  if (!isPass(this)) {
    response(this, 401, 'Please login to save!');
  } else {
		try {
			var post = yield parse(this);
			console.log("save:%s/%s\npost=%j", book, file, post.md);
			yield M.saveBookFile(book, file, post.md);
			response(this, 200, 'Save Success!');
		} catch (e) {
			response(this, 403, 'Save Fail!'); // 403: Forbidden			
		}
	}
}

var search = function *() {
	try {
		var key = this.query.key||"", q = JSON.parse(this.query.q||"{}");
		console.log("query=%j", this.query);
		var results = yield M.search(key, q)
		response(this, 200, JSON.stringify(results));
	} catch (e) {
		response(this, 403, e.stack);
	}
}

var login = function *() {
  var post = yield parse(this);
	console.log("login:post=%s", JSON.stringify(post));
	var user = M.users[post.user];
	if (user.password === post.password) {
    response(this, 200, 'Login Success!');
    this.session.user = post.user;
	}
  else
    response(this, 403, 'Login Fail!'); // 403: Forbidden
}

var logout =function *() {
	delete this.session.user;
	response(this, 200, 'Logout Success!');
}

app.keys = ['#*$*#$)_)*&&^^'];

var CONFIG = {
  key: 'koa:sess', // (string) cookie key (default is koa:sess)
  maxAge: 86400000, // (number) maxAge in ms (default is 1 days)
  overwrite: true, // (boolean) can overwrite or not (default true)
  httpOnly: true, // (boolean) httpOnly or not (default true)
  signed: true, // (boolean) signed or not (default true)
};

app.use(session(CONFIG, app));;
app.use(serve('web'));
app.use(serve('user'));

app.use(route.get('/', function*() { this.redirect('/view/home/README.md') }));
app.use(route.get('/search', search));
app.use(route.get('/view/:book/:file', view));
app.use(route.post('/save/:book/:file', save));
app.use(route.post('/login', login));
app.use(route.post('/logout', logout));

co(function*() {
	yield M.init(__dirname);
	V.init(__dirname);
	if (!module.parent) app.listen(3000);
  console.log('listening on port 3000');
});

