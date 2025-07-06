
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCYEdHutsO1eYn3iQvnVehl-t96__Plwo4",
  authDomain: "educatalog-63603.firebaseapp.com",
  databaseURL: "https://educatalog-63603-default-rtdb.firebaseio.com",
  projectId: "educatalog-63603",
  storageBucket: "educatalog-63603.appspot.com",
  messagingSenderId: "577201627806",
  appId: "1:577201627806:web:bd9d6346134d7c3dff518f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById('solutionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((val, key) => data[key] = val);
    data['contacted'] = formData.get('contacted') ? true : false;

    const newSolutionRef = push(ref(db, 'solutions'));
    set(newSolutionRef, data)
        .then(() => {
            alert("הפתרון נשמר בהצלחה!");
            e.target.reset();
        })
        .catch((error) => {
            alert("שגיאה בשמירה: " + error.message);
        });
});
