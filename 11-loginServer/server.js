var fs    = require('mz/fs');
var koa   = require('koa');
var serve = require('koa-static');
var route = require('koa-route');
var cobody = require('co-body');
var session = require('koa-session');
var path  = require('path');
var showdown = require('showdown');
var handlebars = require('handlebars');

var converter = new showdown.Converter();
converter.setOption('tables', true);

var File={
	readJsonSync:function(file) {
    var json = fs.readFileSync(file, "utf8");
		return JSON.parse(json);
	},
	readJson:function *readJson(file) {
		return yield fs.readFile(filePath, "utf8");		
	},
};

var rootPath = __dirname;
var setting = File.readJsonSync(path.join(rootPath, 'setting.json'));
var users   = setting.users;

var userPath = path.join(rootPath, 'user');

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

function response(self, code, msg) {
	var res = self.response;
  res.status = code;
  res.set({'Content-Length':''+msg.length,'Content-Type':'text/plain'});
  res.body = msg;
  if (code !== 200) console.log('response error : ', code, msg);
}

function *parse(self) {
	var json = yield cobody(self);
	return JSON.parse(json);
}

function isPass(self) {
  return typeof(self.session.user)!=='undefined';
}

function *save(book, file) { // save markdown file.
  if (!isPass(this)) {
    response(this, 401, 'Please login to save!');
  } else {
		var post = yield parse(this);
		console.log("save:%s/%s\npost=%j", book, file, post.md);
		var filePath = getFilePath(book, file);
		var self = this;
		yield fs.writeFile(filePath, post.md).then(function() {
			response(self, 200, 'Save Success!');
		}).catch(function() {
			console.log("this.response=", JSON.stringify(this.response));
			response(self, 403, 'Save Fail!'); // 403: Forbidden
		});
	}
}

function *login() {
  var post = yield parse(this);
	console.log("login:post=%s", JSON.stringify(post));
	var user = users[post.user];
	if (user.password === post.password) {
// 	if (post.user === "ccc" && post.password==="123") {
    response(this, 200, 'Login Success!');
    this.session.user = post.user;
	}
  else
    response(this, 403, 'Login Fail!'); // 403: Forbidden
}

function *logout() {
	delete this.session.user;
	response(this, 200, 'Logout Success!');
}

var app = koa();

app.keys = ['#*$*#$)_)*&&^^'];

var CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
};

app.use(session(CONFIG, app));;
app.use(serve(path.join(__dirname, 'web')));
app.use(serve(userPath));

app.use(route.get('/', function*() { this.redirect('/view/markdown/README.md') }));
app.use(route.get('/view/:book/:file', view));
app.use(route.post('/save/:book/:file', save));
app.use(route.post('/login', login));
app.use(route.post('/logout', logout));


if (!module.parent) app.listen(3000);
console.log('listening on port 3000');
