// 配置管理员栏目的路由
export default [
    {
        path:'/manage',
        name:'Manage',
        redirect: '/manage/user/index',
        meta:{
            title:'管理员',
            icon:'User'
        },
        children:[
            {
                path:'/manage/user/index',
                name:'userIndex',
                component: () => import ('@/views/manage/user.vue'),
                // 路由元信息
                meta:{
                    title:'管理员列表',
                    icon:'Service'
                    // permission:['/manage/user/index']
                }
            },
            {
                path:'/manage/role/index',
                name:'roleIndex',
                component: () => import ('@/views/manage/role.vue'),
                // 路由元信息
                meta:{
                    title:'角色管理',
                    icon:'Coordinate'
                    // permission:['/manage/user/index']
                }
            },
        ]
    },
    
]


























