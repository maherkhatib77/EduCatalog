
let popupSolutions = [];
let currentPopupIndex = 0;

// טוען את הנתונים מתוך Firebase ומכניס אותם למערך popupSolutions
function loadLearningSolutionsIntoPopup() {
  firebase.database().ref("learning_solutions").once("value", (snapshot) => {
    const data = snapshot.val();
    popupSolutions = data ? Object.values(data) : [];
    currentPopupIndex = 0;
    renderPopupCard();
  });
}

// מציג כרטיס לפי האינדקס הנוכחי
function renderPopupCard() {
  const container = document.getElementById("popupContent");
  if (!popupSolutions.length) {
    container.innerHTML = "<p>לא נמצאו פתרונות למידה.</p>";
    document.getElementById("popupCounter").innerText = "0 / 0";
    return;
  }

  const item = popupSolutions[currentPopupIndex];
  container.innerHTML = `
    <div style="line-height: 1.8;">
      <strong>שם הפתרון:</strong> ${item.solution_name || ""}<br>
      <strong>מספר:</strong> ${item.solution_number || ""}<br>
      <strong>יוצר:</strong> ${item.creator_name || ""}<br>
      <strong>מרצה:</strong> ${item.lecturer_name || ""}<br>
      <strong>תאריך התחלה:</strong> ${item.start_date || ""}<br>
      <strong>יום מפגש:</strong> ${item.meeting_day || ""} | ${item.start_time || ""} - ${item.end_time || ""}<br>
      <strong>שלבי חינוך:</strong> ${item.education_levels || ""} | <strong>סוג:</strong> ${item.education_type || ""}<br>
      <strong>תחום דעת:</strong> ${item.subject || ""} | <strong>תחום פתרון:</strong> ${item.solution_domain || ""}<br>
      <strong>אופן למידה:</strong> ${item.learning_mode || ""} | <strong>שעות:</strong> ${item.hour_credits || ""}<br>
      <strong>תקציר:</strong> ${item.solution_summary || ""}<br>
      <strong>מטרות:</strong> ${item.solution_goals || ""}<br>
      ${item.syllabus_link ? `<strong><a href="${item.syllabus_link}" target="_blank">📎 צפייה בסילבוס</a></strong>` : ""}
    </div>
  `;
  document.getElementById("popupCounter").innerText = \`\${currentPopupIndex + 1} / \${popupSolutions.length}\`;
}

// ניווט קדימה
function nextPopupCard() {
  if (popupSolutions.length && currentPopupIndex < popupSolutions.length - 1) {
    currentPopupIndex++;
    renderPopupCard();
  }
}

// ניווט אחורה
function prevPopupCard() {
  if (popupSolutions.length && currentPopupIndex > 0) {
    currentPopupIndex--;
    renderPopupCard();
  }
}
