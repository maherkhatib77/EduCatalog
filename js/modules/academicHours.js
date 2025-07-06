
document.addEventListener("DOMContentLoaded", function () {
    const dbRef = firebase.database().ref('academicHours');
    const tableBody = document.getElementById("academicHours-table-body");
    const form = document.getElementById("academicHours-form");

    function loadData() {
        dbRef.once("value", (snapshot) => {
            tableBody.innerHTML = "";
            snapshot.forEach((childSnapshot) => {
                const key = childSnapshot.key;
                const data = childSnapshot.val();
                const row = `<tr>` + Object.values(data).map(v => `<td>${v}</td>`).join("") + 
                            `<td>
                                <button onclick="editItem('academicHours', '${key}')">✏️</button>
                                <button onclick="deleteItem('academicHours', '${key}')">🗑️</button>
                             </td></tr>`;
                tableBody.innerHTML += row;
            });
        });
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const newData = {};
        formData.forEach((val, key) => newData[key] = val);
        dbRef.push(newData).then(() => {
            form.reset();
            loadData();
        });
    });

    window.editItem = function (mod, key) {
        dbRef.child(key).once("value", (snap) => {
            const data = snap.val();
            for (const k in data) {
                if (form.elements[k]) form.elements[k].value = data[k];
            }
            form.onsubmit = function (e) {
                e.preventDefault();
                const formData = new FormData(form);
                const updatedData = {};
                formData.forEach((val, key) => updatedData[key] = val);
                dbRef.child(key).set(updatedData).then(() => {
                    form.reset();
                    loadData();
                    form.onsubmit = defaultSubmit;
                });
            };
        });
    }

    window.deleteItem = function (mod, key) {
        if (confirm("Are you sure you want to delete this item?")) {
            dbRef.child(key).remove().then(loadData);
        }
    }

    const defaultSubmit = form.onsubmit;
    loadData();
});
