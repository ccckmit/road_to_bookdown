var showdown  = require('showdown');
var converter = new showdown.Converter();
var md        = '#hello, markdown!';
var html      = converter.makeHtml(md);
console.log("======== Markdown =====\n", md);
console.log("======== HTML =====\n", html);
