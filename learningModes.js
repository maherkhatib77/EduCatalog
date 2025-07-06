
const firebaseConfig = {
    databaseURL: "https://educatalog-63603-default-rtdb.firebaseio.com"
};
const databaseURL = firebaseConfig.databaseURL;
const tableName = "learningModes";

// Load existing modes
window.onload = function () {
    loadModes();
};

document.getElementById("modeForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const modeName = document.getElementById("modeName").value.trim();
    if (modeName) {
        const data = { name: modeName };
        fetch(`${databaseURL}/${tableName}.json`, {
            method: "POST",
            body: JSON.stringify(data)
        }).then(() => {
            document.getElementById("modeForm").reset();
            loadModes();
        });
    }
});

function loadModes() {
    fetch(`${databaseURL}/${tableName}.json`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector("#modesTable tbody");
            tbody.innerHTML = "";
            for (let key in data) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><input type="text" value="${data[key].name}" onchange="updateMode('${key}', this.value)" /></td>
                    <td><button onclick="updateMode('${key}', document.querySelector('[value=' + CSS.escape('${data[key].name}') + ']').value)">שמור</button></td>
                    <td><button onclick="deleteMode('${key}')">מחק</button></td>
                `;
                tbody.appendChild(row);
            }
        });
}

function updateMode(key, newValue) {
    fetch(`${databaseURL}/${tableName}/${key}.json`, {
        method: "PATCH",
        body: JSON.stringify({ name: newValue })
    }).then(() => loadModes());
}

function deleteMode(key) {
    fetch(`${databaseURL}/${tableName}/${key}.json`, {
        method: "DELETE"
    }).then(() => loadModes());
}

document.getElementById("searchInput").addEventListener("input", function () {
    const search = this.value.toLowerCase();
    const rows = document.querySelectorAll("#modesTable tbody tr");
    rows.forEach(row => {
        const cellText = row.cells[0].querySelector("input").value.toLowerCase();
        row.style.display = cellText.includes(search) ? "" : "none";
    });
});
