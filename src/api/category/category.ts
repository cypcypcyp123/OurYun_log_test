import request from '@/utils/request'

// 获取商品分类列表11123331
export function getCategoryList(){
    return request({
        url: '/category/list',
        method:'get'
    })
}

// 删除商品分类
export function getDelCategory(data:object){
    return request({
        url: '/category/delete',
        method:'post',
        data
    })
}

// 编辑商品分类
export function getEditCategory(data:object){
    return request({
        url: '/category/edit',
        method:'post',
        data
    })
}

// 新增商品分类
export function getAddCategory(data:object){
    return request({
        url: '/category/add',
        method:'post',
        data
    })
}