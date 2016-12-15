var MD = module.exports = {}

// 1. md 分解出 parts
// 2. 取得表格的 jsons
// 3. 正規化：簡易表格=>標準表格
MD.parse = function(md) {
  var lines = md.split(/\r?\n/), formalLines = [], partLines = [];
  var partList = [], jsonList = [];
  for (var i=0, len = lines.length; i<len; i++) {
    var line = lines[i];
		// 取得 partList 
    if (line.startsWith("#") || i===len-1) {
      var partMd = partLines.join("\n");
      partLines = [ line ];
      var m = partMd.match(/^#{0,6}/);
			if (partMd.trim().length > 0)
				partList.push({part:partList.length, level:m[0].length, md:partMd, type:"md" });
    } else {
      partLines.push(line);
    }
		// 2. 簡易表格 => 標準表格
    if (i<len-1 && (lines[i].indexOf("|")>=0 && !lines[i].startsWith("|")) && lines[i+1].match(/^\-+$/)) {
      var table=[], head=lines[i];
      for (;i<len && lines[i].trim() !== ""; i++) {
        table.push(lines[i]);
				if (i==1) // ----
				  formalLines.push('|'+head.replace(/[^|]/gi, "-")+'|');
				else if (!lines[i].startsWith("|"))
					formalLines.push('|'+lines[i]+'|');
      }
      jsonList = jsonList.concat(MD.tableToJsons(table.join("\n")));
    } else {
			formalLines.push(lines[i]);
		}
  }
	// parts: 分解段落, jsons:所有物件列表, formal:正規化的 markdown 字串
  return {parts:partList, jsons:jsonList, formal:formalLines.join("\n")};
}

MD.tableToJsons = function(table) {
  var lines = table.split(/\n/), len = lines.length;
  var jsonTable = [], fields=lines[0].split(/\s*\|\s*/);
  for (var i=2; i<len; i++) {
    var values=lines[i].split("|"), vlen = values.length, json={};
    for (var vi=0; vi<vlen; vi++) {
      json[fields[vi]] = values[vi].trim();
    }
    jsonTable.push(json);
  }
  return jsonTable;
}



/*
MD.toParts = function(md) {
  var lines = md.split(/\r?\n/);
  var parts = [], partLines = [];
  for (var i=0, len = lines.length; i<len; i++) {
    var line = lines[i];
    if (line.startsWith("#") || i===len-1) {
      var partMd = partLines.join("\n");
      partLines = [ line ];
      if (partMd.trim().length === 0) continue;
      var m = partMd.match(/^#{0,6}/);
//    console.log("m[0]=", m[0]);
      parts.push({part:parts.length, level:m[0].length, md:partMd, type:"md" });
    } else {
      partLines.push(line);
    }
  }
  return parts;
}

MD.getAllJsons = function(md) {
  var jsonList = [];
  var lines = md.split(/\r?\n/);
  for (var i=0, len = lines.length; i<len; i++) {
    if (i<len-1 && lines[i].indexOf("|")>=0 && lines[i+1].match(/^\-+$/)) {
      var table=[];
      while (i<len && lines[i].trim() !== "") {
        table.push(lines[i++]);
      }
      jsonList = jsonList.concat(MD.tableToJsons(table.join("\n")));
    }
  }
  return jsonList;
}
*/