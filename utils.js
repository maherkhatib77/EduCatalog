// utils.js – פונקציות עזר לטעינת נתונים ויצירת תפריטי drop-down

// טוען נתונים מטבלה ב-Firebase ומחזיר מערך של אובייקטים
export async function getData(table) {
  const snapshot = await firebase.database().ref(table).once('value');
  const data = snapshot.val();
  return data ? Object.entries(data).map(([id, item]) => ({ id, ...item })) : [];
}

// ממלא תפריט select עם options בהתבסס על הנתונים שהתקבלו
export function populateSelect(selectElement, data, labelFn) {
  selectElement.innerHTML = '<option value="">בחר</option>';
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = labelFn(item);
    selectElement.appendChild(option);
  });
}
