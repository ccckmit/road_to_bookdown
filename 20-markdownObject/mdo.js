var MD = module.exports = {}

MD.parseJson = function(json) { // Simplified JSON
	json = json.replace(/(\W)(\w+):/gm, '$1"$2":') // id: => "id":
             .replace(/:(\w+)/gm, ':"$1"')     // :v  => :"v"
  					 .replace(/([\{\[])\s*,/gm, '$1')  // {, => {
             .replace(/,\s*([\}\]])/gm, '$1'); // ,] => ]
	return JSON.parse(json);
}

MD.parseValue = function(value) {
  var json;
  try {
    if (value.match(/\n\-+|[|\-]+/)) {
      json = MD.tableToJson(value);
    } else 
      json = U.parseJson(value); // JSON.parse(value);
  } catch (e) {
    json = value;
  }
  return json;
}

MD.parseMdo = function(mdo) {
  var obj={}, field, valueLines = [], lines = mdo.split(/\r?\n/);
  for (var i=0, len = lines.length; i<len; i++) {
    var line = lines[i];
    var m = line.match(/^([^\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/;<=>?@\[\]^_`{|}~]+)\s*:\s*(.*)$/);
    if (m) {
      if (typeof field !== 'undefined')
        obj[field] = MD.parseValue(valueLines.join('\n').trim());
      field = m[1]; valueLines = [ m[2] ];
    } else {
      valueLines.push(line);
    }
  }
  if (valueLines.length > 0 && typeof field !== 'undefined')
    obj[field] = MD.parseValue(valueLines.join('\n').trim());
  return obj;
}

MD.tableToJson = function(table) {
  var lines = table.split(/\r?\n/), len = lines.length;
  var jsonTable = [], types=[], fields=lines[0].split(/\s*\|\s*/);
  for (var i=0; i<fields.length; i++) {
    var tokens = fields[i].split(":");
    fields[i] = tokens[0].trim();
    types[i] = (tokens.length>=2)?tokens[1].trim():"string";
  }
//  console.log("fields=%j types=%j", fields, types);
  for (var i=2; i<len; i++) {
    var values=lines[i].split("|"), vlen = values.length, json={};
    for (var vi=0; vi<vlen; vi++) {
      var value = values[vi].trim();
//      console.log("%d value=%s", vi, value);
      switch (types[vi]) {
        case "json"  : value = U.parseJson(value); break;
        case "number": value = parseFloat(value); break;
        case "boolean":value = JSON.parse(value); break;
        case "date"  : value = (new Date(value)).toJSON(); break; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
      }
      json[fields[vi]] = value;
    }
    jsonTable.push(json);
  }
  return jsonTable;
}

MD.index=function(jsons, field) {
  var map = {};
  for (var i in jsons) {
    var json = jsons[i];
    var key = json[field];
    map[key] = json;
  }
  return map;
}
