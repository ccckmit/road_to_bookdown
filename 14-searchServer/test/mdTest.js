var fs = require("fs");
var MD = require("../lib/markdown");

var md = fs.readFileSync("test.md", "utf8")
var jsonTable = MD.md2json(md);
console.log("jsonTable=%j", jsonTable);

var parts = MD.md2parts(md);
console.log("parts=", parts);