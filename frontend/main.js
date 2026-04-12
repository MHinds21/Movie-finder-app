const API_KEY = "2e9d62d4c3a0513907a14e37f720fc6a";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

function selectMenu(el, type) {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  el.classList.add('active');
  if (type === 'watchlist') showWatchlist();
  else getCategory(type);
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  errorMsg.textContent = "";

  if (!username || !password) {
    errorMsg.textContent = "Enter all fields";
    return;
  }

  if ((username === "test" || username === "test@example.com") && password === "1234") {
    localStorage.setItem("user", username);
    updateAuthUI();
    alert("Login successful");
  } else {
    errorMsg.textContent = "Invalid username or password";
  }
}

function logout() {
  localStorage.removeItem("user");
  updateAuthUI();
  alert("Logged out");
}

function updateAuthUI() {
  const user = localStorage.getItem("user");

  const loginBox = document.getElementById("loginBox");
  const logoutBox = document.getElementById("logoutBox");
  const userStatus = document.getElementById("userStatus");

  if (user) {
    loginBox.style.display = "none";
    logoutBox.style.display = "block";
    userStatus.textContent = "Logged in as " + user;
  } else {
    loginBox.style.display = "block";
    logoutBox.style.display = "none";
    userStatus.textContent = "Not logged in";
  }
}

function toggleDropdown() {
  document.getElementById("dropdown").classList.toggle("hidden");
  updateAuthUI();
}

document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();

  const form = document.getElementById("searchForm");
  searchInput = document.getElementById("search");
  const searchIcon = document.getElementById("searchIcon");

  form.addEventListener("submit", e => {
    e.preventDefault();
    searchMovies();
  });

  searchIcon.addEventListener("click", searchMovies);

  document.getElementById("modalPlayBtn").onclick = (e) => {
    const title = document.getElementById("modalTitle").textContent;
    window.location.href = `trailer.html?title=${encodeURIComponent(title)}`;
  };
});

function addToWatchlist(movie) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (!watchlist.some(m => m.id === movie.id)) {
    watchlist.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }
  alert("Added to watchlist!");
}

function showWatchlist() {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  displayMovies(watchlist);
}

async function searchMovies() {
  const query = searchInput.value.trim();
  if (!query) return alert("Type something to search");

  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await res.json();
  displayMovies(data.results);
}

async function getCategory(type) {
  const res = await fetch(`${BASE_URL}/movie/${type}?api_key=${API_KEY}`);
  const data = await res.json();
  displayMovies(data.results);
}

function displayMovies(movies) {
  const container = document.getElementById("movies");
  container.innerHTML = "";

  if (!movies || movies.length === 0) {
    container.innerHTML = "<p>No movies found.</p>";
    return;
  }

  movies.forEach(movie => {
    const poster = movie.poster_path
      ? IMG_URL + movie.poster_path
      : "https://via.placeholder.com/300x450";

    const div = document.createElement("div");
    div.className = "movie";

    div.innerHTML = `
      <img src="${poster}">
      <div class="overlay">
        <h4>${movie.title}</h4>
        <button class="addBtn">+ Watchlist</button>
      </div>
    `;

    div.querySelector(".addBtn").addEventListener("click", e => {
      e.stopPropagation();
      addToWatchlist(movie);
    });

    div.addEventListener("click", () => showDetails(movie));

    container.appendChild(div);
  });
}

function showDetails(movie) {
  document.getElementById("movieModal").classList.remove("hidden");

  document.getElementById("modalPoster").src =
    movie.poster_path ? IMG_URL + movie.poster_path : "https://via.placeholder.com/300x450";

  document.getElementById("modalTitle").textContent = movie.title;
  document.getElementById("modalRating").textContent = "⭐ Rating: " + movie.vote_average;
  document.getElementById("modalDate").textContent = "📅 Release: " + (movie.release_date || "N/A");
  document.getElementById("modalOverview").textContent = movie.overview || "No description available.";

  document.getElementById("modalPlayBtn").onclick = () => {
    window.location.href = `trailer.html?id=${movie.id}`;
  };
}

function closeModal() {
  document.getElementById("movieModal").classList.add("hidden");
}

window.onload = () => {
  getCategory("popular");
};
