let charactersList = null;
let sortSelect = null;
let pageList = null;

let nextPageBtn = null;
let prevPageBtn = null;

let currentPage = 1;
let charactersSearchInput = null;

function searchCharacters() {
    this.event.preventDefault();
    updateCharactersList();
}

window.onload = function () {
  charactersList = document.getElementById("characters-list");
  pageList = document.getElementById("page-list");
  sortSelect = document.getElementById("sort-by");

  nextPageBtn = document.getElementById("next-page");
  prevPageBtn = document.getElementById("prev-page");
  
  charactersSearchInput = document.getElementById("search");

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
  var url = `./ACM?option=characters&characterId=${this.event.target.getAttribute(
    "data-id"
  )}&username=${sessionStorage.getItem("userName")}`;
  console.log(url);
  fetch(url, {
    method: "PUT",
  })
    .then((response) => response.text())
     .then(responseText => {
        console.log(responseText);
        updateCharactersList();
    });
}

async function updateCharactersList() {
    const myCharactersRes = await fetch(`./ACM?username=${sessionStorage.getItem("userName")}&option=characters`);
    const myCharacters = await myCharactersRes.json();
    
  const req = new XMLHttpRequest();
  req.responseType = "json";

  if (sortSelect.value === "alphabetically") {
    req.open(
      "GET",
      `https://api.jikan.moe/v4/characters?order_by=name&page=${currentPage}${charactersSearchInput.value ? `&q=${encodeURIComponent(charactersSearchInput.value)}` : ''}`,
      true
    );
  } else if (sortSelect.value === "popularity") {
    req.open(
      "GET",
      `https://api.jikan.moe/v4/top/characters?page=${currentPage}${charactersSearchInput.value ? `&q=${encodeURIComponent(charactersSearchInput.value)}` : ''}`,
      true
    );
  }

  req.onload = function () {
    const json = req.response;
    let topCharactersAsListElements = "";

    console.log(json.data);
    console.log(json.pagination);

    json.data.forEach((characters) => {
      topCharactersAsListElements += `<li style="padding: 20px 20px 20px 20px;">
                    <img src="${characters.images.jpg.image_url}" 
                        style="width: auto; height: 160px;"/>
                    <h4>${characters.name}</h4>
                    <button ${myCharacters.data.find(a => a.characterId === characters.mal_id) ? 'disabled' : ''} onclick="addCharacters()" style="float:right;" class="addToMyList" data-id="${
                      characters.mal_id
                    }"> Add to My List
                    </button>
                    ${
                      characters.about
                        ? `<details>
                        <summary>Character Info:</summary>
                        ${characters.about}
                    </details>`
                        : ""
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
