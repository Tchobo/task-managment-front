import { authHeader } from "./auth-header";

export const userService = {
  login,
  logout,
  getProfile,
  /*register,
    getAll,*/
};

//const apiUrl = "https://rtaxibackendtest.raynis.co";
const apiUrl = "http://127.0.0.1:3000";
//const apiUrl = "http://192.168.1.102:3000";
let UserVeritable = ""
function login(tel, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: tel, password }),
  };

  return fetch(`${apiUrl}/auth/login-dashboard`, requestOptions)
    .then(handleResponse)
    .then((user) => {
    
      // login successful if there's a jwt token in the response
      if (user.tokenSalt) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        //localStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem("user", JSON.stringify(user));
        UserVeritable=user.user.droits
      }
      return user;
    });
}

function getProfile() {
  //let user = JSON.parse(localStorage.getItem('user'));
  let user = JSON.parse(sessionStorage.getItem("user"));
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return fetch(`${apiUrl}/image/${user.userAvatarCode}`, requestOptions).then(
    handleResponse
  );
}

function logout() {
  localStorage.removeItem("user");
}

/*function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };
    return fetch(`/users/register`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`/users`, requestOptions).then(handleResponse);
}*/

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
   
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}
