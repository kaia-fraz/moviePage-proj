
const API_KEY = "540f2653b5be14320728451e81fc703d"; 
const API_URL = [`https://api.themoviedb.org/3/movie/now_playing?language=en-US&api_key=${API_KEY}`];

let currentPage = 1;
let totalPages = 3;
let loading = false;

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

      movieCard.innerHTML = `
        <img loading="lazy" class=" w-32 sm:w-36 md:w-40 lg:w-48 h-auto object-cover rounded-lg flex-shrink-0 cursor-pointer transition-transform hover:scale-105" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
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

      //stars
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


