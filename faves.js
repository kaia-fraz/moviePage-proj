document.addEventListener("DOMContentLoaded", () => {
  const favoritesList = document.getElementById("favorites-list");
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    favoritesList.innerHTML = `<p class="text-gray-400 text-lg">You have no favorite movies yet 😢</p>`;
    return;
  }

  favorites.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.className = "bg-stone-900 p-3 rounded-lg shadow hover:scale-105 transition";

    movieCard.innerHTML = `
      <img class="w-32 sm:w-36 md:w-40 lg:w-48 h-auto object-cover rounded-lg flex-shrink-0 cursor-pointer transition-transform hover:scale-105" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h2 class="w-32 sm:w-36 md:w-40 lg:w-48 text-lg text-white font-semibold">${movie.title}</h2>
      <p class="w-32 sm:w-36 md:w-40 lg:w-48 text-sm text-gray-400 mb-2">Release Date: ${movie.release_date}</p>
      <button class="remove w-32 sm:w-36 md:w-40 lg:w-48 bg-red-600 text-white py-1 px-2 rounded mt-2 hover:bg-red-700 w-full">Remove</button>
    `;

    movieCard.querySelector(".remove").addEventListener("click", () => {
      removeFromFavorites(movie.id);
    });

    favoritesList.appendChild(movieCard);
  });
});

function removeFromFavorites(movieId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(movie => movie.id !== movieId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  location.reload(); // reload page to update list
}
