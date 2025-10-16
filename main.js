document.addEventListener('DOMContentLoaded', () => {
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
});

