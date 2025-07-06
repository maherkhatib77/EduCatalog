
document.getElementById("mentorsForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const id = document.getElementById("mentor_id").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const role = document.getElementById("role").value;
  firebase.database().ref("mentors/" + id).set({ id, firstName, lastName, email, role });
  this.reset();
  loadMentors();
});
function loadMentors() {
  const tbody = document.querySelector("#mentorsTable tbody");
  tbody.innerHTML = "";
  firebase.database().ref("mentors").once("value", snapshot => {
    snapshot.forEach(child => {
      const d = child.val();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${d.id}</td>
        <td>${d.firstName} ${d.lastName}</td>
        <td>${d.email}</td>
        <td>${d.role}</td>
        <td><button onclick="deleteMentor('${d.id}')">🗑</button></td>`;
      tbody.appendChild(tr);
    });
  });
}
function deleteMentor(id) {
  firebase.database().ref("mentors/" + id).remove();
  loadMentors();
}
loadMentors();
