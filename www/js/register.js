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

username.focus();

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

okButton.addEventListener("click", () => {
  startButtonPressAnimation(okButton);
  okButton.disabled = true;
  // try to register
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
        // TODO autologin
        // window.open("../index.html", "_self");
      },
      error: (err) => {
        let obj = JSON.parse(err.replace("Error:", "").trim());
        let text = "Invalid data";
        if (typeof obj === "object") {
          if (obj.hasOwnProperty("email")) {
            text = obj.email[0];
            email.focus();
          }
          if (obj.hasOwnProperty("username")) {
            text = obj.username[0];
            userName.focus();
          }
          if (obj.hasOwnProperty("password")) {
            text = obj.password[0];
            password.focus();
          }
        }
        error.textContent = text;
        okButton.disabled = false;
      },
    },
    false
  );
});
