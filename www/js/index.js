const username = document.querySelector("#username");
const password = document.querySelector("#password");
const okButton = document.querySelector("#okButton");
let jwtAccess;

username.focus();

username.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    event.preventDefault();
    password.focus();
  }
});
password.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    event.preventDefault();
    loginDone(login);
  }
});

okButton.addEventListener("click", (event) => {
  event.preventDefault();
  loginDone(login);
});

// try to login
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
      if (response.status !== 200) throw new Error("Unathorized");
      return response.json();
    })
    .then((jwt) => {
      jwtAccess = jwt.access;
      //   console.log(jwt.access);
      localStorage.setItem(LS_JWT_REFRESH, jwt.refresh);
      //   console.log(jwt.refresh);
      loginDone();
    })
    .catch((error) => {
      console.log(error);

      password.value = "";
      password.focus();
    });
};

const loginDone = () => {
  window.open("./html/menu.html", "_self");
};

// get access jwt token
const getAccessJwt = () => {
  let jwtRefresh = localStorage.getItem(LS_JWT_REFRESH);

  if (jwtRefresh === null || jwtRefresh === undefined) return;

  // check
  fetch(API_URL + API_TOKEN_REFRESH, {
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
      refresh: jwtRefresh,
    }),
  })
    .then((response) => {
      console.log(response);
      if (response.status !== 200) throw new Error("Unathorized");
      return response.json();
    })
    .then((jwt) => {
      //   console.log(jwt.access);
      jwtAccess = jwt.access;
      loginDone();
    })
    .catch((error) => {
      console.log(error);
    });
  return false;
};

getAccessJwt();
