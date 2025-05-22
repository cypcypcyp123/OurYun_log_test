import request from '@/utils/request'

// 登录
export function login(username:any,password:any){
    const data = {
        username,
        password
    }
    
    return request({
        url:'/passport/login',
        method:'post',
        data
    })
}
// 登出
export function logout(){
    return request({
        url:'/passport/logout',
        method:'post'
    })
}

// 获取商城信息
export function getStoreInfo(){
    return request({
        url: '/store/info',
        method: 'get'
    })
}


// 获取用户信息 - 菜单和按钮权限
export function getUserInfo(){
    return request({
        url: '/store.user/info',
        method:'get',
    })
}






