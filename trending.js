const API_KEY = "540f2653b5be14320728451e81fc703d"; 
const API_URL = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&api_key=${API_KEY}`;
const SEARCH_URL = "https://api.themoviedb.org/3/search/movie";

let currentPage = 1;
let totalPages = 3;
let loading = false;

const movieList = document.getElementById("movie-list");
const loadingIndicator = document.getElementById("loading");

async function getMovies(page = 1) {
  if (loading) return;
  loading = true;
  loadingIndicator.classList.remove("hidden");

  try {
    const res = await fetch(`${API_URL}&page=${page}`);
    const data = await res.json();
    totalPages = data.total_pages;

    if (!data.results) throw new Error("No results found");

    if (page === 1) movieList.innerHTML = "";

    data.results.forEach(movie => {
      const movieCard = document.createElement("div");
      movieCard.className = "flex-none bg-stone-900 p-3 rounded-lg shadow hover:scale-105 transition";
      movieCard.dataset.movie = JSON.stringify(movie);

      movieCard.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="w-32 sm:w-36 md:w-40 lg:w-48 h-auto rounded-lg cursor-pointer">
        <h2 class="w-32 sm:w-36 md:w-40 lg:w-48 text-white font-semibold text-lg mt-2">${movie.title}</h2>
        <p class="w-32 sm:w-36 md:w-40 lg:w-48 text-gray-300 text-sm mt-1">Release: ${movie.release_date}</p>
        <button class="w-32 sm:w-36 md:w-40 lg:w-48 favorites bg-green-600 text-white py-1 px-2 rounded mt-2">Add to Favorites</button>
      `;

      movieList.appendChild(movieCard);

      movieCard.querySelector(".favorites").addEventListener("click", () => addToFavorites(movie));
    });
  } catch (err) {
    console.error(err);
    movieList.innerHTML = `<p class="text-red-500 text-center">Failed to load trending movies 😢</p>`;
  } finally {
    loading = false;
    loadingIndicator.classList.add("hidden");
  }
}

window.addEventListener("scroll", () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (window.scrollY >= scrollableHeight - 100 && !loading && currentPage < totalPages) {
    currentPage++;
    getMovies(currentPage);
  }
});

getMovies();

// Favorites logic
function addToFavorites(movie) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.some(f => f.id === movie.id)) return alert("Already in favorites!");
  favorites.push(movie);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert(`${movie.title} added to favorites!`);
}

// Modal code (same as ratings.js)
const modal = document.getElementById("movie-modal");
const closeModalBtn = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalPoster = document.getElementById("modal-poster");
const modalOverview = document.getElementById("modal-overview");
const modalRelease = document.getElementById("modal-release");
const modalStars = document.querySelectorAll(".modal-star");
const modalRatingValue = document.getElementById("modal-rating-value");
const saveRatingBtn = document.getElementById("save-rating");

let selectedMovie = null;
let selectedRating = 0;

movieList.addEventListener("click", e => {
  const img = e.target.closest("img");
  if (!img) return;
  const movie = JSON.parse(img.closest("div").dataset.movie);
  openMovieModal(movie);
});

function openMovieModal(movie) {
  selectedMovie = movie;
  modalTitle.textContent = movie.title;
  modalPoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  modalOverview.textContent = movie.overview || "No overview available.";
  modalRelease.textContent = `Release Date: ${movie.release_date || "Unknown"}`;

  const ratings = JSON.parse(localStorage.getItem("movieRatings")) || {};
  selectedRating = ratings[movie.id]?.rating || 0;
  updateModalStars(selectedRating);
  modalRatingValue.textContent = `Your Rating: ${selectedRating}/5`;

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
  const ratings = JSON.parse(localStorage.getItem("movieRatings")) || {};
  ratings[selectedMovie.id] = {
    id: selectedMovie.id,
    title: selectedMovie.title,
    poster: selectedMovie.poster_path,
    rating: selectedRating
  };
  localStorage.setItem("movieRatings", JSON.stringify(ratings));
  modal.classList.add("hidden");
});

closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });
