window.addEventListener("load", function () {
  //   let includeEls = document.querySelectorAll("include");
  let includeEls = document.querySelectorAll(".__include");

  includeEls.forEach((include) => {
    let includeSrc = include.getAttribute("data-src");

    if (includeSrc) {
      const request = new XMLHttpRequest();
      request.open("GET", includeSrc, true);

      request.onload = function () {
        if (request.status == 200) {
          const frag = document
            .createRange()
            .createContextualFragment(request.responseText);
          console.log(frag);
          include.parentElement.replaceChild(frag, include);
        }
      };

      request.send();
    }

    console.log(includeSrc);
  });
});
