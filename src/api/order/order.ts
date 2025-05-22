import request from '@/utils/request'

// 获取订单信息
export function getOrderList(params: object){
    return request({
        url: '/order/list',
        method:'get',
        params
    })
}
// 获取售后信息
export function getRefundList(params: object){
    return request({
        url: '/order.refund/list',
        method:'get',
        params
    })
}
