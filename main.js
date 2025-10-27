document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const popup = document.getElementById('popup');
  const closeBtn = document.getElementById('closePopup');

  const signupUsername = document.getElementById("signup-username");
  const signupPassword = document.getElementById("signup-password");
  const signupBtn = document.getElementById("signup-btn");

  const loginUsername = document.getElementById("login-username");
  const loginPassword = document.getElementById("login-password");
  const loginBtnPopup = document.getElementById("login-popup-btn");

  const loginBtn = document.getElementById("login-btn");

  const menuButton = document.getElementById("menuButton");
  const sidebar = document.getElementById("sidebar");
  const closeSidebar = document.getElementById("closeSidebar");

  const authMessage = document.getElementById("auth-message");

  console.log({ popup, closeBtn, signupBtn, loginBtnPopup, loginBtn, menuButton, sidebar, closeSidebar });

  // --- Persistent login ---
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) renderUserProfile(currentUser);

  // --- Show login popup ---
  if (loginBtn && !currentUser) {
    loginBtn.addEventListener("click", () => {
      if (popup) popup.classList.remove("hidden");
    });
  }

  // --- Close popup ---
  if (closeBtn && popup) {
    closeBtn.addEventListener("click", () => popup.classList.add("hidden"));
  }

  // --- Sign Up ---
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      const username = signupUsername.value.trim();
      const password = signupPassword.value;

      if (!username || !password) {
        authMessage.textContent = "Please fill out both fields.";
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.some(u => u.username === username)) {
        authMessage.textContent = "Username already taken.";
        return;
      }

      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      authMessage.textContent = "✅ Account created! Please log in.";
    });
  }

  // --- Log In ---
  if (loginBtnPopup) {
    loginBtnPopup.addEventListener("click", () => {
      const username = loginUsername.value.trim();
      const password = loginPassword.value;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.username === username && u.password === password);

      if (!user) {
        authMessage.textContent = "❌ Invalid username or password.";
        return;
      }

      localStorage.setItem("currentUser", username);
      if (popup) popup.classList.add("hidden");
      renderUserProfile(username);
    });
  }

  // --- Hamburger Menu ---
  if (menuButton && sidebar) {
    menuButton.addEventListener("click", () => {
      sidebar.classList.toggle("-translate-x-full");
    });
  }

  if (closeSidebar && sidebar) {
    closeSidebar.addEventListener("click", () => {
      sidebar.classList.add("-translate-x-full");
    });
  }

  window.addEventListener("click", (e) => {
    if (sidebar && menuButton && !sidebar.contains(e.target) && !menuButton.contains(e.target)) {
      sidebar.classList.add("-translate-x-full");
    }
  });
});

// --- Render profile safely ---
function renderUserProfile(username) {
  const loginBtn = document.getElementById("login-btn");
  if (!loginBtn) return;

  loginBtn.outerHTML = `
    <div id="user-profile" class="relative flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-800 rounded">
      <i class="fa-solid fa-user text-white"></i>
      <span class="text-white font-semibold">${username}</span>
      <div id="user-dropdown" class="hidden absolute top-12 right-0 bg-stone-900 border border-gray-700 rounded shadow-lg p-3 w-40">
        <p class="text-sm text-gray-300 mb-2">User: ${username}</p>
        <button id="logout-btn" class="text-red-500 hover:underline text-sm w-full text-left">Log Out</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const userProfile = document.getElementById("user-profile");
    const dropdown = document.getElementById("user-dropdown");

    if (userProfile && dropdown) {
      userProfile.addEventListener("click", () => dropdown.classList.toggle("hidden"));
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        location.reload();
      });
    }
  }, 50);
}
