const API_KEY = "2e9d62d4c3a0513907a14e37f720fc6a";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

let currentMovie = null;
let searchInput;
let currentList = [];

function selectMenu(el, type) {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  el.classList.add('active');

  if (type === 'watchlist') {
    showWatchlist();
  } else {
    getCategory(type);
  }
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

  searchInput = document.getElementById("search");

  document.getElementById("searchForm").addEventListener("submit", e => {
    e.preventDefault();
    searchMovies();
  });

  document.getElementById("searchIcon").addEventListener("click", searchMovies);
});

function toggleWatchlist(movie = currentMovie) {
  if (!movie) return;

  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  const exists = watchlist.some(m => m.id === movie.id);

  if (exists) {
    watchlist = watchlist.filter(m => m.id !== movie.id);
    showToast("Removed from watchlist");
  } else {
    watchlist.push(movie);
    showToast("Added to watchlist");
  }

  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  updateWatchlistButton();
  displayMovies(currentList);
}

function updateWatchlistButton() {
  const btn = document.getElementById("watchlistBtn");
  if (!btn || !currentMovie) return;

  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const exists = watchlist.some(m => m.id === currentMovie.id);

  btn.innerHTML = exists
    ? '<i class="fas fa-minus"></i>'
    : '<i class="fas fa-plus"></i>';
}

function showWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  currentList = watchlist;
  displayMovies(watchlist);
}

async function searchMovies() {
  const query = searchInput.value.trim();
  if (!query) return alert("Type something to search");

  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await res.json();

  currentList = data.results;
  displayMovies(data.results);
}

async function getCategory(type) {
  const res = await fetch(`${BASE_URL}/movie/${type}?api_key=${API_KEY}`);
  const data = await res.json();

  currentList = data.results;
  displayMovies(data.results);
}

function displayMovies(movies) {
  const container = document.getElementById("movies");
  container.innerHTML = "";

  if (!movies || movies.length === 0) {
    container.innerHTML = "<p>No movies found.</p>";
    return;
  }

  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  movies.forEach(movie => {
    const poster = movie.poster_path
      ? IMG_URL + movie.poster_path
      : "https://via.placeholder.com/300x450";

    const div = document.createElement("div");
    div.className = "movie";

    const isSaved = watchlist.some(m => m.id === movie.id);

    div.innerHTML = `
      <img src="${poster}">
      <div class="overlay">
        <h4>${movie.title}</h4>
        <button class="addBtn">${isSaved ? "− Watchlist" : "+ Watchlist"}</button>
      </div>
    `;

    div.querySelector(".addBtn").addEventListener("click", e => {
      e.stopPropagation();
      toggleWatchlist(movie);
    });

    div.addEventListener("click", () => showDetails(movie));

    container.appendChild(div);
  });
}

function showDetails(movie) {
  currentMovie = movie;

  const modal = document.getElementById("movieModal");
  modal.classList.remove("hidden");
  modal.style.display = "flex";

  document.getElementById("modalPoster").src =
    movie.poster_path ? IMG_URL + movie.poster_path : "https://via.placeholder.com/300x450";

  document.getElementById("modalTitle").textContent = movie.title;
  document.getElementById("modalRating").textContent = "⭐ Rating: " + movie.vote_average;
  document.getElementById("modalDate").textContent = "📅 Release: " + (movie.release_date || "N/A");
  document.getElementById("modalOverview").textContent = movie.overview || "No description available.";

  updateWatchlistButton();

  document.getElementById("modalPlayBtn").onclick = () => {
    window.location.href = `trailer.html?id=${movie.id}`;
  };
}

function closeModal() {
  const modal = document.getElementById("movieModal");
  modal.classList.add("hidden");
  modal.style.display = "none";
}

document.addEventListener("click", (e) => {
  const modal = document.getElementById("movieModal");
  if (e.target === modal) {
    closeModal();
  }
});

function showToast(msg) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#6c63ff";
    toast.style.color = "white";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "8px";
    toast.style.zIndex = "9999";
    toast.style.opacity = "0";
    toast.style.transition = "0.3s";
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 1200);
}

window.onload = () => {
  getCategory("popular");
};
