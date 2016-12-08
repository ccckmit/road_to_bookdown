var fs = require("fs");
var handlebars = require("handlebars");
var showdown  = require('showdown');
var converter = new showdown.Converter();

var md = fs.readFileSync("user/markdown/markdown.md", "utf8");
var viewHtml   = fs.readFileSync("view.html", "utf8");
var viewRender = handlebars.compile(viewHtml);

var bookJson = fs.readFileSync("user/markdown/book.json", "utf8");
var book = JSON.parse(bookJson);
book.html = converter.makeHtml(md);

var html = viewRender(book);
fs.writeFileSync("user/markdown/markdown.html", html);
