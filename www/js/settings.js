checkAuth();
const userName = document.querySelector("#username");
const password = document.querySelector("#password");
const email = document.querySelector("#email");
const iconUrl = document.querySelector("#iconUrl");
const iconImage = document.querySelector("#iconImage");

// get user data

const getUserData = () => {
  fetchAPI(
    API_USER_PROFILE,
    {},
    {
      ok: (data) => {
        console.log(data);
        userName.value = data.token_user_username;
        password.value = "";
        email.value = data.token_user_email;
        userName.iconUrl = data.token_user_icon;
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

window.addEventListener("beforeunload", (event) => {
  console.log("save");
});
