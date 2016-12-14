var menuBox, headerBox, viewBox;
var editBox, loginBox, userBox, passwordBox, mdBox;
var formEdit, converter, book, file, source;

var loaded={}

function doAfterLoad(src, doJob) {
	if (typeof loaded[src] !== 'undefined') {
		var alreadyLoadedBefore = true;
		doJob(alreadyLoadedBefore);
	}
	var script = document.createElement('script');
	script.src = src;
	script.onload = doJob;
	document.head.appendChild(script); 
	loaded[src] = script;
}

function showBox(box) {
  viewBox.style.display = 'none';
  editBox.style.display = 'none';
  loginBox.style.display = 'none';
  box.style.display = 'block';
}

function texRender(text) {
	if (typeof katex === 'undefined') return text;
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
	if (mdBox.value.indexOf("$$")>=0) {
		doAfterLoad("/katex/katex.min.js", function() {
			viewBox.innerHTML = texRender(html);
		});
	}
}

var kbText="N:前言=preface,程式=code,字體=font,表格=table,姓名=name,陳=chen,鍾=chung,誠=cheng,儲存=save,登入=login,登出=logout,選單=menu,目錄=catalog,檢視=view,簡介=introduction,這=the,作者=author,原文=source,語言=language";

var s2t;

window.onhashchange = function() {
  var hash = window.location.hash.substring(1);
  if (hash === "source") {
    localStorage.s2t = s2t = "";
    window.location.hash="";
    window.location.reload();
  }
  else if (hash === "")
    s2t = localStorage.s2t;
  else
    localStorage.s2t = s2t = window.location.hash.substring(1)
  mt();
}

function load(pBook, pFile) {
  book    = pBook;
  file    = pFile;
  menuBox = document.getElementById("menu");
  headerBox = document.getElementById("headerBox");
  viewBox = document.getElementById("viewBox");
  editBox = document.getElementById("editBox");
  loginBox= document.getElementById("loginBox");
  mdBox   = document.getElementById("md");
  userBox = document.getElementById("user");
  passwordBox = document.getElementById("password");
  formEdit= document.getElementById("formEdit");
  window.onhashchange();
	
	doAfterLoad('/js/showdown.min.js', function() {
		converter = new showdown.Converter();
		converter.setOption('tables', true);			
		menuBox.style.display = "block";
		headerBox.style.display = "block";
		mt();
		showBox(viewBox);
	});
}

function view() {
  showBox(viewBox);
  render();
  if (typeof localStorage.t !== 'undefined') {
    var s = s2t[0], t=s2t[2];
    boxMt(viewBox, s, t);
  }
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

function boxMt(box, s, t) {
	if (typeof bajiu !== 'undefined')
		box.innerHTML = bajiu.mtHtml(box.innerHTML, s, t);
}

function mt() {
  if (s2t.length < 3) return;
	doAfterLoad("/bajiu.js", function(alreadyLoadedBefore) {
  	if (!alreadyLoadedBefore) bajiu.KB.addOntology(bajiu.kb8, kbText);
		var s = s2t[0], t=s2t[2];
		boxMt(viewBox, s, t);
		boxMt(menuBox, s, t);
		boxMt(headerBox, s, t);
	});
}

