export default [
    {
        path:'/order',
        redirect:'/order/list/all',
        name:'Order',
        meta:{
            title:'订单管理',
            icon:'Document'
        },
        children:[
            {
                path:'/order/list/all',
                name:'OrderList',
                component: () => import ('@/views/order/all.vue'),
                meta:{
                    title:'订单列表',
                    icon:'Handbag'
                }
            },
            {
                path:'/order/refund/index',
                name:'OrderRefund',
                component: () => import ('@/views/order/refund.vue'),
                meta:{
                    title:'售后管理',
                    icon:'Headset'
                }
            }
        ]
    }
]