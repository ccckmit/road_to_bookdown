var U     = require("./lib");
var path  = require('path');
var M     = module.exports = {}

M.init = function(root) {
	M.bookRoot = path.join(root, 'user/book');
	M.setting  = U.File.readJsonSync(path.join(root, 'setting.json'));
//  console.log("M.setting=%j", M.setting);
  M.users    = M.setting.users;
}

M.getBookPath = function(book) {
  return path.join(M.bookRoot, book);
}

M.getFilePath = function(book, file) {
  return path.join(M.getBookPath(book), file);
}

M.getBook = function*(book) {
	var bookJsonPath = path.join(M.getBookPath(book), "book.json");
	var bookObj = yield U.File.readJson(bookJsonPath);
	console.log("book=%s bookJsonPath=%s", bookJsonPath);
	bookObj.id = book;
	return bookObj;
}

M.getBookFile = function*(book, file) {
  var filePath = M.getFilePath(book, file);
	var hasFile = yield U.File.fileExists(filePath);
	if (hasFile) {
	  fileObj = { id:file };
		fileObj.md = yield U.File.readFile(filePath);
		return fileObj;
	}
}

M.saveBookFile = function*(book, file, md) {
	console.log("save:%s/%s\npost=%j", book, file, md);
	var filePath = M.getFilePath(book, file);
	yield U.File.writeFile(filePath, md);
}


