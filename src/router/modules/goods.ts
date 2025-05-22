// 配置管理员栏目的路由
export default [
    {
        path:'/goods',
        name:'Goods',
        redirect: "/goods/index",
        meta:{
            title:"商品管理",
            icon:'Goods'
        },
        children:[
            {
                path:"/goods/index",
                name:'goodsIndex',
                component: () => import ('@/views/goods/index.vue'),
                // 路由元信息
                meta:{
                    title:'商品列表',
                    icon:'ShoppingBag'
                    // permission:['/manage/user/index']
                }
            },
            {
                // 可选传参
                path:"/goods/edit/:id?",
                name:'goodsEditSecond',
                component: () => import ('@/views/goods/goodsEdit.vue'),
                // 路由元信息
                meta:{
                    title:'商品信息',
                    // permission:['/manage/user/index']
                }
            },
            {
                path:"/goods/category/index",
                name:'goodsCategory',
                component: () => import ('@/views/goods/cateIndex.vue'),
                // 路由元信息
                meta:{
                    title:"商品分类",
                    icon:'Wallet'
                    // permission:['/manage/user/index']
                }
            },
            {
                path:"/goods/service/index",
                name:'goodsService',
                component: () => import ('@/views/goods/serviceIndex.vue'),
                // 路由元信息
                meta:{
                    title:'服务承诺',
                    icon:'Trophy'
                    // permission:['/manage/user/index']
                }
            },
            // {
            //     path:"/goods/comment/index",
            //     name:'goodsComment',
            //     component: () => import ('@/views/goods/comIndex.vue'),
            //     // 路由元信息
            //     meta:{
            //         title:"商品评价",
            //         icon:'Phone'
            //         // permission:['/manage/user/index']
            //     }
            // }
        ]
    },
    
]


























