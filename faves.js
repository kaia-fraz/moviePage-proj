document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("favorites-list");
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const SEARCH_URL = "https://api.themoviedb.org/3/search/movie";

  function renderFavorites() {
    container.innerHTML = "";
    if (favorites.length === 0) {
      container.innerHTML = '<p class="text-gray-300">No favorites yet.</p>';
      return;
    }

    favorites.forEach(movie => {
      const card = document.createElement("div");
      card.className = "bg-stone-900 p-4 rounded-lg flex flex-col items-center text-center";

      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="w-32 sm:w-36 md:w-40 lg:w-48 w-48 rounded-lg mb-2 cursor-pointer">
        <h3 class="w-32 sm:w-36 md:w-40 lg:w-48 text-white font-semibold text-lg">${movie.title}</h3>
        <p class="w-32 sm:w-36 md:w-40 lg:w-48 text-gray-300 text-sm mb-2">Release: ${movie.release_date}</p>
        <button class="w-32 sm:w-36 md:w-40 lg:w-48 remove-btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" data-id="${movie.id}">Remove</button>
      `;

      container.appendChild(card);

      card.querySelector("img").addEventListener("click", () => openMovieModal(movie));

      card.querySelector(".remove-btn").addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const updated = favorites.filter(f => f.id != id);
        localStorage.setItem("favorites", JSON.stringify(updated));
        location.reload();
      });
    });
  }

  renderFavorites();

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
      poster: selectedMovie.poster_path,
      rating: selectedRating
    };
    localStorage.setItem("movieRatings", JSON.stringify(ratings));
    modal.classList.add("hidden");
  });

  closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
  window.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });
});
menuButton?.addEventListener("click", () => sidebar?.classList.toggle("-translate-x-full"));
  closeSidebar?.addEventListener("click", () => sidebar?.classList.add("-translate-x-full"));
  window.addEventListener("click", (e) => {
    if (sidebar && menuButton && !sidebar.contains(e.target) && !menuButton.contains(e.target)) {
      sidebar.classList.add("-translate-x-full");
    }
  });
