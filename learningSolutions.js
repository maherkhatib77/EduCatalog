
let currentCardIndex = 0;
let cardDataArray = [];

function loadLearningSolutionsAsCards() {
  document.getElementById('card-container').classList.remove('hidden');
  document.getElementById('table-container').innerHTML = '';

  db.ref("learning_solutions").once("value", snapshot => {
    cardDataArray = [];
    snapshot.forEach(child => {
      const item = child.val();
      item.id = child.key;
      cardDataArray.push(item);
    });

    if (cardDataArray.length > 0) {
      currentCardIndex = 0;
      renderCardView();
    } else {
      document.getElementById("card-container").innerHTML = "<p>אין נתונים להצגה.</p>";
    }
  });
}

function renderCardView() {
  const d = cardDataArray[currentCardIndex];
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  let html = '<div style="border:2px solid #1976d2; border-radius:12px; padding:20px; background:#f9f9f9;">';
  html += `<h3 style="margin-top:0;">${d.solution_name || "(ללא שם)"}</h3>`;
  html += `<p><strong>מנחה:</strong> ${d.creator_name || ""}</p>`;
  html += `<p><strong>תאריך:</strong> ${d.first_meeting_date || ""}</p>`;
  html += `<p><strong>יום:</strong> ${d.weekday || ""}</p>`;
  html += `<p><strong>שלבים:</strong> ${(d.education_levels || []).join(", ")}</p>`;
  html += `<p><strong>שעות:</strong> ${d.hours_count || ""}</p>`;
  html += `<p><strong>תחום דעת:</strong> ${d.subject || ""}</p>`;
  html += `<p><strong>מטרות:</strong> ${d.objectives || ""}</p>`;
  html += `<p><strong>תקציר:</strong> ${d.summary || ""}</p>`;

  html += `<div style="margin-top:10px;">`;
  html += `<button onclick="prevCard()" ${currentCardIndex === 0 ? "disabled" : ""}>◀</button>`;
  html += ` ${currentCardIndex + 1} / ${cardDataArray.length} `;
  html += `<button onclick="nextCard()" ${currentCardIndex === cardDataArray.length - 1 ? "disabled" : ""}>▶</button>`;
  html += `</div>`;

  if (userType === "admin" || userType === "operator") {
    html += `<div style="margin-top:15px;">`;
    html += `<button onclick="editLearningSolution('${d.id}')">✎ ערוך</button> `;
    if (userType === "admin") {
      html += `<button onclick="deleteLearningSolution('${d.id}')">🗑 מחק</button>`;
    }
    html += `</div>`;
  }

  html += "</div>";
  container.innerHTML = html;
}

function prevCard() {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    renderCardView();
  }
}

function nextCard() {
  if (currentCardIndex < cardDataArray.length - 1) {
    currentCardIndex++;
    renderCardView();
  }
}

// expose globally
window.loadLearningSolutionsAsCards = loadLearningSolutionsAsCards;
