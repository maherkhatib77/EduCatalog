
const instructorsRef = firebase.database().ref("instructors");

document.getElementById("instructorForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const id = document.getElementById("instructorId").value;
  const name = document.getElementById("instructorName").value;
  const phone = document.getElementById("instructorPhone").value;
  const email = document.getElementById("instructorEmail").value;
  instructorsRef.child(id).set({ id, name, phone, email });
  this.reset();
});

instructorsRef.on("value", snapshot => {
  const tbody = document.querySelector("#instructorsTable tbody");
  tbody.innerHTML = "";
  snapshot.forEach(child => {
    const data = child.val();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.id}</td>
      <td>${data.name}</td>
      <td>${data.phone}</td>
      <td>${data.email}</td>
      <td>
        <button onclick='editInstructor("${data.id}")'>ערוך</button>
        <button onclick='deleteInstructor("${data.id}")'>מחק</button>
      </td>
    `;
    tbody.appendChild(row);
  });
});

function deleteInstructor(id) {
  if (confirm("האם אתה בטוח שברצונך למחוק מנחה זה?")) {
    instructorsRef.child(id).remove();
  }
}

function editInstructor(id) {
  instructorsRef.child(id).once("value").then(snapshot => {
    const data = snapshot.val();
    document.getElementById("instructorId").value = data.id;
    document.getElementById("instructorName").value = data.name;
    document.getElementById("instructorPhone").value = data.phone;
    document.getElementById("instructorEmail").value = data.email;
  });
}

document.getElementById("searchInstructor").addEventListener("input", function () {
  const filter = this.value.toLowerCase();
  document.querySelectorAll("#instructorsTable tbody tr").forEach(row => {
    const name = row.children[1].textContent.toLowerCase();
    row.style.display = name.includes(filter) ? "" : "none";
  });
});
