var modal = document.getElementById("modal");
var modal_box = document.getElementById("modal-box");
var close_btn = document.getElementById("close-btn");
var modal_content = document.getElementById("modal-content");


function open_modal(content, width = "80%", padding = "100px") {
    modal.style.display = "block";
    modal.style.paddingTop = padding;
    modal_box.style.width = width;
    modal_content.innerHTML = content;
}

function close_modal() {
    modal.style.display = "none";
    modal_content.innerHTML = "";
}

function open_modal_pre(content) {
    open_modal(`<pre>${content}</pre>`, "80%", "100px");
}

function open_modal_issues2(issues) {
    issues = issues.split(",").map(item => item.trim());
    let content = '<h4>Issues</h4>';
    for (const issue of issues) {
        content += `<a href="https://bugtracker.com/${issue}" style="color: blue;" target="_blank">${issue}</a>`;
        content += '<br/>';
    }
    open_modal(content, "80%", "100px");
}

async function open_modal_issues(issues) {
    issues = issues.split(",").map(item => item.trim());
    let content = '<h4>Issues</h4>';
    for (const issue of issues) {
        let issueLink = `<a href="https://bugtracker.com/${issue}" style="color: blue;" target="_blank">${issue}`;
        try {
            const response = await fetch(`http://192.168.5.5:8000/api/jira/${issue}`, { signal: AbortSignal.timeout(3000) });
            const issueJson = await response.json();
            if ("error" in issueJson)
                issueLink += `</a>`;
            else
                issueLink += ` ${issueJson.title}</a> <span class="status">${issueJson.status}</span>`;
        } catch(error) {
            issueLink += `</a>`;
        }
        content += issueLink + '<br/>';
    }
    open_modal(content, "80%", "100px");
}

async function open_modal_test_run_trend(url) {
    let data = await getChartData(url);
    let runs = data?.labels?.length;
    let content = `
      <p style='display: flex; justify-content: flex-end;'>Runs: ${runs}</p>
      <canvas id='chart'></canvas>
    `;
    open_modal(content, "90%", "100px");
    await display_chart(data);
}

async function open_modal_test_case_trend(trend, url) {
    let record, history;
    try {
        record = await fetchJson(url);
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
        <td style="border: none;">Trend: ${trend} %</td>
        <td style="text-align: right; border: none;">Runs: ${history.length}</td>
      </tr></table>
      <div class="history">`;
    for (const item of history) {
        const color = colors[item.status];
        content += `<div class="history_line history_${color}" data-tooltip="${item.date}"></div>`
    }
    content += '</div>';
    open_modal(content, "60%", "100px");
}

function open_modal_img(url) {
    content = `<a href="${url}" target="_blank"><img class="modal-content-img" src="${url}" style="width: 100%"></a>`;
    open_modal(content, "90%", "80px");
}

function open_modal_video(url, type = null) {
    if (!type) type = getExtension(url);
    content = `<video class="modal-content-img" style="width: 100%; height: 100%" controls><source src="${url}" type="video/${type}"></video>`;
    open_modal(content, "90%", "80px");
}

// When the user clicks on span (x), close the modal
close_btn.onclick = function () {
    close_modal();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal)
        close_modal();
}

document.addEventListener("mouseover", function (e) {
    const circle = e.target.closest(".history_line");
    if (!circle) return;

    const tooltip = document.querySelector(".history-tooltip");
    if (!tooltip) return;

    tooltip.textContent = circle.dataset.tooltip;
    const rect = circle.getBoundingClientRect();
    // tooltip.style.left = (rect.left + rect.width / 2) + "px";
    // tooltip.style.top = (rect.bottom + 8) + "px";
    tooltip.style.left = (rect.left + rect.width / 2) + "px";
    tooltip.style.top = (rect.top - 40) + "px";
    tooltip.classList.add("visible");
});

document.addEventListener("mouseout", function (e) {
    const circle = e.target.closest(".history_line");
    if (!circle) return;

    const tooltip = document.querySelector(".history-tooltip");
    if (tooltip) {
        tooltip.classList.remove("visible");
    }
});

function getExtension(filepath) {
    const fileName = filepath.split(/[\\/]/).pop();
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex <= 0 || lastDotIndex == fileName.length - 1)
        return '';
    else
        return fileName.slice(lastDotIndex + 1);
}

async function fetchJson(url, timeout = 3000) {
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(timeout) });
        if (!response.ok)
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${url}\n${error.toString()}`);
        throw error;
    }
}

