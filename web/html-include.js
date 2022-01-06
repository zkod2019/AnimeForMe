window.addEventListener("load", function () {
  //   let includeEls = document.querySelectorAll("include");
  let includeEls = document.querySelectorAll(".__include");

  includeEls.forEach((include) => {
    let includeSrc = include.getAttribute("data-src");

    if (includeSrc) {
      const request = new XMLHttpRequest();
      request.open("GET", includeSrc, true);

      const parser = new DOMParser();
      request.onload = function () {
        if (request.status == 200) {
          const tmpDoc = parser.parseFromString(
            request.responseText,
            "text/html"
          );
          include.parentElement.replaceChild(tmpDoc.body.firstChild, include);
        }
      };

      request.send();
    }

    console.log(includeSrc);
  });
});
