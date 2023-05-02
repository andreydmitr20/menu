const userName = document.querySelector("#username");
const password = document.querySelector("#password");
const email = document.querySelector("#email");
const iconUrl = document.querySelector("#iconUrl");
const iconImage = document.querySelector("#iconImage");
const okButton = document.querySelector("#ok");
const errorText = document.querySelector("#error-text");
const viewPassword = document.querySelector("#view-password");

btnAction("view-password", () => {
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
  password.focus();
});

userName.focus();

btnAction("back", () => {
  window.open("./login.html", "_self");
});

iconImage.addEventListener("error", () => {
  iconImage.src = "../icon/salad.png";
});

iconUrl.addEventListener("input", () => {
  iconImage.src = iconUrl.value;
});

userName.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    if (!strIsEmpty(userName.value)) {
      password.focus();
    }
  }
});

password.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    if (!strIsEmpty(password.value)) {
      email.focus();
    }
  }
});

email.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    if (!strIsEmpty(email.value)) {
      iconUrl.focus();
    }
  }
});

okButton = btnAction("ok", (event) => {
  event.target.disabled = true;

  // try to register of user
  fetchAPI(
    API_USER_REGISTER,
    "post",

    {
      username: userName.value,
      password: password.value,
      email: email.value,
      icon: iconUrl.value,
    },
    (jwtAuth = false),
    {
      ok: () => {
        setText(errorText, "");

        console.log("registered");
        event.target.disabled = false;
        // auto login
        login(userName.value, password.value, {
          ok: () => {
            window.open("../html/index.html", "_self");
          },
          error: () => {
            window.open("../html/login.html", "_self");
          },
        });
      },
      error: (err) => {
        setText(
          errorText,
          getErrorTextFromMessage(err, document.querySelector("#register-form"))
        );
        event.target.disabled = false;
      },
    }
  );
});

iconUrl.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    okButton.click();
  }
});
