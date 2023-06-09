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
  fetchAPI(API_USER, "get", "", true, {
    ok: (data) => {
      // console.log(data);
      userName.value = data.username;
      // userName.dataset.id = data.token_user_id;
      email.value = data.email;
      iconUrl.value = data.icon;
      iconImage.src = iconUrl.value;
    },
  });
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
  setText(errorText, "");

  fetchAPI(
    API_USER_LOGOUT,
    "post",

    {},
    false,
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
    true,
    {
      ok: () => {
        modal.style.display = "none";
        settingsForm.style.display = "block";
      },
      error: (err) => {
        console.log(err);
        setText(
          errorPasswordText,
          getErrorTextFromMessage(err, document.querySelector("#passwordModal"))
        );
      },
    }
  );
});

const save = document.querySelector("#save");
save.addEventListener("click", (event) => {
  setText(errorText, "");
  fetchAPI(
    API_USER,
    "put",
    { username: userName.value, email: email.value, icon: iconUrl.value },
    true,
    {
      ok: () => {
        window.open("./more.html", "_self");
      },
      error: (err) => {
        console.log(err);
        setText(
          errorText,
          getErrorTextFromMessage(err, document.querySelector("#settings-form"))
        );
      },
    }
  );
});
