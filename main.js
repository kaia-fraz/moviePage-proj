document.addEventListener("DOMContentLoaded", () => {
  // ------------------ ELEMENTS ------------------
  const API_KEY = "540f2653b5be14320728451e81fc703d";

  const popup = document.getElementById('popup');
  const closeBtn = document.getElementById('closePopup');

  const signupUsername = document.getElementById("signup-username");
  const signupPassword = document.getElementById("signup-password");
  const signupBtn = document.getElementById("signup-btn");

  const loginUsername = document.getElementById("login-username");
  const loginPassword = document.getElementById("login-password");
  const loginBtnPopup = document.getElementById("login-popup-btn");

  const loginBtn = document.getElementById("login-btn");
  const menuButton = document.getElementById("menuButton");
  const sidebar = document.getElementById("sidebar");
  const closeSidebar = document.getElementById("closeSidebar");
  const authMessage = document.getElementById("auth-message");

  const searchInput = document.getElementById("search-input");

  // ------------------ USER ------------------
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) renderUserProfile(currentUser);

  if (loginBtn && !currentUser) {
    loginBtn.addEventListener("click", () => popup?.classList.remove("hidden"));
  }
  closeBtn?.addEventListener("click", () => popup?.classList.add("hidden"));

  signupBtn?.addEventListener("click", () => {
    const username = signupUsername.value.trim();
    const password = signupPassword.value;

    if (!username || !password) {
      authMessage.textContent = "Please fill out both fields.";
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(u => u.username === username)) {
      authMessage.textContent = "Username already taken.";
      return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    authMessage.textContent = "✅ Account created! Please log in.";
  });

  loginBtnPopup?.addEventListener("click", () => {
    const username = loginUsername.value.trim();
    const password = loginPassword.value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      authMessage.textContent = "❌ Invalid username or password.";
      return;
    }

    localStorage.setItem("currentUser", username);
    popup?.classList.add("hidden");
    renderUserProfile(username);
  });

  // ------------------ HAMBURGER ------------------
  menuButton?.addEventListener("click", () => sidebar?.classList.toggle("-translate-x-full"));
  closeSidebar?.addEventListener("click", () => sidebar?.classList.add("-translate-x-full"));
  window.addEventListener("click", (e) => {
    if (sidebar && menuButton && !sidebar.contains(e.target) && !menuButton.contains(e.target)) {
      sidebar.classList.add("-translate-x-full");
    }
  });

  // ------------------ SEARCH ------------------
const SEARCH_URL = "https://api.themoviedb.org/3/search/movie";

  if (searchInput) {
    searchInput.addEventListener("input", async (e) => {
      const query = e.target.value.trim();
      const searchResults = document.getElementById("search-results");
      if (!searchResults) return;

      if (query.length < 2) {
        searchResults.innerHTML = "";
        return;
      }

      try {
        const res = await fetch(`${SEARCH_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.results) renderSearchResults(data.results);
      } catch (err) {
        console.error("Search failed:", err);
      }
    });
  }

  // ------------------ RATED MOVIES ------------------
  renderRatedMovies(); // render immediately if on ratings page
});

// ------------------ USER PROFILE ------------------
function renderUserProfile(username) {
  const loginBtn = document.getElementById("login-btn");
  if (!loginBtn) return;

  loginBtn.outerHTML = `
    <div id="user-profile" class="relative flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-800 rounded">
      <i class="fa-solid fa-user text-white"></i>
      <span class="text-white font-semibold">${username}</span>
      <div id="user-dropdown" class="hidden absolute top-12 right-0 bg-stone-900 border border-gray-700 rounded shadow-lg p-3 w-40">
        <p class="text-sm text-gray-300 mb-2">User: ${username}</p>
        <button id="logout-btn" class="text-red-500 hover:underline text-sm w-full text-left">Log Out</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const userProfile = document.getElementById("user-profile");
    const dropdown = document.getElementById("user-dropdown");
    userProfile?.addEventListener("click", () => dropdown?.classList.toggle("hidden"));

    document.getElementById("logout-btn")?.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      location.reload();
    });
  }, 50);
}

// search results
function getImageUrl(path) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : "images/no-image.png";
}

function renderSearchResults(movies) {
  const searchResults = document.getElementById("search-results");
  if (!searchResults) return;

  searchResults.innerHTML = "";
  movies.forEach(movie => {
    const poster = getImageUrl(movie.poster_path);

    const movieCard = document.createElement("div");
    movieCard.className = "bg-gray-800 p-4 rounded-xl w-48 text-center hover:scale-105 transition-transform cursor-pointer";
    movieCard.innerHTML = `
      <img src="${poster}" alt="${movie.title}" class="rounded-lg mb-2">
      <h3 class="text-white text-md font-semibold">${movie.title}</h3>
      <p class="text-gray-400 text-sm">${movie.release_date ? movie.release_date.split("-")[0] : ""}</p>
    `;
    movieCard.addEventListener("click", () => openModal(movie));
    searchResults.appendChild(movieCard);
  });

  searchResults.classList.remove("hidden");
}

// modal
function openModal(movie) {
  const modal = document.getElementById("movie-modal");
  if (!modal) return;

  const modalTitle = document.getElementById("modal-title");
  const modalPoster = document.getElementById("modal-poster");
  const modalOverview = document.getElementById("modal-overview");
  const modalRelease = document.getElementById("modal-release");
  const modalStars = document.querySelectorAll(".modal-star");
  const modalRatingValue = document.getElementById("modal-rating-value");
  const saveRatingBtn = document.getElementById("save-rating");

  modal.dataset.movieId = movie.id;
  modal.dataset.userRating = 0;
  modal.dataset.movieData = JSON.stringify(movie);

  modalTitle.textContent = movie.title;
  modalPoster.src = getImageUrl(movie.poster_path);
  modalOverview.textContent = movie.overview || "No description available.";
  modalRelease.textContent = `Release: ${movie.release_date || "N/A"}`;

  modalStars.forEach(s => s.classList.remove("text-yellow-400"));

  modalStars.forEach(star => {
    const newStar = star.cloneNode(true);
    star.parentNode.replaceChild(newStar, star);
  });

  const freshStars = document.querySelectorAll(".modal-star");
  freshStars.forEach(star => {
    star.addEventListener("click", () => {
      const value = parseInt(star.dataset.value);
      modal.dataset.userRating = value;
      freshStars.forEach(s => s.classList.toggle("text-yellow-400", parseInt(s.dataset.value) <= value));
      modalRatingValue.textContent = `Your Rating: ${value}/5`;
    });
  });

  saveRatingBtn.onclick = () => {
    const ratings = JSON.parse(localStorage.getItem("movieRatings")) || {};
    ratings[movie.id] = {
      rating: parseInt(modal.dataset.userRating),
      title: movie.title,
      poster: movie.poster_path
    };
    localStorage.setItem("movieRatings", JSON.stringify(ratings));
    renderRatedMovies();
    modal.classList.add("hidden");
  };

  modal.classList.remove("hidden");
}

// rated movies
function renderRatedMovies() {
  const ratedMoviesContainer = document.getElementById("rated-movies");
  if (!ratedMoviesContainer) return;

  const ratings = JSON.parse(localStorage.getItem('movieRatings')) || {};
  ratedMoviesContainer.innerHTML = "";

  if (Object.keys(ratings).length === 0) {
    ratedMoviesContainer.innerHTML = "<p>No movies rated yet.</p>";
    return;
  }

  for (const id in ratings) {
    const movie = ratings[id];
    const poster = getImageUrl(movie.poster);

    const card = document.createElement("div");
    card.className = "bg-gray-800 p-4 rounded-xl relative";
    card.innerHTML = `
      <img src="${poster}" alt="${movie.title}" class="rounded-lg mb-2">
      <h3 class="w-32 sm:w-36 md:w-40 lg:w-48 text-white text-lg font-semibold">${movie.title}</h3>
      <p class="w-32 sm:w-36 md:w-40 lg:w-48 text-yellow-400">⭐ ${movie.rating}/5</p>
      <button class="w-32 sm:w-36 md:w-40 lg:w-48 remove-rating absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">Remove</button>
    `;

    card.querySelector(".remove-rating").addEventListener("click", () => {
      delete ratings[id];
      localStorage.setItem('movieRatings', JSON.stringify(ratings));
      card.remove();
    });

    ratedMoviesContainer.appendChild(card);
  }
}
