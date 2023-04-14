checkAuth();

const menu = document.querySelector("#menu");
menu.addEventListener("click", () => {
  startButtonPressAnimation(menu);
  window.open("./menu.html", "_self");
});
const ingredients = document.querySelector("#ingredients");
ingredients.addEventListener("click", () => {
  startButtonPressAnimation(ingredients);
  window.open("./ingredients.html", "_self");
});
