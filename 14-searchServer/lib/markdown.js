var M = module.exports = {}

M.md2parts = function(text) {
	var lines = text.split(/\r?\n/);
	var parts = [], partLines = [];
	for (var i=0, len = lines.length; i<len; i++) {
		var line = lines[i];
		if (line.startsWith("#") || i===len-1) {
			var md = partLines.join("\n");
			partLines = [ line ];
			if (md.trim().length === 0) continue;
			var m = md.match(/^#*/);
//		console.log("m[0]=", m[0]);
			parts.push({part:parts.length, level:m[0].length, md:md, type:"md" });
		} else {
			partLines.push(line);
		}
	}
	return parts;
}

M.md2json = function(text) {
	var tableMerge = [];
	var lines = text.split(/\r?\n/);
	for (var i=0, len = lines.length; i<len; i++) {
		if (i<len-1 && lines[i].indexOf("|")>=0 && lines[i+1].match(/^\-+$/)) {
			var table=[];
			while (i<len && lines[i].trim() !== "") {
				table.push(lines[i++]);
			}
			tableMerge = tableMerge.concat(M.table2json(table.join("\n")));
		}
	}
	return tableMerge;
}

M.table2json = function(table) {
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

