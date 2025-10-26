/*document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup');
  const closeBtn = document.getElementById('closePopup');

  // Show popup after short delay (or immediately)
  setTimeout(() => {
    popup.classList.remove('hidden');
  }, 500); // 0.5s delay for smoother effect

  // Hide popup when "X" is clicked
  closeBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
  });
});*/


const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");
const closeSidebar = document.getElementById("closeSidebar");

// Open sidebar
menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
});

// Close sidebar
closeSidebar.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");
});

// Optional: Close if you click outside sidebar
window.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !menuButton.contains(e.target)) {
    sidebar.classList.add("-translate-x-full");
  }
});


