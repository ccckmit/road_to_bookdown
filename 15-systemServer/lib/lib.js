var fs = require('mz/fs');
var hash = require('object-hash');
var U  = module.exports = {}

var fileWalk = function(dir, path, done) {
  var results = [];
	var dir = (dir.endsWith("/"))?dir:dir+"/";
	var path = (path.endsWith("/"))?path:path+"/";
  fs.readdir(dir+path, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      fs.stat(dir+path+file, function(err, stat) {
//				console.log("path=%s file=%s", path, file);
        if (stat && stat.isDirectory()) {
          fileWalk(dir, path+file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(path.substring(1)+file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

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
	recursiveList:function(dir) {
		return function(done) {
			fileWalk(dir, "", done);
		}
	},	
};

U.clone=function(o) {
	return JSON.parse(JSON.stringify(o));
}

U.hash = function(o) {
	return hash(o);
}

/*

U.hash = function(o) {
	var str = JSON.stringify(o);
  var hash = 0, i, chr, len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
*/
/*
var fileWalk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir+"/"+file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          fileWalk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};
*/
