// ============================
// קובץ ראשי - modules.js
// כולל את כל מודולי הניהול
// ============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

// === מודול 2: מנחים ===
export function addMentor(data) { set(push(ref(db, 'mentors')), data); }
export function loadMentors(cb) { onValue(ref(db, 'mentors'), s => cb(s.val())); }
export function createMentorForm(cId, onSubmit) {
  document.getElementById(cId).innerHTML = `
    <form id="mentor-form">
      <input name="name" placeholder="שם מנחה" required>
      <input name="expertise" placeholder="תחום התמחות">
      <button type="submit">שמור</button>
    </form>`;
  document.getElementById('mentor-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    onSubmit(data);
    e.target.reset();
  };
}
export function renderMentors(cId, data) {
  const c = document.getElementById(cId);
  c.innerHTML = '';
  for (const [id, item] of Object.entries(data)) {
    c.innerHTML += `<div class='card'><h4>${item.name}</h4><p>${item.expertise || ''}</p></div>`;
  }
}

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
  const c = document.getElementById(cId);
  c.innerHTML = '';
  for (const [id, item] of Object.entries(data)) {
    c.innerHTML += `<div class='card'>${item.subject}</div>`;
  }
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
  const c = document.getElementById(cId);
  c.innerHTML = `
    <div class='card'>
      <h4>${data.title}</h4>
      <p>שנה: ${data.year}</p>
      <p>צור קשר: ${data.contact}</p>
      <p>ימים: ${data.work_days}, שעות: ${data.hours}</p>
      <p>כתובת: ${data.address}</p>
      <p><a href='${data.waze}' target='_blank'>Waze</a> | <a href='${data.maps}' target='_blank'>Google Maps</a></p>
    </div>`;
}
