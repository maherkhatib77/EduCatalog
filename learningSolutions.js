// learningSolutions.js – גרסה מעודכנת עם שדות drop-down דינמיים וטופס ארוך

import { getData, populateSelect } from './utils.js';

const db = firebase.database();
const solutionsRef = db.ref('learning_solutions');

// טענת רשימות לבחירה מטבלאות שונות
const dropdownSources = {
  creator_name: { table: 'instructors', label: d => `${d.first_name} ${d.last_name}` },
  fixed_day: { table: 'weekdays', label: d => d.name },
  education_level: { table: 'education_levels', label: d => d.title },
  education_type: { table: 'education_types', label: d => d.title },
  hour_credits: { table: 'hour_credits', label: d => d.hours },
  subject: { table: 'subjects', label: d => d.name },
  solution_domain: { table: 'solution_domains', label: d => d.name },
  learning_mode: { table: 'learning_modes', label: d => d.title },
};

export function renderLearningSolutionsModule(container) {
  container.innerHTML = '';

  const form = document.createElement('form');
  form.className = 'scrollable-form';
  form.innerHTML = `
    <div class="form-group">
      <label>מספר פתרון למידה</label>
      <input type="text" name="solution_id" required>
    </div>
    <div class="form-group">
      <label>שם פתרון למידה</label>
      <input type="text" name="solution_name" required>
    </div>
    <div class="form-group">
      <label>שם יוצר פתרון הלמידה</label>
      <select name="creator_name"></select>
    </div>
    <div class="form-group">
      <label>שם המנחה</label>
      <input type="text" name="instructor_name" required>
    </div>
    <div class="form-group">
      <label>תחום דעת</label>
      <select name="subject"></select>
    </div>
    <div class="form-group">
      <label>תחום פתרון למידה</label>
      <select name="solution_domain"></select>
    </div>
    <div class="form-group">
      <label>מטרות פתרון הלמידה</label>
      <textarea name="solution_goals"></textarea>
    </div>
    <div class="form-group">
      <label>תקציר פתרון הלמידה</label>
      <textarea name="solution_summary"></textarea>
    </div>
    <div class="form-group">
      <label>שלב חינוך</label>
      <select name="education_level"></select>
    </div>
    <div class="form-group">
      <label>סוג חינוך</label>
      <select name="education_type"></select>
    </div>
    <div class="form-group">
      <label>היקף שעות אקדמיות מוכר לגמול</label>
      <select name="hour_credits"></select>
    </div>
    <div class="form-group">
      <label>תאריך ויום התחלת המפגשים</label>
      <input type="date" name="start_date">
    </div>
    <div class="form-group">
      <label>יום קבוע למפגשים</label>
      <select name="fixed_day"></select>
    </div>
    <div class="form-group">
      <label>שעת התחלה</label>
      <input type="time" name="start_time">
    </div>
    <div class="form-group">
      <label>שעת סיום</label>
      <input type="time" name="end_time">
    </div>
    <div class="form-group">
      <label>אופן הלמידה</label>
      <select name="learning_mode"></select>
    </div>
    <div class="form-group">
      <label>שם המדריך הפדגוגי</label>
      <input type="text" name="coordinator_name">
    </div>
    <div class="form-group">
      <label>האם נוצר קשר עם המרצה</label>
      <select name="contacted">
        <option value="כן">כן</option>
        <option value="לא">לא</option>
      </select>
    </div>
    <div class="form-group">
      <label>סטטוס הסילבוס</label>
      <input type="text" name="syllabus_status">
    </div>
    <div class="form-group">
      <label>קישור סילבוס</label>
      <input type="url" name="syllabus_link">
    </div>
    <button type="submit">שמור</button>
  `;

  container.appendChild(form);

  // טען נתונים לכל השדות מסוג drop-down
  Object.entries(dropdownSources).forEach(([fieldName, { table, label }]) => {
    getData(table).then(data => {
      populateSelect(form[fieldName], data, label);
    });
  });

  form.onsubmit = e => {
    e.preventDefault();
    const formData = new FormData(form);
    const record = Object.fromEntries(formData.entries());
    solutionsRef.push(record);
    alert('נשמר בהצלחה!');
    form.reset();
  };
}
