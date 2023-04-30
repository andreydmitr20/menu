checkAuth();

btnAction("menu", () => {
  window.open("./more.html", "_self");
});

// get user data
const getUserData = (varUserId) => {
  fetchAPI(API_USER, "get", "", (jwtAuth = true), {
    ok: (data) => {
      varUserId = data.user_id;
      console.log(varUserId);
    },
    error: () => {
      console.log("in error");
      window.open("./login.html", "_self");
    },
  });
};
let userId;
getUserData(userId);

const newIngredient = document.querySelector("#new-ingredient");
const searchDiv = document.querySelector("#search-div");
const pagination = document.querySelector("#pagination");
const ingredients = document.querySelector("#ingredients");
const vitamins = document.querySelector("#vitamins");
const vitaminsList = document.querySelector("#vitamins-list");
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

const search = btnAction("search", () => {
  if (!strIsEmpty(searchInput.value)) goToPage(1);
});
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("keypress", (event) => {
  if (event.keyCode === 13 && !strIsEmpty(searchInput.value)) goToPage(1);
});

// get user data
const getIngredients = (searchText, pageToGo, pageSize) => {
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
    `?search=${searchTextPlus}&page_size=${pageSize}&page_number=${pageToGo}`,
    (jwtAuth = true),
    {
      ok: (data) => {
        console.log(data);
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
              <th scope="col">*</th>
            </tr>
          </thead>
          <tbody>
        `;
        if (data.length > 0) {
          data.forEach((element) => {
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
            
            <td class="text-end align-middle">${element.creator}</td>
            
            <td></td>
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

// add ingredient
const saveBtn = btnAction("save", () => {
  console.log("save");
  // prep vitamins
});

const add = btnAction("add", () => {
  searchDiv.classList.add("d-none");
  pagination.classList.add("d-none");
  ingredients.classList.add("d-none");
  newIngredient.classList.remove("d-none");
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
  document.querySelector("#ingredient-name").focus();
  document
    .querySelector("#new-ingredient")
    .addEventListener("keypress", (event) => {
      setFocusToNextField(event);
    });
});

const ingredientPhoto = document.querySelector("#ingredient-photo");
const ingredientPhotoUrl = document.querySelector("#ingredient-photo-url");
ingredientPhotoUrl.addEventListener("input", () => {
  ingredientPhoto.src = ingredientPhotoUrl.value;
});
ingredientPhoto.addEventListener("error", () => {
  ingredientPhoto.src = "../icon/ingredient.png";
});
