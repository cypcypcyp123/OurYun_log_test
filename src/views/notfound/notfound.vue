<template>
    <el-empty description="页面找不到了~" >
        <el-button type="primary" @click="toIndex">返回首页</el-button>
    </el-empty>
</template>
<script setup lang="ts">
const $router = useRouter()
const toIndex = () => {
    $router.replace('/')
}



</script>
<style scoped>

</style>
