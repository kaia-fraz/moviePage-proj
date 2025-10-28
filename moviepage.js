
const API_KEY = "540f2653b5be14320728451e81fc703d"; 
const API_URL = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&api_key=${API_KEY}`;

let currentPage = 1;
let totalPages = 3;
let loading = false;

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    renderUserProfile(currentUser);
  }
});

const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    console.log("Button clicked!");
  });
}


const movieList = document.getElementById("movie-list");
const loadingIndicator = document.getElementById("loading");
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function getMovies(page = 1) {
    if (loading) return; 
  loading = true;
  loadingIndicator.classList.remove("hidden");

  try {
    const response = await fetch(`${API_URL}&page=${page}`);
    const data = await response.json();

        totalPages = data.total_pages;

    if (!data.results) {
      throw new Error("No movie results found.");
    }
//html insertion
    if (page === 1) {
        movieList.innerHTML = "";
    }

    data.results.forEach(movie => {
      const movieCard = document.createElement("div");
movieCard.className = "flex-none bg-stone-900 p-3 rounded-lg shadow hover:scale-105 transition";
movieCard.dataset.movie = JSON.stringify(movie); // <— store movie info directly

      movieCard.innerHTML = `
        <img loading="lazy" class=" w-32 sm:w-36 md:w-40 lg:w-48 h-auto object-cover rounded-lg flex-shrink-0 cursor-pointer transition-transform hover:scale-105" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h2 class="w-32 sm:w-36 md:w-40 lg:w-48 text-lg font-semibold text-white">${movie.title}</h2>
        <p class="w-32 sm:w-36 md:w-40 lg:w-48 text-sm text-gray-300 mb-2 mt-2">Release Date: ${movie.release_date}</p>
        <button class="favorites bg-green-600 text-white py-1 px-2 rounded ">Add to Favorites</button>
      `;
        
        movieList.appendChild(movieCard);

        movieCard.querySelector(".favorites").addEventListener("click", () => {
            addToFavorites(movie);
            
        });
    });

  } catch (error) {
    console.error("Error fetching movies:", error);
    movieList.innerHTML = `<p class="text-red-500 text-center">Failed to load movies 😢</p>`;
  } finally {
    loading = false;
    loadingIndicator.classList.add("hidden");
  }
};

window.addEventListener("scroll", () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;

    if (scrolled >= scrollableHeight - 100 && !loading && currentPage < totalPages) {
        currentPage++;
        getMovies(currentPage);
    }
});

getMovies();

//faves
function addToFavorites(movie) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const exists = favorites.some(fav => fav.id === movie.id);
  if (exists) {
    alert(`${movie.title} is already in your favorites!`);
    return;
  }

  favorites.push(movie);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert(`${movie.title} added to favorites!`);
}



function renderFavorites() {
    const favoritesList = document.getElementById("favorites-list");
    favoritesList.innerHTML = "";
    favorites.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.className = "flex-none bg-stone-900 p-3 rounded-lg shadow hover:scale-105 transition";

        movieCard.innerHTML = `
        <img class=" w-32 sm:w-36 md:w-40 lg:w-48 h-auto object-cover rounded-lg flex-shrink-0 cursor-pointer transition-transform hover:scale-105" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h2 class="w-32 sm:w-36 md:w-40 lg:w-48 text-lg font-semibold text-white">${movie.title}</h2>
        <p class="w-32 sm:w-36 md:w-40 lg:w-48 text-sm text-gray-300 mb-2 mt-2">Release Date: ${movie.release_date}</p>
        <button class="remove-btn bg-red-600 text-white py-1 px-2 rounded ">Remove from Favorites</button>
      `;

      movieCard.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromFavorites(movie.id);
    });

        favoritesList.appendChild(movieCard);
    });
};

// movie popup

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

// Open popup
movieList.addEventListener("click", async (e) => {
  const img = e.target.closest("img");
  if (!img) return;

  const movieCard = img.closest("div");
  const movie = JSON.parse(movieCard.dataset.movie);

  selectedMovie = movie;
  openMovieModal(movie);
});

async function fetchMovieDetails(title) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results[0];
}

function openMovieModal(movie) {
    modalTitle.textContent = movie.title;
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
//stars
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
  const existingIndex = ratings.findIndex((m) => m.id === selectedMovie.id);
  const ratings = JSON.parse(localStorage.getItem("ratings")) || {};
 
  if (existingIndex !== -1) {
    ratings[existingIndex].rating = selectedRating;
  } else {
     ratings.push({
      id: selectedMovie.id,
      title: selectedMovie.title,
      poster_path: selectedMovie.poster_path,
      rating: selectedRating
    });
  }
  localStorage.setItem("ratings", JSON.stringify(ratings));

  alert(`You rated "${selectedMovie.title}" ${selectedRating}/5 ⭐`);
  modal.classList.add("hidden");
});

// Close modal
closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});
