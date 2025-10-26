
const favoritesList = document.getElementById("favorites-list");
let favorites = [];
let selectedMovie = null;
let selectedRating = 0;
const API_KEY = "YOUR_TMDB_API_KEY_HERE"; // Make sure to replace

const modal = document.getElementById("movie-modal");
const modalPoster = document.getElementById("modal-poster");
const modalOverview = document.getElementById("modal-overview");
const modalRelease = document.getElementById("modal-release");
const modalStars = document.querySelectorAll(".modal-star");
const modalRatingValue = document.getElementById("modal-rating-value");
const saveRatingBtn = document.getElementById("save-rating");
const closeModalBtn = document.getElementById("close-modal");

document.addEventListener("DOMContentLoaded", () => {
  favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    favoritesList.innerHTML = `<p class="text-gray-400 text-lg">You have no favorite movies yet 😢</p>`;
    return;
  }

  favorites.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.className = "bg-stone-900 p-3 rounded-lg shadow hover:scale-105 transition";

    movieCard.innerHTML = `
      <img data-id="${movie.id}" class="w-32 sm:w-36 md:w-40 lg:w-48 h-auto object-cover rounded-lg flex-shrink-0 cursor-pointer transition-transform hover:scale-105" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h2 class="w-32 sm:w-36 md:w-40 lg:w-48 text-lg text-white font-semibold">${movie.title}</h2>
      <p class="w-32 sm:w-36 md:w-40 lg:w-48 text-sm text-gray-400 mb-2">Release Date: ${movie.release_date}</p>
      <button class="w-32 sm:w-36 md:w-40 lg:w-48 remove bg-red-600 text-white py-1 px-2 rounded mt-2 hover:bg-red-700 w-full">Remove</button>
    `;

    movieCard.querySelector(".remove").addEventListener("click", () => {
      removeFromFavorites(movie.id);
    });

    favoritesList.appendChild(movieCard);
  });
});

favoritesList.addEventListener("click", async (e) => {
  const img = e.target.closest("img");
  if (!img) return;

  const movieId = parseInt(img.dataset.id);
  const movie = favorites.find(m => m.id === movieId);

  selectedMovie = movie;
  openMovieModal(movie);
});

function openMovieModal(movie) {
  modalPoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  modalOverview.textContent = movie.overview || "No overview available.";
  modalRelease.textContent = `Release Date: ${movie.release_date || "Unknown"}`;

  const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
  const movieRating = savedRatings[movie.id] || 0;
  selectedRating = movieRating;

  updateModalStars(movieRating);
  modalRatingValue.textContent = `Your Rating: ${movieRating}/5`;

  modal.classList.remove("hidden");
}

function updateModalStars(rating) {
  modalStars.forEach(star => {
    star.classList.toggle("text-yellow-400", star.dataset.value <= rating);
    star.classList.toggle("text-gray-500", star.dataset.value > rating);
  });
}

modalStars.forEach(star => {
  star.addEventListener("click", e => {
    selectedRating = parseInt(e.target.dataset.value);
    updateModalStars(selectedRating);
    modalRatingValue.textContent = `Your Rating: ${selectedRating}/5`;
  });
});

saveRatingBtn.addEventListener("click", () => {
  if (!selectedMovie) return;

  const ratings = JSON.parse(localStorage.getItem("ratings")) || {};
  ratings[selectedMovie.id] = selectedRating;
  localStorage.setItem("ratings", JSON.stringify(ratings));

  alert(`You rated "${selectedMovie.title}" ${selectedRating}/5 ⭐`);
  modal.classList.add("hidden");
});

closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});

function removeFromFavorites(movieId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(movie => movie.id !== movieId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  location.reload();
}
