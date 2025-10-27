function renderRatings() {
  const ratingsList = document.getElementById("ratings-list");
  const ratings = JSON.parse(localStorage.getItem("ratings") || "[]");

  if (!ratingsList) return;
  ratingsList.innerHTML = "";

  if (ratings.length === 0) {
    ratingsList.innerHTML = "<p class='text-gray-400'>You haven't rated any movies yet.</p>";
    return;
  }

  ratings.forEach(movie => {
    const div = document.createElement("div");
    div.className = "flex-none bg-stone-900 p-3 rounded-lg shadow text-white";
    div.innerHTML = `
      <img class="w-40 h-auto object-cover rounded-lg mb-2" src="${getImageUrl(movie.poster_path)}" alt="${movie.title}">
      <h3 class="font-semibold">${movie.title}</h3>
      <p class="text-yellow-400">⭐ ${movie.rating}/5</p>
    `;
    ratingsList.appendChild(div);
  });
}

