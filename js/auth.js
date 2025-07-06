document.getElementById("adminLoginBtn").onclick = function () {
  const user = prompt("שם משתמש:");
  const pass = prompt("סיסמה:");
  if (user === "Pisga" && pass === "Sara@2203") {
    window.location.href = "dashboard.html";
  } else {
    alert("פרטי התחברות שגויים.");
  }
};
