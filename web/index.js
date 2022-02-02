window.onload = function () {
  var signInForm = document.getElementById("signInForm");
  var signInUserName = document.getElementById("signInUserName");
  var signInPassword = document.getElementById("signInPassword");
  var errorMessage = document.getElementById("errorMessage");
  
  var signUpForm = document.getElementById("signupForm");
  var signUpUserName = document.getElementById("userName");
  var signUpPassword = document.getElementById("psw");
  var errorMessageSignUp = document.getElementById("errorMessageSignUp");

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
    
  signUpForm.onsubmit = function(e) {
      e.preventDefault();
      errorMessageSignUp.innerText = "";
      var request = new XMLHttpRequest();
      request.open("POST", "./SignUpServlet", true);
      request.onload = function () {
        if (request.status === 200) {
          sessionStorage.setItem("userName", signUpUserName.value);
          sessionStorage.setItem("password", signUpPassword.value);
          window.location = "./home.html";
        } else {
          errorMessageSignUp.innerText = request.response;
        }
      };
      request.send(
        `username=${encodeURIComponent(
          signUpUserName.value
        )}&password=${encodeURIComponent(signUpPassword.value)}`
      );
  };
};
