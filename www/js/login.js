const username = document.querySelector("#username");
const password = document.querySelector("#password");
const okButton = document.querySelector("#okButton");
const registerButton = document.querySelector("#registerButton");

const body = document.querySelector("body");
body.addEventListener("loaded", () => username.focus());

//
const loginDone = () => {
  login(username.value, password.value, {
    ok: () => {
      window.open("../html/index.html", "_self");
    },
    error: () => {
      password.value = "";
      password.focus();
    },
  });
};
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
    loginDone();
  }
});

okButton.addEventListener("click", (event) => {
  event.preventDefault();
  startButtonPressAnimation(okButton);
  loginDone();
});

registerButton.addEventListener("click", (event) => {
  event.preventDefault();
  startButtonPressAnimation(registerButton);
  window.open("../html/register.html", "_self");
});

btnAction("view-password", () => {
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
  password.focus();
});
