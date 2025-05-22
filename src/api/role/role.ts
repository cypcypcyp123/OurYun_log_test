import request from '@/utils/request'

// 获取角色管理列表
export function getRoleList(){
    return request({
        url: '/store.role/list',
        method:'get'
    })
}
// 获取菜单列表
export function getMenuList(){
    return request({
        url: '/store.menu/list',
        method:'get'
    })
}
// 新增角色
export function getAddRole(data:object){
    return request({
        url: '/store.role/add',
        method:'post',
        data
    })
}
// 编辑角色
export function getEditRole(data:object){
    return request({
        url: '/store.role/edit',
        method:'post',
        data
    })
}
// 删除角色
export function getDelRole(data:object){
    return request({
        url: '/store.role/delete',
        method:'post',
        data
    })
}