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

function statusChangeListener() {
    var url = `./ACM?option=manga&mangaId=${this.event.target.getAttribute("data-id")}&username=${sessionStorage.getItem("userName")}&status=${this.event.target.value.toLowerCase() === "reading" ? "active" :this.event.target.value.toLowerCase() }`;
    console.log(url);
    fetch(url, {
        method: 'PUT',
    }).then(response => response.text()).then(console.log)

}
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
                    <img src="${manga.images.jpg.image_url}" 
                        style="width: auto; height: 90px;"/>
                    <h4>${manga.title}</h4>
                    <select onchange="statusChangeListener()" style="float:right;" data-id="${manga.mal_id}">
                        <option value="" disabled selected>Add to list</option>
                        <option>Completed</option>
                        <option>Reading</option>
                        <option>Paused</option>
                    </select>
                    ${manga.volumes || manga.rank || manga.genres.length>0 || manga.score || manga.background || manga.synopsis || manga.chapters?
                    `<details>
                        <summary>Manga Info:</summary>
                        ${manga.rank? `Rank: ${manga.rank} <br> ` : ''}
                        ${manga.score? `Score: ${manga.scored} <br>` : ''}
                        ${manga.volumes? `Volumes: ${manga.volumes} <br>` : ''}
                        ${manga.chapters? `Chapters: ${manga.chapters} <br>` : ''}
                        ${manga.synopsis? `Synopsis: ${manga.synopsis} <br>` : ''}
                        ${manga.background? `Background: ${manga.background} <br>` : ''}
                        ${manga.genres.length>0? `Genre: ${manga.genres[0].name} <br>` : ''}
                    </details>` : ''
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
