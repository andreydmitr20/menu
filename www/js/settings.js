checkAuth();

btnAction("menu", () => {
  window.open("./more.html", "_self");
});

const userName = document.querySelector("#username");
const password = document.querySelector("#password");
const email = document.querySelector("#email");
const iconUrl = document.querySelector("#iconUrl");
const iconImage = document.querySelector("#iconImage");
const logout = document.querySelector("#logout");
const errorText = document.querySelector("#error-text");
const settingsForm = document.querySelector("#settings-form");

// get user data
const getUserData = () => {
  fetchAPI(
    API_USER,
    "get",
    "",
    {
      ok: (data) => {
        // console.log(data);
        userName.value = data.username;
        // userName.dataset.id = data.token_user_id;
        email.value = data.email;
        iconUrl.value = data.icon;
        iconImage.src = iconUrl.value;
      },
    },
    true
  );
};
getUserData();

email.focus();

iconImage.addEventListener("error", () => {
  iconImage.src = "../icon/salad.png";
});

iconUrl.addEventListener("input", () => {
  iconImage.src = iconUrl.value;
});

logout.addEventListener("click", () => {
  startButtonPressAnimation(logout);
  errorText.textContent = "";

  fetchAPI(
    API_USER_LOGOUT,
    "post",

    {},
    {
      ok: () => {
        userLogout();
        window.open("./login.html", "_self");
      },
      error: () => {
        userLogout();
        window.open("./login.html", "_self");
      },
    }
  );
});

// change password
const modal = document.querySelector("#passwordModal");
const currentPassword = document.querySelector("#current-password");
const newPassword = document.querySelector("#new-password");
const errorPasswordText = document.querySelector("#error-password-text");

btnAction("change-password", () => {
  modal.style.display = "block";
  settingsForm.style.display = "none";
  errorPasswordText.textContent = "";

  currentPassword.focus();
});

btnAction("cancel", () => {
  modal.style.display = "none";
  settingsForm.style.display = "block";
});

btnAction("view-password", () => {
  if (currentPassword.type === "password") {
    currentPassword.type = "text";
    newPassword.type = "text";
  } else {
    currentPassword.type = "password";
    newPassword.type = "password";
  }
});

currentPassword.addEventListener("keypress", (event) => {
  if (event.keyCode === 13 && !strIsEmpty(currentPassword.value)) {
    newPassword.focus();
  }
});

newPassword.addEventListener("keypress", (event) => {
  if (event.keyCode === 13 && !strIsEmpty(newPassword.value)) {
    changePasswordAction.click();
  }
});

const changePasswordAction = btnAction("change-password-action", () => {
  errorPasswordText.textContent = "";
  fetchAPI(
    API_USER_CHANGE_PASSWORD,
    "put",
    {
      current_password: currentPassword.value,
      new_password: newPassword.value,
    },
    {
      ok: () => {
        modal.style.display = "none";
        settingsForm.style.display = "block";
        console.log("change pass");
      },
      error: (err) => {
        console.log(err);
        errorPasswordText.textContent = getErrorTextFromMessage(err, [
          ["current_password", currentPassword],
          ["new_password", newPassword],
        ]);
        // newPassword.focus();
      },
    },
    true
  );
});

const save = document.querySelector("#save");
save.addEventListener("click", (event) => {
  errorText.textContent = "";
  fetchAPI(
    API_USER,
    "post",
    { username: userName.value, email: email.value, icon: iconUrl.value },
    {
      ok: () => {
        window.open("./more.html", "_self");

        // errorText.textContent = "Settings were saved";
      },
      error: (err) => {
        // console.log(err);
        errorText.textContent = getErrorTextFromMessage(err, [
          ["email", email],
          ["icon", iconUrl],
        ]);
      },
    },
    true
  );
});
