window.onload = function(){
    var hi = document.getElementById("hi");
    var userName = sessionStorage.getItem("userName"); //localStorage instead of session will keep it open across tabs
    if (userName){
        hi.innerText = `Hi ${userName}!!!`;
    }
};
