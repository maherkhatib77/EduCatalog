
let popupSolutions = [];
let currentPopupIndex = 0;

function loadLearningSolutionsIntoPopup() {
  const ref = firebase.database().ref("learning_solutions");
  ref.once("value", (snapshot) => {
    const data = snapshot.val();
    console.log("✅ טוען נתונים מטבלת learning_solutions:", data);

    if (!data) {
      document.getElementById("popupContent").innerHTML = "<p style='color:red;'>לא נמצאו נתונים בטבלה.</p>";
      document.getElementById("popupCounter").innerText = "0 / 0";
      return;
    }

    popupSolutions = Object.values(data);
    currentPopupIndex = 0;
    renderPopupCard();
  });
}

function renderPopupCard() {
  const container = document.getElementById("popupContent");

  if (!popupSolutions.length) {
    container.innerHTML = "<p style='color:red;'>אין כרטיסים להצגה.</p>";
    document.getElementById("popupCounter").innerText = "0 / 0";
    return;
  }

  const item = popupSolutions[currentPopupIndex];
  console.log("✅ מציג כרטיס:", item);

  container.innerHTML = `
    <div style="line-height: 1.8; padding: 10px;">
      <strong>שם הפתרון:</strong> ${item.solution_name || ""}<br>
      <strong>מספר:</strong> ${item.solution_number || ""}<br>
      <strong>מרצה:</strong> ${item.lecturer_name || ""}<br>
      <strong>תחום דעת:</strong> ${item.subject || ""}<br>
      <strong>תאריך התחלה:</strong> ${item.start_date || ""}<br>
    </div>
  `;

  document.getElementById("popupCounter").innerText = `${currentPopupIndex + 1} / ${popupSolutions.length}`;
}

function nextPopupCard() {
  if (popupSolutions.length && currentPopupIndex < popupSolutions.length - 1) {
    currentPopupIndex++;
    renderPopupCard();
  }
}

function prevPopupCard() {
  if (popupSolutions.length && currentPopupIndex > 0) {
    currentPopupIndex--;
    renderPopupCard();
  }
}
