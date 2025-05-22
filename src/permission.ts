import router from "./router";
import { piniaStore } from "./store";
import { storeToRefs } from "pinia";
import NProgress from "nprogress";
import { getToken } from "./utils/auth";
import 'nprogress/nprogress.css'


// 路由白名单
const whiteList = ['/login']

router.beforeEach((to, from, next) =>{
    // 进度条开始
    NProgress.start()
    // 判断有无token
    if(getToken()){
        // 如果有token 路径切换之后 就直接跳转到 目标页面
        // 如果有token 还需要重置 如果跳到login页面 再回到内部业务页面
        if(to.path === '/login'){
            next({
                path: '/'
            })
            NProgress.done()
        } else {
            let { stateInfo } = storeToRefs(piniaStore.usePermissStore)
            let { getStoreUserInfo, setPermissionRouter } = piniaStore.usePermissStore
            
            if(!stateInfo.value.permissions){
                getStoreUserInfo().then(() => {}).catch(() => {})
            } else {
                setPermissionRouter()
            }
            next()
        }
    } else {
        if(whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})