window.addEventListener("load", function () {
  let includeEls = document.querySelectorAll(".__include");

  includeEls.forEach((include) => {
    let includeSrc = include.getAttribute("data-src");

    if (includeSrc) {
      const request = new XMLHttpRequest();
      
      //makes request to the provided Src for the include element
      request.open("GET", includeSrc, true);

      request.onload = function () {
        if (request.status == 200) {
            // create range is more modern API that allows for <script> elements. therefore it's prefered over DOMParser()
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
