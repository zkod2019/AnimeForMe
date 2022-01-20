window.onload = function () {
  var signInForm = document.getElementById("signInForm");
  var signInUserName = document.getElementById("signInUserName");
  var signInPassword = document.getElementById("signInPassword");
  var errorMessage = document.getElementById("errorMessage");

  signInForm.onsubmit = function (e) {
    e.preventDefault();
    errorMessage.innerText = "";
    var request = new XMLHttpRequest();
    request.open("POST", "./SignIn", true);
    request.onload = function () {
      if (request.status === 200) {
        sessionStorage.setItem("userName", signInUserName.value);
        sessionStorage.setItem("password", signInPassword.value);
        window.location = "./home.html";
      } else {
        errorMessage.innerText = request.response;
      }
    };
    request.send(
      `username=${encodeURIComponent(
        signInUserName.value
      )}&password=${encodeURIComponent(signInPassword.value)}`
    );
  };
};
