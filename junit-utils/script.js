var modal = document.getElementById("modal");
var modal_box = document.getElementById("modal-box");
var modal_content = document.getElementById("modal-content");
var close_btn = document.getElementById("close-btn");

function open_modal_pre(content) {
    modal.style.display = "block";
    modal.style.paddingTop = "100px";
    modal_box.style.width = "80%";
    modal_content.innerHTML = `<pre>${content}</pre>`;
}

function open_modal_img(filepath) {
    modal.style.display = "block";
    modal.style.paddingTop = "80px";
    modal_box.style.width = "90%";
    modal_content.innerHTML = `<a href="${filepath}" target="_blank"><img class="modal-content-img" src="${filepath}" style="width: 100%"></a>`;
}

function open_modal_video(filepath, type = "webm") {
    if (!type) type = getExtension(filepath);
    modal.style.display = "block";
    modal.style.paddingTop = "80px";
    modal_box.style.width = "90%";
    modal_content.innerHTML = `<video class="modal-content-img" style="width: 100%; height: 100%" controls><source src="${filepath}" type="video/${type}"></video>`;
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
  const fileName = filepath.split(/[/\\]/).pop();
  const lastDotIndex = fileName.lastIndexOf('.');

  if (lastDotIndex <= 0 || lastDotIndex == fileName.length - 1)
    return null;
  else
    return fileName.slice(lastDotIndex + 1);
}
