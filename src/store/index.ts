
// // 引入pinia和持久化插件
// import { createPinia } from 'pinia'
// import piniaPersist from 'pinia-plugin-persistedstate'

// import usePermissStore from '@/store/modules/usePermissStore'


// // 创建pinia
// const pinia = createPinia()

// // 定义一个pinia仓库对象，来接受上方引入的仓库模块
// const piniaStore = {}

// // 定义安装的插件
// const store = {
//     install(app:any){
//         app.use(pinia.use(piniaPersist))
//         // 提取接收过来的仓库
//         piniaStore.usePermissStore = usePermissStore()
//     }
// }

// export {
//     store,
//     piniaStore
// }


import usePermissStore from './modules/usePermissStore'
import useRadioInfo from './modules/useRadioInfo'

import { createPinia } from "pinia";
import piniaPersist from 'pinia-plugin-persistedstate'

// !创建pinia
const pinia = createPinia()
// !定义piniaStore 仓库对象

interface IUser{
    [propName:string]:any
}
const piniaStore:IUser = {}

// !定义安装函数的对象
const store = {
    install(app:any){
        app.use(pinia.use(piniaPersist))
        piniaStore.useRadioInfo = useRadioInfo()
        piniaStore.usePermissStore = usePermissStore()
    }
}

export {
    store,
    piniaStore
}



