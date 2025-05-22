<template>
    <div v-for="(item, index) in routeMenu" :key="index">

            <el-sub-menu 
            :index="item.path" 
            v-if="item.children">
                <template #title>
                    <el-icon>
                        <component :is="item.meta.icon"/>
                    </el-icon>
                    <span>
                        {{ item.meta ? item.meta.title : item.name }}
                    </span>
                </template>
                <div v-for="(child, indexs) in item.children" >
                    <!-- 过滤 把带Second的过滤掉 -->
                    <el-menu-item 
                    v-if="!child.name.includes('Second')"
                    :index="child.path" 
                    :key="indexs"
                    >
                        <el-icon>
                            <component :is="child.meta.icon" />
                        </el-icon>
                        <span>{{ child.meta ? child.meta.title : child.name }}</span>
                    </el-menu-item>
                </div>
            </el-sub-menu>
            <el-menu-item 
            :index="item.path" 
            v-else>
                <el-icon>
                    <component :is="item.meta.icon"/>
                </el-icon>
                <span>
                    {{ item.meta ? item.meta.title : item.name }}
                </span>
            </el-menu-item>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

// // 从sessionStorage中获取并转换为数组

var routeMenu = ref()
var JSONMenu = sessionStorage.getItem("permission");
setTimeout(() => {
    routeMenu.value = JSON.parse(JSONMenu).addRoutes
},0)



</script>
<style scoped lang="scss">
.is-active{
    background-color: rgb(255, 130, 219) !important;
    color: #fff !important;
}


</style>
