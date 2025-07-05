let solutions = [];

// טוען את קובץ JSON
fetch("solutions.json")
  .then((res) => res.json())
  .then((data) => {
    solutions = data;
    displaySolutions(data);
  })
  .catch((err) => {
    console.error("שגיאה בטעינת הנתונים:", err);
    document.getElementById("cardsContainer").innerHTML =
      "<p>לא ניתן לטעון את פתרונות הלמידה.</p>";
  });

// מציג את הכרטיסים בדף
function displaySolutions(data) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>לא נמצאו פתרונות מתאימים.</p>";
    return;
  }

  data.forEach((sol) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${sol.image}" alt="תמונה מייצגת" />
      <h3>${sol.title}</h3>
      <p><strong>מספר מזהה:</strong> ${sol.id}</p>
      <p><strong>אופן הלמידה:</strong> ${sol.method}</p>
      <p><strong>מנחה:</strong> ${sol.instructor}</p>
      <p><strong>שלבי חינוך:</strong> ${sol.education_levels.join(", ")}</p>
      <p><strong>שעות:</strong> ${sol.hours}</p>
    `;
    container.appendChild(card);
  });
}

// פונקציית חיפוש לפי שם
document.getElementById("searchInput").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const filtered = solutions.filter((s) =>
    s.title.toLowerCase().includes(searchTerm)
  );
  displaySolutions(filtered);
});

function addNewSolution() {
  try {
    let current = JSON.parse(document.getElementById("jsonContent").value || "[]");
    if (!Array.isArray(current)) current = [];

    const newSolution = {
      "id": "",
      "title": "פתרון חדש",
      "summary": "",
      "objectives": "",
      "method": "",
      "instructor": "",
      "guide": "",
      "education_levels": [],
      "hours": 0,
      "domain": "",
      "subject": "",
      "start_date": "",
      "day": "",
      "start_time": "",
      "end_time": "",
      "contacted": false,
      "syllabus_status": "",
      "syllabus_link": "",
      "image": ""
    };

    current.push(newSolution);
    document.getElementById("jsonContent").value = JSON.stringify(current, null, 2);
    document.getElementById("statusMsg").textContent = "🆕 שורה חדשה נוספה.";
  } catch (e) {
    document.getElementById("statusMsg").textContent = "❌ לא ניתן להוסיף – תוכן JSON אינו תקין.";
  }
}
