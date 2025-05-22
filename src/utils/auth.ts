import Cookies from "js-cookie";

const TokenKey = 'Admin-Token'

export function setToken(token: string){
    // 存cookie
    return Cookies.set(TokenKey, token)
}

export function getToken(){
    return Cookies.get(TokenKey)
}

export function removeToken(){
    return Cookies.remove(TokenKey)
}



















