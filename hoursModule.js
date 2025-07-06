
document.getElementById("hoursForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const key = document.getElementById("amount").value;
  firebase.database().ref("hours/" + key).set({ key });
  this.reset();
  loadHours();
});
function loadHours() {
  const tbody = document.querySelector("#hoursTable tbody");
  tbody.innerHTML = "";
  firebase.database().ref("hours").once("value", snapshot => {
    snapshot.forEach(child => {
      const key = child.key;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${key}</td>
        <td><button onclick="deleteHour('${key}')">🗑</button></td>`;
      tbody.appendChild(tr);
    });
  });
}
function deleteHour(key) {
  firebase.database().ref("hours/" + key).remove();
  loadHours();
}
loadHours();
