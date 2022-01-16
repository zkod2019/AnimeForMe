let forumsList = null;
let myForumsList = null;
let sortSelect = null;
let pageList = null;

let forumTitle = null;
let forumPostsList = null;
let newPostForm = null;
let newPostContent = null;

let nextPageBtn = null;
let prevPageBtn = null;

let currentPage = 1;
let myForumsCurrentPage = 1;

let currentlySelectedForumTargetId = null;
let currentlySelectedForumOption = null;

window.onload = function () {
    if (!sessionStorage.getItem("userName")) {
        window.location = "./";
    }
  
  
    forumTitle = document.getElementById("title");
    forumPostsList = document.getElementById("posts-list");
    newPostForm = document.getElementById("new-post-form");
        newPostForm.style.display = "none";
        forumPostsList.style.display = "none";

    newPostContent = document.getElementById("post-content");
  
  forumsList = document.getElementById("all-forums-list");
  myForumsList = document.getElementById("my-forums-list");
  
  pageList = document.getElementById("page-list");
  sortSelect = document.getElementById("sort-by");

  nextPageBtn = document.getElementById("next-page");
  prevPageBtn = document.getElementById("prev-page");

  myfNextPageBtn = document.getElementById("my-next-page");
  myfPrevPageBtn = document.getElementById("my-prev-page");

  updateAnimeList();

  nextPageBtn.onclick = function () {
    currentPage++;
    updateAnimeList();
  };

  prevPageBtn.onclick = function () {
    currentPage--;
    updateAnimeList();
  };
  
  myfNextPageBtn.onclick = function () {
    myForumsCurrentPage++;
    updateAnimeList();
  };

  myfPrevPageBtn.onclick = function () {
    myForumsCurrentPage--;
    updateAnimeList();
  };

  sortSelect.onchange = function () {
    currentPage = 1;
    updateAnimeList();
  };
  
  newPostForm.onsubmit = async function(e) {
      e.preventDefault();
      fetch(
              `./Posts?authorName=${sessionStorage.getItem("userName")}&targetId=${currentlySelectedForumTargetId}&option=${currentlySelectedForumOption}&content=${encodeURIComponent(newPostContent.value)}`,
      {method: 'POST'}
      ).then(res => res.text()).then(() => {
          updateCurrentForumPosts(currentlySelectedForumTargetId, currentlySelectedForumOption == 0);
      });
  };
};

function statusChangeListener() {
    // add user to forum
    fetch(
            `./Forums?username=${sessionStorage.getItem("userName")}&targetId=${this.event.target.getAttribute("data-id")}&option=${this.event.target.getAttribute("data-option")}`,
    {method: 'POST'}
    ).then(res => res.text()).then(() => {
            updateAnimeList();
    });
   }

function leaveForumHandler() {
    fetch(
            `./Forums?username=${sessionStorage.getItem("userName")}&targetId=${this.event.target.getAttribute("data-id")}&option=${this.event.target.getAttribute("data-option")}`,
    {method: 'DELETE'}
    ).then(res => res.text()).then(() => {
            updateAnimeList();
    });
    
}

const LIMIT = 3;

function cutPages(arr, chunkSize) {
    const res = [];
    while (arr.length > 0) {
        const chunk = arr.splice(0, chunkSize);
        res.push(chunk);
    }
    return res;
}

function myForumClickHandler() {
    console.log('my forum was clicked!');
    updateCurrentForumPosts(this.event.target.getAttribute("data-id"), this.event.target.getAttribute("data-option") === "0");
}

async function updateCurrentForumPosts(targetId, isAnime) {
    console.log('updating posts', targetId, isAnime);
    
    console.log(forumTitle);

    forumPostsList.innerHTML = "";
    
    currentlySelectedForumTargetId  = targetId;
    currentlySelectedForumOption = isAnime ? 0 : 1;
    
    if (targetId === null || isAnime === null) {
        forumTitle.innerHTML = "Forum";
        newPostForm.style.display = "none";
        forumPostsList.style.display = "none";
    } else {
        newPostForm.style.display = "block";
        forumPostsList.style.display = "block";

      let json = null;
      if (isAnime) {
          const animeRes = await fetch(`https://api.jikan.moe/v4/anime/${targetId}`);
          json = await animeRes.json();
      } else {
          const mangaRes = await fetch(`https://api.jikan.moe/v4/manga/${targetId}`);
          json = await mangaRes.json();
      }
        
        forumTitle.innerHTML = `Forum: ${json.data.title}`;
        const postsRes = await fetch(`./Posts?targetId=${targetId}&option=${isAnime ? 0 : 1}`);
        const postsJson = await postsRes.json();
        
        postsJson.forEach(post => {
            forumPostsList.innerHTML += `<li>
                <p>${post.content}</p>
            <small>${post.authorName}</small>
            </li>` 
        });
    }
    
}

async function updateAnimeList() {
  const animeReq = new XMLHttpRequest();
  const mangaReq = new XMLHttpRequest();
  
    myForumsList.innerHTML = "";

  const myForumsRes = await fetch(`./Forums?username=${sessionStorage.getItem("userName")}`);
  const myForums = await myForumsRes.json();
  
  const myForumListElementsAsArray = [];
  const myForumPromises = myForums.map(async forum => {
      let json = null;
      if (forum.animeId !== null) {
          const animeRes = await fetch(`https://api.jikan.moe/v4/anime/${forum.animeId}`);
          json = await animeRes.json();
      } else {
          const mangaRes = await fetch(`https://api.jikan.moe/v4/manga/${forum.mangaId}`);
          json = await mangaRes.json();
      }
      
      console.log(json);
      json = json.data;
      let option = forum.animeId === null ? 1 : 0;
      myForumListElementsAsArray.push(`
          <li >
        <button data-id="${json.mal_id}" data-option="${option}" onclick="myForumClickHandler()">Open Forum</button>
           <img src="${json.images.jpg.image_url}" 
                        style="width: auto; height: 90px;" >
                    <h4>${json.title}</h4>
                    <button onclick="leaveForumHandler()" data-id="${json.mal_id}" data-option="${option}">Leave</button>
                   
                </li>`);
  });
  
  await Promise.all(myForumPromises);
  
  console.log('listelementsasarray', myForumListElementsAsArray);
  const listElementsByPages = cutPages(myForumListElementsAsArray, LIMIT);
    console.log(listElementsByPages);

  console.log(myForumsCurrentPage, listElementsByPages[myForumsCurrentPage-1] ? listElementsByPages[myForumsCurrentPage-1].join("\n") : '');
  myForumsList.innerHTML = listElementsByPages[myForumsCurrentPage-1] ? listElementsByPages[myForumsCurrentPage-1].join("\n") : '';
  
  
  
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
      topAnimeAsListElements += 
                `<li>
                    <img src="${anime.images.jpg.image_url}" 
                        style="width: auto; height: 90px;" >
                    <h4>${anime.title}</h4>
                    <button ${myForums.find(forum => forum.animeId !== null ? forum.animeId === anime.mal_id && option === 0 : forum.mangaId === anime.mal_id && option === 1 ) ? 'disabled' : ''} onclick="statusChangeListener()" style="float:right;" data-id="${anime.mal_id}" data-option="${option}">Join</button>
                   
                </li>`;
    });

    nextPageBtn.style.display = !json.pagination.has_next_page
      ? "none"
      : "block";
    prevPageBtn.style.display = currentPage === 1 ? "none" : "block";

    forumsList.innerHTML += topAnimeAsListElements;
  };
  
  forumsList.innerHTML = "";
  animeReq.onload = () => reqHandler(animeReq, true);
  mangaReq.onload = () => reqHandler(mangaReq, false);

  animeReq.send(null);
  mangaReq.send(null);
}
