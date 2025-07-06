
function addLearningMode() {
  const name = document.getElementById("newLearningMode").value;
  const id = db.ref().child("learningModes").push().key;
  db.ref("learningModes/" + id).set({ id, name });
  document.getElementById("newLearningMode").value = "";
  loadLearningModes();
}

function loadLearningModes() {
  db.ref("learningModes").once("value", (snapshot) => {
    const list = document.getElementById("learningModesList");
    list.innerHTML = "";
    snapshot.forEach((child) => {
      const item = child.val();
      const div = document.createElement("div");
      div.textContent = item.name;
      list.appendChild(div);
    });
  });
}

window.onload = loadLearningModes;
