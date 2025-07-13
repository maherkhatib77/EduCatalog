
function renderTable(data, title) {
  const container = document.getElementById("table-container");
  if (!data) {
    container.innerHTML = `<h3>${title}</h3><p>אין נתונים להצגה.</p>`;
    return;
  }

  let html = `<h3>${title}</h3><table border="1" cellpadding="5" cellspacing="0"><thead><tr>`;
  const first = Object.values(data)[0];
  for (let key in first) {
    html += `<th>${key}</th>`;
  }
  html += "</tr></thead><tbody>";

  for (let id in data) {
    html += "<tr>";
    for (let key in data[id]) {
      html += `<td>${data[id][key]}</td>`;
    }
    html += "</tr>";
  }

  html += "</tbody></table>";
  container.innerHTML = html;
}

function loadInstructors() {
  const ref = firebase.database().ref("instructors");
  ref.once("value", (snapshot) => {
    const data = snapshot.val();
    renderTable(data, "מדריכים");
  });
}
