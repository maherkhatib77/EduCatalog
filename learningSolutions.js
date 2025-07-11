// learningSolutions.js

const learningSolutionsSchema = [
  { label: "מספר פתרון הלמידה", field: "solution_id", type: "short_answer" },
  { label: "שם פתרון הלמידה", field: "solution_name", type: "short_answer" },
  {
    label: "שם יוצר פתרון הלמידה",
    field: "creator_name",
    type: "dropdown",
    source: "instructors",
    display_field: "first_name + ' ' + last_name"
  },
  { label: "תאריך מפגש ראשון", field: "start_date", type: "date" },
  { label: "זמני המפגש – התחלה", field: "start_time", type: "time" },
  { label: "זמני המפגש – סיום", field: "end_time", type: "time" },
  {
    label: "יום המפגש הקבוע",
    field: "weekday",
    type: "dropdown",
    source: "weekdays",
    display_field: "name"
  },
  {
    label: "שלבי חינוך",
    field: "education_level",
    type: "dropdown",
    source: "education_levels",
    display_field: "title"
  },
  {
    label: "סוג חינוך",
    field: "education_type",
    type: "dropdown",
    source: "education_types",
    display_field: "title"
  },
  {
    label: "היקף שעות אקדמיות מוכר לגמול",
    field: "hour_credits",
    type: "dropdown",
    source: "hour_credits",
    display_field: "hours"
  },
  {
    label: "תחום דעת",
    field: "subject",
    type: "dropdown",
    source: "subjects",
    display_field: "name"
  },
  {
    label: "תחום פתרון למידה",
    field: "solution_domain",
    type: "dropdown",
    source: "solution_domains",
    display_field: "name"
  },
  {
    label: "אופן למידה",
    field: "learning_mode",
    type: "dropdown",
    source: "learning_modes",
    display_field: "title"
  },
  { label: "קישור סילבוס", field: "syllabus_link", type: "short_answer" },
  { label: "תקציר פתרון הלמידה", field: "solution_summary", type: "rich_text" },
  { label: "מטרות פתרון הלמידה", field: "solution_goals", type: "rich_text" }
];

function createLearningSolutionForm(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  learningSolutionsSchema.forEach(field => {
    const fieldWrapper = document.createElement("div");
    fieldWrapper.className = "form-group";

    const label = document.createElement("label");
    label.textContent = field.label;
    fieldWrapper.appendChild(label);

    let input;
    switch (field.type) {
      case "short_answer":
        input = document.createElement("input");
        input.type = "text";
        break;
      case "date":
        input = document.createElement("input");
        input.type = "date";
        break;
      case "time":
        input = document.createElement("input");
        input.type = "time";
        break;
      case "rich_text":
        input = document.createElement("textarea");
        input.rows = 4;
        break;
      case "dropdown":
        input = document.createElement("select");
        input.innerHTML = `<option disabled selected>בחר...</option>`;
        loadDropdownOptions(field.source, field.display_field, input);
        break;
      default:
        input = document.createElement("input");
        input.type = "text";
    }

    input.id = field.field;
    input.name = field.field;
    input.className = "form-control";

    fieldWrapper.appendChild(input);
    container.appendChild(fieldWrapper);
  });
}

function loadDropdownOptions(sourceTable, displayField, selectElement) {
  // Replace with actual Firebase call
  fetch(`https://educatalog-63603-default-rtdb.firebaseio.com/${sourceTable}.json`)
    .then(res => res.json())
    .then(data => {
      Object.entries(data || {}).forEach(([key, value]) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = parseDisplayField(value, displayField);
        selectElement.appendChild(option);
      });
    });
}

function parseDisplayField(data, displayField) {
  if (displayField.includes("+")) {
    return displayField.split("+").map(part => {
      const key = part.trim().replace(/['"]/g, "");
      return data[key] || "";
    }).join(" ").trim();
  }
  return data[displayField] || "";
}

export { learningSolutionsSchema, createLearningSolutionForm };
