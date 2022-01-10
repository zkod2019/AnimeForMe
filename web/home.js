window.onload = function(){
    var hi = document.getElementById("hi");
    var userName = sessionStorage.getItem("userName"); //localStorage instead of session will keep it open across tabs
    if (userName){
        hi.innerText = `Hi ${userName}!!!`;
        
        var myMangaList = document.getElementById("myMangaList");
        fetch(`./ACM?username=${userName}&option=manga`).then(response => response.json()).then(json => {
            json.data.forEach(pair => {
                myMangaList.innerHTML += `<li>
                    <select onchange="statusChangeListener()" style="float:right;" data-id="${pair.mangaId}">
                        <option>Empty</option>
                        <option>Completed</option>
                        <option>Reading</option>
                        <option>Paused</option>
                    </select>
                </li>`
            })
            
        });
        
    }
    
    
    
};
