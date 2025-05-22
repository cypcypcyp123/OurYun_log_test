import request from '@/utils/request'

// 获取用户管理列表
export function getUserList<T>(page:T, search?:string | number){
    return request({
        url: '/store.user/list',
        method:'get',
        params:{
            page,
            search
        }
    })
}
// 新增用户信息
export function getAddUser(data:object){
    return request({
        url: '/store.user/add',
        method:'post',
        data
    })
}
// 编辑用户信息
export function getEditUser(data:object){
    return request({
        url: '/store.user/edit',
        method:'post',
        data
    })
}
// 删除用户信息
export function getDelUser(data:object){
    return request({
        url: '/store.user/delete',
        method:'post',
        data
    })
}