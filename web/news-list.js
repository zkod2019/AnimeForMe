/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const newsList = document.getElementById("news-list");

console.log(newsList);

(async () => {
    const newsRes = await fetch("./News");
    const newsJson = await newsRes.json();
    console.log(newsJson);
    newsJson.slice(0, 5).forEach(article => {
        console.log(article);
        newsList.innerHTML += `
            <li style="display:flex;">
                <img src="${article.imageUrl}"/>
                <div>
                <a href="${article.url}"><h4>${article.title}</h4></a>
                <p>${article.excerpt}</p>
                </div>
            </li>
        `;
    });
})();
