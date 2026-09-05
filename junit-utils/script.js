var modal = document.getElementById("modal");
var modal_box = document.getElementById("modal-box");
var close_btn = document.getElementById("close-btn");
var modal_content = document.getElementById("modal-content");

function open_modal_pre(content) {
    modal.style.display = "block";
    modal.style.paddingTop = "100px";
    modal_box.style.width = "80%";
    modal_content.innerHTML = `<pre>${content}</pre>`;
}

function open_modal_html(content) {
    modal.style.display = "block";
    modal.style.paddingTop = "100px";
    modal_box.style.width = "80%";
    modal_content.innerHTML = `${content}`;
}

function open_modal_issues(issues) {
    modal.style.display = "block";
    modal.style.paddingTop = "100px";
    modal_box.style.width = "80%";
    issues = issues.split(",").map(item => item.trim());
    console.log(issues);
    let content = '<h4>Issues</h4>';
    for (const issue of issues) {
        content += `<a href="https://naxosdionysos.atlassian.net/browse/${issue}" style="color: blue;" target="_blank">${issue}</a>`;
        content += '<br/>';
    }
    modal_content.innerHTML = `${content}`;
}

function open_modal_bars(trend, file_history) {
    modal.style.display = "block";
    modal.style.paddingTop = "100px";
    modal_box.style.width = "80%";
    let record;
    try {
      record = readJson(file_history);
      history = record?.history ?? [];
    } catch (error) {
      history = [];
    }
    let colors = {
        passed: 'green',
        failed: 'red',
        skipped: 'blue',
        other: 'gray',
    };
    let content = `
        <h4>History</h4>
        <table><tr>
          <td style="border: none;">Trend: ${trend}</td>
          <td style="text-align: right; border: none;">Runs: ${history.length}</td>
        </tr></table>
        <div class="history">`;
    for (const item of history) {
        const color = colors[item.status];
        content += `<div class="history_line history_${color}"></div>`
    }
    content += '</div>';
    modal_content.innerHTML = `${content}`;
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
    modal_content.innerHTML = "";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        modal_content.innerHTML = "";
    }
}

function readJson(filename) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", filename, false); // false = synchronous
    xhr.send(null);
    if (xhr.status !== 200)
        return {};
    let content;
    try {
        content = JSON.parse(xhr.responseText);
    } catch (error) {
        content = {};
    }
    return content;
}

// Set the test report title
const title = document.getElementById("title");
if (title && brand)
    title.textContent = "JUnit Test Report for " + brand;

