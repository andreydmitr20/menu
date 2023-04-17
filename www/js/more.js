checkAuth();
const menu = document.querySelector("#menu");
menu.addEventListener("click", () => {
  startButtonPressAnimation(menu);
  window.open("./menu.html", "_self");
});
const dishes = document.querySelector("#dishes");
dishes.addEventListener("click", () => {
  startButtonPressAnimation(dishes);
  window.open("./dishes.html", "_self");
});
const ingredients = document.querySelector("#ingredients");
ingredients.addEventListener("click", () => {
  startButtonPressAnimation(ingredients);
  window.open("./ingredients.html", "_self");
});
const settings = document.querySelector("#settings");
settings.addEventListener("click", () => {
  startButtonPressAnimation(settings);
  window.open("./settings.html", "_self");
});
