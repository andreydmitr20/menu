checkAuth();
getCurrentUser();

const newIngredient = document.querySelector("#new-ingredient");
const searchDiv = document.querySelector("#search-div");
const pagination = document.querySelector("#pagination");
const ingredients = document.querySelector("#ingredients");
const vitamins = document.querySelector("#vitamins");
const vitaminsList = document.querySelector("#vitamins-list");

// get vitamins
getDict(API_DISH_VITAMINS, {
  ok: (data) => {
    // console.log(data);
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
        <div 
         class="accordion-body d-flex flex-row flex-nowrap text-primary justify-content-between border border-warning rounded">
          ${element["name"]}
          <input 
          class="w-50 p-2 text-end " 
          type="number" 
          data-field="vitamin"
          data-id="${element["id"]}" 
          min="0" 
          step="0.001">
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
if (!strIsEmpty(localStorageGet(LS_MINE_SEARCH))) {
  mineSearch.checked = true;
  search.click();
}

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
    startButtonPressAnimation(element, () => prepareIngredient(id), event);
  }
});

// get user data
const getIngredients = (searchText, pageToGo, pageSize) => {
  const editButton = (userId, userUsername, ingredientId) => {
    if (+userId === currentUser.id) {
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
    API_DISH_INGREDIENTS,
    "get",
    `?search=${searchTextPlus}&page_size=${pageSize}&page_number=${pageToGo}&mine=${
      mineSearch.checked ? "1" : "0"
    }&short=1`,
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
        <table class="table w-100  ">
          <thead>
            <tr>
              <th scope="col">Ingredient</th>
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
        ingredients.innerHTML =
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

searchInput.focus();

const add = btnAction("add", () => {
  prepareIngredient();
});

const ingredientName = document.querySelector("#ingredient-name");
// photo
const ingredientPhoto = document.querySelector("#ingredient-photo");
const ingredientPhotoUrl = document.querySelector("#ingredient-photo-url");
ingredientPhotoUrl.addEventListener("input", () => {
  ingredientPhoto.src = ingredientPhotoUrl.value;
});
const setDefaultPhoto = () => {
  ingredientPhoto.src = "../icon/ingredient.png";
};
ingredientPhoto.addEventListener("error", () => {
  setDefaultPhoto();
});

const errorText = document.querySelector("#error-text");

//
const saveButton = btnAction("save", (event) => {
  //
  let vitaminsObj = {};
  let requestBody = {};
  newIngredient.querySelectorAll("input").forEach((inputElement) => {
    const field = inputElement.dataset.field;
    if (!strIsEmpty(field)) {
      if (field !== "vitamin") {
        if (!strIsEmpty(inputElement.value)) {
          requestBody[field] = inputElement.value;
        } else {
          requestBody[field] = null;
        }
      } else if (!strIsEmpty(inputElement.value)) {
        vitaminsObj[`${inputElement.dataset.id}`] = inputElement.value;
      }
    }
  });
  let vitaminsJSON = "";
  try {
    vitaminsJSON = JSON.stringify(vitaminsObj);
  } catch (error) {
    console.error(error);
    setText(errorText, TEXT_ERROR_INVALID_VITAMINS_DATA);
    return;
  }
  requestBody["vitamins"] = vitaminsJSON;
  requestBody["user"] = currentUser.id;
  // console.log(requestBody);

  // save
  let ingredientId = saveButton.dataset.ingredientId;
  let api = API_DISH_INGREDIENTS;
  let method = "post";
  if (ingredientId !== "") {
    method = "put";
    api += ingredientId;
  }
  fetchAPI(api, method, requestBody, true, {
    ok: (data) => {
      back.click();
    },
    error: (error) => {
      console.log(error);
      setText(errorText, getErrorTextFromMessage(error, newIngredient));
    },
  });
});

// back action
const back = btnAction("back", () => {
  if (isElementVisible(deleteModal)) {
    showElement(newIngredient);
    hideElement(deleteModal);
  } else if (isElementVisible(newIngredient)) {
    showElement(searchDiv);
    showElement(pagination);
    showElement(ingredients);
    hideElement(newIngredient);
    search.click();
  } else {
    window.open("./more.html", "_self");
  }
});

// delete
const deleteModal = document.querySelector("#deleteModal");
const deleteButton = btnAction("delete", () => {
  // ask
  document.querySelector("#delete-name").textContent =
    ingredientName.value + " ?";

  hideElement(newIngredient);
  showElement(deleteModal);
});

const deleteNoButton = btnAction("delete-no", () => {
  back.click();
});

btnAction("delete-yes", () => {
  // delete
  fetchAPI(
    API_DISH_INGREDIENTS + saveButton.dataset.ingredientId,
    "delete",
    {},
    true,
    {
      ok: () => {
        back.click();
        back.click();
      },
      error: (error) => {
        console.error(error);
        setText(
          errorText,
          "Can not delete the ingredient which is already been used in a dish"
        );
        back.click();
      },
    }
  );
});

// prepare to create or edit ingredient
// ingredientId is null for new ingredient
function prepareIngredient(ingredientId) {
  hideElement(searchDiv);
  hideElement(pagination);
  hideElement(ingredients);
  showElement(newIngredient);
  hideElement(deleteButton);
  setDefaultPhoto();
  setText(errorText, "");
  if (ingredientId === undefined) {
    saveButton.dataset.ingredientId = "";
  } else {
    saveButton.dataset.ingredientId = ingredientId;
  }

  ingredientName.focus();
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
  // get data
  if (ingredientId !== undefined) {
    showElement(deleteButton);
    // get data
    fetchAPI(API_DISH_INGREDIENTS, "get", `${ingredientId}`, true, {
      ok: (data) => {
        // console.log(data);
        if (data.length === 0) {
          // error
          back.click();
          return;
        }

        let vitaminsObj = JSON.parse(data["vitamins"]);
        if (vitaminsObj === null) vitaminsObj = {};
        // console.log(vitaminsObj);

        allInputs.forEach((inputElement) => {
          const field = inputElement.dataset.field;
          if (!strIsEmpty(field)) {
            if (field !== "vitamin") {
              inputElement.value = data[field];
              if (field === "photo") ingredientPhoto.src = data[field];
            } else {
              // console.log(inputElement.dataset.id);
              inputElement.value = vitaminsObj[`"${inputElement.dataset.id}"`];
            }
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
