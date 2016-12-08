var fs        = require('fs');
var showdown  = require('showdown');
var converter = new showdown.Converter();

showdown.setFlavor('github');
converter.setOption('tables', true);

var md        = fs.readFileSync("markdown.md", "utf8");
var html      = converter.makeHtml(md);
fs.writeFileSync("markdown.html", html);

