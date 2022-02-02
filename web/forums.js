let myForumsList = null;
let myfNextPageBtn = null;
let myfPrevPageBtn = null;

let forumTitle = null;
let forumPostsList = null;
let newPostForm = null;
let newPostContent = null;

let myForumsCurrentPage = 1;

let currentlySelectedForumTargetId = null;
let currentlySelectedForumOption = null;

window.onload = function () {
  if (!sessionStorage.getItem("userName")) {
    window.location = "./";
  }

  if (window.location.pathname.includes("forums")) {
    forumTitle = document.getElementById("title");
    forumPostsList = document.getElementById("posts-list");
    newPostForm = document.getElementById("new-post-form");
    newPostForm.style.display = "none";
    forumPostsList.style.display = "none";
    newPostContent = document.getElementById("post-content");
  }

  myForumsList = document.getElementById("my-forums-list");
  myfNextPageBtn = document.getElementById("my-next-page");
  myfPrevPageBtn = document.getElementById("my-prev-page");

  updateMyForums();

  myfNextPageBtn.onclick = function () {
    myForumsCurrentPage++;
    updateMyForums();
  };

  myfPrevPageBtn.onclick = function () {
    myForumsCurrentPage--;
    updateMyForums();
  };

  newPostForm.onsubmit = async function (e) {
    e.preventDefault();
    fetch(
      `./Posts?authorName=${sessionStorage.getItem(
        "userName"
      )}&targetId=${currentlySelectedForumTargetId}&option=${currentlySelectedForumOption}&content=${encodeURIComponent(
        newPostContent.value
      )}`,
      { method: "POST" }
    )
      .then((res) => res.text())
      .then(() => {
        updateCurrentForumPosts(
          currentlySelectedForumTargetId,
          currentlySelectedForumOption === 0
        );
      });
  };
};

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
      if (window.updateAllForumsList) {
        updateAllForumsList();
      }
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
  console.log("my forum was clicked!");
  updateCurrentForumPosts(
    this.event.target.getAttribute("data-id"),
    this.event.target.getAttribute("data-option") === "0"
  );
}

async function updateCurrentForumPosts(targetId, isAnime) {
  console.log("updating posts", targetId, isAnime);

  console.log(forumTitle);

  forumPostsList.innerHTML = "";

  currentlySelectedForumTargetId = targetId;
  // option is an enum(0, 1) where enum(anime, manga)
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
      const animeRes = await fetch(
        `https://api.jikan.moe/v4/anime/${targetId}`
      );
      json = await animeRes.json();
    } else {
      const mangaRes = await fetch(
        `https://api.jikan.moe/v4/manga/${targetId}`
      );
      json = await mangaRes.json();
    }

    forumTitle.innerHTML = `Forum: ${json.data.title}`;
    const postsRes = await fetch(
      `./Posts?targetId=${targetId}&option=${isAnime ? 0 : 1}`
    );
    const postsJson = await postsRes.json();

    postsJson.forEach((post) => {
      forumPostsList.innerHTML += `<li>
                <p>${post.content}</p>
            <small>${post.authorName}</small>
            ${
              sessionStorage.getItem("userName") === post.authorName
                ? `<button data-postId="${post.id}" onclick="deletePostHandler()" class="deletebtn">Delete Post</button>`
                : ""
            } 
            </li>`;
    });
  }
}

async function deletePostHandler() {
  let postId = this.event.target.getAttribute("data-postId");
  console.log(postId);
  await fetch(`./Posts?postId=${postId}`, { method: "DELETE" });
  updateCurrentForumPosts(
    currentlySelectedForumTargetId,
    currentlySelectedForumOption === 0
  );
}

async function updateMyForums() {
  myForumsList.innerHTML = "";

  const myForumsRes = await fetch(
    `./Forums?username=${sessionStorage.getItem("userName")}`
  );
  const myForums = await myForumsRes.json();

  const myForumListElementsAsArray = [];
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
    myForumListElementsAsArray.push(`
      <li>
        <img src="${
          json.images.jpg.image_url
        }" style="width: auto; height: 90px;">
        <h4>${json.title}</h4>
        <button class="openForumBtn" data-id="${
          json.mal_id
        }" data-option="${option}" ${
      window.location.pathname.includes("forums")
        ? `onclick="myForumClickHandler()"`
        : ""
    }>Open Forum</button>
        <button class="leaveButton" onclick="leaveForumHandler()" data-id="${
          json.mal_id
        }" data-option="${option}">Leave</button>
      </li>
    `);
  }

  console.log("listelementsasarray", myForumListElementsAsArray);
  const listElementsByPages = cutPages(
    myForumListElementsAsArray,
    allfPageLimit
  );
  console.log(listElementsByPages);

  console.log(
    myForumsCurrentPage,
    listElementsByPages[myForumsCurrentPage - 1]
      ? listElementsByPages[myForumsCurrentPage - 1].join("\n")
      : ""
  );
  myForumsList.innerHTML = listElementsByPages[myForumsCurrentPage - 1]
    ? listElementsByPages[myForumsCurrentPage - 1].join("\n")
    : "";
}
