let data = [];

fetch('solutions.json')
    .then(response => response.json())
    .then(json => {
        data = json;
        renderSolutions(json);
    });

function renderSolutions(solutions) {
    const container = document.getElementById('solutionContainer');
    container.innerHTML = '';
    solutions.forEach(sol => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="images/default.jpg" alt="תמונה ייצוגית">
            <div class="info">
                <h3 onclick="showPopup('${sol.name}', \`${formatFullDetails(sol)}\`)">${sol.name}</h3>
                <p>רכז: ${sol.manager}</p>
                <p>מנחה: ${sol.mentor}</p>
                <p>שלב חינוך: ${sol.level}</p>
                <p>תאריך התחלה: ${sol.date}</p>
                <p>שעות: ${sol.hours}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

function showPopup(title, details) {
    document.getElementById('popupTitle').innerText = title;
    document.getElementById('popupDetails').innerHTML = details;
    document.getElementById('solutionPopup').classList.remove('hidden');
}

function closePopup() {
    document.getElementById('solutionPopup').classList.add('hidden');
}

function filterSolutions() {
    const term = document.getElementById('searchBox').value.toLowerCase();
    const filtered = data.filter(sol => 
        sol.name.toLowerCase().includes(term) || 
        sol.manager.toLowerCase().includes(term) ||
        sol.level.toLowerCase().includes(term));
    renderSolutions(filtered);
}

function formatFullDetails(sol) {
    return `
        <strong>רכז פדגוגי:</strong> ${sol.manager}<br>
        <strong>מנחה:</strong> ${sol.mentor}<br>
        <strong>שלב חינוך:</strong> ${sol.level}<br>
        <strong>תאריך התחלה:</strong> ${sol.date}<br>
        <strong>שעת התחלה:</strong> ${sol.startTime}<br>
        <strong>שעת סיום:</strong> ${sol.endTime}<br>
        <strong>אופן למידה:</strong> ${sol.method}<br>
        <strong>מטרות:</strong> ${sol.goals}<br>
        <strong>תקציר:</strong> ${sol.summary}<br>
        <strong>תחום:</strong> ${sol.topic}<br>
        <strong>שעות:</strong> ${sol.hours}
    `;
}
