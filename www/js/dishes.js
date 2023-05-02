checkAuth();
getCurrentUser();

const dishes = document.querySelector("#dishes");

// PAGINATION
let page = 1;
let pageOne = btnAction("page-one", () => {
  page = 1;
  goToPage(1, INGREDIENTS_PAGE_SIZE);
});
const pagePrev = btnAction("page-prev", () => {
  goToPage(page - 1, INGREDIENTS_PAGE_SIZE);
});
const pageCurrent = document.querySelector("#page-current");
const pageFirst = btnAction("page-next", () => {
  goToPage(page + 1, INGREDIENTS_PAGE_SIZE);
});

// SEARCH
const searchInput = document.querySelector("#search-input");

const searchFunction = createSlowedFunction(() => {
  if (mineSearch.checked) {
    goToPage(1);
  } else if (!strIsEmpty(searchInput.value)) {
    goToPage(1);
  }
  searchInput.focus();
});

const goToPage = (page) => {
  getSearchResults(searchInput.value, page, DISHES_PAGE_SIZE);
};
const search = btnAction("search", (event) => {
  searchFunction();
});

searchInput.addEventListener("keydown", (event) => {
  searchFunction();
});

// to search only in mine
const mineSearch = document.querySelector("#mine-search");
btnAction("mine-search", (event) => {
  mineSearch.checked = !mineSearch.checked;
  if (mineSearch.checked) {
    localStorageSet(LS_MINE_SEARCH, "1");
  } else {
    localStorageRemove(LS_MINE_SEARCH);
    if (strIsEmpty(searchInput.value)) {
      dishes.innerHTML = "";
    }
  }
  searchFunction();
});
if (!strIsEmpty(localStorageGet(LS_MINE_SEARCH))) {
  mineSearch.checked = true;
  searchFunction();
}

// GET SEARCH RESULTS
const getSearchResults = (searchText, pageToGo, pageSize) => {
  const editButton = (userId, userUsername, dishId) => {
    if (+userId === currentUser.id) {
      return `<button
                type="button"
                class="btn btn-primary bg-gradient  fs-5 mx-1"
                data-editable="1"
                data-id="${dishId}"
              >
                <img 
                  class="img-fluid rounded w30" 
                  src="../icon/edit.png" 
                  data-editable="1"
                />
              </button>`;
    } else {
      return userUsername;
    }
  };

  if (pageToGo === 0) return;

  let searchTextPlus = searchText;

  while (true) {
    let index = searchTextPlus.indexOf(" ");
    if (index === -1) break;
    searchTextPlus = searchTextPlus.replace(" ", "+");
    searchTextPlus = searchTextPlus.replace("++", "+");
  }

  fetchAPI(
    API_DISH_DISHES,
    "get",
    `?search=${searchTextPlus}&page_size=${pageSize}&page_number=${pageToGo}&mine=${
      mineSearch.checked ? "1" : "0"
    }&short=1`,
    true,
    {
      ok: (data) => {
        // console.log(data);
        if (data.length === 0) {
          dishes.innerHTML = "";
          return;
        }
        page = pageToGo;
        pageCurrent.innerHTML = pageToGo.toString();

        let html = "";

        // table header
        html += `
        <table class="table w-100  ">
          <thead>
            <tr>
              <th scope="col">Dish</th>
              <th scope="col"></th>
              <th scope="col">Creator/Edit</th>
            </tr>
          </thead>
          <tbody>
        `;
        if (data.length > 0) {
          data.forEach((element) => {
            // console.log(element);
            html += ` 
          <tr>
            
            
            <td>
              <img class="img-fluid rounded w80" src="${
                !strIsEmpty(element.photo) ? element.photo : "../icon/salad.png"
              }">
            </td>
            
            <td class="my-shadow fs-2 text-start text-capitalize text-primary align-middle">${
              element.name
            }</td>

            <td class="text-center align-middle">${editButton(
              element.user__id,
              element.user__username,
              element.id
            )}</td>
            
          </tr>`;
          });
        }
        dishes.innerHTML =
          html +
          `</tbody>
        </table>`;
      },
      error: (err) => {
        console.error(err);
      },
    }
  );
};

// BACK
const back = btnAction("back", () => {
  // if (isElementVisible(deleteModal)) {
  //   showElement(newIngredient);
  //   hideElement(deleteModal);
  // } else if (isElementVisible(newIngredient)) {
  //   showElement(searchDiv);
  //   showElement(pagination);
  //   showElement(ingredients);
  //   hideElement(newIngredient);
  //   search.click();
  // } else {
  window.open("./more.html", "_self");
  // }
});

searchInput.focus();
