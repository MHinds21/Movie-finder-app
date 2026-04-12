const apiKey = "2e9d62d4c3a0513907a14e37f720fc6a";

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

const iframe = document.getElementById("trailerFrame");

const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const soundBtn = document.getElementById("soundBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const backBtn = document.getElementById("backBtn");

let trailerKey = "";
let isMuted = true;

function buildUrl() {
  return `https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&mute=${isMuted ? 1 : 0}`;
}

async function loadTrailer() {
  if (!movieId) return;

  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`);
    const data = await res.json();

    const trailer = data.results.find(v => v.type === "Trailer" && v.site === "YouTube");

    if (!trailer) return;

    trailerKey = trailer.key;
    iframe.src = buildUrl();

  } catch (e) {
    console.log("Failed to load trailer");
  }
}

loadTrailer();

playBtn.addEventListener("click", () => {
  if (!trailerKey) return;
  iframe.src = buildUrl();
});

stopBtn.addEventListener("click", () => {
  iframe.src = "";
});

soundBtn.addEventListener("click", () => {
  isMuted = !isMuted;

  soundBtn.innerHTML = isMuted
    ? `<i class="fas fa-volume-mute"></i>`
    : `<i class="fas fa-volume-up"></i>`;

  if (trailerKey) {
    iframe.src = buildUrl();
  }
});

fullscreenBtn.addEventListener("click", () => {
  const container = document.getElementById("videoContainer");
  if (container.requestFullscreen) container.requestFullscreen();
});

backBtn.addEventListener("click", () => {
  window.history.back();
});
