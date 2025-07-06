
function addMeetingDay() {
  const name = document.getElementById("newMeetingDay").value;
  const id = db.ref().child("meetingDays").push().key;
  db.ref("meetingDays/" + id).set({ id, name });
  document.getElementById("newMeetingDay").value = "";
  loadMeetingDays();
}

function loadMeetingDays() {
  db.ref("meetingDays").once("value", (snapshot) => {
    const list = document.getElementById("meetingDaysList");
    list.innerHTML = "";
    snapshot.forEach((child) => {
      const item = child.val();
      const div = document.createElement("div");
      div.textContent = item.name;
      list.appendChild(div);
    });
  });
}
