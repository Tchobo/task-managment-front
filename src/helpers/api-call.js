import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
//export const apiUrl = 'https://rtaxibackendtest.raynis.co' //Prod
export const apiUrl = "http://127.0.0.1:8080";  //Test locale
import store from "../store";
export async function apiRequest(
  method, // "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "LINK" | "UNLINK" | undefined,
  endPoint, // string,
  variables, // any,
  formData, //boolean
) {
  let authToken //: string | undefined | null = undefined;
  let userToken = localStorage.getItem('userToken')
  store.dispatch('setLoggedUserToken', userToken)
  //authToken = sessionStorage.getItem("token");
  authToken =userToken
  const router = useRouter();

  try {
    const options = {
      method,
      url: `${apiUrl}/${endPoint}`,
      data: variables,
      headers: {},
    }

    if (authToken) options.headers['authorization'] = `Token ${authToken}`

    if (formData)
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded'

    const resp = await axios(options)

    if (!resp) return resp

    return resp
  } catch (err) {
    console.error('[ERROR]:', err)
    const resp = err.response
    if (resp && resp.status === 401) {
      sessionStorage.removeItem('accessToken')
      router.push('/');
    } else {
      //throw new Error(err);
      return resp
    }
  }
}
