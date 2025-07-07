// ============================
// קובץ ראשי - modules.js
// כולל את כל מודולי הניהול
// ============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
  createCategoriesForm,
  loadCategories,
  renderCategories,
  addCategory
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "educatalog-63603.firebaseapp.com",
  databaseURL: "https://educatalog-63603-default-rtdb.firebaseio.com",
  projectId: "educatalog-63603",
  storageBucket: "educatalog-63603.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// === מודול 1: פתרונות למידה ===
export function addLearningSolution(data) {
  const newRef = push(ref(db, 'learning_solutions'));
  set(newRef, data);
}
export function loadLearningSolutions(callback) {
  onValue(ref(db, 'learning_solutions'), snapshot => callback(snapshot.val()));
}
export function createLearningSolutionForm(containerId, onSubmit) {
  document.getElementById(containerId).innerHTML = `
    <form id="learning-form">
      <input name="solution_name" placeholder="שם פתרון" required>
      <input name="summary" placeholder="תקציר">
      <button type="submit">שמור</button>
    </form>`;
  document.getElementById('learning-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    onSubmit(data);
    e.target.reset();
  };
}
export function renderLearningSolutions(containerId, data) {
  const c = document.getElementById(containerId);
  c.innerHTML = '';
  for (const [id, item] of Object.entries(data)) {
    c.innerHTML += `<div class='card'><h4>${item.solution_name}</h4><p>${item.summary}</p></div>`;
  }
}

// === מודול 3: מנחים (Mentors) עם פופאפ ===
import { ref, set, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { db } from './firebase-config.js';

export function addMentor(data) { set(push(ref(db, 'mentors')), data); }
export function updateMentor(id, data) { update(ref(db, 'mentors/' + id), data); }
export function deleteMentor(id) { remove(ref(db, 'mentors/' + id)); }
export function loadMentors(cb) { onValue(ref(db, 'mentors'), s => cb(s.val())); }

export function openMentorsPopup() {
  const popup = document.createElement('div');
  popup.id = 'mentors-popup';
  popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  popup.innerHTML = `
    <div class='bg-white rounded shadow p-6 w-full max-w-xl'>
      <h2 class='text-xl font-bold mb-4'>ניהול מנחים</h2>
      <form id="mentors-form" class="space-y-2 mb-4">
        <input name="name" placeholder="שם מנחה" class="border p-2 w-full" required>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">➕ הוסף מנחה</button>
      </form>
      <input type="file" id="mentors-excel" accept=".xlsx,.xls" class="mb-2" />
      <button id="import-mentors" class="bg-green-600 text-white px-4 py-2 rounded mb-4">📥 ייבוא מאקסל</button>
      <div id='mentors-list' class='space-y-2'></div>
      <button onclick="document.getElementById('mentors-popup').remove()" class="mt-4 text-red-600">❌ סגור</button>
    </div>`;
  document.body.appendChild(popup);

  // טופס הוספה
  document.getElementById('mentors-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    addMentor(data);
    e.target.reset();
  };

  // ייבוא מאקסל
  document.getElementById('import-mentors').onclick = () => {
    const file = document.getElementById('mentors-excel').files[0];
    if (!file) return alert('בחר קובץ');
    const reader = new FileReader();
    reader.onload = e => {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      rows.forEach(row => addMentor({ name: row.name || row["שם"] }));
    };
    reader.readAsArrayBuffer(file);
  };

  // טען והצג
  loadMentors(data => renderMentorsList(data));
}

function renderMentorsList(data) {
  const c = document.getElementById('mentors-list');
  c.innerHTML = '';
  for (const [id, item] of Object.entries(data)) {
    const div = document.createElement('div');
    div.className = 'border p-2 rounded flex justify-between items-center';
    div.innerHTML = `
      <span>${item.name}</span>
      <div class='flex gap-2'>
        <button class='text-sm text-yellow-600' onclick='editMentor("${id}", "${item.name}")'>✏️</button>
        <button class='text-sm text-red-600' onclick='deleteMentor("${id}")'>🗑️</button>
      </div>`;
    c.appendChild(div);
  }
}

// פעולות עריכה ומחיקה
window.editMentor = function(id, oldValue) {
  const name = prompt("עדכן שם מנחה:", oldValue);
  if (name) updateMentor(id, { name });
}

window.deleteMentor = deleteMentor;
window.openMentorsPopup = openMentorsPopup;

// === מודול 3: מדריכים פדגוגיים ===
export function addGuide(data) { set(push(ref(db, 'guides')), data); }
export function loadGuides(cb) { onValue(ref(db, 'guides'), s => cb(s.val())); }
export function createGuideForm(cId, onSubmit) {
  document.getElementById(cId).innerHTML = `
    <form id="guide-form">
      <input name="name" placeholder="שם מדריך" required>
      <input name="region" placeholder="אזור עבודה">
      <button type="submit">שמור</button>
    </form>`;
  document.getElementById('guide-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    onSubmit(data);
    e.target.reset();
  };
}
export function renderGuides(cId, data) {
  const c = document.getElementById(cId);
  c.innerHTML = '';
  for (const [id, item] of Object.entries(data)) {
    c.innerHTML += `<div class='card'><h4>${item.name}</h4><p>${item.region || ''}</p></div>`;
  }
}

// === מודול 4: היקף שעות אקדמיות ===
export function addHours(data) { set(push(ref(db, 'hours')), data); }
export function loadHours(cb) { onValue(ref(db, 'hours'), s => cb(s.val())); }
export function createHoursForm(cId, onSubmit) {
  document.getElementById(cId).innerHTML = `
    <form id="hours-form">
      <input name="amount" placeholder="לדוגמה: 30 / 60 / 120 שעות" required>
      <button type="submit">שמור</button>
    </form>`;
  document.getElementById('hours-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    onSubmit(data);
    e.target.reset();
  };
}
export function renderHours(cId, data) {
  const c = document.getElementById(cId);
  c.innerHTML = '';
  for (const [id, item] of Object.entries(data)) {
    c.innerHTML += `<div class='card'>${item.amount} שעות</div>`;
  }
}

// === מודול 5: אופני למידה ===
export function addMode(data) { set(push(ref(db, 'learning_modes')), data); }
export function loadModes(cb) { onValue(ref(db, 'learning_modes'), s => cb(s.val())); }
export function createModesForm(cId, onSubmit) {
  document.getElementById(cId).innerHTML = `
    <form id="modes-form">
      <input name="type" placeholder="לדוג': פנים אל פנים, סינכרוני וכו'" required>
      <button type="submit">שמור</button>
    </form>`;
  document.getElementById('modes-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    onSubmit(data);
    e.target.reset();
  };
}
export function renderModes(cId, data) {
  const c = document.getElementById(cId);
  c.innerHTML = '';
  for (const [id, item] of Object.entries(data)) {
    c.innerHTML += `<div class='card'>${item.type}</div>`;
  }
}

// === מודול 6: ימי מפגש ===
export function addDay(data) { set(push(ref(db, 'meeting_days')), data); }
export function loadDays(cb) { onValue(ref(db, 'meeting_days'), s => cb(s.val())); }
export function createDaysForm(cId, onSubmit) {
  document.getElementById(cId).innerHTML = `
    <form id="days-form">
      <input name="day" placeholder="לדוג': ראשון, שני, שלישי וכו'" required>
      <button type="submit">שמור</button>
    </form>`;
  document.getElementById('days-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    onSubmit(data);
    e.target.reset();
  };
}
export function renderDays(cId, data) {
  const c = document.getElementById(cId);
  c.innerHTML = '';
  for (const [id, item] of Object.entries(data)) {
    c.innerHTML += `<div class='card'>${item.day}</div>`;
  }
}

// === מודול 7: שלבי חינוך ===
export function addLevel(data) { set(push(ref(db, 'education_levels')), data); }
export function loadLevels(cb) { onValue(ref(db, 'education_levels'), s => cb(s.val())); }
export function createLevelsForm(cId, onSubmit) {
  document.getElementById(cId).innerHTML = `
    <form id="levels-form">
      <input name="level" placeholder="לדוג': קדם-יסודי, יסודי, תיכון..." required>
      <button type="submit">שמור</button>
    </form>`;
  document.getElementById('levels-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    onSubmit(data);
    e.target.reset();
  };
}
export function renderLevels(cId, data) {
  const c = document.getElementById(cId);
  c.innerHTML = '';
  for (const [id, item] of Object.entries(data)) {
    c.innerHTML += `<div class='card'>${item.level}</div>`;
  }
}

// === מודול 8: תחומי דעת ===
export function addSubject(data) { set(push(ref(db, 'subjects')), data); }
export function loadSubjects(cb) { onValue(ref(db, 'subjects'), s => cb(s.val())); }
export function createSubjectsForm(cId, onSubmit) {
  document.getElementById(cId).innerHTML = `
    <form id="subjects-form">
      <input name="subject" placeholder="לדוג': שפה עברית, שפה ערבית וכו'" required>
      <button type="submit">שמור</button>
    </form>`;
  document.getElementById('subjects-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    onSubmit(data);
    e.target.reset();
  };
}
export function renderSubjects(cId, data) {
  renderTable(cId, data, ['subject']);
}

// === מודול 9: מידע כללי לאתר ===
export function addSiteInfo(data) { set(ref(db, 'site_info'), data); }
export function loadSiteInfo(cb) { onValue(ref(db, 'site_info'), s => cb(s.val())); }
export function createSiteInfoForm(cId, onSubmit) {
  document.getElementById(cId).innerHTML = `
    <form id="siteinfo-form">
      <input name="title" placeholder="כותרת עמוד ראשי" required>
      <input name="year" placeholder="שנת לימודים">
      <input name="logo" placeholder="קישור ללוגו">
      <input name="copyright" placeholder="זכויות יוצרים">
      <input name="contact" placeholder="פרטי יצירת קשר">
      <input name="work_days" placeholder="ימי עבודה">
      <input name="hours" placeholder="שעות פעילות">
      <input name="address" placeholder="כתובת פיזית">
      <input name="waze" placeholder="קישור ל-Waze">
      <input name="maps" placeholder="קישור ל-Google Maps">
      <button type="submit">שמור</button>
    </form>`;
  document.getElementById('siteinfo-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    onSubmit(data);
  };
}
export function renderSiteInfo(cId, data) {
  renderTable(cId, {single: data}, ['title','year','contact','work_days','hours','address','waze','maps']);
}

// === מודול 10: פתרונות למידה ===
export function addSolution(data) { set(push(ref(db, 'solutions')), data); }
export function loadSolutions(cb) { onValue(ref(db, 'solutions'), s => cb(s.val())); }
export function createSolutionsForm(cId, onSubmit) {
  document.getElementById(cId).innerHTML = `
    <form id="solutions-form">
      <input name="name" placeholder="שם פתרון למידה" required>
      <input name="guide" placeholder="שם מדריך פדגוגי">
      <input name="instructor" placeholder="שם המנחה">
      <input name="education_stage" placeholder="שלב חינוך">
      <input name="start_date" placeholder="תאריך התחלה">
      <input name="hours" placeholder="היקף שעות">
      <button type="submit">שמור</button>
    </form>`;
  document.getElementById('solutions-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    onSubmit(data);
    e.target.reset();
  };
}
export function renderSolutions(cId, data) {
  renderTable(cId, data, ['name','guide','instructor','education_stage','start_date','hours']);
}


// פונקציה גלובלית לעריכה
window.editCategory = function(id, oldValue) {
  const newCategory = prompt("עדכן את הקטגוריה:", oldValue);
  if (newCategory) updateCategory(id, { category: newCategory });
}

window.deleteCategory = deleteCategory;



<!-- === כפתורי הפעלה למודולים (Tailwind + Icons) === -->
<div id="module-buttons" class="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
  <button class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow" onclick="createLearningSolutionForm('form-container', addLearningSolution); loadLearningSolutions(data => renderLearningSolutions('list-container', data));">
    📘 פתרונות למידה
  </button>
  <button class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl shadow" onclick="createMentorForm('form-container', addMentor); loadMentors(data => renderMentors('list-container', data));">
    👥 מנחים
  </button>
  <button class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow" onclick="createGuideForm('form-container', addGuide); loadGuides(data => renderGuides('list-container', data));">
    🧑‍🏫 מדריכים פדגוגיים
  </button>
  <button class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow" onclick="createHoursForm('form-container', addHours); loadHours(data => renderHours('list-container', data));">
    ⏱️ היקף שעות
  </button>
  <button class="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-xl shadow" onclick="createModesForm('form-container', addMode); loadModes(data => renderModes('list-container', data));">
    🔄 אופני למידה
  </button>
  <button class="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl shadow" onclick="createDaysForm('form-container', addDay); loadDays(data => renderDays('list-container', data));">
    📅 ימי מפגש
  </button>
  <button class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow" onclick="createLevelsForm('form-container', addLevel); loadLevels(data => renderLevels('list-container', data));">
    🎓 שלבי חינוך
  </button>
  <button class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl shadow" onclick="createSubjectsForm('form-container', addSubject); loadSubjects(data => renderSubjects('list-container', data));">
    📚 תחומי דעת
  </button>
  <button class="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-xl shadow" onclick="createSiteInfoForm('form-container', addSiteInfo); loadSiteInfo(data => renderSiteInfo('list-container', data));">
    ⚙️ מידע כללי לאתר
  </button>
</div>

<!-- === אזור הטפסים והתצוגות === -->
<div id="form-container" class="my-6"></div>
<div id="list-container" class="space-y-4"></div>
