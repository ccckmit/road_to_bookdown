var fs = require("fs");
var path = require("path");
var MD   = require("./markdown");
var showdown = require('showdown');
var handlebars = require('handlebars');

var converter = new showdown.Converter();
converter.setOption('tables', true);

var V = module.exports = {}

V.init = function(root) {
  V.viewPath = path.join(root, "view");
  V.render = {
    view:V.newTemplate("view.html"),
  }
}

V.newTemplate= function(file) {
  return handlebars.compile(fs.readFileSync(path.join(V.viewPath, file), "utf8"));
}

V.mdToHtml = function(md) {
  return converter.makeHtml(md);
}

V.viewRender=function(bookObj, fileObj) {
	if (fileObj.file.endsWith(".md"))
		fileObj.html = V.mdToHtml(fileObj.text);
  else
    fileObj.html = '```\n'+fileObj.text+'\n```';
  return V.render.view({book:bookObj, file:fileObj});
}


