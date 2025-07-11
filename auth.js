
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username === "Pisga" && password === "Sara@2203") {
    localStorage.setItem("userType", "admin");
    window.location.href = "dashboard.html";
  } else {
    alert("פרטי התחברות שגויים");
  }
}
function logout() {
  localStorage.removeItem("userType");
  window.location.href = "index.html";
}
function openLoginModal() {
  document.getElementById("loginModal").style.display = "block";
}
function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none";
}
