let myForumsCurrentPage = 1;
let myForumsList = null;

function leaveForumHandler() {
  fetch(
    `./Forums?username=${sessionStorage.getItem(
      "userName"
    )}&targetId=${this.event.target.getAttribute(
      "data-id"
    )}&option=${this.event.target.getAttribute("data-option")}`,
    { method: "DELETE" }
  )
    .then((res) => res.text())
    .then(() => {
      updateMyForums();
    });
}

async function updateMyForums() {
  myForumsList.innerHTML = "";

  const myForumsRes = await fetch(
    `./Forums?username=${sessionStorage.getItem("userName")}`
  );
  const myForums = await myForumsRes.json();
  console.log(myForums);

  for (let forum of myForums) {
    let json = null;
    if (forum.animeId !== null) {
      const animeRes = await fetch(
        `https://api.jikan.moe/v4/anime/${forum.animeId}`
      );
      json = await animeRes.json();
    } else {
      const mangaRes = await fetch(
        `https://api.jikan.moe/v4/manga/${forum.mangaId}`
      );
      json = await mangaRes.json();
    }

    console.log(json);
    json = json.data;

    let option = forum.animeId === null ? 1 : 0;
    myForumsList.innerHTML += `
        <li>
            <img src="${json.images.jpg.image_url}" style="width: auto; height: 90px;">
            <h4>${json.title}</h4>
            <button onclick="leaveForumHandler()" class="leaveButton" data-id="${json.mal_id}" data-option="${option}">Leave</button>
            </br></br>
        </li>
    `;
  }
}

window.onload  = updateHome;

function updateHome() {
  var hi = document.getElementById("hi");
  var userName = sessionStorage.getItem("userName"); //localStorage instead of session will keep it open across tabs
  if (userName) {
    hi.innerText = `Hi ${userName}!!!`;

    var myMangaList = document.getElementById("myMangaList");
    var myAnimeList = document.getElementById("myAnimeList");
    var myCharactersList = document.getElementById("myCharactersList");

    myMangaList.innerHTML = "";
    myAnimeList.innerHTML = "";
    myCharactersList.innerHTML = "";

    myForumsList = document.getElementById("my-forums-list");

    updateMyForums().then(() => {
      console.log("updated my forums");
    });

    fetch(`./ACM?username=${userName}&option=manga`)
      .then((response) => response.json())
      .then((json) => {
        json.data.forEach(async (pair) => {
          var mangaHeading = (
            await (
              await fetch(`https://api.jikan.moe/v4/manga/${pair.mangaId}`)
            ).json()
          ).data.title;
          var mangaPic = (
            await (
              await fetch(`https://api.jikan.moe/v4/manga/${pair.mangaId}`)
            ).json()
          ).data.images.jpg.image_url;
          myMangaList.innerHTML += `<li>
                    <img src="${mangaPic}" 
                        style="width: auto; height: 160px;" >
                    <h4>${mangaHeading}</h4>
                    <select onchange="mangaStatusChange()" style="float:right;" data-id="${
                      pair.mangaId
                    }">
                        <option value=0 ${
                          pair.status === 0 ? "selected" : ""
                        }>Empty</option>
                        <option value=1 ${
                          pair.status === 1 ? "selected" : ""
                        }>Completed</option>
                        <option value=2  ${
                          pair.status === 2 ? "selected" : ""
                        }>Reading</option>
                        <option value=3 ${
                          pair.status === 3 ? "selected" : ""
                        }>Paused</option>
                    </select>
                <button data-id="${pair.mangaId}" data-option="manga" class="leaveButton" onclick="removeACMHandler()">Remove from MyList</button>
                </li>`;
        });
      });
    fetch(`./ACM?username=${userName}&option=anime`)
      .then((response) => response.json())
      .then((json) => {
        json.data.forEach(async (pair) => {
          var animeHeading = (
            await (
              await fetch(`https://api.jikan.moe/v4/anime/${pair.animeId}`)
            ).json()
          ).data.title;
            var animePic = (
            await (
              await fetch(`https://api.jikan.moe/v4/anime/${pair.animeId}`)
            ).json()
          ).data.images.jpg.image_url;
          myAnimeList.innerHTML += `<li>
                    <img src="${animePic}" 
                        style="width: auto; height: 160px;" >
                    <h4>${animeHeading}</h4>
                    <select onchange="animeStatusChange()" style="float:right;" data-id="${
                      pair.animeId
                    }">
                        <option value=0 ${
                          pair.status === 0 ? "selected" : ""
                        }>Empty</option>
                        <option value=1 ${
                          pair.status === 1 ? "selected" : ""
                        }>Completed</option>
                        <option value=2 ${
                          pair.status === 2 ? "selected" : ""
                        }>Watching</option>
                        <option value=3 ${
                          pair.status === 3 ? "selected" : ""
                        }>Paused</option>
                    </select>
                    <button data-id="${pair.animeId}" data-option="anime" class="leaveButton" onclick="removeACMHandler()">Remove from MyList</button>
                </li>`;
        });
      });
    fetch(`./ACM?username=${userName}&option=characters`)
      .then((response) => response.json())
      .then((json) => {
        json.data.forEach(async (pair) => {
          var charactersHeading = (
            await (
              await fetch(
                `https://api.jikan.moe/v4/characters/${pair.characterId}`
              )
            ).json()
          ).data.name;
         var charactersPic = (
          await (
              await fetch(
                `https://api.jikan.moe/v4/characters/${pair.characterId}`
              )
            ).json()
          ).data.images.jpg.image_url;
          myCharactersList.innerHTML += `<li>
                    <img src="${charactersPic}" 
                        style="width: auto; height: 160px;" >
                    <h4>${charactersHeading}</h4>
                    <button data-id="${pair.characterId}" data-option="characters" class="leaveButton" onclick="removeACMHandler()">Remove from MyList</button>
                    </br></br>
                </li>`;
        });
      });
  }
};

async function removeACMHandler(){
    let id = this.event.target.getAttribute("data-id");
    let option = this.event.target.getAttribute("data-option");
    
    console.log(id);
    await fetch(`./ACM?${option==="characters"?"character":option}Id=${id}&option=${option}&username=${sessionStorage.getItem("userName")}`, {method : "DELETE"});
    updateHome();
    
}

function mangaStatusChange() {
  var url = `./ACM?option=manga&mangaId=${this.event.target.getAttribute(
    "data-id"
  )}&username=${sessionStorage.getItem("userName")}&status=${
    this.event.target.value
  }`;
  console.log(url);
  fetch(url, {
    method: "POST",
  })
    .then((response) => response.text())
    .then(console.log);
}

function animeStatusChange() {
  var url = `./ACM?option=anime&animeId=${this.event.target.getAttribute(
    "data-id"
  )}&username=${sessionStorage.getItem("userName")}&status=${
    this.event.target.value
  }`;
  console.log(url);
  fetch(url, {
    method: "POST",
  })
    .then((response) => response.text())
    .then(console.log);
}
