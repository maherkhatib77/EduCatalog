let solutions = [];

fetch("solutions.json")
  .then((res) => res.json())
  .then((data) => {
    solutions = data;
    displaySolutions(data);
  });

function displaySolutions(data) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";
  data.forEach((sol) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${sol.image}" alt="solution image" />
      <h3 onclick="showPopup('${sol.id}')">${sol.title}</h3>
      <p><strong>מספר:</strong> ${sol.id}</p>
      <p><strong>אופן:</strong> ${sol.method}</p>
      <p><strong>מנחה:</strong> ${sol.instructor}</p>
      <p><strong>שלב:</strong> ${sol.education_levels.join(", ")}</p>
      <p><strong>שעות:</strong> ${sol.hours}</p>
    `;
    container.appendChild(card);
  });
}

function showPopup(id) {
  const sol = solutions.find((s) => s.id === id);
  document.getElementById("popupTitle").innerText = sol.title;
  document.getElementById("popupDetails").innerHTML = `
    <p><strong>תקציר:</strong> ${sol.summary}</p>
    <p><strong>מטרות:</strong> ${sol.goals}</p>
    <p><strong>שעות:</strong> ${sol.hours}</p>
    <p><strong>מרצה:</strong> ${sol.instructor}</p>
    <p><a href="${sol.syllabus_link}" target="_blank">סילבוס</a></p>
  `;
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

function downloadPDF() {
  alert("הורדת PDF תתווסף בעתיד.");
}

// חיפוש פשוט
document.getElementById("searchInput").addEventListener("input", function () {
  const value = this.value.toLowerCase();
  const filtered = solutions.filter((s) =>
    s.title.toLowerCase().includes(value)
  );
  displaySolutions(filtered);
});
