
import axios from 'axios'

import { ref, watchEffect } from 'vue';

export const userService = {
  login,
  logout,
}

//const apiUrl = 'https://rtaxibackendtest.raynis.co'
const apiUrl = 'http://127.0.0.1:8080'

/* function login(email, password) {


  const requestOptions = {
    method: 'POST',
     headers: {
     'Content-Type': 'application/json'
    }, 
    withCredentials: true,    
    crossorigin: true,    
    mode: 'no-cors',    

    body: JSON.stringify({ email, password }),
  }


    const loginInfo = {email, password}
    return axios.post(`${apiUrl}/auth/login-dashboard`,
    {
      email:email,
      password:password
    }
  ,{
      headers: {
        'Content-Type': 'application/json',
    
      }
    }
    )
    .then(response => {
      console.log(response);
      let user = response.data
      if (user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        //localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('user', JSON.stringify(user))
        const userDroit = user.user_droits;

        // Set userDroit directly in useSideMenuStore
        useSideMenuStore.userDroit = userDroit;

        console.log("Valeur de la connexion ",    useSideMenuStore.userDroit);
     
 
      }
      return response
    })
    .catch(error => {
      console.log(error);
      return error
    });
    


} */


/* function getProfile() {
  //let user = JSON.parse(localStorage.getItem('user'));
  let user = JSON.parse(sessionStorage.getItem('user'))
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }
  return fetch(`${apiUrl}/image/${user.userAvatarCode}`, requestOptions).then(
    handleResponse,
  )
} */




async function login(email, password) {
  try {
    const response = await axios.post(
      `${apiUrl}/api/user/token/`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    let user = response.data;
    if (user.token) {
      localStorage.setItem('user', JSON.stringify(user));
    
 
    }

    return response;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('userDroit')


 
}



function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout()
     
      }
      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }
    return data
  })
}
