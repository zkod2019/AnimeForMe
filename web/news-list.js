const newsList = document.getElementById("news-list");

console.log(newsList);

(async () => {
  const newsRes = await fetch("./News");
  const newsJson = await newsRes.json();
  console.log(newsJson);
  newsJson.slice(0, 5).forEach((article) => {
    console.log(article);
    newsList.innerHTML += `
            <li style="display:flex;" class="news-list-el">
                <img src="${article.imageUrl}"/>
                <div>
                <a href="${article.url}"><h4>${article.title}</h4></a>
                <p>${article.excerpt}</p>
                </div>
            </li>
        `;
  });
})();