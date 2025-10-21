
const API_KEY = "540f2653b5be14320728451e81fc703d"; // from TMDB
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

const movieList = document.getElementById("movie-list");
const scrollLeftBtn = document.getElementById("scroll-left");
const scrollRightBtn = document.getElementById("scroll-right");

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

      movieCard.innerHTML = `
        <img class="rounded mb-3" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h2 class="text-lg font-semibold text-white">${movie.title}</h2>
        <p class="text-sm text-gray-300 mb-2 mt-2">Release Date: ${movie.release_date}</p>
        <p class="text-gray-400 text-sm">Critics Score: ____</p>
        <div class="rating" id="rating">
            <span class="star bg-yellow-500" data-value="1">★</span>
            <span class="star bg-yellow-500" data-value="2">★</span>
            <span class="star bg-yellow-500" data-value="3">★</span>
            <span class="star bg-yellow-500" data-value="4">★</span>
            <span class="star bg-yellow-500" data-value="5">★</span>
        </div>
        <p id="rating-value" class="text-gray-400 text-sm">Your Rating: 0/5</p>

      `;

      movieList.appendChild(movieCard);
    });

  } catch (error) {
    console.error("Error fetching movies:", error);
    movieList.innerHTML = `<p class="text-red-500 text-center">Failed to load movies 😢</p>`;
  }
}

scrollLeftBtn.addEventListener("click", ( ) => {
    movieList.scrollBy({ left: -300, behavior: 'smooth' });
});

scrollRightBtn.addEventListener("click", ( ) => {
    movieList.scrollBy({ left: 300, behavior: 'smooth' });
});

getMovies();


