# ���ʬ��� 19-tableServer

user/password/type ��� table

��� appendFile �B�z table


# ���ʬ��� 14-tableServer

�ק� /user/book/... �� /data/book/...
�[�J /data/user/...
�[�J /data/system/...

�b /data/system/ ����J�U�C�m�t�Ϊ��n

user | book | relation
----------------------------------
ccc  | markdown | editor
snoopy | history | editor
ccc | bajiu | editor
snoopy | markdown | coeditor
ccc | history | coeditor

�C�� user �����@�� profile ���ѡA�b /data/user/ �̭�

data/user/ccc/README.md
data/user/ccc/profile.md
data/user/ccc/system.md

# ���ʬ��� 13-searchServer

�[�J�����˯�����

# ���ʬ��� 13-file2mongodb

```
D:\Dropbox\github\road_to_bookdown\13-files2mongodb>node files2mongo.js
path=/ file=bajiu
path=/ file=markdown
path=/bajiu/ file=book.json
path=/bajiu/ file=README.md
path=/markdown/ file=book.json
path=/markdown/ file=CC-BY-SA_icon.svg
path=/markdown/ file=markdown.md
path=/markdown/ file=math.md
path=/markdown/ file=README.md
path=/markdown/ file=table.md
fileList=["bajiu/book.json","bajiu/README.md","markdown/book.json","markdown/CC-
BY-SA_icon.svg","markdown/markdown.md","markdown/math.md","markdown/README.md","
markdown/table.md"]
[��] ��X������˯�=[{"_id":"584f597e5dc67e9a9a53b0e2","path":"markdown/table.md
","md":"# ���\n\n| �m�W   | email               |\n|--------|------------------
---|\n| ����� | <ccckmit@gmail.com> |\n| Snoopy | <snoopy@gmail.com>  |\n\n","k
eywords":"8868 683c 59d3 540d 9673 937e 8aa0"}]
```

# ���ʬ��� 12-mvcServer

```
model : lib/model.js
view  : lib/view.js   + view/*.html
controller  : server.js
```

# ���ʬ��� 11-loginServer

```
user : ccc
password: 1234
```

# ���ʬ��� 10-editServer

�Ҽ{�ϥ� Fetch API : https://github.com/camsong/blog/issues/2


# ���ʬ��� 09-katexRendering

## �����ɮסG user/book/markdown/math.md

�[�J�̫ᨺ�ӷ|�j�r��m�����ƾǦ��C

```
\int_0^{\infty} f(x) dx
```

$$\int_0^{\infty} f(x) dx$$


$$
\int_0^{\infty} f(x) dx
$$

## �����ɮ� : render/view.html


�ק�[�J�U�C�q���A��O�i�H�b�e�ݧe�{ tex �ƾǦ�

```
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.6.0/katex.min.css">

...

<script>
var htmlBox = document.getElementById("htmlBox");

function texRender(text) {
  var tex1 = text.replace(/\$\$\s*\n\s*([^$]+)\s*\n\s*\$\$/gi, function(flag,match,end){
		return katex.renderToString(match, { displayMode: true });
  });
	var tex2 = tex1.replace(/\$\$([^$]+)\$\$/gi, function(flag,match,end){
		return katex.renderToString(match);
  });
	return tex2;
}

function load() {
	htmlBox.innerHTML = texRender(htmlBox.innerHTML);
}
</script>

...
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.6.0/katex.min.js"></script>

...

```