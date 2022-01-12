window.onload = function(){
    var hi = document.getElementById("hi");
    var userName = sessionStorage.getItem("userName"); //localStorage instead of session will keep it open across tabs
    if (userName){
        hi.innerText = `Hi ${userName}!!!`;
        
        var myMangaList = document.getElementById("myMangaList");
        var myAnimeList = document.getElementById("myAnimeList");
        var myCharactersList = document.getElementById("myCharactersList");
        
        

        fetch(`./ACM?username=${userName}&option=manga`).then(response => response.json()).then(json => {
            json.data.forEach(async pair => {
                var mangaHeading = (await (await fetch(`https://api.jikan.moe/v4/manga/${pair.mangaId}`)).json()).data.title;
                myMangaList.innerHTML += `<li>
                    <h4>${mangaHeading}</h4>
                    <select onchange="mangaStatusChange()" style="float:right;" data-id="${pair.mangaId}">
                        <option value=0 ${pair.status === 0 ? 'selected' : ''}>Empty</option>
                        <option value=1 ${pair.status === 1 ? 'selected' : ''}>Completed</option>
                        <option value=2  ${pair.status === 2 ? 'selected' : ''}>Reading</option>
                        <option value=3 ${pair.status === 3 ? 'selected' : ''}>Paused</option>
                    </select>
                </li>`;
            });
        });
        fetch(`./ACM?username=${userName}&option=anime`).then(response => response.json()).then(json => {
            json.data.forEach(async pair => {
                var animeHeading = (await (await fetch(`https://api.jikan.moe/v4/anime/${pair.animeId}`)).json()).data.title; 
                myAnimeList.innerHTML += `<li>
                    <h4>${animeHeading}</h4>
                    <select onchange="animeStatusChange()" style="float:right;" data-id="${pair.animeId}">
                        <option value=0 ${pair.status === 0 ? 'selected' : ''}>Empty</option>
                        <option value=1 ${pair.status === 1 ? 'selected' : ''}>Completed</option>
                        <option value=2 ${pair.status === 2 ? 'selected' : ''}>Watching</option>
                        <option value=3 ${pair.status === 3 ? 'selected' : ''}>Paused</option>
                    </select>
                </li>`;
            });
        });
        fetch(`./ACM?username=${userName}&option=characters`).then(response => response.json()).then(json => {
            json.data.forEach(async pair => {
                var charactersHeading = (await (await fetch(`https://api.jikan.moe/v4/characters/${pair.characterId}`)).json()).data.name;
                myCharactersList.innerHTML += `<li>
                    <h4>${charactersHeading}</h4>
                </li>`;
            });
        });
    }
};

function mangaStatusChange() {
        var url = `./ACM?option=manga&mangaId=${this.event.target.getAttribute("data-id")}&username=${sessionStorage.getItem("userName")}&status=${this.event.target.value}`;
            console.log(url);
            fetch(url, {
                method: 'POST'
            }).then(response => response.text()).then(console.log);
         };

function animeStatusChange() {
        var url = `./ACM?option=anime&animeId=${this.event.target.getAttribute("data-id")}&username=${sessionStorage.getItem("userName")}&status=${this.event.target.value}`;
            console.log(url);
            fetch(url, {
                method: 'POST'
            }).then(response => response.text()).then(console.log);
         };