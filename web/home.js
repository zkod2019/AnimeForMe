window.addEventListener(
  "load",
  async () => {
    const introHeading = document.querySelector("#intro");
    const signInForm = document.querySelector("#sign-in-form");
    const signInFormMessage = document.querySelector("#sign-in-form-message");

    const signOutBtn = document.querySelector("#sign-out-button");
    const readingListEl = document.querySelector("#reading-list");

    const isSignedIn = sessionStorage.getItem("signed-in-username");

    if (isSignedIn) {
      const username = sessionStorage.getItem("signed-in-username");
      const password = sessionStorage.getItem("signed-in-password");

      introHeading.textContent = `Welcome back ${username}`;
      signOutBtn.style.display = "block";

      signOutBtn.addEventListener(
        "click",
        () => {
          sessionStorage.removeItem("signed-in-username");
          sessionStorage.removeItem("signed-in-password");
          window.location.href = window.location.href;
        },
        false
      );

      try {
        const readingListRes = await fetch("./servlets/reading-list", {
          method: "GET",
          headers: new Headers({
            Authorization: "Basic " + btoa(`${username}:${password}`),
          }),
        });
        const readingListJson = await readingListRes.json();
        if (readingListJson.status == 200) {
          console.log(readingListJson);
        } else {
          signInFormMessage.textContent = `Error while signing in: ${readingListJson.message}.`;
        }
      } catch (e) {
        signInFormMessage.textContent = `Internal error when signing in: ${e}.`;
      }
    } else {
      introHeading.textContent = "Sign in to use this app";
      signInForm.style.display = "block";
      
        const $ = document.querySelector.bind(document);
        const $s = document.querySelectorAll.bind(document);

        // fetch + async/await (the most modern)
        const booksRes = await fetch('/servlets/books');
        const booksJson = await booksRes.json();
        $(".books").innerHTML = `<ul>${booksJson.results.map(book => `<li>${book.title}</li>`).join('')}</ul>`;

        // fetch + raw promises (modern)
        fetch('/servlets/books')
            .then(booksRes => booksRes.json())
            .then(booksJson => {
                $(".books").innerHTML = `<ul>${booksJson.results.map(book => `<li>${book.title}</li>`).join('')}</ul>`;
            })

        // XHR (old-fashioned)
        const booksReq = new XMLHttpRequest();
        booksReq.responseType = 'json';
        booksReq.open('GET', './servlets/books', true);
        booksReq.onload  = function() {
            const booksJson = booksReq.response;
            console.log(booksJson);
            $(".books").innerHTML = `<ul>${booksJson.results.map(book => `<li>${book.title}</li>`).join('')}</ul>`;
            $(".books").style.display = "block";
        };
        booksReq.send(null);

      signInForm.addEventListener(
        "submit",
        async (e) => {
          // We do form submission manually instead of using action to avoid the page redirect
          e.preventDefault();

          signInFormMessage.textContent = "";

          const usernameInput = document.querySelector("#username");
          const passwordInput = document.querySelector("#password");

          // Validation
          if (usernameInput.length > 15) {
            signInFormMessage.textContent =
              "Username can only have up to 15 characters.";
            return;
          } else if (!/^[a-zA-Z0-9-_]+$/.test(usernameInput.value)) {
            signInFormMessage.textContent =
              "Username can only have letters, numbers, dashes, or underscores.";
            return;
          }

          try {
            const authRes = await fetch("./servlets/validate-auth", {
              method: "GET",
              headers: new Headers({
                Authorization:
                  "Basic " +
                  btoa(`${usernameInput.value}:${passwordInput.value}`),
              }),
            });
            const authJson = await authRes.json();
            if (authJson.status == 200) {
              sessionStorage.setItem("signed-in-username", usernameInput.value);
              sessionStorage.setItem("signed-in-password", passwordInput.value);
              window.location.href = window.location.href;
            } else {
              signInFormMessage.textContent = `Error while signing in: ${authJson.message}.`;
            }
          } catch (e) {
            signInFormMessage.textContent = `Internal error when signing in: ${e}.`;
          }
        },
        false
      );
    }
  },
  false
);
