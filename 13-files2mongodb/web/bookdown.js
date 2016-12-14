var viewBox, editBox, loginBox, userBox, passwordBox, mdBox;
var formEdit, converter, book, file;
var katexLoaded = false;

function showBox(box) {
  viewBox.style.display = 'none';
  editBox.style.display = 'none';
	loginBox.style.display = 'none';
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

function ajaxPost(path, obj) {
  var r = new XMLHttpRequest();
  r.open("POST", path, true);
  r.onreadystatechange = function () {
		if (r.readyState != 4) return;
    if (r.status != 200) {
			alert("Fail: " + r.responseText);
		} else {
			alert("Success: " + r.responseText);
		}
  };
  r.send(JSON.stringify(obj));
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
	loginBox= document.getElementById("loginBox");
  mdBox   = document.getElementById("md");
  userBox = document.getElementById("user");
  passwordBox = document.getElementById("password");
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

function loginDialog() {
	showBox(loginBox);
}

function signup() {
  alert('Singup not implemented yet!');
}

function login() {
  ajaxPost("/login", {user:userBox.value, password:passwordBox.value});
}

function logout() {
  ajaxPost("/logout", {});
}

function save() {
  ajaxPost('/save/'+book+'/'+file, {md:mdBox.value});
}

