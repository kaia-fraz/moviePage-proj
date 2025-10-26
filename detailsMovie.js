/* Create the movie modal dynamically
const modalHTML = `
  <div id="movie-modal" class="hidden fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
    <div class="bg-stone-900 text-white p-6 rounded-lg max-w-2xl w-full relative">
      <button id="close-modal" class="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl">&times;</button>
      <div id="movie-modal-content">
        <h2 id="modal-title" class="text-2xl font-bold mb-2"></h2>
        <p id="modal-overview" class="text-gray-300 mb-3"></p>
        <p id="modal-release" class="text-gray-400 mb-2"></p>
        <p id="modal-cast" class="text-gray-400 mb-4"></p>
        <div id="modal-trailer" class="aspect-video"></div>
      </div>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', modalHTML);


async function showMovieDetails(movieId) {
  const modal = document.getElementById("movie-modal");
  const modalTrailer = document.getElementById("modal-trailer");
  const modalCast = document.getElementById("modal-cast");


// Clear old content
  modalTrailer.innerHTML = "";
  modalCast.textContent = "Loading...";

  try {
    // Fetch movie details
    
      const [detailsRes, creditsRes, videosRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`),
      ]);
      console.log('movies fetched');
    

    const details = await detailsRes.json();
    const credits = await creditsRes.json();
    const videos = await videosRes.json();

    // Fill modal content
    document.getElementById("modal-title").textContent = details.title;
    document.getElementById("modal-overview").textContent = details.overview || "No overview available.";
    document.getElementById("modal-release").textContent = `Release Date: ${details.release_date}`;

    const castList = credits.cast.slice(0, 5).map(actor => actor.name).join(", ");
    document.getElementById("modal-cast").textContent = `Cast: ${castList}`;

    // Find trailer video
    const trailer = videos.results.find(v => v.type === "Trailer" && v.site === "YouTube");
    if (trailer) {
      document.getElementById("modal-trailer").innerHTML = `
        <iframe class="w-full h-64 rounded-lg" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
      `;
    } else {
      document.getElementById("modal-trailer").textContent = "No trailer available.";
    }

    // Show modal
    modal.classList.remove("hidden");

  } catch (error) {
    console.error("Error fetching movie details:", error);
    modalCast.textContent = "Failed to load details.";
  }
}

// Close modal when clicking X

document.addEventListener("click", (e) => {
  if (e.target.id === "close-modal" || e.target.id === "movie-modal") {
    document.getElementById("movie-modal").classList.add("hidden");
  }
});*/