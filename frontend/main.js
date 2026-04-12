const API_KEY = "2e9d62d4c3a0513907a14e37f720fc6a";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

let currentMovie = null;
let currentList = [];
let searchInput;

function selectMenu(el, type) {
  document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
  el.classList.add("active");

  if (type === "watchlist") showWatchlist();
  else getCategory(type);
}

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const err = document.getElementById("errorMsg");

  err.textContent = "";

  if (!u || !p) return err.textContent = "Enter all fields";

  if ((u === "test" || u === "test@example.com") && p === "1234") {
    localStorage.setItem("user", u);
    updateAuthUI();
  } else {
    err.textContent = "Invalid login";
  }
}

function logout() {
  localStorage.removeItem("user");
  updateAuthUI();
}

function updateAuthUI() {
  const user = localStorage.getItem("user");

  document.getElementById("loginBox").style.display = user ? "none" : "block";
  document.getElementById("logoutBox").style.display = user ? "block" : "none";
  document.getElementById("userStatus").textContent = user ? "Logged in as " + user : "Not logged in";
}

function toggleDropdown() {
  document.getElementById("dropdown").classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();

  searchInput = document.getElementById("search");

  document.getElementById("searchForm").addEventListener("submit", e => {
    e.preventDefault();
    searchMovies();
  });

  document.getElementById("searchIcon").onclick = searchMovies;

  document.getElementById("modalPlayBtn").onclick = () => {
    window.location.href = `trailer.html?id=${currentMovie.id}`;
  };

  getCategory("popular");
});

async function getCategory(type) {
  const res = await fetch(`${BASE_URL}/movie/${type}?api_key=${API_KEY}`);
  const data = await res.json();
  currentList = data.results;
  displayMovies(currentList);
}

async function searchMovies() {
  const q = searchInput.value.trim();
  if (!q) return;

  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${q}`);
  const data = await res.json();

  currentList = data.results;
  displayMovies(currentList);
}

function displayMovies(movies) {
  const container = document.getElementById("movies");
  container.innerHTML = "";

  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  movies.forEach(movie => {
    const img = movie.poster_path
      ? IMG_URL + movie.poster_path
      : "https://via.placeholder.com/300x450";

    const saved = watchlist.some(m => m.id === movie.id);

    const div = document.createElement("div");
    div.className = "movie";

    div.innerHTML = `
      <img src="${img}">
      <div class="overlay">
        <h4>${movie.title}</h4>
        <button class="toggleBtn">
          <i class="fas ${saved ? "fa-minus" : "fa-plus"}"></i>
        </button>
      </div>
    `;

    div.querySelector(".toggleBtn").onclick = e => {
      e.stopPropagation();
      toggleWatchlist(movie);
    };

    div.onclick = () => showDetails(movie);

    container.appendChild(div);
  });
}

function showDetails(movie) {
  currentMovie = movie;

  document.getElementById("movieModal").classList.remove("hidden");

  document.getElementById("modalPoster").src = movie.poster_path
    ? IMG_URL + movie.poster_path
    : "https://via.placeholder.com/300x450";

  document.getElementById("modalTitle").textContent = movie.title;
  document.getElementById("modalRating").textContent = "⭐ " + movie.vote_average;
  document.getElementById("modalDate").textContent = movie.release_date || "N/A";
  document.getElementById("modalOverview").textContent = movie.overview || "";

  updateWatchlistBtn();
}

function closeModal() {
  document.getElementById("movieModal").classList.add("hidden");
}

function toggleWatchlist(movie = currentMovie) {
  if (!movie) return;

  let list = JSON.parse(localStorage.getItem("watchlist")) || [];
  const exists = list.some(m => m.id === movie.id);

  if (exists) {
    list = list.filter(m => m.id !== movie.id);
  } else {
    list.push(movie);
  }

  localStorage.setItem("watchlist", JSON.stringify(list));
  updateWatchlistBtn();
  displayMovies(currentList);
}

function updateWatchlistBtn() {
  const btn = document.getElementById("watchlistBtn");
  if (!btn || !currentMovie) return;

  const list = JSON.parse(localStorage.getItem("watchlist")) || [];
  const exists = list.some(m => m.id === currentMovie.id);

  btn.innerHTML = `<i class="fas ${exists ? "fa-minus" : "fa-plus"}"></i>`;
}

function showWatchlist() {
  const list = JSON.parse(localStorage.getItem("watchlist")) || [];
  currentList = list;
  displayMovies(list);
}
