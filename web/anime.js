let animeList = null;
let sortSelect = null;
let pageList = null;

let nextPageBtn = null;
let prevPageBtn = null;

let animeSearchInput = null;

let currentPage = 1;

function searchAnime() {
  this.event.preventDefault();
  updateAnimeList();
}

window.onload = function () {
  animeList = document.getElementById("anime-list");
  pageList = document.getElementById("page-list");
  sortSelect = document.getElementById("sort-by");

  nextPageBtn = document.getElementById("next-page");
  prevPageBtn = document.getElementById("prev-page");

  animeSearchInput = document.getElementById("search");

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

function statusChangeListener() {
  var url = `./ACM?option=anime&animeId=${this.event.target.getAttribute(
    "data-id"
  )}&username=${sessionStorage.getItem("userName")}&status=0`;
  console.log(url);
  fetch(url, {
    method: "PUT",
  })
    .then((response) => response.text())
    .then((responseText) => {
      console.log(responseText);
      updateAnimeList();
    });
}

async function updateAnimeList() {
  const myAnimeRes = await fetch(
    `./ACM?username=${sessionStorage.getItem("userName")}&option=anime`
  );
  const myAnime = await myAnimeRes.json();

  console.log(myAnime);

  const req = new XMLHttpRequest();
  req.responseType = "json";

  if (sortSelect.value === "alphabetically") {
    req.open(
      "GET",
      `https://api.jikan.moe/v4/anime?sfw=true&order_by=title&page=${currentPage}${
        animeSearchInput.value
          ? `&q=${encodeURIComponent(animeSearchInput.value)}`
          : ""
      }`,
      true
    );
  } else if (sortSelect.value === "popularity") {
    req.open(
      "GET",
      `https://api.jikan.moe/v4/top/anime?page=${currentPage}${
        animeSearchInput.value
          ? `&q=${encodeURIComponent(animeSearchInput.value)}`
          : ""
      }`,
      true
    );
  }

  req.onload = function () {
    const json = req.response;
    let topAnimeAsListElements = "";

    console.log(json.data);
    console.log(json.pagination);

    //Existance of anime info is checked and displayed for every anime.
    

    json.data.forEach((anime) => {
      topAnimeAsListElements += `<li style="padding: 20px 20px 20px 20px;">
                    <img src="${anime.images.jpg.image_url}" 
                        style="width: auto; height: 160px;" >
                    <h4>${anime.title}</h4>
                    <button ${
                      myAnime.data.find((a) => a.animeId === anime.mal_id)
                        ? "disabled"
                        : ""
                    } onclick="statusChangeListener()" style="float:right;" class="addToMyList" data-id="${
        anime.mal_id
      }"> Add to My List
                    </button>
                    ${
                      anime.rank ||
                      anime.genres.length > 0 ||
                      anime.background ||
                      anime.synopsis ||
                      anime.status ||
                      anime.rating ||
                      anime.episodes ||
                      anime.score ||
                      anime.season
                        ? `<details>
                        <summary>Anime Info:</summary>
                        ${anime.rank ? `Rank: ${anime.rank} <br>` : ""}
                        ${anime.score ? `Score: ${anime.score} <br>` : ""}
                        ${anime.season ? `Seasons: ${anime.season} <br>` : ""}
                        ${
                          anime.episodes
                            ? `Episodes: ${anime.episodes} <br>`
                            : ""
                        }
                        ${anime.rating ? `Rating: ${anime.rating} <br>` : ""}
                        ${anime.status ? `Status: ${anime.status} <br>` : ""}
                        ${
                          anime.synopsis
                            ? `Synopsis: ${anime.synopsis} <br>`
                            : ""
                        }
                        ${
                          anime.background
                            ? `Background: ${anime.background} <br>`
                            : ""
                        }
                        ${
                          anime.genres.length > 0
                            ? `Genre: ${anime.genres[0].name} <br>`
                            : ""
                        }
                    </details>`
                        : ""
                    }
                </li>`;
    });

    nextPageBtn.style.display = !json.pagination.has_next_page
      ? "none"
      : "block";
    prevPageBtn.style.display = currentPage === 1 ? "none" : "block";

    animeList.innerHTML = topAnimeAsListElements;
  };

  req.send(null);
}
