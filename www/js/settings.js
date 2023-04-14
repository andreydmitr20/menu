checkAuth();
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const iconUrl = document.querySelector("#iconUrl");
const iconImage = document.querySelector("#iconImage");

// get user data

const getUserData = () => {};
getUserData();

username.focus();
const menu = document.querySelector("#menu");
menu.addEventListener("click", () => {
  startButtonPressAnimation(menu);
  window.open("./menu.html", "_self");
});

window.addEventListener("beforeunload", (event) => {
  console.log("save");
});
