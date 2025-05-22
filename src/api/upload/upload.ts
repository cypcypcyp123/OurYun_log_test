import upRequest from '@/utils/upRequest'

// 上传图片
export function uploadImage(file){
    return upRequest({
        url: '/upload/image',
        method:'post',
        data:file
    })
}
// 上传视频
export function uploadVideo(file){
    return upRequest({
        url: '/upload/video',
        method:'post',
        data:file
    })
}