// פתיחת וסגירת חלונית התחברות
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('adminLoginBtn');
const closeModal = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

loginBtn.onclick = () => loginModal.style.display = 'block';
closeModal.onclick = () => loginModal.style.display = 'none';
window.onclick = (e) => { if (e.target === loginModal) loginModal.style.display = 'none'; }

// אימות מקומי
loginForm.onsubmit = (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === 'Pisga' && password === 'Sara@2203') {
    localStorage.setItem('userType', 'admin');
    window.location.href = 'dashboard.html';
  } else {
    errorMsg.textContent = 'שם משתמש או סיסמה שגויים';
  }
};
