# 異動紀錄 10-editServer

考慮使用 Fetch API : https://github.com/camsong/blog/issues/2


# 異動紀錄 09-katexRendering

## 異動檔案： user/book/markdown/math.md

加入最後那個會大字體置中的數學式。

```
\int_0^{\infty} f(x) dx
```

$$\int_0^{\infty} f(x) dx$$


$$
\int_0^{\infty} f(x) dx
$$

## 異動檔案 : render/view.html


修改加入下列段落，於是可以在前端呈現 tex 數學式

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

