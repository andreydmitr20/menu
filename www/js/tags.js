checkAuth();

btnAction("menu", () => {
  window.open("./more.html", "_self");
});

tags = document.querySelector("#tags");

const getTags = () => {
  fetchAPI(
    API_DISH_TAGS,
    "get",
    {},
    {
      ok: (data) => {
        // console.log(data);
        let html = "";
        let index = 0;
        let index100 = 0;
        let beginGroup = true;
        let groupId;
        for (let tag of data) {
          let id = tag["id"];
          if (id % 100 === 0) {
            // group
            if (!beginGroup) {
              // add tail
              html += `</div></div>`;
            }
            groupId = id;
            html += `<div class="accordion-item bg-primary mt-1">
            <h2 class="accordion-header " id="h${groupId}">
              <button class="accordion-button bg-warning fs-3 " type="button" 
                data-bs-toggle="collapse"
                data-bs-target="#c${groupId}" aria-expanded="true" 
                aria-controls="c${groupId}">
                ${tag["name"]}
              </button>
            </h2>
            <div  id="c${groupId}" class="accordion-collapse collapse " 
              aria-labelledby="h${groupId}" 
              data-bs-parent="#tags">
             
                <div id="a${groupId}" class="accordion accordion-body">`;
            beginGroup = false;
          } else {
            html += `
          <div class="accordion-item">
            <h2 class="accordion-header " id="h${id}">
              <button class="accordion-button btn-primary fs-3 px-5 " type="button" 
                data-bs-toggle="collapse"
                data-bs-target="#c${id}" aria-expanded="true" 
                aria-controls="c${id}">
                ${tag["name"]}
              </button>
            </h2>
            <div  id="c${id}" class="accordion-collapse collapse " 
              aria-labelledby="h${id}" 
              data-bs-parent="#a${groupId}">
              <div class="accordion-body fs-4">
              ${tag["description"]}
              </div>
            </div>
          </div>
          `;
          }
        }
        if (!beginGroup) {
          // add tail
          html += `</div></div>`;
        }
        tags.innerHTML = html;
      },
      error: (err) => {
        console.log(err);
        tags.innerHTML = TEXT_ERROR_SERVER_ERROR;
      },
    },
    true
  );
};

getTags();
