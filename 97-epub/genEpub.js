var Peepub   = require('pe-epub');
var epubJson = require('./example.json'); // see examples/example.json for the specs
var myPeepub = new Peepub(epubJson);

myPeepub.create('example.epub')
    .then(function(filePath){
       console.log(filePath); // the same path to your epub file!
});