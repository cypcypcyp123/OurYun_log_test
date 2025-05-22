import { createRouter, createWebHashHistory } from "vue-router";
// 引入所在路径的所有ts文件
let assRouter = import.meta.glob('./modules/*.ts',{ import: 'default', eager: true })


const navPath = () => {
    const _totPath = []
    Object.keys(assRouter).forEach( keys => {
        // 合并所有数据于 _totpath
        _totPath.unshift(...assRouter[keys])
    })
    return _totPath
}


const routes:any = [
    {
        path:'/',
        name: 'layout',
        redirect: '/index',
        component: () => import('@/views/layout.vue'),  //登录之后重定向到layout页面
        meta:{
            title:'首页',
            icon:'House'
        },
        children:[
            {
                path:'/index',
                name:'index',
                component: () => import ('@/views/index.vue'),
                meta:{
                    title:'首页',
                    icon: 'House'
                }
            },
            ...navPath()
        ]
    },
    {
        path:'/login',
        name:'Login',
        component: () => import ('@/views/login.vue')
    },
    {
        path:'/:pathMatch(.*)',
        name:'404',
        component: () => import('@/views/notfound/notfound.vue')
    }
]











const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router





