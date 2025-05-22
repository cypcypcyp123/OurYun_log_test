// 引入登陆的api
import router from "@/router";
import Api from '@/api'
import { defineStore } from "pinia";
import { ref } from "vue";

const usePermissionStore = defineStore('permission',()=>{
    let stateInfo = ref<any>({})
    let userInfo = ref<any>({})
    let addRoutes = ref<object>([])
    // 获取用户信息
    const getStoreUserInfo = ():any=>{
        return new Promise((resolve, reject) => {
            Api.Login.getUserInfo().then((res:any) =>{
                let {data:{ roles, userInfo}} = res
                stateInfo.value = roles
                userInfo.value = userInfo
                addRoutes.value = getPermissionRouter(stateInfo.value)
                resolve(stateInfo)
            }).catch((err:any) =>{
                reject(err)
            })
            
        })
    }
    const setPermissionRouter = ()=>{
        addRoutes.value = getPermissionRouter(stateInfo.value)
    }

    return{
        stateInfo,
        addRoutes,
        userInfo,
        getStoreUserInfo,
        setPermissionRouter
    }
},{
    persist:{
        storage: sessionStorage,
    }
})
function getPermissionRouter<T>(permissInfo: T) {
    let staticRouter: object[] = router.options.routes[0].children
    if(permissInfo.isSuper){
        // 超管走本地所有路由
        return staticRouter
    }else{
        // 非超管走过滤后本地路由
        return filterAsseccRouter<Array<object>,Array<object>>(permissInfo.permissions,staticRouter)
    }
}
function filterAsseccRouter<T,U>(permissionRouter:T, staticRouter:U) {
    interface IPermission {
        readonly permissionId: string,
        path?: string,
        [propName:string]: any
    }
    // 构造path
    permissionRouter.forEach((item:IPermission) => {
        item.path = item.permissionId
    });
    return treeMenuSource<T,U>(permissionRouter,staticRouter)
}
function treeMenuSource<T,U>(sructTreeData: T, staticRouter:U){
    let okayRouter:T = staticRouter.filter(a=>{
        for(let i = 0; i < sructTreeData.length; i++){
            if(a.path === sructTreeData[i].path){
                a.children && a.children.length > 0 &&(a.children = sendChildrenSource(a.children,sructTreeData))
                return a
            }
        }
    })
    return okayRouter
}
function sendChildrenSource<T,U>(Achild: T,SturChild: U) {
    // 从本地获取有权限的路由
    return Achild.filter(s => {
        for(let i = 0; i < SturChild.length;i++){
            if(s.path === SturChild[i].path){
                return s
            }
        }
    })
}


export default usePermissionStore
