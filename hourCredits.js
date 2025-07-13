function loadHourCredits() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Hour Credits</h2>
    ${(userType === "admin" || userType === "operator") ? '<button onclick="openHourCreditForm()">➕ הוסף היקף שעות</button>' : ""}
    <table class="data-table">
      <thead><tr><th>Title</th><th>Actions</th></tr></thead>
      <tbody id="hour-credits-body"></tbody>
    </table>
    <div id="hourCreditModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeHourCreditForm()">&times;</span>
        <h3 id="hourCreditFormTitle">הוסף היקף שעות</h3>
        <input type="hidden" id="hourCreditKey">
        <input type="text" id="hourCreditTitle" placeholder="כותרת היקף השעות">
        <button onclick="saveHourCredit()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("hour-credits-body");
  firebase.database().ref("hour_credits").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const key = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${d.Title}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editHourCredit('${key}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteHourCredit('${key}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openHourCreditForm() {
  document.getElementById("hourCreditFormTitle").textContent = "הוסף היקף שעות";
  document.getElementById("hourCreditKey").value = "";
  document.getElementById("hourCreditTitle").value = "";
  document.getElementById("hourCreditModal").style.display = "block";
}

function editHourCredit(key) {
  firebase.database().ref("hour_credits/" + key).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("hourCreditFormTitle").textContent = "ערוך היקף שעות";
    document.getElementById("hourCreditKey").value = key;
    document.getElementById("hourCreditTitle").value = data.Title;
    document.getElementById("hourCreditModal").style.display = "block";
  });
}

function saveHourCredit() {
  const key = document.getElementById("hourCreditKey").value;
  const title = document.getElementById("hourCreditTitle").value;

  if (!title.trim()) {
    alert("יש להזין כותרת היקף שעות");
    return;
  }

  const ref = firebase.database().ref("hour_credits");

  if (key) {
    // עדכון רשומה קיימת
    ref.child(key).update({ Title: title }).then(() => {
      closeHourCreditForm();
      loadHourCredits();
    });
  } else {
    // הוספת רשומה חדשה
    ref.push({ Title: title }).then(() => {
      closeHourCreditForm();
      loadHourCredits();
    });
  }
}

function deleteHourCredit(key) {
  if (confirm("למחוק את היקף השעות?")) {
    firebase.database().ref("hour_credits/" + key).remove().then(() => {
      loadHourCredits();
    });
  }
}

function closeHourCreditForm() {
  document.getElementById("hourCreditModal").style.display = "none";
}

window.loadHourCredits = loadHourCredits;
