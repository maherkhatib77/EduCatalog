
let learningSolutions = [];
let currentIndex = 0;

const cardContent = document.getElementById("cardContent");
const cardCounter = document.getElementById("cardCounter");

function renderCard(index) {
  const data = learningSolutions[index];
  if (!data) return;

  cardContent.innerHTML = '';

  for (const key in data) {
    const value = data[key];
    const field = document.createElement('div');
    field.className = 'card-field';
    field.innerHTML = `<strong>${key}:</strong> <span>${value}</span>`;
    cardContent.appendChild(field);
  }

  const actions = document.createElement('div');
  actions.className = 'card-actions';
  actions.innerHTML = `
    <i class="fas fa-edit" title="עריכה" onclick="editCard('${learningSolutions[index].id}')"></i>
    <i class="fas fa-trash-alt" title="מחיקה" onclick="deleteCard('${learningSolutions[index].id}')"></i>
  `;
  cardContent.appendChild(actions);

  cardCounter.textContent = `${index + 1} / ${learningSolutions.length}`;
}

function prevCard() {
  if (currentIndex > 0) {
    currentIndex--;
    renderCard(currentIndex);
  }
}

function nextCard() {
  if (currentIndex < learningSolutions.length - 1) {
    currentIndex++;
    renderCard(currentIndex);
  }
}

function loadLearningSolutions() {
  const dbRef = firebase.database().ref("learning_solutions");
  dbRef.once("value", snapshot => {
    learningSolutions = [];
    snapshot.forEach(child => {
      const item = child.val();
      item.id = child.key;
      learningSolutions.push(item);
    });

    if (learningSolutions.length > 0) {
      currentIndex = 0;
      renderCard(currentIndex);
    } else {
      cardContent.innerHTML = '<p>לא נמצאו רשומות.</p>';
    }
  });
}

function editCard(id) {
  alert(`עריכה של רשומה: ${id}`);
}

function deleteCard(id) {
  if (confirm("האם אתה בטוח שברצונך למחוק רשומה זו?")) {
    firebase.database().ref("learning_solutions").child(id).remove()
      .then(() => {
        alert("נמחק בהצלחה");
        loadLearningSolutions();
      });
  }
}

window.addEventListener("DOMContentLoaded", loadLearningSolutions);
