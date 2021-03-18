import Cookies from 'js-cookie'

const TokenKey = 'herbal_token'

export function getToken() {
  console.log('Cookies.get(TokenKey)' + Cookies.get(TokenKey))
  if(Cookies.get(TokenKey)){
	  console.log('Cookies.get(TokenKey)' + true)
  }else{
	  console.log('Cookies.get(TokenKey)' + false)
  }
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
