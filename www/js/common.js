const LS_JWT_REFRESH = "jwt_refresh";
const LS_JWT_ACCESS = "jwt_access";

const API_TOKEN = "api/token/";
const API_TOKEN_REFRESH = "api/token/refresh/";
const API_USER_PROFILE = "api/user/profile/";
const API_URL = "http://127.0.0.1:8000/";

// get access jwt token
// if ok then call functionsObj.ok()
// if error then call functionsObj.error()
const getAccessJwt = (functionsObj) => {
  let jwtRefresh = localStorage.getItem(LS_JWT_REFRESH);

  if (jwtRefresh === null || jwtRefresh === undefined) {
    if (
      typeof functionsObj === "object" &&
      functionsObj.hasOwnProperty("error")
    ) {
      functionsObj.error();
    }
    return;
  }
  // check
  fetchAPI(
    API_TOKEN_REFRESH,
    {
      refresh: jwtRefresh,
    },
    functionsObj
  );
};

// if not authenticated, goto index.html
const checkAuth = () => {
  getAccessJwt({
    error: () => {
      window.open("../index.html", "_self");
    },
  });
};

// buttonPress animation
const buttonPressEventListener = (event) => {
  event.target.removeEventListener("animationend", buttonPressEventListener);
  event.target.classList.remove("button-press");
};
const startButtonPressAnimation = (element) => {
  element.addEventListener("animationend", buttonPressEventListener);
  element.classList.add("button-press-animation");
};

// fetch data from api
const fetchAPI = (api, body, functionsObj, jwtAuth) => {
  let headers = {
    "Content-Type": "application/json",
  };
  if (jwtAuth) {
    headers["Authorization"] =
      "Bearer " + sessionStorage.getItem(LS_JWT_ACCESS);
  }
  //   console.log([headers]);
  fetch(API_URL + api, {
    method: "POST",

    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: headers,
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(body),
  })
    .then((response) => {
      //   console.log(response);
      if (response.status === 401) {
        // get new jwt access token
        console.log("refresh token");
        fetchAPI(
          API_TOKEN_REFRESH,
          {
            refresh: localStorage.getItem(LS_JWT_REFRESH),
          },
          {
            ok: (data) => {
              console.log("repeat fetch");
              sessionStorage.setItem(LS_JWT_ACCESS, data.access);
              fetchAPI(api, body, functionsObj, jwtAuth);
            },
          }
        );
        return;
      }
      if (response.status !== 200) throw new Error(response.responseText);
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      if (
        typeof functionsObj === "object" &&
        functionsObj.hasOwnProperty("ok")
      ) {
        functionsObj.ok(data);
      }
    })
    .catch((error) => {
      console.log(error);
      if (
        typeof functionsObj === "object" &&
        functionsObj.hasOwnProperty("error")
      ) {
        functionsObj.error();
      }
    });
};
