function joinForum() {
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
      updateAllForumsList();
      if (window.updateMyForums) {
        updateMyForums();
      }
    });
}

let searchInputEl = document.getElementById("search-forums-input");
function searchForums() {
  this.event.preventDefault();
  searchInputEl = document.getElementById("search-forums-input");
  updateAllForumsList();
}

let allfCurrentPage = 1;
const allfPageLimit = 3;

let allForumsList = document.getElementById("all-forums-list");
let allfSortSelect = document.getElementById("allf-sort-by");

let allfNextPageBtn = document.getElementById("allf-next-page");
let allfPrevPageBtn = document.getElementById("allf-prev-page");

allfNextPageBtn.onclick = function () {
  allfCurrentPage++;
  updateAllForumsList();
};

allfPrevPageBtn.onclick = function () {
  allfCurrentPage--;
  updateAllForumsList();
};

allfSortSelect.onchange = function () {
  allfCurrentPage = 1;
  updateAllForumsList();
};

updateAllForumsList();

async function updateAllForumsList() {
  allForumsList.innerHTML = "";

  const myForumsRes = await fetch(
    `./Forums?username=${sessionStorage.getItem("userName")}`
  );
  const myForums = await myForumsRes.json();

  console.log(myForums);

  let animeRes = null;
  let mangaRes = null;

  if (allfSortSelect.value === "alphabetically") {
    animeRes = await fetch(
      `https://api.jikan.moe/v4/anime?limit=${allfPageLimit}&order_by=title&page=${allfCurrentPage}${
        searchInputEl.value ? `&q=${searchInputEl.value}` : ""
      }`
    );
    mangaRes = await fetch(
      `https://api.jikan.moe/v4/manga?limit=${allfPageLimit}&order_by=title&page=${allfCurrentPage}${
        searchInputEl.value ? `&q=${searchInputEl.value}` : ""
      }`
    );
  } else if (allfSortSelect.value === "popularity") {
    animeRes = await fetch(
      `https://api.jikan.moe/v4/top/anime?limit=${allfPageLimit}&page=${allfCurrentPage}${
        searchInputEl.value ? `&q=${searchInputEl.value}` : ""
      }`
    );
    mangaRes = await fetch(
      `https://api.jikan.moe/v4/top/manga?limit=${allfPageLimit}&page=${allfCurrentPage}${
        searchInputEl.value ? `&q=${searchInputEl.value}` : ""
      }`
    );
  }

  const animeJson = await animeRes.json();
  const mangaJson = await mangaRes.json();

  let topAnimeAsListElements = "";
  function loopHandler(json, isAnime) {
    let option = isAnime ? 0 : 1;
    topAnimeAsListElements += `
        <li style="padding: 20px 20px 20px 20px;">
          <img src="${
            json.images.jpg.image_url
          }" style="width: auto; height: 90px;">
          <h4>${json.title}</h4>
          <button ${
            myForums.find((forum) =>
              forum.animeId !== null
                ? forum.animeId === json.mal_id && option === 0
                : forum.mangaId === json.mal_id && option === 1
            )
              ? "disabled"
              : ""
          } onclick="joinForum()" class="addToMyList" style="float:right;" data-id="${
      json.mal_id
    }" data-option="${option}">Join</button>
        </li>
      `;
  }

  animeJson.data.forEach((el) => loopHandler(el, true));
  mangaJson.data.forEach((el) => loopHandler(el, false));

  allfNextPageBtn.style.display = !animeJson.pagination.has_next_page
    ? "none"
    : "block";
  allfPrevPageBtn.style.display = allfCurrentPage === 1 ? "none" : "block";
  allForumsList.innerHTML += topAnimeAsListElements;
}
