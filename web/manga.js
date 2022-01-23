let mangaList = null;
let sortSelect = null;
let pageList = null;

let nextPageBtn = null;
let prevPageBtn = null;

let currentPage = 1;

let mangaSearchInput = null;

function searchManga() {
    this.event.preventDefault();
    updateMangaList();
}

window.onload = function () {
  mangaList = document.getElementById("manga-list");
  pageList = document.getElementById("page-list");
  sortSelect = document.getElementById("sort-by");

  nextPageBtn = document.getElementById("next-page");
  prevPageBtn = document.getElementById("prev-page");
  mangaSearchInput = document.getElementById("search");
  updateMangaList();

  nextPageBtn.onclick = function () {
    currentPage++;
    updateMangaList();
  };

  prevPageBtn.onclick = function () {
    currentPage--;
    updateMangaList();
  };

  sortSelect.onchange = function () {
    currentPage = 1;
    updateMangaList();
  };
};

function statusChangeListener() {
  var url = `./ACM?option=manga&mangaId=${this.event.target.getAttribute(
    "data-id"
  )}&username=${sessionStorage.getItem("userName")}&status=0`;
  console.log(url);
  fetch(url, {
    method: "PUT",
  })
    .then((response) => response.text())
     .then(responseText => {
        console.log(responseText);
        updateMangaList();
    });
}

async function updateMangaList() {
   const myMangaRes = await fetch(`./ACM?username=${sessionStorage.getItem("userName")}&option=manga`);
   const myManga = await myMangaRes.json();
    
  const req = new XMLHttpRequest();
  req.responseType = "json";

  if (sortSelect.value === "alphabetically") {
    req.open(
      "GET",
      `https://api.jikan.moe/v4/manga?order_by=title&page=${currentPage}${mangaSearchInput.value ? `&q=${encodeURIComponent(mangaSearchInput.value)}` : ''}`,
      true
    );
  } else if (sortSelect.value === "popularity") {
    req.open(
      "GET",
      `https://api.jikan.moe/v4/top/manga?page=${currentPage}${mangaSearchInput.value ? `&q=${encodeURIComponent(mangaSearchInput.value)}` : ''}`,
      true
    );
  }

  req.onload = function () {
    const json = req.response;
    let topMangaAsListElements = "";

    console.log(json.data);
    console.log(json.pagination);

    json.data.forEach((manga) => {
      topMangaAsListElements += `<li>
                    <img src="${manga.images.jpg.image_url}" 
                        style="width: auto; height: 160px;"/>
                    <h4>${manga.title}</h4>
                    <button ${myManga.data.find(a => a.mangaId === manga.mal_id) ? 'disabled' : ''} onclick="statusChangeListener()" style="float:right;" class="addToMyList" data-id="${
                      manga.mal_id
                    }"> Add to My List
                    </button>
                    ${
                      manga.volumes ||
                      manga.rank ||
                      manga.genres.length > 0 ||
                      manga.score ||
                      manga.background ||
                      manga.synopsis ||
                      manga.chapters
                        ? `<details>
                        <summary>Manga Info:</summary>
                        ${manga.rank ? `Rank: ${manga.rank} <br> ` : ""}
                        ${manga.score ? `Score: ${manga.scored} <br>` : ""}
                        ${manga.volumes ? `Volumes: ${manga.volumes} <br>` : ""}
                        ${
                          manga.chapters
                            ? `Chapters: ${manga.chapters} <br>`
                            : ""
                        }
                        ${
                          manga.synopsis
                            ? `Synopsis: ${manga.synopsis} <br>`
                            : ""
                        }
                        ${
                          manga.background
                            ? `Background: ${manga.background} <br>`
                            : ""
                        }
                        ${
                          manga.genres.length > 0
                            ? `Genre: ${manga.genres[0].name} <br>`
                            : ""
                        }
                    </details>`
                        : ""
                    }
                    <br><br>
                </li>`;
    });

    nextPageBtn.style.display = !json.pagination.has_next_page
      ? "none"
      : "block";
    prevPageBtn.style.display = currentPage === 1 ? "none" : "block";

    mangaList.innerHTML = topMangaAsListElements;
  };

  req.send(null);
}
