function loadWeekdays() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Weekdays</h2>
    ${(userType === "admin" || userType === "operator") ? '<button onclick="openWeekdayForm()">➕ הוסף יום בשבוע</button>' : ""}
    <table class="data-table">
      <thead><tr><th>Title</th><th>Actions</th></tr></thead>
      <tbody id="weekdays-body"></tbody>
    </table>
    <div id="weekdayModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeWeekdayForm()">&times;</span>
        <h3 id="weekdayFormTitle">הוסף יום בשבוע</h3>
        <input type="hidden" id="weekdayKey">
        <input type="text" id="weekdayTitle" placeholder="כותרת יום בשבוע">
        <button onclick="saveWeekday()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("weekdays-body");
  firebase.database().ref("weekdays").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const key = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${d.Title}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editWeekday('${key}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteWeekday('${key}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openWeekdayForm() {
  document.getElementById("weekdayFormTitle").textContent = "הוסף יום בשבוע";
  document.getElementById("weekdayKey").value = "";
  document.getElementById("weekdayTitle").value = "";
  document.getElementById("weekdayModal").style.display = "block";
}

function editWeekday(key) {
  firebase.database().ref("weekdays/" + key).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("weekdayFormTitle").textContent = "ערוך יום בשבוע";
    document.getElementById("weekdayKey").value = key;
    document.getElementById("weekdayTitle").value = data.Title;
    document.getElementById("weekdayModal").style.display = "block";
  });
}

function saveWeekday() {
  const key = document.getElementById("weekdayKey").value;
  const title = document.getElementById("weekdayTitle").value;

  if (!title.trim()) {
    alert("יש להזין כותרת יום בשבוע");
    return;
  }

  const ref = firebase.database().ref("weekdays");

  if (key) {
    // עדכון
    ref.child(key).update({ Title: title }).then(() => {
      closeWeekdayForm();
      loadWeekdays();
    });
  } else {
    // הוספה
    ref.push({ Title: title }).then(() => {
      closeWeekdayForm();
      loadWeekdays();
    });
  }
}

function deleteWeekday(key) {
  if (confirm("למחוק את היום?")) {
    firebase.database().ref("weekdays/" + key).remove().then(() => {
      loadWeekdays();
    });
  }
}

function closeWeekdayForm() {
  document.getElementById("weekdayModal").style.display = "none";
}

window.loadWeekdays = loadWeekdays;
