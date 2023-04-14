checkAuth();

const more = document.querySelector("#more");
more.addEventListener("click", () => {
  startButtonPressAnimation(more);
  window.open("./more.html", "_self");
});
