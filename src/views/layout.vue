<template>
        <el-container>
        <el-aside :class="{'isCollAside' : isCollapse}">
            <div class="store-tit" :class="{'isCollTitle' : isCollapse}">
                
                <h3><img src="/vite.svg" alt="">{{ storeName }}</h3>
            </div>
            <group-menu :isCollapse="isCollapse">

            </group-menu>
        </el-aside>

        <el-container>
            <el-header>
                <div class="lefter">
                    <el-button
                    class="half-slide"
                    size="small"
                    :icon="Operation"
                    @click="halfSlide"
                    >
                    </el-button>
                    <bread-crumb></bread-crumb>
                </div>
                <el-text>
                    <el-dropdown>
                        <span class="el-dropdown-link">
                        <el-avatar :size="30" :src="circleUrl" />
                            {{ userNamer }}
                        </span>

                        
                        <arrow-down />
                        <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>账户设置</el-dropdown-item>
                            <el-dropdown-item @click="toLogout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-text>
            </el-header>
            <el-main>
                <!-- <keep-alive> -->
                    <router-view></router-view>
                <!-- </keep-alive> -->
            </el-main>
        </el-container>
        </el-container>
        <el-dialog
            title="友情提示"
            width="30%"
            v-model="dialogVisible"
        >
            <span>确认要退出登录吗？</span>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button 
                type="primary" 
                @click="logout"
                v-loading.fullscreen.lock="fullscreenLoading"
                >
                确定
                </el-button>
            </span>
            </template>
        </el-dialog>
        </template>
<script setup lang="ts">
import groupMenu from '@/layout/groupMenu.vue';
import { removeToken } from '@/utils/auth'

import router from '@/router';
import breadCrumb from '@/plugins/components/breadCrumb.vue';
import { ElNotification, ElText } from 'element-plus';
import { ArrowDown, Operation } from '@element-plus/icons-vue/global';
import { ref, onMounted } from 'vue';
import Api from '@/api';

const circleUrl:string = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const storeName = ref<String>()
const dialogVisible = ref(false)
const userNamer = ref()
const isCollapse = ref(false)
var JSONUser = sessionStorage.getItem("sessionObj");


setTimeout(() => {
    userNamer.value = JSON.parse(JSON.parse(JSONUser).data).username
},0)
onMounted(() => {
    Api.Login.getStoreInfo().then(res => {
        let {data:{storeInfo}} = res
        storeName.value = storeInfo.store_name
    }).catch()
})


const $router:any = router
const toLogout = () =>{
    dialogVisible.value = true
}
const fullscreenLoading = ref(false)
const logout = ():void => {
    fullscreenLoading.value = true
    Api.Login.logout().then(() => {
        sessionStorage.clear()
        removeToken()
        ElNotification({
            title: '操作成功',
            message:'希望再次与你相见',
            type: 'success',
            duration:2000
        })
        fullscreenLoading.value = false
    $router.go('/login')
    }).catch()
}

const halfSlide = () => {
    isCollapse.value = !isCollapse.value
}





</script>
<style scoped lang="scss">
$bg-color: #ffffff;
    .el-menu--collapse::v-deep{
        .el-menu-item span{
            display: none;
        }
        .el-sub-menu span,
        .el-sub-menu .el-sub-menu__icon-arrow{
            display: none;
        }
    }
    img{
        width: 25px;
    }
    .el-header {
    background-color: $bg-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.2);
    }

    .el-aside {
    background-color: #001529;
    height: 100vh;
    overflow: hidden;
    transition: all .3s ease 0s;
    min-width: 160px;
    max-width: 200px;
    &.isCollAside{
        min-width: 64px;
        max-width: 64px;
    }
    
    .store-tit {
        position: sticky;
        top: 0;
        width: 200px;
        font-size: 15px;
        color: #ffffff;
        padding:20px 0;
        text-align: center;
        z-index: 1;
        background-color: #001529;
        h3{
            display: flex;
            align-items: center;
            padding-left: 15px;
        }
        &.isCollTitle h3{
            color: transparent;
            padding: 0;
        }
        &.isCollTitle img{
            width: 30px;
            margin-left: 15px;
        }
        img{
            width: 20px;
            vertical-align: middle;
            margin-right: 8px;
        }
    }
    }

    .el-main {
    height: 0;
    background-color: $bg-color;
    margin: 15px 20px 0;
    padding: 20px;
    }
    .asideList{
        margin-top: 30px;
    }
    .el-text{
        display: flex;
        text-align: center;
        cursor: pointer;
        width: 120px;
        justify-content: center;
        height: 100%;
        align-items: center;
    }
    .el-text:hover{
        background-color: #f0f2f5;
    }
    .el-dropdown-link{
        display: flex;
        align-items: center;
    }
    .el-avatar{
        margin: 0 10px;
    }
    .example-showcase .el-dropdown-link {
        cursor: pointer;
        color: var(--el-color-primary);
        display: flex;
        align-items: center;
    }
    .lefter{
    display: flex;
    align-items: center;
    .half-slide{
        margin-right: 10px;
    }
}

</style>
