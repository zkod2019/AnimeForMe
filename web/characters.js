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
                    <h3>${characters.name}</h3>
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
