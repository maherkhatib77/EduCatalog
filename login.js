document.getElementById("loginBtn").onclick = function () {
  document.getElementById("loginModal").style.display = "block";
};
document.querySelector(".close").onclick = function () {
  document.getElementById("loginModal").style.display = "none";
};
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "Pisga" && pass === "Sara@2203") {
    window.location.href = "dashboard.html";
  } else {
    alert("שם משתמש או סיסמה שגויים");
  }
}
