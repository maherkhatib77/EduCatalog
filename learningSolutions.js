
let popupData = [];
let popupIndex = 0;
let fullData = [];
let editingId = null;

function showSolutionForm() {
  document.getElementById("popupContent").innerHTML = `
    <label>תחום דעת:</label>
    <select id="formSubject" style="width:100%;margin-bottom:5px;"></select>

    <label>יום קבוע:</label>
    <select id="formWeekday" style="width:100%;margin-bottom:5px;"></select>

    <label>שלבי חינוך:</label>
    <select id="formLevels" multiple style="width:100%;margin-bottom:5px;"></select>

    <label>סוג חינוך:</label>
    <select id="formTypes" multiple style="width:100%;margin-bottom:5px;"></select>

    <label>היקף שעות:</label>
    <select id="formHours" style="width:100%;margin-bottom:5px;"></select>

    <label>תחום פתרון למידה:</label>
    <select id="formDomain" style="width:100%;margin-bottom:5px;"></select>

    <label>אופן למידה:</label>
    <select id="formMode" style="width:100%;margin-bottom:5px;"></select>

    <label>שם המנחה:</label>
    <select id="formCreator" style="width:100%;margin-bottom:5px;"></select>
  `;

  populateSelect("formSubject", "subjects", "Title");
  populateSelect("formWeekday", "weekdays", "Title");
  populateSelect("formLevels", "education_levels", "Title", null, true);
  populateSelect("formTypes", "education_types", "Title", null, true);
  populateSelect("formHours", "hour_credits", "Title");
  populateSelect("formDomain", "solution_domains", "Title");
  populateSelect("formMode", "learning_modes", "title");
  populateSelect("formCreator", "instructors", "first_name", "last_name");
}

function populateSelect(id, path, field, secondField = null, multi = false) {
  const select = document.getElementById(id);
  if (!select) {
    console.error("לא נמצא שדה בשם:", id);
    return;
  }

  select.innerHTML = multi ? "" : "<option value=''>בחר</option>";

  db.ref(path).once("value").then(snapshot => {
    if (!snapshot.exists()) {
      console.warn("לא נמצאה טבלה:", path);
      return;
    }

    snapshot.forEach(child => {
      const data = child.val();
      let label = secondField ? `${data[field] || ""} ${data[secondField] || ""}`.trim() : data[field];
      if (label) {
        const option = document.createElement("option");
        option.value = label;
        option.textContent = label;
        select.appendChild(option);
      }
    });

    console.log("טענו נתונים ל-" + id + " מתוך " + path);
  }).catch(error => {
    console.error("שגיאה בעת טעינת " + path + ":", error);
  });
}

window.showSolutionForm = showSolutionForm;
