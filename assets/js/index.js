document.getElementById("loginButton").addEventListener("click", () => {
  document.getElementById("loginModal").style.display = "block";
});

document.getElementById("loginSubmit").addEventListener("click", () => {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "Pisga" && pass === "Sara@2203") {
    window.location.href = "/dashboard/dashboard.html";
  } else {
    alert("שם משתמש או סיסמה שגויים.");
  }
});
