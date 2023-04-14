const LS_JWT_REFRESH = "jwt_refresh";
const API_TOKEN_GET = "api/token/";
const API_TOKEN_REFRESH = "api/token/refresh/";
const API_URL = "http://127.0.0.1:8000/";

let jwtAccess = "";

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
  fetch(API_URL + API_TOKEN_REFRESH, {
    method: "POST",

    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      refresh: jwtRefresh,
    }),
  })
    .then((response) => {
      //   console.log(response);
      if (response.status !== 200) throw new Error("Unathorized");
      return response.json();
    })
    .then((jwt) => {
      // console.log(jwt.access);
      jwtAccess = jwt.access;
      if (
        typeof functionsObj === "object" &&
        functionsObj.hasOwnProperty("ok")
      ) {
        functionsObj.ok();
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

// if not authenticated, goto index.html
const checkAuth = () => {
  getAccessJwt({
    error: () => {
      window.open("../index.html", "_self");
    },
  });
};
