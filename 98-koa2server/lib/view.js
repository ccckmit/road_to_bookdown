var fs = require("fs");
var path = require("path");
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

V.newTemplate=function(file) {
	return handlebars.compile(fs.readFileSync(path.join(V.viewPath, file), "utf8"));
}

V.md2html = function(md) {
  return converter.makeHtml(md);	
}

V.viewRender=function(bookObj, fileObj) {
  fileObj.html = V.md2html(fileObj.md);
	console.log("bookObj=", bookObj);
	console.log("fileObj=", fileObj);
	return V.render.view({book:bookObj, file:fileObj});
}


