// shared/basicModule.js

function createBasicTableModule(tableName, fields, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<h3>ניהול טבלה: ${tableName}</h3>`;

  const table = document.createElement("table");
  table.className = "data-table";
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  fields.forEach(field => {
    const th = document.createElement("th");
    th.textContent = field;
    headerRow.appendChild(th);
  });
  const thActions = document.createElement("th");
  thActions.textContent = "פעולות";
  headerRow.appendChild(thActions);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  table.appendChild(tbody);
  container.appendChild(table);

  loadTableData(tableName, fields, tbody);
}

function loadTableData(tableName, fields, tbody) {
  fetch(`https://educatalog-63603-default-rtdb.firebaseio.com/${tableName}.json`)
    .then(res => res.json())
    .then(data => {
      tbody.innerHTML = "";
      Object.entries(data || {}).forEach(([id, record]) => {
        const row = document.createElement("tr");

        fields.forEach(field => {
          const td = document.createElement("td");
          td.textContent = record[field] || "";
          row.appendChild(td);
        });

        const tdActions = document.createElement("td");
        tdActions.innerHTML = `
          <button onclick="alert('עריכה עדיין לא זמינה')">✏️</button>
          <button onclick="deleteRecord('${tableName}', '${id}', this)">🗑️</button>
        `;
        row.appendChild(tdActions);

        tbody.appendChild(row);
      });
    });
}

function deleteRecord(tableName, id, buttonElement) {
  fetch(`https://educatalog-63603-default-rtdb.firebaseio.com/${tableName}/${id}.json`, {
    method: "DELETE"
  }).then(() => {
    const row = buttonElement.closest("tr");
    row.remove();
  });
}

export { createBasicTableModule };
