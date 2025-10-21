const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NDBmMjY1M2I1YmUxNDMyMDcyODQ1MWU4MWZjNzAzZCIsIm5iZiI6MTc2MTAxMjY5OS4wMzQsInN1YiI6IjY4ZjZlYmRiMTRhNzhmOTVhZTk3ZmFjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vAM8Qmr89rcJ1Nu9p4EoJ6CyxQRag-xElrMHqbDFGco'
  }
};

fetch('https://api.themoviedb.org/3/account/22400301', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));



/*const API_URL = 'https://api.themoviedb.org/3/movie/{movie_id}';

const movieList = document.getElementById('movie-list');

fetch(API_URL) 
    .then(response => response.json())
    .then( data => {
        const movies = data.results;  
        
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            movieCard.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster" class="w-full h-auto rounded-lg mb-4">
                <h2 class="text-white text-lg font-semibold mb-2">${movie.title}</h2>
                <p class="text-gray-300 text-sm mb-4">${movie.release_date}</p>
                <p class="text-gray-400 text-sm">${movie.overview}</p>
                <p>Rating: ${movie.vote_average}</p>
            `;
            movieList.appendChild(movieCard);
        });
    })
    .catch(error => {
        console.error('Error fetching movie data:', error);
    });*/
