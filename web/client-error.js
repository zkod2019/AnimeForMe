function parseQueryFromString(queryString) {
  let splitQuery = queryString.slice(1).split("&");
  let result = {};
  splitQuery.forEach((param) => {
    let [name, value] = param.split("=");
    result[name] = value;
  });
  return result;
}

window.addEventListener("load", () => {
  if (window.location.search) {
    let query = parseQueryFromString(window.location.search);
    let { errorType } = query;
    if (errorType === "username-taken") {
      alert("That username is taken. Please try another one.");
    }
  }
});
