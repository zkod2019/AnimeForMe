let charactersList = null;
let sortSelect = null;
let pageList = null;

let nextPageBtn = null;
let prevPageBtn = null;

let currentPage = 1;

window.onload = function () {
  charactersList = document.getElementById("characters-list");
  pageList = document.getElementById("page-list");
  sortSelect = document.getElementById("sort-by");

  nextPageBtn = document.getElementById("next-page");
  prevPageBtn = document.getElementById("prev-page");

  updateCharactersList();

  nextPageBtn.onclick = function () {
    currentPage++;
    updateCharactersList();
  };

  prevPageBtn.onclick = function () {
    currentPage--;
    updateCharactersList();
  };

  sortSelect.onchange = function () {
    currentPage = 1;
    updateCharactersList();
  };
};

function addCharacters() {
    var url = `./ACM?option=characters&characterId=${this.event.target.getAttribute("data-id")}&username=${sessionStorage.getItem("userName")}`;
    console.log(url);
    fetch(url, {
        method: 'PUT'
    }).then(response => response.text()).then(console.log);
}

function updateCharactersList() {
  const req = new XMLHttpRequest();
  req.responseType = "json";

  if (sortSelect.value === "alphabetically") {
    req.open(
      "GET",
      `https://api.jikan.moe/v4/characters?order_by=name&page=${currentPage}`,
      true
    );
  } else if (sortSelect.value === "popularity") {
    req.open(
      "GET",
      `https://api.jikan.moe/v4/top/characters?page=${currentPage}`,
      true
    );
  }

  req.onload = function () {
    const json = req.response;
    let topCharactersAsListElements = "";

    console.log(json.data);
    console.log(json.pagination);

    json.data.forEach((characters) => {
      topCharactersAsListElements += 
                `<li>
                    <img src="${characters.images.jpg.image_url}" />
                    <h4>${characters.name}</h4>
                    <button onclick="addCharacters()" style="float:right;" data-id="${characters.mal_id}"> Add to My List
                    </button>
                    ${characters.about?
                    `<details>
                        <summary>Character Info:</summary>
                        ${characters.about}
                    </details>` : ''
                    }
                </li>`;
    });

    nextPageBtn.style.display = !json.pagination.has_next_page
      ? "none"
      : "block";
    prevPageBtn.style.display = currentPage === 1 ? "none" : "block";

    charactersList.innerHTML = topCharactersAsListElements;
  };

  req.send(null);
}
