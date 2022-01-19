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

          // Add any elements that would've gone into the <head>
          [...tmpDoc.head.children].forEach((child) => {
            window.document.head.appendChild(child);
          });

          // Add the other elements
          let firstEl = include.parentElement.replaceChild(
            tmpDoc.body.firstChild,
            include
          );
          if (tmpDoc.body.children.length > 1) {
            [...tmpDoc.body.children].slice(1).forEach((child) => {
              firstEl.insertAdjacentElement("afterend", child);
            });
          }
        }
      };

      request.send();
    }

    console.log(includeSrc);
  });
});
