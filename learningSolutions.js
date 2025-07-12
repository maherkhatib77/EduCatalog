
let popupData = [];
let popupIndex = 0;

function openLearningSolutionPopup() {
  db.ref("learning_solutions").once("value", snapshot => {
    popupData = [];
    snapshot.forEach(child => {
      const d = child.val();
      d.id = child.key;
      popupData.push(d);
    });
    if (popupData.length > 0) {
      popupIndex = 0;
      renderPopupCard();
      document.getElementById("learningSolutionPopup").style.display = "flex";
    } else {
      alert("אין פתרונות להצגה.");
    }
  });
}

function closeLearningSolutionPopup() {
  document.getElementById("learningSolutionPopup").style.display = "none";
}

function renderPopupCard() {
  const d = popupData[popupIndex];
  const content = document.getElementById("popupContent");
  const counter = document.getElementById("popupCounter");
  content.innerHTML = `
    <p><strong>שם:</strong> ${d.solution_name || ""}</p>
    <p><strong>מנחה:</strong> ${d.creator_name || ""}</p>
    <p><strong>תאריך:</strong> ${d.first_meeting_date || ""}</p>
    <p><strong>יום:</strong> ${d.weekday || ""}</p>
    <p><strong>שלבים:</strong> ${(d.education_levels || []).join(", ")}</p>
    <p><strong>שעות:</strong> ${d.hours_count || ""}</p>
    <p><strong>תחום דעת:</strong> ${d.subject || ""}</p>
    <p><strong>מטרות:</strong> ${d.objectives || ""}</p>
    <p><strong>תקציר:</strong> ${d.summary || ""}</p>
    <div style="margin-top: 10px;">
      <button onclick="editLearningSolution('${d.id}')">✎ ערוך</button>
      <button onclick="deleteLearningSolution('${d.id}')">🗑 מחק</button>
    </div>
  `;
  counter.textContent = `${popupIndex + 1} / ${popupData.length}`;
}

function prevPopupCard() {
  if (popupIndex > 0) {
    popupIndex--;
    renderPopupCard();
  }
}

function nextPopupCard() {
  if (popupIndex < popupData.length - 1) {
    popupIndex++;
    renderPopupCard();
  }
}

function filterPopupResults() {
  const term = document.getElementById("popupSearch").value.toLowerCase();
  const filtered = popupData.filter(d => (d.solution_name || "").toLowerCase().includes(term));
  if (filtered.length > 0) {
    popupData = filtered;
    popupIndex = 0;
    renderPopupCard();
  }
}

window.openLearningSolutionPopup = openLearningSolutionPopup;
window.closeLearningSolutionPopup = closeLearningSolutionPopup;
