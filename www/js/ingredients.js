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

const ingredients = document.querySelector("#ingredients");
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
        // let html = `
        // <nav aria-label="...">
        //   <ul class="pagination pagination-sm">
        //     <li class="page-item active" aria-current="page">
        //       <span class="page-link">1</span>
        //     </li>
        //     <li class="page-item"><a class="page-link" href="#">2</a></li>
        //     <li class="page-item"><a class="page-link" href="#">3</a></li>
        //   </ul>
        // </nav>
        // `;
        let html = `
        <table class="table">
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
    },
    true
  );
};

searchInput.focus();
