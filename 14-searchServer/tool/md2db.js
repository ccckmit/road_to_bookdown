var co   = require('co');
var M    = require('../lib/model');

co(function*() {
	yield M.init("../");
	yield M.md2db();
	yield M.query({type:"json"});
//	yield M.search("陳鍾誠 email");
//	yield M.search("八極語 grammar");
//	yield M.search("Africa");
	yield M.search("", {type:"json"});
	yield M.close();
});
