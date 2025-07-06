
document.getElementById("instructorForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  firebase.database().ref("instructors/" + id).set({ id, name, phone, email });
  this.reset();
  loadInstructors();
});

function loadInstructors() {
  const tbody = document.querySelector("#instructorsTable tbody");
  tbody.innerHTML = "";
  firebase.database().ref("instructors").once("value", snapshot => {
    snapshot.forEach(child => {
      const data = child.val();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.id}</td>
        <td>${data.name}</td>
        <td>${data.phone}</td>
        <td>${data.email}</td>
        <td><button onclick="deleteInstructor('${data.id}')">🗑</button></td>`;
      tbody.appendChild(tr);
    });
  });
}
function deleteInstructor(id) {
  firebase.database().ref("instructors/" + id).remove();
  loadInstructors();
}
loadInstructors();
