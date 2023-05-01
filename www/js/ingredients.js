checkAuth();

// get user data
const getUserData = (varUserId) => {
  fetchAPI(API_USER, "get", "", true, {
    ok: (data) => {
      varUserId["id"] = data.id;
    },
    error: () => {
      window.open("./login.html", "_self");
    },
  });
};
let currentUser = {};
getUserData(currentUser);

const newIngredient = document.querySelector("#new-ingredient");
const searchDiv = document.querySelector("#search-div");
const pagination = document.querySelector("#pagination");
const ingredients = document.querySelector("#ingredients");
const vitamins = document.querySelector("#vitamins");
const vitaminsList = document.querySelector("#vitamins-list");

// get vitamins
getDict(API_DISH_VITAMINS, {
  ok: (data) => {
    console.log(data);
    if (data.length > 0) {
      html = "";
      data.forEach((element) => {
        html += `
      <div
        id="flush-collapseOne"
        class="accordion-collapse collapse text-start "
        aria-labelledby="flush-headingOne"
        data-bs-parent="#accordionFlushExample"
      >
        <div class="accordion-body d-flex flex-row flex-nowrap text-primary justify-content-between border border-warning rounded">
          ${element["name"]}
          <input class="w-50 p-2 text-end " type="number" id="v${element["id"]}" min="0" step="0.001">
        </div>
      </div>`;
      });
      vitaminsList.innerHTML = html;
    }
  },
  error: (err) => {
    console.log(err);
  },
});

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

// search
const goToPage = (page) => {
  getIngredients(searchInput.value, page, INGREDIENTS_PAGE_SIZE);
};

const searchInput = document.querySelector("#search-input");
const search = btnAction("search", (event) => {
  if (mineSearch.checked) {
    goToPage(1);
  } else if (!strIsEmpty(searchInput.value)) {
    goToPage(1);
  }
  searchInput.focus();
});
searchInput.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    search.click();
  }
});
// to search only in mine ingredients
const mineSearch = document.querySelector("#mine-search");
btnAction("mine-search", (event) => {
  mineSearch.checked = !mineSearch.checked;
  if (mineSearch.checked) {
    localStorageSet(LS_MINE_SEARCH, "1");
  } else {
    localStorageRemove(LS_MINE_SEARCH);
    if (strIsEmpty(searchInput.value)) {
      ingredients.innerHTML = "";
    }
  }
  search.click();
});
if (!strIsEmpty(localStorageGet(LS_MINE_SEARCH))) mineSearch.checked = true;

// click edit button
ingredients.addEventListener("click", (event) => {
  let element = event.target;
  if (element.dataset.editable === "1") {
    event.preventDefault();

    let id = element.dataset.id;
    if (strIsEmpty(id)) {
      element = element.parentElement;
      id = element.dataset.id;
    }
    startButtonPressAnimation(element);
    prepareIngredient(id);
  }
});

// get user data
const getIngredients = (searchText, pageToGo, pageSize) => {
  const editButton = (userId, creator, ingredientId) => {
    if (userId === currentUser.id) {
      return `<button
                type="button"
                class="btn btn-primary bg-gradient  fs-5 mx-1"
                data-editable="1"
                data-id="${ingredientId}"
              >
                <img 
                  class="img-fluid rounded w30" 
                  src="../icon/edit.png" 
                  data-editable="1"
                />
              </button>`;
    } else {
      return creator;
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
    API_DISH_INGREDIENTS,
    "get",
    `?search=${searchTextPlus}&page_size=${pageSize}&page_number=${pageToGo}&mine=${
      mineSearch.checked ? "1" : "0"
    }`,
    (jwtAuth = true),
    {
      ok: (data) => {
        // console.log(data);
        if (data.length === 0) {
          ingredients.innerHTML = "";
          return;
        }
        page = pageToGo;
        pageCurrent.innerHTML = pageToGo.toString();

        let html = "";

        // table header
        html += `
        <table class="table w-100 ">
          <thead>
            <tr>
              <th scope="col">Ingredient</th>
              <th scope="col"></th>
              <th scope="col">Creator</th>
            </tr>
          </thead>
          <tbody>
        `;
        if (data.length > 0) {
          data.forEach((element) => {
            // console.log(element);
            html += ` 
          <tr>
            <td class="fs-2 text-start text-capitalize align-middle">${
              element.name
            }</td>
            
            <td>
              <img class="img-fluid rounded w80" src="${
                !strIsEmpty(element.photo) ? element.photo : "../icon/salad.png"
              }">
            </td>
            
            <td class="text-end align-middle">${editButton(
              element.user_id,
              element.creator,
              element.id
            )}</td>
            
          </tr>`;
          });
        }
        ingredients.innerHTML =
          html +
          `</tbody>
        </table>`;
      },
      error: (err) => {
        console.log(err);
      },
    }
  );
};

searchInput.focus();

const errorText = document.querySelector("#error-text");

//
const saveBtn = btnAction("save", () => {
  console.log("save");
  // prep vitamins
});

btnAction("menu", () => {
  if (newIngredient.classList.contains("d-none")) {
    window.open("./more.html", "_self");
  } else {
    searchDiv.classList.remove("d-none");
    pagination.classList.remove("d-none");
    ingredients.classList.remove("d-none");
    newIngredient.classList.add("d-none");
    searchInput.focus();
  }
});
// prepare to create or edit ingredient
const prepareIngredient = (ingredientId) => {
  searchDiv.classList.add("d-none");
  pagination.classList.add("d-none");
  ingredients.classList.add("d-none");
  newIngredient.classList.remove("d-none");

  document.querySelector("#ingredient-name").focus();
  document
    .querySelector("#new-ingredient")
    .addEventListener("keypress", (event) => {
      setFocusToNextField(event);
    });
  // clear all
  const allInputs = newIngredient.querySelectorAll("input");
  allInputs.forEach((inputElement) => {
    inputElement.value = "";
  });
  if (ingredientId !== undefined) {
    console.log("get data");
  }
};

const add = btnAction("add", () => {
  prepareIngredient();
});

const ingredientPhoto = document.querySelector("#ingredient-photo");
const ingredientPhotoUrl = document.querySelector("#ingredient-photo-url");
ingredientPhotoUrl.addEventListener("input", () => {
  ingredientPhoto.src = ingredientPhotoUrl.value;
});
ingredientPhoto.addEventListener("error", () => {
  ingredientPhoto.src = "../icon/ingredient.png";
});
