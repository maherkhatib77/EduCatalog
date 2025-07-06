
function openLogin() {
  const u = prompt("שם משתמש:");
  const p = prompt("סיסמה:");
  if (u === "Pisga" && p === "Sara@2203") {
    window.location.href = "dashboard.html";
  } else {
    alert("פרטי התחברות שגויים");
  }
}
