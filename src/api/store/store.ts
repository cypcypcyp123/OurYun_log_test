import request from '@/utils/request'

// 修改店铺信息
export function getStorepdate(data:object){
    return request({
        url: '/store/update',
        method:'post',
        data
    })
}

// 获取地址信息
export function getStoreAddressList<T>(page:T, search?:string | number, type?:number){
    return request({
        url: '/store.address/list',
        method:'get',
        params:{
            page,
            search,
            type
        }
    })
}

// 新增地址信息
export function getAddAddress(data:object){
    return request({
        url: '/store.address/add',
        method:'post',
        data
    })
}

// 编辑地址信息
export function getEditAddress(data:object){
    return request({
        url: '/store.address/edit',
        method:'post',
        data
    })
}

// 获取树形地区
export function getRegionTree(){
    return request({
        url: '/region/tree',
        method:'get'
    })
}

// 删除地址信息
export function getDelAddress(data:object){
    return request({
        url: '/store.address/delete',
        method:'post',
        data
    })
}