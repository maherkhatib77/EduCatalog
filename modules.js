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
// מודול 4: קטגוריות תוכן (אופציונלי להשלמה בהמשך)
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
