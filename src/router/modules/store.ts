export default [
    {
        path:'/store',
        redirect:'/store/setting',
        name:'store',
        meta:{
            title:'店铺管理',
            icon:'ShoppingTrolley'
            // permission:['/manage/user/index']
        },
        children:[
            {
                path:"/store/setting",
                name:'storeSetting',
                component: () => import ('@/views/store/setting.vue'),
                // 路由元信息
                meta:{
                    title:'店铺设置',
                    icon:'Setting'
                    // permission:['/manage/user/index']
                }
            },
            {
                path:'/store/address/index',
                name:'storeAddress',
                component:() => import ('@/views/store/address.vue'),
                meta:{
                    title:'地址管理',
                    icon:'School'
                }
            }
        ]
    }
]