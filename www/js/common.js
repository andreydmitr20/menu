const LS_JWT_REFRESH = "jwt_refresh";
const SS_JWT_ACCESS = "jwt_access";

const API_TOKEN = "user/token/";
const API_TOKEN_REFRESH = "user/token/refresh/";

const API_USER_LOGOUT = "user/logout/";
const API_USER_REGISTER = "user/register/";
const API_USER_CHANGE_PASSWORD = "user/change-password/";

const API_URL = "http://127.0.0.1:8000/";

const strIsEmpty = (str) => {
  return str === null || str === undefined || str === "";
};

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
  //   getAccessJwt({
  //     error: () => {
  //       window.open("../index.html", "_self");
  //     },
  //   });
  if (strIsEmpty(sessionStorage.getItem(SS_JWT_ACCESS))) {
    window.open("../index.html", "_self");
  }
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
const fetchAPI = (api, body, functionsObj, jwtAuth = false, recursion) => {
  let headers = {
    "Content-Type": "application/json",
  };
  if (jwtAuth) {
    headers["Authorization"] =
      "Bearer " + sessionStorage.getItem(SS_JWT_ACCESS);
  }

  //   console.log([headers]);
  let responseStatus = 200;

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
      responseStatus = response.status;

      //   console.log(response);
      if (response.status === 401 && recursion !== true) {
        // console.log("get access token");
        fetchAPI(
          API_TOKEN_REFRESH,
          {
            refresh: localStorage.getItem(LS_JWT_REFRESH),
          },
          {
            ok: (data) => {
              //   console.log("repeat fetch");
              sessionStorage.setItem(SS_JWT_ACCESS, data.access);
              fetchAPI(api, body, functionsObj, jwtAuth, (recursion = true));
            },
            error: (err) => {
              console.log("err");
              sessionStorage.removeItem(SS_JWT_ACCESS);
              if (
                typeof functionsObj === "object" &&
                functionsObj.hasOwnProperty("error")
              ) {
                functionsObj.error(err.message);
              }
            },
          },

          (jwtAuth = false),
          (recursion = true)
        );
        return new Promise(() => null);
      }

      if (response.status >= 200 && response.status < 500) {
        return response.json();
      }
      throw new Error((message = response.responseText));
    })
    .then((data) => {
      if (data !== null) {
        //   console.log(data);
        if (responseStatus >= 400 && responseStatus < 500) {
          throw new Error((message = JSON.stringify(data)));
        }
        if (
          typeof functionsObj === "object" &&
          functionsObj.hasOwnProperty("ok")
        ) {
          functionsObj.ok(data);
        }
      } else {
        console.log("null");
      }
    })
    .catch((error) => {
      // to clear exit when use recursion
      console.log(error);
      if (
        typeof functionsObj === "object" &&
        functionsObj.hasOwnProperty("error")
      ) {
        functionsObj.error(error.message);
      }
    });
};

// try to login
const login = (username, password, okFunction = null, errorFunction = null) => {
  // try to get new token
  fetchAPI(
    API_TOKEN,
    {
      username: username,
      password: password,
    },
    {
      ok: (data) => {
        sessionStorage.setItem(SS_JWT_ACCESS, data.access);
        localStorage.setItem(LS_JWT_REFRESH, data.refresh);
        if (okFunction !== null && okFunction !== undefined) okFunction();
      },
      error: () => {
        if (errorFunction !== null && errorFunction !== undefined)
          errorFunction();
      },
    }
  );
};

// get error text from error message
const getErrorTextFromMessage = (err, propertyArray) => {
  let errorText = "Invalid data";
  try {
    let obj = JSON.parse(err.replace("Error:", "").trim());
    if (typeof obj === "object") {
      for (let property of propertyArray) {
        if (obj.hasOwnProperty(property[0])) {
          errorText = obj[property[0]];
          property[1].focus();
          break;
        }
      }
    }
  } catch (e) {}
  return errorText;
};
