<div class="content">
  <div style="width:50vw; margin-top:10vh">
  <form class="pure-form pure-form-aligned"> 
    <fieldset>
      <div class="pure-control-group">
        <label for="book">Book</label>
        <input id="book" type="text" placeholder="Book">
      </div>
      <div class="pure-controls">
        <button type="button" class="pure-button pure-button-primary" onclick="createBook()">Create Book</button>
      </div>
    </fieldset>
  </form>     
  </div>
</div>

<script>

function signup() {
  var bookBox = document.getElementById("book");
  ajaxPost("/createBook", {book:bookBox.value});
}
</script>