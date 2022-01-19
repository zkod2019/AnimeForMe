(() => {
let currentPage = 1;
const LIMIT = 3;

  console.log("all list thingy imported!");
  let forumsList = document.getElementById("all-forums-list");
  let sortSelect = document.getElementById("allf-sort-by");

  let nextPageBtn = document.getElementById("allf-next-page");
  let prevPageBtn = document.getElementById("allf-prev-page");

  nextPageBtn.onclick = function () {
    currentPage++;
    updateAllForumsList();
  };

  prevPageBtn.onclick = function () {
    currentPage--;
    updateAllForumsList();
  };
  
  sortSelect.onchange = function() {
      updateAllForumsList();
  };
  
  updateAllForumsList();

function joinForum() {
  // add user to forum
  fetch(
    `./Forums?username=${sessionStorage.getItem(
      "userName"
    )}&targetId=${this.event.target.getAttribute(
      "data-id"
    )}&option=${this.event.target.getAttribute("data-option")}`,
    { method: "POST" }
  )
    .then((res) => res.text())
    .then((msg) => {
        console.log(msg);
      updateAnimeList();
    });
}

async function updateAllForumsList() {
    console.log("im so sad");
  const animeReq = new XMLHttpRequest();
  const mangaReq = new XMLHttpRequest();
  
  
  const myForumsRes = await fetch(
    `./Forums?username=${sessionStorage.getItem("userName")}`
  );
  const myForums = await myForumsRes.json();

  animeReq.responseType = "json";
  mangaReq.responseType = "json";

  if (sortSelect.value === "alphabetically") {
    animeReq.open(
      "GET",
      `https://api.jikan.moe/v4/anime?limit=${LIMIT}&order_by=title&page=${currentPage}`,
      true
    );
    mangaReq.open(
      "GET",
      `https://api.jikan.moe/v4/manga?limit=${LIMIT}&order_by=title&page=${currentPage}`,
      true
    );
  } else if (sortSelect.value === "popularity") {
    animeReq.open(
      "GET",
      `https://api.jikan.moe/v4/top/anime?limit=${LIMIT}&page=${currentPage}`,
      true
    );
    mangaReq.open(
      "GET",
      `https://api.jikan.moe/v4/top/manga?limit=${LIMIT}&page=${currentPage}`,
      true
    );
  }

  function reqHandler(req, isAnime) {
    const json = req.response;
    let topAnimeAsListElements = "";

    console.log(json.data);
    console.log(json.pagination);

    json.data.forEach((anime) => {
      let option = isAnime ? 0 : 1;
      topAnimeAsListElements += `<li>
                      <img src="${anime.images.jpg.image_url}" 
                          style="width: auto; height: 90px;" >
                      <h4>${anime.title}</h4>
                      <button ${
                        myForums.find((forum) =>
                          forum.animeId !== null
                            ? forum.animeId === anime.mal_id && option === 0
                            : forum.mangaId === anime.mal_id && option === 1
                        )
                          ? "disabled"
                          : ""
                      } onclick="statusChangeListener()" style="float:right;" data-id="${
        anime.mal_id
      }" data-option="${option}">Join</button>
                     
                  </li>`;
    });

    nextPageBtn.style.display = !json.pagination.has_next_page
      ? "none"
      : "block";
    prevPageBtn.style.display = currentPage === 1 ? "none" : "block";

    forumsList.innerHTML += topAnimeAsListElements;
  }

  forumsList.innerHTML = "";
  animeReq.onload = () => reqHandler(animeReq, true);
  mangaReq.onload = () => reqHandler(mangaReq, false);

  animeReq.send(null);
  mangaReq.send(null);
}


})();
