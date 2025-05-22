<template>
    <div class="pag-group">
        <el-pagination 
            :layout="layout"
            :total="total" 
            :background="background"
            :page-size="pageSize"
            @size-change = "sizeChange"
            @prev-click = "prevClick"
            @next-click = "nextCkick"
            @current-change= "currentChange"
        />
    </div>


</template>
<script lang="ts" setup>

const props = withDefaults(defineProps<{
    layout?:string, // 组件布局，子组件名用逗号分隔
    total?:number, // 总条目数
    background?:boolean,// 是否添加背景色
    pageSize?:number, // 每页显示条目数
}>(), {
    layout:"total, sizes, prev, pager, next, jumper", // prev, pager, next, jumper, ->, total
    total: 50,
    background:false,
    pageSize: 15,
})

// emits自定义事件
const emit = defineEmits<{
    'SizeChange':[page:number],
    'CurrentChange':[page:number],
    'PrevClick':[page:number],
    'NextCkick':[page:number]
}>()
// element-plus
const currentChange = (page:number):void =>{
    emit('CurrentChange', page)
}
const sizeChange = (page:number):void =>{
    emit('SizeChange', page)
}
const prevClick = (page:number):void =>{
    emit('PrevClick', page)
}
const nextCkick = (page:number):void =>{
    emit('NextCkick', page)
}
</script>
<style scoped>

</style>