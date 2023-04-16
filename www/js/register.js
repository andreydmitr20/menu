const userName = document.querySelector("#username");
const password = document.querySelector("#password");
const email = document.querySelector("#email");
const iconUrl = document.querySelector("#iconUrl");
const iconImage = document.querySelector("#iconImage");
const okButton = document.querySelector("#ok");
const error = document.querySelector("#error");
const viewPassword = document.querySelector("#view-password");

viewPassword.addEventListener("click", () => {
  startButtonPressAnimation(viewPassword);

  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
});

userName.focus();

const menu = document.querySelector("#menu");
menu.addEventListener("click", () => {
  startButtonPressAnimation(menu);
  window.open("../index.html", "_self");
});

iconImage.addEventListener("error", () => {
  iconImage.src = "../icon/salad.png";
});

iconUrl.addEventListener("input", () => {
  iconImage.src = iconUrl.value;
});

userName.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    if (!strIsEmpty(userName.value)) {
      password.focus();
    }
  }
});

password.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    if (!strIsEmpty(password.value)) {
      email.focus();
    }
  }
});

email.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    if (!strIsEmpty(email.value)) {
      icon.focus();
    }
  }
});

iconUrl.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    okButton.click();
  }
});

okButton.addEventListener("click", (event) => {
  startButtonPressAnimation(okButton);
  okButton.disabled = true;

  // try to register of user
  fetchAPI(
    API_USER_REGISTER,
    {
      username: userName.value,
      password: password.value,
      email: email.value,
      icon: iconUrl.value,
    },
    {
      ok: () => {
        error.textContent = "";

        console.log("registered");
        okButton.disabled = false;
        // auto login
        login(
          userName.value,
          password.value,
          () => {
            window.open("../html/menu.html", "_self");
          },
          () => {
            window.open("../index.html", "_self");
          }
        );
      },
      error: (err) => {
        error.textContent = getErrorTextFromMessage(err, [
          ["username", userName],
          ["password", password],
          ["email", email],
        ]);
        okButton.disabled = false;
      },
    },
    false
  );
});
