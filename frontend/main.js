const API_KEY = "2e9d62d4c3a0513907a14e37f720fc6a";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

let currentMovie = null;
let searchInput = null;
let currentList = [];

function selectMenu(el, type) {
  document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
  el.classList.add("active");

  if (type === "watchlist") showWatchlist();
  else getCategory(type);
}

function login() {
  const u = username.value.trim();
  const p = password.value.trim();

  errorMsg.textContent = "";

  if (!u || !p) {
    errorMsg.textContent = "Enter all fields";
    return;
  }

  if ((u === "test" || u === "test@example.com") && p === "1234") {
    localStorage.setItem("user", u);
    updateAuthUI();
  } else {
    errorMsg.textContent = "Invalid username or password";
  }
}

function logout() {
  localStorage.removeItem("user");
  updateAuthUI();
}

function updateAuthUI() {
  const user = localStorage.getItem("user");

  loginBox.style.display = user ? "none" : "block";
  logoutBox.style.display = user ? "block" : "none";
  userStatus.textContent = user ? "Logged in as " + user : "Not logged in";
}

function toggleDropdown() {
  dropdown.classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();

  searchInput = document.getElementById("search");

  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    searchMovies();
  });

  searchIcon.addEventListener("click", searchMovies);

  getCategory("popular");
});

async function getCategory(type) {
  const res = await fetch(`${BASE_URL}/movie/${type}?api_key=${API_KEY}`);
  const data = await res.json();

  currentList = data.results;
  displayMovies(data.results);
}

async function searchMovies() {
  const q = searchInput.value.trim();
  if (!q) return;

  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${q}`);
  const data = await res.json();

  currentList = data.results;
  displayMovies(data.results);
}

function displayMovies(movies) {
  const box = document.getElementById("movies");
  box.innerHTML = "";

  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  movies.forEach(movie => {
    const img = movie.poster_path ? IMG_URL + movie.poster_path : "";

    const div = document.createElement("div");
    div.className = "movie";

    div.innerHTML = `
      <img src="${img}">
      <div class="overlay">
        <h4>${movie.title}</h4>
      </div>
    `;

    div.onclick = () => showDetails(movie);

    box.appendChild(div);
  });
}

function showDetails(movie) {
  currentMovie = movie;

  movieModal.classList.remove("hidden");

  modalPoster.src = movie.poster_path ? IMG_URL + movie.poster_path : "";
  modalTitle.textContent = movie.title;
  modalRating.textContent = "⭐ " + movie.vote_average;
  modalDate.textContent = movie.release_date;
  modalOverview.textContent = movie.overview;

  updateWatchlistBtn();
}

function closeModal() {
  movieModal.classList.add("hidden");
}

function toggleWatchlist() {
  if (!currentMovie) return;

  let list = JSON.parse(localStorage.getItem("watchlist")) || [];

  const exists = list.some(m => m.id === currentMovie.id);

  if (exists) {
    list = list.filter(m => m.id !== currentMovie.id);
    toast("Removed from watchlist");
  } else {
    list.push(currentMovie);
    toast("Added to watchlist");
  }

  localStorage.setItem("watchlist", JSON.stringify(list));

  updateWatchlistBtn();
}

function updateWatchlistBtn() {
  const list = JSON.parse(localStorage.getItem("watchlist")) || [];
  const exists = list.some(m => m.id === currentMovie.id);

  watchlistBtn.innerHTML = exists
    ? '<i class="fas fa-minus"></i>'
    : '<i class="fas fa-plus"></i>';
}

function showWatchlist() {
  const list = JSON.parse(localStorage.getItem("watchlist")) || [];
  currentList = list;
  displayMovies(list);
}

function toast(msg) {
  let t = document.getElementById("toast");

  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    document.body.appendChild(t);
  }

  t.textContent = msg;

  t.style.position = "fixed";
  t.style.bottom = "20px";
  t.style.left = "50%";
  t.style.transform = "translateX(-50%)";
  t.style.background = "#6c63ff";
  t.style.color = "white";
  t.style.padding = "10px 20px";
  t.style.borderRadius = "8px";
  t.style.zIndex = "9999";
  t.style.opacity = "1";

  setTimeout(() => {
    t.style.opacity = "0";
  }, 1200);
}
