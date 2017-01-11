var path  = require('path');
var io = require("./io");
// var File  = U.File;
var mongo = require('./mongo');
var MD    = require('./markdown');
var M     = module.exports = {}

M.init = function*(root) {
  M.bookRoot = path.join(root, 'data/book');
  var settingMdo = yield io.readFile(path.join(root, 'setting', 'setting.mdo'));
  M.setting  = MD.parseMdo(settingMdo);
  M.setting.users = MD.index(M.setting.users, 'user');
  console.log("M.setting=%j", M.setting);
  M.users    = M.setting.users;
  try {
    M.db       = yield mongo.open('bookdown');
    M.docTable = M.db.collection('doc');    
    M.fileTable = M.db.collection('file');
  } catch (e) {
    console.log("Mongodb connect fail : no database supported !");
  }
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
  var bookFile = path.join(M.getBookPath(book), "book.mdo");
  var bookMdo  = yield io.readFile(bookFile);
  var bookObj  = MD.parseMdo(bookMdo);
  bookObj.book = book;
  return bookObj;
}

M.getBookFile = function*(book, file) {
  var filePath = M.getFilePath(book, file);
  var hasFile = yield io.fileExists(filePath);
  if (hasFile) {
    fileObj = { book:book, file:file };
    fileObj.text = yield io.readFile(filePath);
    return fileObj;
  }
}

M.saveBookFile = function*(book, file, text) {
  console.log("save:%s/%s\npost=%j", book, file, text);
  var filePath = M.getFilePath(book, file);
  yield io.writeFile(filePath, text);
  if (typeof M.db === 'undefined') return;
  if (file.endsWith(".md"))
    yield mongo.saveMd(M.docTable, text, filePath);
  else
    yield mongo.saveJson(M.docTable, io.parseJson(text), filePath);
}

M.createBook = function*(book, user) {
  console.log("createBook:%s", book);
  var isMkdir = yield io.mkdir(M.getBookPath(book));
  yield io.writeFile(M.getBookPath(book)+'/book.mdo', 
    'title:Book Title\neditor:'+user+'\nchapters:\ntitle        | link\n-------------|---------\nChapter1     | chapter1.md');
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
  var fileList = yield io.recursiveList(M.bookRoot);
  yield mongo.importFiles(M.docTable, M.bookRoot, fileList);  
}
