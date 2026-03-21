var modal = document.getElementById("modal");
var modal_box = document.getElementById("modal-box");
var modal_content = document.getElementById("modal-content");
var close_btn = document.getElementById("close-btn");

function open_modal_pre(content) {
    modal.style.display = "block";
    modal.style.paddingTop = "100px";
    modal_box.style.width = "80%";
    modal_content.innerHTML = `<pre>${content}</pre>`;
    modal_content.className="";
}

function open_modal_img(filepath) {
    modal.style.display = "block";
    modal.style.paddingTop = "80px";
    modal_box.style.width = "90%";
    modal_content.innerHTML = `<a href="${filepath}" target="_blank"><img class="modal-content-img" src="${filepath}" style="width: 100%"></a>`;
    modal_content.className="";
}

function open_modal_video(filepath, type = null) {
    if (!type) type = getExtension(filepath);
    modal.style.display = "block";
    modal.style.paddingTop = "80px";
    modal_box.style.width = "90%";
    modal_content.innerHTML = `<video width="50%" height="50%" controls><source src="${filepath}" type="video/${type}"></video>`;
    modal_content.className="modal-content";
}

// When the user clicks on span (x), close the modal
close_btn.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal)
        modal.style.display = "none";
}

function getExtension(filepath) {
  if (typeof filepath !== "string")
    return null;

  const fileName = filepath.split(/[/\\]/).pop();

  // Ignore files starting or ending with a dot
  if (!fileName || fileName.startsWith('.') || fileName.endsWith('.'))
    return null;

  const lastDotIndex = fileName.lastIndexOf('.');

  // No dot → no extension
  if (lastDotIndex <= 0)
    return null;

  let ext = fileName.slice(lastDotIndex + 1);
  return ext.length < 2 ? null : ext;
}
