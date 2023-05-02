const username = document.querySelector("#username");
const password = document.querySelector("#password");

document
  .querySelector("body")
  .addEventListener("loaded", () => username.focus());

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

btnAction("okButton", loginDone);

btnAction("registerButton", () => {
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
