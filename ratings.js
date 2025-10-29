document.addEventListener('DOMContentLoaded', () => {
  const ratedMoviesContainer = document.getElementById('rated-movies');
  const ratings = JSON.parse(localStorage.getItem('movieRatings')) || {};
  const SEARCH_URL = "https://api.themoviedb.org/3/search/movie";

  function renderRatedMovies() {
    ratedMoviesContainer.innerHTML = '';

    if (Object.keys(ratings).length === 0) {
      ratedMoviesContainer.innerHTML = '<p class="text-gray-300">No movies rated yet.</p>';
      return;
    }

    Object.values(ratings).forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.className = 'bg-stone-900 p-4 rounded-lg flex flex-col items-center text-center';

      movieCard.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster}" alt="${movie.title}" class="w-32 sm:w-36 md:w-40 lg:w-48 rounded-lg mb-2 w-48 cursor-pointer">
        <h3 class="w-32 sm:w-36 md:w-40 lg:w-48 text-white text-lg font-semibold">${movie.title}</h3>
        <p class="w-32 sm:w-36 md:w-40 lg:w-48 text-yellow-400 mb-3">⭐ ${movie.rating}/5</p>
        <button class="w-32 sm:w-36 md:w-40 lg:w-48 remove-rating bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition" data-id="${movie.id}">
          Remove Rating
        </button>
      `;

      ratedMoviesContainer.appendChild(movieCard);

      // Open modal when clicking poster
      movieCard.querySelector("img").addEventListener("click", () => openMovieModal(movie));
    });

    // Remove rating
    document.querySelectorAll('.remove-rating').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        delete ratings[id];
        localStorage.setItem('movieRatings', JSON.stringify(ratings));
        renderRatedMovies();
      });
    });
  }

  renderRatedMovies();

  // Modal setup
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

  function openMovieModal(movie) {
    selectedMovie = movie;
    modalTitle.textContent = movie.title;
    modalPoster.src = `https://image.tmdb.org/t/p/w500${movie.poster}`;
    modalOverview.textContent = movie.overview || "No overview available.";
    modalRelease.textContent = `Release Date: ${movie.release_date || "Unknown"}`;

    selectedRating = movie.rating || 0;
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
    star.addEventListener("click", (e) => {
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
      poster: selectedMovie.poster,
      rating: selectedRating
    };
    localStorage.setItem("movieRatings", JSON.stringify(ratings));
    renderRatedMovies();
    modal.classList.add("hidden");
  });

  closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
  window.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });
});
