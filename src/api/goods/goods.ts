import request from '@/utils/request'

// 获取商品信息
export function getGoodsList(params: object){
    return request({
        url: '/goods/list',
        method:'get',
        params
    })
}

// 获取运费模板
export function getDeliveryAll(){
    return request({
        url: '/setting.delivery/all',
        method:'get'
    })
}

// 获取服务承诺
export function getServiceAll(){
    return request({
        url: '/goods.service/all',
        method:'get'
    })
}

// 商品新增
export function getGoodsAdd(data:object){
    return request({
        url: '/goods/add',
        method:'post',
        data
    })
}

// 商品删除
export function getGoodsDel(data:object){
    return request({
        url: '/goods/delete',
        method:'post',
        data
    })
}

// 商品编辑
export function getGoodsEdit(data:object){
    return request({
        url: '/goods/edit',
        method:'post',
        data
    })
}

// 商品详情--编辑用
export function getGoodsDetail(data:any){
    return request({
        url: '/goods/detail',
        method:'get',
        params:data
    })
}

// 获取服务承诺
export function getServiceList<T>(page:T, search?:string | number){
    return request({
        url: '/goods.service/list',
        method:'get',
        params:{
            page,
            search
        }
    })
}

// 删除服务承诺
export function getServiceDel(data:any){
    return request({
        url: '/goods.service/delete',
        method:'post',
        data
    })
}

// 新增服务承诺
export function getServiceAdd(data:any){
    return request({
        url: '/goods.service/add',
        method:'post',
        data
    })
}

// 编辑服务承诺
export function getServiceEdit(data:any){
    return request({
        url: '/goods.service/edit',
        method:'post',
        data
    })
}