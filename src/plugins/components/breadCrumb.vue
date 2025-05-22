<template>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in routeInfo" :to = "item.path">
            {{ item.title }}
            </el-breadcrumb-item>
        </el-breadcrumb>
</template>
<script lang="ts" setup name="breadCrumb">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const $route = useRoute()
const routeInfo = ref<Array<Object>>([])
watch($route, (o: any) => {
    routeInfo.value = o.matched.map(item => ({path:item.path, title: item.meta.title}))

},{
    immediate: true,
    deep: true
})


</script>
<style scoped lang="scss">


</style>