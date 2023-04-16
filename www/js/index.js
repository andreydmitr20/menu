const username = document.querySelector("#username");
const password = document.querySelector("#password");
const okButton = document.querySelector("#okButton");
const registerButton = document.querySelector("#registerButton");

const body = document.querySelector("body");
body.addEventListener("loaded", () => username.focus());

username.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    event.preventDefault();
    if (strIsEmpty(username.value)) {
      username.focus();
    } else {
      password.focus();
    }
  }
});
password.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    event.preventDefault();
    login();
  }
});

okButton.addEventListener("click", (event) => {
  event.preventDefault();
  startButtonPressAnimation(okButton);
  login();
});

registerButton.addEventListener("click", (event) => {
  event.preventDefault();
  startButtonPressAnimation(registerButton);
  window.open("./html/register.html", "_self");
});

// try to login
const login = () => {
  // try to get new token
  fetchAPI(
    API_TOKEN,
    {
      username: username.value,
      password: password.value,
    },
    {
      ok: (data) => {
        sessionStorage.setItem(SS_JWT_ACCESS, data.access);
        localStorage.setItem(LS_JWT_REFRESH, data.refresh);
        loginDone();
      },
      error: () => {
        password.value = "";
        password.focus();
      },
    }
  );
};

const loginDone = () => {
  window.open("./html/menu.html", "_self");
};

// check jwt
getAccessJwt({
  ok: (data) => {
    sessionStorage.setItem(SS_JWT_ACCESS, data.access);
    loginDone();
  },
  error: () => {
    body.classList.remove("d-none");
    username.focus();
  },
});
