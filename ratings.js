document.addEventListener('DOMContentLoaded', () => {
  const ratedMoviesContainer = document.getElementById('rated-movies');
  const ratings = JSON.parse(localStorage.getItem('movieRatings')) || {};

  function renderRatedMovies() {
    ratedMoviesContainer.innerHTML = '';

    if (Object.keys(ratings).length === 0) {
      ratedMoviesContainer.innerHTML = '<p class="text-gray-300">No movies rated yet.</p>';
      return;
    }

    for (const id in ratings) {
      const movie = ratings[id];

      const movieCard = document.createElement('div');
      movieCard.className = 'bg-gray-800 p-4 rounded-xl flex flex-col items-center text-center';

      movieCard.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster}" alt="${movie.title}" class="rounded-lg mb-2 w-48">
        <h3 class="text-white text-lg font-semibold">${movie.title}</h3>
        <p class="text-yellow-400 mb-3">⭐ ${movie.rating}/5</p>
        <button 
          class="remove-rating bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          data-id="${id}">
          Remove Rating
        </button>
      `;

      ratedMoviesContainer.appendChild(movieCard);
    }

    const removeButtons = document.querySelectorAll('.remove-rating');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const movieId = e.target.dataset.id;

        delete ratings[movieId];
        localStorage.setItem('movieRatings', JSON.stringify(ratings));

        renderRatedMovies();
      });
    });
  }

  renderRatedMovies();
});
