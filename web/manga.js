let mangaList = null;
let sortSelect = null;
let pageList = null;

let nextPageBtn = null;
let prevPageBtn = null;

let currentPage = 1;

window.onload = function () {
  mangaList = document.getElementById("manga-list");
  pageList = document.getElementById("page-list");
  sortSelect = document.getElementById("sort-by");

  nextPageBtn = document.getElementById("next-page");
  prevPageBtn = document.getElementById("prev-page");

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

function updateMangaList() {
  const req = new XMLHttpRequest();
  req.responseType = "json";

  if (sortSelect.value === "alphabetically") {
    req.open(
      "GET",
      `https://api.jikan.moe/v4/manga?order_by=title&page=${currentPage}`,
      true
    );
  } else if (sortSelect.value === "popularity") {
    req.open(
      "GET",
      `https://api.jikan.moe/v4/top/manga?page=${currentPage}`,
      true
    );
  }

  req.onload = function () {
    const json = req.response;
    let topMangaAsListElements = "";

    console.log(json.data);
    console.log(json.pagination);

    json.data.forEach((manga) => {
      topMangaAsListElements += 
                `<li>
                    <img src="${manga.images.jpg.image_url}" />
                    <h3>${manga.title}</h3>
                    ${manga.chapters?
                    `<details>
                        <summary>Manga Info:</summary>
                        Rank: ${manga.rank} <br>
                        Score: ${manga.scored} <br>
                        Volumes: ${manga.volumes} <br>
                        Chapters: ${manga.chapters} <br>
                        Synopsis: ${manga.synopsis} <br>
                        Background: ${manga.background} <br>
                        Genre: ${manga.genres.name} <br>
                    </details>` : ''
                    }
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
