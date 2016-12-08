var koa = require('koa');
var serve = require('koa-static');
var path = require('path');
var app = koa();

app.use(serve(path.join(__dirname, '')));
app.listen(3000);
console.log('listening on port 3000');
