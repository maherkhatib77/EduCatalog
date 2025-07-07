
// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD...example",
  authDomain: "educatalog-63603.firebaseapp.com",
  databaseURL: "https://educatalog-63603-default-rtdb.firebaseio.com",
  projectId: "educatalog-63603",
  storageBucket: "educatalog-63603.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefg"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// טופס מדריכים פדגוגיים
document.getElementById("form-guides").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = {
    firstName: this[0].value,
    lastName: this[1].value,
    id: this[2].value,
    email: this[3].value,
    role: this[4].value
  };
  push(ref(db, "guides"), data);
  this.reset();
});

// טעינת טבלת מדריכים פדגוגיים
onValue(ref(db, "guides"), snapshot => {
  const tbody = document.querySelector("#form-guides").nextElementSibling.querySelector("tbody");
  tbody.innerHTML = "";
  snapshot.forEach(child => {
    const g = child.val();
    tbody.innerHTML += `<tr><td>${g.firstName}</td><td>${g.lastName}</td><td>${g.id}</td><td>${g.email}</td><td>${g.role}</td></tr>`;
  });
});

// טופס היקף שעות
document.getElementById("form-hours").addEventListener("submit", function(e) {
  e.preventDefault();
  const value = document.getElementById("hours-input").value;
  push(ref(db, "hours"), { value });
  this.reset();
});

// טעינת טבלת שעות
onValue(ref(db, "hours"), snapshot => {
  const tbody = document.getElementById("table-hours").querySelector("tbody");
  tbody.innerHTML = "";
  snapshot.forEach(child => {
    const val = child.val().value;
    tbody.innerHTML += `<tr><td>${val}</td><td>✏️</td><td>🗑️</td></tr>`;
  });
});

// טופס מידע כללי לאתר
document.getElementById("form-site-info").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = {
    siteTitle: document.getElementById("site-title").value,
    year: document.getElementById("school-year").value,
    copyright: document.getElementById("copyright-info").value,
    contact: document.getElementById("contact-info").value,
    workdays: document.getElementById("working-days").value,
    hours: document.getElementById("working-hours").value,
    address: document.getElementById("physical-address").value,
    waze: document.getElementById("waze-link").value,
    maps: document.getElementById("maps-link").value
  };
  push(ref(db, "siteInfo"), data);
  this.reset();
});

// טבלת מידע כללי
onValue(ref(db, "siteInfo"), snapshot => {
  const tbody = document.getElementById("table-site-info").querySelector("tbody");
  tbody.innerHTML = "";
  snapshot.forEach(child => {
    const val = child.val();
    Object.keys(val).forEach(key => {
      tbody.innerHTML += `<tr><td>${key}</td><td>${val[key]}</td><td>✏️</td></tr>`;
    });
  });
});


// טופס מנחים
document.getElementById("form-mentors").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = {
    id: this[0].value,
    name: this[1].value,
    phone: this[2].value,
    email: this[3].value
  };
  push(ref(db, "mentors"), data);
  this.reset();
});
onValue(ref(db, "mentors"), snapshot => {
  const tbody = document.querySelector("#form-mentors").nextElementSibling.querySelector("tbody");
  tbody.innerHTML = "";
  snapshot.forEach(child => {
    const m = child.val();
    tbody.innerHTML += `<tr><td>${m.id}</td><td>${m.name}</td><td>${m.phone}</td><td>${m.email}</td></tr>`;
  });
});

// טופס אופני למידה
document.getElementById("form-learning-modes").addEventListener("submit", function(e) {
  e.preventDefault();
  const mode = this[0].value;
  push(ref(db, "learningModes"), { mode });
  this.reset();
});
onValue(ref(db, "learningModes"), snapshot => {
  const tbody = document.querySelector("#form-learning-modes").nextElementSibling.querySelector("tbody");
  tbody.innerHTML = "";
  snapshot.forEach(child => {
    const m = child.val().mode;
    tbody.innerHTML += `<tr><td>${m}</td></tr>`;
  });
});

// טופס ימי מפגש
document.getElementById("form-days").addEventListener("submit", function(e) {
  e.preventDefault();
  const day = this[0].value;
  push(ref(db, "meetingDays"), { day });
  this.reset();
});
onValue(ref(db, "meetingDays"), snapshot => {
  const tbody = document.querySelector("#form-days").nextElementSibling.querySelector("tbody");
  tbody.innerHTML = "";
  snapshot.forEach(child => {
    const d = child.val().day;
    tbody.innerHTML += `<tr><td>${d}</td></tr>`;
  });
});

// טופס שלבי חינוך
document.getElementById("form-stages").addEventListener("submit", function(e) {
  e.preventDefault();
  const stage = this[0].value;
  push(ref(db, "educationStages"), { stage });
  this.reset();
});
onValue(ref(db, "educationStages"), snapshot => {
  const tbody = document.querySelector("#form-stages").nextElementSibling.querySelector("tbody");
  tbody.innerHTML = "";
  snapshot.forEach(child => {
    const s = child.val().stage;
    tbody.innerHTML += `<tr><td>${s}</td></tr>`;
  });
});

// טופס תחומי פתרונות למידה
document.getElementById("form-solution-domains").addEventListener("submit", function(e) {
  e.preventDefault();
  const domain = this[0].value;
  push(ref(db, "solutionDomains"), { domain });
  this.reset();
});
onValue(ref(db, "solutionDomains"), snapshot => {
  const tbody = document.querySelector("#form-solution-domains").nextElementSibling.querySelector("tbody");
  tbody.innerHTML = "";
  snapshot.forEach(child => {
    const d = child.val().domain;
    tbody.innerHTML += `<tr><td>${d}</td></tr>`;
  });
});

// טופס תחומי דעת
document.getElementById("form-subjects").addEventListener("submit", function(e) {
  e.preventDefault();
  const subject = this[0].value;
  push(ref(db, "subjects"), { subject });
  this.reset();
});
onValue(ref(db, "subjects"), snapshot => {
  const tbody = document.querySelector("#form-subjects").nextElementSibling.querySelector("tbody");
  tbody.innerHTML = "";
  snapshot.forEach(child => {
    const s = child.val().subject;
    tbody.innerHTML += `<tr><td>${s}</td></tr>`;
  });
});

// טופס פתרונות למידה
document.getElementById("form-learning-solutions").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = {
    guideName: this[0].value,
    solutionNumber: this[1].value,
    solutionName: this[2].value,
    summary: this[3].value,
    goals: this[4].value,
    contentDomain: this[5].value,
    stage: this[6].value,
    hours: this[7].value,
    startDate: this[8].value,
    fixedDay: this[9].value,
    startTime: this[10].value,
    endTime: this[11].value,
    mode: this[12].value,
    mentorName: this[13].value,
    contactMade: this[14].value
    // סילבוס לא נטען כאן כי זו העלאת קובץ
  };
  push(ref(db, "learningSolutions"), data);
  this.reset();
});
onValue(ref(db, "learningSolutions"), snapshot => {
  const tbody = document.querySelector("#form-learning-solutions").nextElementSibling.querySelector("tbody");
  tbody.innerHTML = "";
  snapshot.forEach(child => {
    const l = child.val();
    tbody.innerHTML += `<tr><td>${l.solutionName}</td></tr>`;
  });
});
