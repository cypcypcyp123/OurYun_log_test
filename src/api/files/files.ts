import request from '@/utils/request'

// 获取图片库分组
export function getFileGroupList(){
    return request({
        url: '/files.group/list',
        method:'get'
    })
}

// 获取图片库
export function getFilesList(params: object){
    return request({
        url: '/files/list',
        method:'get',
        params
    })
}

// 新增图片库分组
export function addFileGroup(data: object){
    return request({
        url: '/files.group/add',
        method:'post',
        data
    })
}

