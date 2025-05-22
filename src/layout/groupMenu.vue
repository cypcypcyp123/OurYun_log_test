<template>
    <el-menu 
        :default-active="$route.path"
        class="el-menu-vertical-demo" 
        :router="true"
        text-color="#ffffff"
        background-color="#001529"
        :collapse="isCollapse"
        >
            
            <el-scrollbar style="height: 100vh">
                <slide-menu>

                </slide-menu>
            </el-scrollbar>

        </el-menu>
</template>
<script setup lang="ts">
import slideMenu from './slideMenu.vue'
import { useRoute } from 'vue-router';
const $route = useRoute()
defineProps<{
    isCollapse:boolean
}>()



</script>
<style scoped lang="scss">

</style>
