checkAuth();

btnAction("menu", () => {
  window.open("./more.html", "_self");
});

// search
const doSearch = (searchText) => {
  console.log("search: ", searchText);
  getIngredients(searchText);
};

const search = btnAction("search", () => {
  if (!strIsEmpty(searchInput.value)) {
    doSearch(searchInput.value);
  }
});
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("keypress", (event) => {
  if (event.keyCode === 13 && !strIsEmpty(searchInput.value)) {
    doSearch(searchInput.value);
  }
});

// get user data
const getIngredients = (searchText) => {
  let searchTextPlus = searchText;
  while (true) {
    let index = searchTextPlus.indexOf(" ");
    if (index === -1) break;
    searchTextPlus = searchTextPlus.replace(" ", "+");
    searchTextPlus = searchTextPlus.replace("++", "+");
  }
  fetchAPI(
    API_DISH_INGREDIENTS,
    "get",
    `?search=${searchTextPlus}`,
    {
      ok: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    },
    true
  );
};

searchInput.focus();
