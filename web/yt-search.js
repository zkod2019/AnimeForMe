const YOUTUBE_API_KEY = "AIzaSyDkQoDHb0Qd4vjwZcUpLFjEnfSeh1wGB-o";

const searchInput = document.getElementById("yt-search-input");
const searchForm = document.getElementById("yt-search-form");
const resultsList = document.getElementById("yt-search-results");

updateYtSearchResults("anime");

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  updateYtSearchResults(searchInput.value);
});

async function updateYtSearchResults(searchString) {
  const ytRes = await fetch(
    `https://youtube.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=snippet&q=${encodeURIComponent(
      searchString
    )}`
  );
  const ytJson = await ytRes.json();

  resultsList.innerHTML = "";
  ytJson.items.forEach((video) => {
    resultsList.innerHTML += `<li><iframe id="ytplayer" type="text/html" width="640" height="360"
  src="https://www.youtube.com/embed/${video.id.videoId}"
  frameborder="0"></iframe><h4>${
      video.snippet.title
    }</h4><p>${video.snippet.description}</p></li>`;
  });
}
