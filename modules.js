// ============================
// קובץ ראשי - modules.js
// כולל את כל מודולי הניהול: פתרונות למידה, מנחים, מדריכים וכו'
// ============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// קונפיגורציית Firebase (נא לוודא שהיא נכונה)
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

// ============================
// מודול 1: פתרונות למידה
// ============================
export function addLearningSolution(data) {
  const newRef = push(ref(db, 'learning_solutions'));
  set(newRef, data);
}

export function loadLearningSolutions(callback) {
  const solutionsRef = ref(db, 'learning_solutions');
  onValue(solutionsRef, snapshot => {
    const data = snapshot.val();
    callback(data);
  });
}

export function updateLearningSolution(id, data) {
  update(ref(db, `learning_solutions/${id}`), data);
}

export function deleteLearningSolution(id) {
  remove(ref(db, `learning_solutions/${id}`));
}

// ============================
// מודול 2: מנחים
// ============================
export function addMentor(data) {
  const newRef = push(ref(db, 'mentors'));
  set(newRef, data);
}

export function loadMentors(callback) {
  const mentorsRef = ref(db, 'mentors');
  onValue(mentorsRef, snapshot => {
    const data = snapshot.val();
    callback(data);
  });
}

export function updateMentor(id, data) {
  update(ref(db, `mentors/${id}`), data);
}

export function deleteMentor(id) {
  remove(ref(db, `mentors/${id}`));
}

// ============================
// מודול 3: מדריכים פדגוגיים
// ============================
export function addGuide(data) {
  const newRef = push(ref(db, 'guides'));
  set(newRef, data);
}

export function loadGuides(callback) {
  const guidesRef = ref(db, 'guides');
  onValue(guidesRef, snapshot => {
    const data = snapshot.val();
    callback(data);
  });
}

export function updateGuide(id, data) {
  update(ref(db, `guides/${id}`), data);
}

export function deleteGuide(id) {
  remove(ref(db, `guides/${id}`));
}

// ============================
// מודול 4: קטגוריות תוכן
// ============================
export function addContentCategory(data) {
  const newRef = push(ref(db, 'content_categories'));
  set(newRef, data);
}

export function loadContentCategories(callback) {
  const catRef = ref(db, 'content_categories');
  onValue(catRef, snapshot => {
    const data = snapshot.val();
    callback(data);
  });
}

export function updateContentCategory(id, data) {
  update(ref(db, `content_categories/${id}`), data);
}

export function deleteContentCategory(id) {
  remove(ref(db, `content_categories/${id}`));
}

// ============================
// ממשק גרפי - פתרונות למידה
// ============================

window.renderLearningSolutions = function(containerId, solutions) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (const [id, sol] of Object.entries(solutions)) {
    const div = document.createElement('div');
    div.className = 'solution-card';
    div.innerHTML = `<h4>${sol.solution_name}</h4><p>${sol.summary}</p>`;
    container.appendChild(div);
  }
}

window.createLearningSolutionForm = function(containerId, onSubmit) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <form id="learning-form">
      <input name="solution_name" placeholder="שם פתרון הלמידה" required>
      <input name="summary" placeholder="תקציר פתרון הלמידה">
      <button type="submit">שמור</button>
    </form>
  `;
  const form = document.getElementById('learning-form');
  form.onsubmit = e => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
    form.reset();
  };
}

// ============================
// ממשק גרפי - מנחים
// ============================

window.renderMentors = function(containerId, mentors) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (const [id, mentor] of Object.entries(mentors)) {
    const div = document.createElement('div');
    div.className = 'mentor-card';
    div.innerHTML = `<h4>${mentor.name}</h4><p>${mentor.expertise || ''}</p>`;
    container.appendChild(div);
  }
}

window.createMentorForm = function(containerId, onSubmit) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <form id="mentor-form">
      <input name="name" placeholder="שם מנחה" required>
      <input name="expertise" placeholder="תחום התמחות">
      <button type="submit">שמור</button>
    </form>
  `;
  const form = document.getElementById('mentor-form');
  form.onsubmit = e => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
    form.reset();
  };
}

// ============================
// ממשק גרפי - מדריכים פדגוגיים
// ============================

window.renderGuides = function(containerId, guides) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (const [id, guide] of Object.entries(guides)) {
    const div = document.createElement('div');
    div.className = 'guide-card';
    div.innerHTML = `<h4>${guide.name}</h4><p>${guide.region || ''}</p>`;
    container.appendChild(div);
  }
}

window.createGuideForm = function(containerId, onSubmit) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <form id="guide-form">
      <input name="name" placeholder="שם מדריך" required>
      <input name="region" placeholder="אזור עבודה">
      <button type="submit">שמור</button>
    </form>
  `;
  const form = document.getElementById('guide-form');
  form.onsubmit = e => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
    form.reset();
  };
}

// ============================
// ממשק גרפי - קטגוריות תוכן
// ============================

window.renderContentCategories = function(containerId, categories) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (const [id, cat] of Object.entries(categories)) {
    const div = document.createElement('div');
    div.className = 'category-card';
    div.innerHTML = `<h4>${cat.name}</h4>`;
    container.appendChild(div);
  }
}

window.createContentCategoryForm = function(containerId, onSubmit) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <form id="category-form">
      <input name="name" placeholder="שם קטגוריה" required>
      <button type="submit">שמור</button>
    </form>
  `;
  const form = document.getElementById('category-form');
  form.onsubmit = e => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
    form.reset();
  };
}
