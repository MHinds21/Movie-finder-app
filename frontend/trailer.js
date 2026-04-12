const apiKey = "2e9d62d4c3a0513907a14e37f720fc6a";

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

const iframe = document.getElementById("trailerFrame");
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

backBtn.addEventListener("click", () => {
  window.history.back();
});
