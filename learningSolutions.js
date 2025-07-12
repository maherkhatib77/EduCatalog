
let popupData = [];
let popupIndex = 0;
let fullData = [];
let editingId = null;

function showSolutionForm() {
  document.getElementById("popupContent").innerHTML = `
    <label>תחום דעת:</label>
    <select id="formSubject" style="width:100%;margin-bottom:5px;"></select>
  `;
  populateSelect("formSubject", "subjects", "name");
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
      let label = "";

      if (secondField) {
        label = `${data[field] || ""} ${data[secondField] || ""}`.trim();
      } else {
        label = data[field];
      }

      if (label) {
        const option = document.createElement("option");
        option.value = label;
        option.textContent = label;
        select.appendChild(option);
      }
    });

    console.log(`טענו נתונים ל-${id} מתוך ${path}`);
  }).catch(error => {
    console.error(`שגיאה בעת טעינת ${path}:`, error);
  });
}


window.showSolutionForm = showSolutionForm;
