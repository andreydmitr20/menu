checkAuth();

btnAction("menu", () => {
  window.open("./more.html", "_self");
});

units = document.querySelector("#vitamins");

const getVitamins = () => {
  fetchAPI(
    API_DISH_VITAMINS,
    "get",
    "",
    {
      ok: (data) => {
        // console.log(data);
        let html = "";
        let index = 0;
        for (let vitamin of data) {
          html += `
          <div class="accordion-item mt-1">
            <h2 class="accordion-header " id="h${index}">
              <button class="accordion-button bg-warning bg-gradient fs-3 " type="button" 
                data-bs-toggle="collapse"
                data-bs-target="#c${index}" aria-expanded="true" 
                aria-controls="c${index}">
                ${vitamin["name"]}
              </button>
            </h2>
            <div  id="c${index}" class="accordion-collapse collapse " 
              aria-labelledby="h${index}" 
              data-bs-parent="#units">
              <div class="accordion-body fs-4">
              ${vitamin["description"]}
              </div>
            </div>
          </div>
          `;
          index += 1;
        }
        vitamins.innerHTML = html;
      },
      error: (err) => {
        console.log(err);
        vitamins.innerHTML = TEXT_ERROR_SERVER_ERROR;
      },
    },
    true
  );
};

getVitamins();
