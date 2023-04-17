checkAuth();
const userName = document.querySelector("#username");
const password = document.querySelector("#password");
const email = document.querySelector("#email");
const iconUrl = document.querySelector("#iconUrl");
const iconImage = document.querySelector("#iconImage");
const logout = document.querySelector("#logout");
const errorText = document.querySelector("#error-text");

iconImage.addEventListener("error", () => {
  iconImage.src = "../icon/salad.png";
});

iconUrl.addEventListener("input", () => {
  iconImage.src = iconUrl.value;
});

logout.addEventListener("click", () => {
  startButtonPressAnimation(logout);
  console.log("!");
  fetchAPI(
    API_USER_LOGOUT,
    "post",

    {},
    {
      ok: () => {
        errorText.textContent = "";

        userLogout();
        window.open("../index.html");
      },
    }
  );
});

// get user data
const getUserData = () => {
  fetchAPI(
    API_USER,
    "get",
    {},
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

username.focus();
const menu = document.querySelector("#menu");
menu.addEventListener("click", () => {
  startButtonPressAnimation(menu);
  window.open("./menu.html", "_self");
});

const save = document.querySelector("#save");
save.addEventListener("click", (event) => {
  fetchAPI(
    API_USER,
    "post",
    { username: userName.value, email: email.value, icon: iconUrl.value },
    {
      ok: (data) => {
        console.log("settings saved");
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
