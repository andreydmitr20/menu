// storage
const LS_SS_PREFIX = "menu__";
const sessionStorageSet = (key, value) =>
  sessionStorage.setItem(LS_SS_PREFIX + key, value);
const sessionStorageGet = (key) => sessionStorage.getItem(LS_SS_PREFIX + key);
const sessionStorageRemove = (key) =>
  sessionStorage.removeItem(LS_SS_PREFIX + key);
const localStorageSet = (key, value) =>
  localStorage.setItem(LS_SS_PREFIX + key, value);
const localStorageGet = (key) => localStorage.getItem(LS_SS_PREFIX + key);
const localStorageRemove = (key) => localStorage.removeItem(LS_SS_PREFIX + key);

const LS_JWT_REFRESH = "jwt_refresh";
const SS_JWT_ACCESS = "jwt_access";

const SS_API_URL = "API_URL";

const LS_MINE_SEARCH = "MINE_SEARCH";

// api

const API_URL_PREFIX = "api/";
const API_URL_LOCAL = "http://127.0.0.1:8000/" + API_URL_PREFIX;

const API_TOKEN = "user/token/";
const API_TOKEN_REFRESH = "user/token/refresh/";

const API_USER_TEST = "user/test/";
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

const TEXT_ERROR_INVALID_VITAMINS_DATA = "Invalid vitamins data";
const TEXT_ERROR_SERVER_ERROR = "Server error";

const INGREDIENTS_PAGE_SIZE = 6;

//
const showElement = (element) => element.classList.remove("d-none");
const hideElement = (element) => element.classList.add("d-none");

//
const getApiUrl = () => {
  let link = window.location.href.toLowerCase();
  if (link.indexOf("file:") === 0) {
    return API_URL_LOCAL;
  } else {
    if (link.indexOf("www.") !== -1) link = link.replace("www.", "");
    let colonIndex = link.indexOf(":");
    let thirdSlashIndex = link.indexOf("/", colonIndex + 3);
    if (thirdSlashIndex === -1) thirdSlashIndex = 10000;
    link = link.substring(0, thirdSlashIndex) + "/" + API_URL_PREFIX;
    return link;
  }
};
//
let apiUrl = getApiUrl();

//
const strIsEmpty = (str) => {
  return str === null || str === undefined || str === "";
};

// get dictionary one time and keep them saved in sessionStorage
const getDict = (api, functionsObj) => {
  let dictString = sessionStorageGet(api);
  if (!strIsEmpty(dictString)) {
    try {
      let obj = JSON.parse(dictString);
      callFunctionFrom(functionsObj, "ok", obj);
      return;
    } catch (e) {}
  }

  //
  fetchAPI(api, "get", GET_SHORT, (jwtAuth = true), {
    ok: (data) => {
      try {
        sessionStorageSet(api, JSON.stringify(data));
        callFunctionFrom(functionsObj, "ok", data);
      } catch (e) {
        sessionStorageRemove(ssDict);
        callFunctionFrom(functionsObj, "error", TEXT_ERROR_SERVER_ERROR);
      }
    },
    error: (err) => callFunctionFrom(functionsObj, "error", err),
  });
};

const userLogout = () => {
  sessionStorageRemove(SS_JWT_ACCESS);
  localStorageRemove(LS_JWT_REFRESH);
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
  let jwtRefresh = localStorageGet(LS_JWT_REFRESH);
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
    (jwtAuth = false),
    {
      ok: (data) => {
        if (saveJwt) sessionStorageSet(SS_JWT_ACCESS, data.access);
        callFunctionFrom(functionsObj, "ok");
      },
      error: () => callFunctionFrom(functionsObj, "error"),
    }
  );
};

// if not authenticated, goto login.html
const checkAuth = () => {
  if (strIsEmpty(sessionStorageGet(SS_JWT_ACCESS))) {
    getAccessJwt(
      {
        error: () => {
          window.open("../html/login.html", "_self");
        },
      },
      true
    );
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
    event.preventDefault();
    startButtonPressAnimation(btn);
    setTimeout(clickFunction, 50, event);
  });
  return btn;
};

// fetch
async function fetchAPIStart(apiLink, apiMethod, body, jwtAuth = false) {
  // console.log("body", body);
  let fullUrl = apiUrl + apiLink;

  let headers = {
    "Content-Type": "application/json",
  };

  if (jwtAuth) {
    headers["Authorization"] = "Bearer " + sessionStorageGet(SS_JWT_ACCESS);
  }

  //   console.log([headers]);
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

  console.log(apiMethod.toUpperCase(), fullUrl);
  return await fetch(fullUrl, request);
}

//
async function fetchAPI(
  apiLink,
  apiMethod,
  body,
  jwtAuth = false,
  functionsObj
) {
  let response = await fetchAPIStart(apiLink, apiMethod, body, jwtAuth);
  // console.log("response:", response);
  if (response.status === 401) {
    // if can not get access token - > go to login page
    if (apiLink === API_TOKEN_REFRESH) {
      // userLogout();
      // window.open("./login.html", "_self");
      callFunctionFrom(functionsObj, "error", "Unauthorized");
      return;
    }

    // get access token
    // console.log("get access token");
    response = await fetchAPIStart(
      API_TOKEN_REFRESH,
      "post",
      { refresh: localStorageGet(LS_JWT_REFRESH) },
      (jwtAuth = false)
    );
    // console.log("access token:", response);
    if (response.status !== 200) {
      // did not get refresh token
      callFunctionFrom(functionsObj, "error", "Unauthorized");
      return;
    }
    // have got refresh token - > save and repeat fetch
    let data = await response.json();
    sessionStorageSet(SS_JWT_ACCESS, data.access);
    console.log("repeat fetch");
    response = await fetchAPIStart(apiLink, apiMethod, body, (jwtAuth = true));
  }

  // console.log(response);
  if (response.status >= 200 && response.status < 500) {
    if (response.status === 204) {
      callFunctionFrom(functionsObj, "ok", {});
      return;
    }
    // get data
    // console.log("get data");
    let data = await response.json();
    // console.log(data);
    if (data === null) data = {};
    if (response.status >= 400 && response.status < 500) {
      // error
      callFunctionFrom(functionsObj, "error", JSON.stringify(data));
      return;
    }
    // console.log("ok", data);
    callFunctionFrom(functionsObj, "ok", data);
    return;
  } else {
    // error
    callFunctionFrom(functionsObj, "error", response.responseText);
    return;
  }
}

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
    (jwtAuth = false),
    {
      ok: (data) => {
        sessionStorageSet(SS_JWT_ACCESS, data.access);
        localStorageSet(LS_JWT_REFRESH, data.refresh);
        callFunctionFrom(functionsObj, "ok", data);
      },
      error: (err) => callFunctionFrom(functionsObj, "error", err),
    }
  );
};

// // get error text from error message
// const getErrorTextFromMessage = (err, propertyArray) => {
//   let errorText = "Invalid data";
//   try {
//     let obj = JSON.parse(err.replace("Error:", "").trim());
//     if (typeof obj === "object") {
//       for (let property of propertyArray) {
//         if (obj.hasOwnProperty(property[0])) {
//           errorText = obj[property[0]];
//           property[1].focus();
//           break;
//         }
//       }
//     }
//   } catch (e) {}
//   return errorText;
// };

// get error text from error message
const getErrorTextFromMessage = (err, element) => {
  let errorText = "Invalid data";
  try {
    let obj = JSON.parse(err.replace("Error:", "").trim());
    if (typeof obj === "object") {
      let searchKey = Object.keys(obj)[0];
      element.querySelectorAll("input").forEach((inputElement) => {
        if (inputElement.dataset.field === searchKey) {
          inputElement.focus();
          errorText = obj[searchKey];
        }
      });
    }
  } catch (e) {
    console.log("parse JSON error");
  }
  return errorText;
};

const setText = (element, text) => (element.textContent = text);

// set focus to element in data-next="element-id" when press enter
// if  data-next="*element-id" then element will be clicked
const setFocusToNextField = (event) => {
  if (event.keyCode == 13) {
    let nextId = event.target.dataset.next;
    if (!strIsEmpty(nextId)) {
      event.preventDefault();
      if (nextId[0] === "*") {
        document.querySelector("#" + nextId.slice(1)).click();
      } else {
        document.querySelector("#" + nextId).focus();
      }
    }
  }
};
