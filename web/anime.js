let animeList = null;
let sortSelect = null;
let pageList = null;

let nextPageBtn = null;
let prevPageBtn = null;

let currentPage = 1;

window.onload = function () {
  animeList = document.getElementById("anime-list");
  pageList = document.getElementById("page-list");
  sortSelect = document.getElementById("sort-by");

  nextPageBtn = document.getElementById("next-page");
  prevPageBtn = document.getElementById("prev-page");

  updateAnimeList();

  nextPageBtn.onclick = function () {
    currentPage++;
    updateAnimeList();
  };

  prevPageBtn.onclick = function () {
    currentPage--;
    updateAnimeList();
  };

  sortSelect.onchange = function () {
    currentPage = 1;
    updateAnimeList();
  };
};

function updateAnimeList() {
  const req = new XMLHttpRequest();
  req.responseType = "json";

  if (sortSelect.value === "alphabetically") {
    req.open(
      "GET",
      `https://api.jikan.moe/v4/anime?order_by=title&page=${currentPage}`,
      true
    );
  } else if (sortSelect.value === "popularity") {
    req.open(
      "GET",
      `https://api.jikan.moe/v4/top/anime?page=${currentPage}`,
      true
    );
  }

  req.onload = function () {
    const json = req.response;
    let topAnimeAsListElements = "";

    console.log(json.data);
    console.log(json.pagination);

    json.data.forEach((anime) => {
      topAnimeAsListElements += `<li>${anime.title}</li>`;
    });

    nextPageBtn.style.display = !json.pagination.has_next_page
      ? "none"
      : "block";
    prevPageBtn.style.display = currentPage === 1 ? "none" : "block";

    animeList.innerHTML = topAnimeAsListElements;
  };

  req.send(null);
}
