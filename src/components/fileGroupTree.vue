<template>
    <el-tree-select
        v-model="modelValue"
        :data="goodsTreeInfo"
        :check-strictly="checkStrictly"
        :render-after-expand="false"
        :props="treeProps"
        :multiple="multiple"
        :show-checkbox="showCheckbox"
        :max-collapse-tags="maxCollapseTags"
        :collapse-tags="collapseTags"
        :clearable="clearable"
    />
</template>
<script setup lang="ts" name="goodsCateTree">
import Api from '@/api';
import { defineModel } from 'vue';
let goodsTreeInfo = ref<Array<object>>([])

const modelValue = defineModel()
onMounted(() => {
    getFileGroupList()
})

// 规定自定义更改属性
withDefaults(defineProps<{
    checkStrictly?: boolean, // 父节点是否可选中
    multiple?: boolean, // 是否可以多选
    showCheckbox?: boolean,
    maxCollapseTags?:string | number, // 最大展示条数
    collapseTags?:boolean, // 是否合并tag 
    clearable?:boolean, // 是否可清空
}>(), {
    checkStrictly: false,
    multiple: false,
    showCheckbox: false,
    maxCollapseTags: 5,
    collapseTags:false,
    clearable: false
})

const getFileGroupList = () => {
    Api.Files.getFileGroupList().then(res => {
        let {data:{list}} = res
        goodsTreeInfo.value = list
    })
}

const treeProps = reactive({
    label: 'name',
    value: 'group_id'
})

</script>
<style scoped lang="scss">


</style>