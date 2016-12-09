var viewBox, editBox, mdBox, formEdit, converter, book, file;
var katexLoaded = false;

function showBox(box) {
  viewBox.style.display = 'none';
  editBox.style.display = 'none';
  box.style.display = 'block';
}

function texRender(text) {
  if (!katexLoaded && text.indexOf("$$")>=0) {
    katexLoaded = true;
  }

  var tex1 = text.replace(/\$\$\s*\n\s*([^$]+)\s*\n\s*\$\$/gi, function(flag,match,end){
    return katex.renderToString(match, { displayMode: true });
  });
  var tex2 = tex1.replace(/\$\$([^$]+)\$\$/gi, function(flag,match,end){
    return katex.renderToString(match);
  });
  return tex2;
}

function ajaxPost(path, msg) {
  var r = new XMLHttpRequest();
  r.open("POST", "/save/"+book+"/"+file, true);
  r.onreadystatechange = function () {
    if (r.readyState != 4 || r.status != 200) return;
    alert("Success: " + r.responseText);
  };
  r.send(msg);
}

function markdownRender(md) {
  return converter.makeHtml(md);
}

function render() {
  var html = markdownRender(mdBox.value);
  viewBox.innerHTML = texRender(html);
}

function load(pBook, pFile) {
  book    = pBook;
  file    = pFile;
  viewBox = document.getElementById("viewBox");
  editBox = document.getElementById("editBox");
  mdBox   = document.getElementById("md");
  formEdit= document.getElementById("formEdit");
  showBox(viewBox);
  converter = new showdown.Converter();
  converter.setOption('tables', true);
  viewBox.innerHTML = texRender(viewBox.innerHTML);
}

function view() {
  showBox(viewBox);
  render();
}

function edit() {
  showBox(editBox);
}

function signup() {
  alert('Singup not implemented yet!');
}

function login() {
  alert('Login not implemented yet!');
}

function save() {
 ajaxPost('/save/'+book+'/'+file, mdBox.value);
}
