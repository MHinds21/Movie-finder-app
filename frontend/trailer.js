const apiKey = "YOUR_TMDB_API_KEY";

const params = new URLSearchParams(window.location.search);
const movieId = params.get("movieId");

const iframe = document.getElementById("trailerFrame");
const loading = document.getElementById("loading");

async function loadTrailer() {
  if (!movieId) {
    loading.innerText = "No movie selected";
    return;
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`
    );

    const data = await res.json();

    const trailer = data.results.find(
      video => video.type === "Trailer" && video.site === "YouTube"
    );

    if (!trailer) {
      loading.innerText = "No trailer found";
      return;
    }

    loading.style.display = "none";

    iframe.src =
      `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=1`;

  } catch (error) {
    loading.innerText = "Failed to load trailer";
  }
}

loadTrailer();

function enableSound() {
  if (iframe.src) {
    iframe.src = iframe.src.replace("&mute=1", "&mute=0");
  }
}
