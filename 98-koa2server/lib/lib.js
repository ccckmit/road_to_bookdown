var fs = require('mz/fs');
var U  = module.exports = {}

U.File={
	readJsonSync:function(file) {
    var json = fs.readFileSync(file, "utf8");
		return JSON.parse(json);
	},
	readFile:function *(file) {
		return yield fs.readFile(file, "utf8");		
	},
	writeFile:function *(file, text) {
		yield fs.writeFile(file, text);
	},
	readJson:function *readJson(file) {
		var json = yield fs.readFile(file, "utf8");
		return JSON.parse(json);
	},
	fileExists:function *(file) {
	  var fstat = yield fs.stat(file);
    return fstat.isFile();
	},
};

U.clone=function(o) {
	return JSON.parse(JSON.stringify(o));
}

