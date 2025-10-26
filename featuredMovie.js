const API_KEY = "540f2653b5be14320728451e81fc703d"; 
const API_URL = `https://api.themoviedb.org/3/trending/movie/day?language=en-US&api_key=${API_KEY}`;

const movieList = document.getElementById("movie-list");
const scrollLeftBtn = document.getElementById("scroll-left");
const scrollRightBtn = document.getElementById("scroll-right");
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function getMovies() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!data.results) {
      throw new Error("No movie results found.");
    }

    movieList.innerHTML = "";

    data.results.forEach(movie => {
      const movieCard = document.createElement("div");
      movieCard.className = "flex-none bg-stone-900 p-3 rounded-lg shadow hover:scale-105 transition";
        movieCard.id = "movies"

      movieCard.innerHTML = `
        <img class=" w-32 sm:w-36 md:w-40 lg:w-48 h-auto object-cover rounded-lg flex-shrink-0 cursor-pointer transition-transform hover:scale-105" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h2 class="w-32 sm:w-36 md:w-40 lg:w-48 text-lg font-semibold text-white">${movie.title}</h2>
        <p class="w-32 sm:w-36 md:w-40 lg:w-48 text-sm text-gray-300 mb-2 mt-2">Release Date: ${movie.release_date}</p>
        <p class="text-gray-400 text-sm">Critics Score: ____</p>
        <div class="rating" id="rating">
            <button class="star text-gray-700" data-value="1">★</button>
            <button class="star text-gray-700" data-value="2">★</button>
            <button class="star text-gray-700" data-value="3">★</button>
            <button class="star text-gray-700" data-value="4">★</button>
            <button class="star text-gray-700" data-value="5">★</button>
        </div>
        <p id="rating-value" class="text-gray-400 text-sm">Your Rating: 0/5</p>
        <button class="favorites bg-green-600 text-white py-1 px-2 rounded ">Add to Favorites</button>
      `;
        
      movieList.appendChild(movieCard);
      
      const stars = movieCard.querySelectorAll(".star");
        const ratingValue = movieCard.querySelector("#rating-value");

        stars.forEach(star => {
          star.addEventListener("click", (e) => {
            const rating = e.target.dataset.value;
            ratingValue.innerText = `Your Rating: ${rating}/5`;

            stars.forEach(s => {
                s.classList.toggle("text-yellow-400", s.dataset.value <= rating);
                s.classList.toggle("text-gray-600", s.dataset.value === rating);
            });
          });
        });

        movieCard.querySelector(".favorites").addEventListener("click", () => {
            alert(`${movie.title} added to favorites!`);
            addToFavorites(movie);
            
        });
    });

  } catch (error) {
    console.error("Error fetching movies:", error);
    movieList.innerHTML = `<p class="text-red-500 text-center">Failed to load movies 😢</p>`;
  }
}
//scroll
scrollLeftBtn.addEventListener("click", ( ) => {
    movieList.scrollBy({ left: -300, behavior: 'smooth' });
});

scrollRightBtn.addEventListener("click", ( ) => {
    movieList.scrollBy({ left: 300, behavior: 'smooth' });
});
// Faves
function addToFavorites(movie) {
    const alreadyFavorited = favorites.some(fav => fav.id === movie.id);
    if (!alreadyFavorited) {
        favorites.push(movie);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    } else {
        alert(`${movie.title} is already in your favorites!`);
    }

    renderFavorites();
};

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
//remove button
        function removeFromFavorites(id) {
  favorites = favorites.filter(movie => movie.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}
getMovies();
 renderFavorites();

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
  const title = movieCard.querySelector("h2").textContent;
  const movie = [...favorites, ...JSON.parse(localStorage.getItem("movieCache") || "[]")]
    .find(m => m.title === title);

  const movieData = movie || await fetchMovieDetails(title);

  selectedMovie = movieData;
  openMovieModal(movieData);
});

async function fetchMovieDetails(title) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results[0];
}

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

  const ratings = JSON.parse(localStorage.getItem("ratings")) || {};
  ratings[selectedMovie.id] = selectedRating;
  localStorage.setItem("ratings", JSON.stringify(ratings));

  alert(`You rated "${selectedMovie.title}" ${selectedRating}/5 ⭐`);
  modal.classList.add("hidden");
});

// Close modal
closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});

