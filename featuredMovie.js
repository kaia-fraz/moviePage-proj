document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "540f2653b5be14320728451e81fc703d";
  const BASE_URL = "https://api.themoviedb.org/3";

  // Lists
  const featuredList = document.getElementById("movie-list");
  const trendingList = document.getElementById("movie-list-2");
  const favoritesList = document.getElementById("favorites-list");

  // Scroll buttons
  const scroll = (leftBtn, rightBtn, list) => {
    if (!list) return;
    if (leftBtn) leftBtn.addEventListener("click", () => list.scrollBy({ left: -300, behavior: "smooth" }));
    if (rightBtn) rightBtn.addEventListener("click", () => list.scrollBy({ left: 300, behavior: "smooth" }));
  };

  scroll(document.getElementById("scroll-left"), document.getElementById("scroll-right"), featuredList);
  scroll(document.getElementById("scroll-left-2"), document.getElementById("scroll-right-2"), trendingList);
  scroll(document.getElementById("scroll-left-3"), document.getElementById("scroll-right-3"), favoritesList);

  // Utility for images
  const getImageUrl = (path) => path ? `https://image.tmdb.org/t/p/w500${path}` : "images/no-image.png";

  // Fetch movies and render
  async function fetchAndRender(url, targetList) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!data.results || !targetList) return;

      targetList.innerHTML = "";
      data.results.forEach(movie => {
        const card = document.createElement("div");
        card.className = "flex-none flex-shrink-0 bg-stone-900 p-3 rounded-lg shadow hover:scale-105 transition";
        card.innerHTML = `
          <img class="w-32 sm:w-36 md:w-40 lg:w-48 h-auto object-cover rounded-lg cursor-pointer mb-2" src="${getImageUrl(movie.poster_path)}" alt="${movie.title}">
          <h2 class="w-32 sm:w-36 md:w-40 lg:w-48 text-white font-semibold text-lg">${movie.title}</h2>
          <p class="w-32 sm:w-36 md:w-40 lg:w-48 text-gray-400 text-sm mb-2">Release: ${movie.release_date || "N/A"}</p>
          <button class="add-fave-btn bg-blue-600 text-white py-1 px-2 rounded ">Add to Favorites</button>
        `;

        // Add to favorites
        card.querySelector(".add-fave-btn").addEventListener("click", () => {
          let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
          if (favorites.some(fav => fav.id === movie.id)) {
            alert(`${movie.title} is already in favorites!`);
            return;
          }
          favorites.push(movie);
          localStorage.setItem("favorites", JSON.stringify(favorites));
          alert(`${movie.title} added to favorites!`);
        });

        // Open modal on click
        card.querySelector("img").addEventListener("click", () => openModal(movie));
        targetList.appendChild(card);
      });
    } catch (err) {
      console.error("Error loading movies:", err);
      if (targetList) targetList.innerHTML = "<p class='text-red-500'>Failed to load movies.</p>";
    }
  }

  // Modal
  const modal = document.getElementById("movie-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalPoster = document.getElementById("modal-poster");
  const modalOverview = document.getElementById("modal-overview");
  const modalRelease = document.getElementById("modal-release");
  const modalStars = document.querySelectorAll(".modal-star");
  const modalRatingValue = document.getElementById("modal-rating-value");
  const saveRatingBtn = document.getElementById("save-rating");

  let selectedRating = 0;

  function openModal(movie) {
    modal.classList.remove("hidden");
    modal.dataset.movieId = movie.id;
    modal.dataset.movieData = JSON.stringify(movie);

    modalTitle.textContent = movie.title;
    modalPoster.src = getImageUrl(movie.poster_path);
    modalOverview.textContent = movie.overview || "No description available.";
    modalRelease.textContent = `Release: ${movie.release_date || "N/A"}`;

    modalStars.forEach(s => s.classList.remove("text-yellow-400"));
  }

    modalStars.forEach((star) => {
      star.addEventListener("click", () => {
        const value = parseInt(star.dataset.value);
        modal.dataset.userRating = value;
      modalStars.forEach((s) =>
        s.classList.toggle("text-yellow-400", parseInt(s.dataset.value) <= value)
      );
      modalRatingValue.textContent = `Your Rating: ${value}/5`;
    });
  });

  closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
  window.addEventListener("click", e => { 
    if (e.target === modal) modal.classList.add("hidden"); 
  });

  saveRatingBtn.addEventListener("click", () => {
  const movieId = modal.dataset.movieId;
  const rating = modal.dataset.userRating;

  if (!rating) {
    alert("Please select a rating first!");
    return;
  }

  let ratings = JSON.parse(localStorage.getItem("ratings") || "[]");
  const existingIndex = ratings.findIndex((m) => m.id === movieId);

  if (existingIndex !== -1) {
    ratings[existingIndex].rating = rating; 
  } else {
    ratings.push({ id: movieId, rating }); 
  }

  localStorage.setItem("ratings", JSON.stringify(ratings));
  alert(`${movieId} rated ${rating} stars!`);
  modal.classList.add("hidden");
});

  fetchAndRender(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`, featuredList);
  fetchAndRender(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US`, trendingList);

  const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  savedFavorites.forEach(movie => {
    const div = document.createElement("div");
    div.className = "flex-none flex-shrink-0 bg-stone-900 p-3 rounded-lg shadow hover:scale-105 transition";
    div.innerHTML = `
      <img class="w-32 sm:w-36 md:w-40 lg:w-48 h-auto object-cover rounded-lg cursor-pointer mb-2" src="${getImageUrl(movie.poster_path)}" alt="${movie.title}">
      <h2 class="w-32 sm:w-36 md:w-40 lg:w-48 text-white font-semibold text-lg">${movie.title}</h2>
      <p class="w-32 sm:w-36 md:w-40 lg:w-48 text-gray-400 text-sm mb-2">Release: ${movie.release_date || "N/A"}</p>
    `;
    div.querySelector("img").addEventListener("click", () => openModal(movie));
    favoritesList.appendChild(div);
    });
});
