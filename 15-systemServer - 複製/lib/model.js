var path  = require('path');
var U     = require("./lib");
var File  = U.File;
var mongo = require('./mongo');
var M     = module.exports = {}

M.init = function*(root) {
  M.bookRoot = path.join(root, 'data/book');
  M.setting  = yield File.readJson(path.join(root, 'setting.json'));
//  console.log("M.setting=%j", M.setting);
  M.users    = M.setting.users;
  M.db       = yield mongo.open('bookdown');
  M.docTable = M.db.collection('doc');
}

M.close = function*() {
  yield mongo.close(M.db);
}

M.getBookPath = function(book) {
//  console.log("M.bookRoot=%s book=%s", M.bookRoot, book);
  return path.join(M.bookRoot, book);
}

M.getFilePath = function(book, file) {
  return path.join(M.getBookPath(book), file);
}

M.getBook = function*(book) {
  var bookJsonPath = path.join(M.getBookPath(book), "book.json");
  var bookObj = yield File.readJson(bookJsonPath);
//  console.log("book=%s bookJsonPath=%s", bookJsonPath);
  bookObj.id = book;
  return bookObj;
}

M.getBookFile = function*(book, file) {
  var filePath = M.getFilePath(book, file);
  var hasFile = yield File.fileExists(filePath);
  if (hasFile) {
    fileObj = { id:file };
    fileObj.md = yield File.readFile(filePath);
    return fileObj;
  }
}

M.saveBookFile = function*(book, file, md) {
  console.log("save:%s/%s\npost=%j", book, file, md);
  var filePath = M.getFilePath(book, file);
  yield File.writeFile(filePath, md);
  yield mongo.saveMd(M.docTable, md, filePath);
}

M.search = function*(keywords, q={}) {
  var results = yield mongo.search(M.docTable, keywords, q);
  console.log("==========================================");
  console.log("search(%s,%j)=%j", keywords, q, results);
  return results;
}

M.query = function*(q) {
  var results = yield mongo.query(M.docTable, q);
  console.log("==========================================");
  console.log("query(%j)=%j", q, results);
  return results;
}

M.uploadToDb = function*() {
  var fileList = yield File.recursiveList(M.bookRoot);
  yield mongo.importFiles(M.docTable, M.bookRoot, fileList);  
}


