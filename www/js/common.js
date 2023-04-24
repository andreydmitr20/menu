const LS_SS_PREFIX = "menu__";
const LS_JWT_REFRESH = "jwt_refresh";
const SS_JWT_ACCESS = "jwt_access";

// api
// const API_URL = "http://memenu.me:80/api/";
const API_URL = "http://127.0.0.1:8000/api/";
// const API_URL = "http://3.213.174.126/api/";

const API_TOKEN = "user/token/";
const API_TOKEN_REFRESH = "user/token/refresh/";

const API_USER_LOGOUT = "user/logout/";
const API_USER_REGISTER = "user/register/";
const API_USER_CHANGE_PASSWORD = "user/change-password/";
const API_USER = "user/";

const GET_SHORT = "?short=1";
const API_DISH_VITAMINS = "dish/vitamins/";
const API_DISH_UNITS = "dish/units/";
const API_DISH_TAGS = "dish/tags/";
const API_DISH_INGREDIENTS = "dish/ingredients/";

const CSS_BUTTON_PRESS_ANIMATION = "button-press-animation";

const TEXT_ERROR_SERVER_ERROR = "Server error";

const INGREDIENTS_PAGE_SIZE = 6;

// border border-primary rounded
// const BODY_STYLE = "bg-warning";

// set same background-color
// const commonBody = document.querySelector("body");
// commonBody.addEventListener("loaded", () => {
//   BODY_STYLE.split(" ").forEach((style) => {
//     body.classList.add(style);
//   });
// });

//
const strIsEmpty = (str) => {
  return str === null || str === undefined || str === "";
};

// get dictionary one time and keep them saved in sessionStorage
const getDict = (api, functionsObj) => {
  let dictString = sessionStorage.getItem(LS_SS_PREFIX + api);
  if (!strIsEmpty(dictString)) {
    try {
      let obj = JSON.parse(dictString);
      callFunctionFrom(functionsObj, "ok", obj);
      return;
    } catch (e) {}
  }
  // load
  fetchAPI(
    api,
    "get",
    GET_SHORT,
    {
      ok: (data) => {
        try {
          sessionStorage.setItem(LS_SS_PREFIX + api, JSON.stringify(data));
          callFunctionFrom(functionsObj, "ok", data);
        } catch (e) {
          sessionStorage.removeItem(ssDict);
          callFunctionFrom(functionsObj, "error", TEXT_ERROR_SERVER_ERROR);
        }
      },
      error: (err) => callFunctionFrom(functionsObj, "error", err),
    },
    true
  );
};

const userLogout = () => {
  sessionStorage.removeItem(LS_SS_PREFIX + SS_JWT_ACCESS);
  localStorage.removeItem(LS_SS_PREFIX + LS_JWT_REFRESH);
};

//
const callFunctionFrom = (functionsObj, property, params) => {
  if (typeof functionsObj === "object" && functionsObj.hasOwnProperty(property))
    functionsObj[property](params);
};

// get access jwt token
// if ok then call functionsObj.ok()
// if error then call functionsObj.error()
// if saveJvt===true then save access token
const getAccessJwt = (functionsObj, saveJwt) => {
  let jwtRefresh = localStorage.getItem(LS_SS_PREFIX + LS_JWT_REFRESH);
  if (jwtRefresh === null || jwtRefresh === undefined) {
    callFunctionFrom(functionsObj, "error");
    return;
  }

  // check
  fetchAPI(
    API_TOKEN_REFRESH,
    "post",
    {
      refresh: jwtRefresh,
    },
    {
      ok: (data) => {
        if (saveJwt)
          sessionStorage.setItem(LS_SS_PREFIX + SS_JWT_ACCESS, data.access);
        callFunctionFrom(functionsObj, "ok");
      },
      error: () => callFunctionFrom(functionsObj, "error"),
    }
  );
};

// if not authenticated, goto index.html
const checkAuth = () => {
  //   getAccessJwt({
  //     error: () => {
  //       window.open("../html/index.html", "_self");
  //     },
  //   });
  if (strIsEmpty(sessionStorage.getItem(LS_SS_PREFIX + SS_JWT_ACCESS))) {
    window.open("../html/index.html", "_self");
  }
};

// buttonPress animation
const buttonPressEventListener = (event) => {
  event.target.removeEventListener("animationend", buttonPressEventListener);
  event.target.classList.remove(CSS_BUTTON_PRESS_ANIMATION);
};
const startButtonPressAnimation = (element) => {
  element.addEventListener("animationend", buttonPressEventListener);
  element.classList.add(CSS_BUTTON_PRESS_ANIMATION);
};

// action for button click with animation
const btnAction = (id, clickFunction) => {
  const btn = document.querySelector("#" + id);
  btn.addEventListener("click", (event) => {
    startButtonPressAnimation(btn);
    setTimeout(clickFunction, 50, event);
  });
  return btn;
};

// fetch data from api
const fetchAPI = (
  apiLink,
  apiMethod,
  body,
  functionsObj,
  jwtAuth = false,
  recursion
) => {
  // console.log("body", body);
  let fullUrl = API_URL + apiLink;

  let headers = {
    "Content-Type": "application/json",
  };
  if (jwtAuth) {
    headers["Authorization"] =
      "Bearer " + sessionStorage.getItem(LS_SS_PREFIX + SS_JWT_ACCESS);
  }

  //   console.log([headers]);
  let responseStatus = 200;
  let request = {
    method: apiMethod,

    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: headers,
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  };

  if (apiMethod.toLowerCase() === "get") {
    if (!strIsEmpty(body)) fullUrl += body;
  } else {
    request["body"] = JSON.stringify(body);
  }

  console.log(fullUrl);

  fetch(fullUrl, request)
    .then((response) => {
      responseStatus = response.status;

      //   console.log(response);
      if (response.status === 401 && recursion !== true) {
        console.log("get access token");
        fetchAPI(
          API_TOKEN_REFRESH,
          "post",

          {
            refresh: localStorage.getItem(LS_SS_PREFIX + LS_JWT_REFRESH),
          },
          {
            ok: (data) => {
              console.log("repeat fetch");
              sessionStorage.setItem(LS_SS_PREFIX + SS_JWT_ACCESS, data.access);
              fetchAPI(
                apiLink,
                apiMethod,
                body,
                functionsObj,
                (jwtAuth = true),
                (recursion = true)
              );
            },
            error: (err) => {
              // console.log("err");
              sessionStorage.removeItem(LS_SS_PREFIX + SS_JWT_ACCESS);
              callFunctionFrom(functionsObj, "error", err.message);
            },
          },

          (jwtAuth = false),
          (recursion = true)
        );
        return;
      }

      if (response.status >= 200 && response.status < 500) {
        // console.log(response);
        if (response.status === 204) return;
        return response.json();
      }
      throw new Error((message = response.responseText));
    })
    .then((data) => {
      // console.log("json", data);

      if (data !== null) {
        if (responseStatus >= 400 && responseStatus < 500) {
          throw new Error((message = JSON.stringify(data)));
        }
        callFunctionFrom(functionsObj, "ok", data);
      }
    })
    .catch((error) => {
      // to clear exit when use recursion
      console.log(error);
      callFunctionFrom(functionsObj, "error", error.message);
    });
};

// try to login
const login = (username, password, functionsObj) => {
  // try to get new token
  fetchAPI(
    API_TOKEN,
    "post",

    {
      username: username,
      password: password,
    },
    {
      ok: (data) => {
        sessionStorage.setItem(LS_SS_PREFIX + SS_JWT_ACCESS, data.access);
        localStorage.setItem(LS_SS_PREFIX + LS_JWT_REFRESH, data.refresh);
        callFunctionFrom(functionsObj, "ok", data);
      },
      error: (err) => callFunctionFrom(functionsObj, "error", err),
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
