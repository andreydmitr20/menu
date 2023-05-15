checkAuth();
getCurrentUser();

const editDish = document.querySelector("#edit-dish");
const searchDiv = document.querySelector("#search-div");
const dishes = document.querySelector("#dishes");
const tagsList = document.querySelector("#tags-list");

// get tags
getDict(API_DISH_TAGS, {
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
      tagsList.innerHTML = html;
    }
  },
  error: (err) => {
    console.log(err);
  },
});

// PAGINATION
let page = 1;
let pageOne = btnAction("page-one", () => {
  page = 1;
  goToPage(1, DISHES_PAGE_SIZE);
});
const pagePrev = btnAction("page-prev", () => {
  goToPage(page - 1, DISHES_PAGE_SIZE);
});
const pageCurrent = document.querySelector("#page-current");
const pageFirst = btnAction("page-next", () => {
  goToPage(page + 1, DISHES_PAGE_SIZE);
});

// SEARCH
const searchInput = document.querySelector("#search-input");

const searchFunction = createSlowedFunction(() => {
  goToPage(1);
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
if (!strIsEmpty(localStorageGet(LS_MINE_SEARCH))) mineSearch.checked = true;

searchFunction();

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
          <tr style="background-image:url(${
            !strIsEmpty(element.photo) ? element.photo : "../icon/salad.png"
          })">
            
            
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

const editElement = document.querySelector("#edit-element");

// click edit dish button
dishes.addEventListener("click", (event) => {
  let element = event.target;
  if (element.dataset.editable === "1") {
    event.preventDefault();

    let id = element.dataset.id;
    if (strIsEmpty(id)) {
      element = element.parentElement;
      id = element.dataset.id;
    }
    startButtonPressAnimation(element, () => prepareDish(id), event);
  }
});

// click add dish button
const add = btnAction("add", () => {
  prepareDish();
});

const dishName = document.querySelector("#dish-name");
// photo
const dishPhoto = document.querySelector("#dish-photo");
const dishPhotoUrl = document.querySelector("#dish-photo-url");
dishPhotoUrl.addEventListener("input", () => {
  dishPhoto.src = dishPhotoUrl.value;
});
const setDefaultPhoto = () => {
  dishPhoto.src = "../icon/rice.png";
};
dishPhoto.addEventListener("error", () => {
  setDefaultPhoto();
});

const errorText = document.querySelector("#error-text");

//
const saveButton = btnAction("save", (event) => {
  //
  // let vitaminsObj = {};
  // let requestBody = {};
  // editdish.querySelectorAll("input").forEach((inputElement) => {
  //   const field = inputElement.dataset.field;
  //   if (!strIsEmpty(field)) {
  //     if (field !== "vitamin") {
  //       if (!strIsEmpty(inputElement.value)) {
  //         requestBody[field] = inputElement.value;
  //       } else {
  //         requestBody[field] = null;
  //       }
  //     } else if (!strIsEmpty(inputElement.value)) {
  //       vitaminsObj[`${inputElement.dataset.id}`] = inputElement.value;
  //     }
  //   }
  // });
  // let vitaminsJSON = "";
  // try {
  //   vitaminsJSON = JSON.stringify(vitaminsObj);
  // } catch (error) {
  //   console.error(error);
  //   setText(errorText, TEXT_ERROR_INVALID_VITAMINS_DATA);
  //   return;
  // }
  // requestBody["vitamins"] = vitaminsJSON;
  // requestBody["user"] = currentUser.id;
  // // console.log(requestBody);
  // // save
  // let dishId = saveButton.dataset.dishId;
  // let api = API_DISH_INGREDIENTS;
  // let method = "post";
  // if (ingredientId !== "") {
  //   method = "put";
  //   api += ingredientId;
  // }
  // fetchAPI(api, method, requestBody, true, {
  //   ok: (data) => {
  //     back.click();
  //   },
  //   error: (error) => {
  //     console.log(error);
  //     setText(errorText, getErrorTextFromMessage(error, editIngredient));
  //   },
  // });
});

// BACK
const back = btnAction("back", () => {
  if (isElementVisible(deleteModal)) {
    showElement(editDish);
    hideElement(deleteModal);
  } else if (isElementVisible(editDish)) {
    showElement(searchDiv);
    showElement(pagination);
    showElement(dishes);
    hideElement(editDish);
    search.click();
  } else {
    window.open("./more.html", "_self");
  }
});

// delete
const deleteModal = document.querySelector("#deleteModal");
const deleteButton = btnAction("delete", () => {
  // ask
  document.querySelector("#delete-name").textContent = dishName.value + " ?";

  hideElement(editDish);
  showElement(deleteModal);
});

const deleteNoButton = btnAction("delete-no", () => {
  back.click();
});

btnAction("delete-yes", () => {
  // delete
  fetchAPI(API_DISH_DISHES + saveButton.dataset.dishId, "delete", {}, true, {
    ok: () => {
      back.click();
      back.click();
    },
    error: (error) => {
      console.error(error);
      setText(errorText, "Can not delete the dish which was liked");
      back.click();
    },
  });
});

// prepare to create or edit dish
// dishId is null for new dish
function prepareDish(dishId) {
  hideElement(searchDiv);
  hideElement(pagination);
  hideElement(dishes);
  showElement(editDish);
  hideElement(deleteButton);
  setDefaultPhoto();
  setText(errorText, "");
  saveButton.dataset.dishId = dishId === undefined ? "" : dishId;

  dishName.focus();
  editDish.addEventListener("keypress", (event) => {
    setFocusToNextField(event);
  });

  // clear all
  const allInputs = editDish.querySelectorAll("input");
  allInputs.forEach((inputElement) => {
    inputElement.value = "";
  });

  // // get data
  // if (ingredientId !== undefined) {
  //   showElement(deleteButton);
  //   // get data
  //   fetchAPI(API_DISH_INGREDIENTS, "get", `${ingredientId}`, true, {
  //     ok: (data) => {
  //       // console.log(data);
  //       if (data.length === 0) {
  //         // error
  //         back.click();
  //         return;
  //       }

  //       let vitaminsObj = JSON.parse(data["vitamins"]);
  //       if (vitaminsObj === null) vitaminsObj = {};
  //       // console.log(vitaminsObj);

  //       allInputs.forEach((inputElement) => {
  //         const field = inputElement.dataset.field;
  //         if (!strIsEmpty(field)) {
  //           if (field !== "vitamin") {
  //             inputElement.value = data[field];
  //             if (field === "photo") ingredientPhoto.src = data[field];
  //           } else {
  //             // console.log(inputElement.dataset.id);
  //             inputElement.value = vitaminsObj[`"${inputElement.dataset.id}"`];
  //           }
  //         }
  //       });
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }
}
