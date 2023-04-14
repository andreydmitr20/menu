const username = document.querySelector("#username");
const password = document.querySelector("#password");
const okButton = document.querySelector("#okButton");

username.focus();

username.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    event.preventDefault();
    password.focus();
  }
});

const login = () => {
  console.log("login");
  // try to get new token
  fetch(API_URL + API_TOKEN_GET, {
    method: "POST",

    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

password.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    event.preventDefault();
    login();
  }
});

okButton.addEventListener("click", (event) => {
  event.preventDefault();
  login();
});

// refresh jwt token
const refreshJwtToken = () => {};

// check jwt token
const checkJwtToken = () => {
  let jwtToken = localStorage.getItem(LS_JWT_TOKEN);

  if (jwtToken === null) return false;
  // check
  fetch(API_URL + API_TOKEN_CHECK, {
    method: "POST",

    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: {
      username: username.value,
      password: password.value,
    },
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

checkJwtToken();
