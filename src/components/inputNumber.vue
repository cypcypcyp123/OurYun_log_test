<template>
    <div class="container">
        <el-input-number
        v-model="moduleValue"
        class="numberInput"
        :min="min"
        :max="max"
        :controls-position="controlsPosition"
        :precision="precision"
        :step="step"
    />
        <div class="tips">
            {{ tips }}
        </div>
    </div>
</template>
<script setup lang="ts" name="inputNumber">
    import { defineModel } from 'vue';
    const moduleValue = defineModel()
    withDefaults(defineProps<{
        controlsPosition?:string, // 按钮位置
        tips?:string, // 末尾信息
        min?:number | string,
        max?:number | string,
        precision?:number, //精度位数
        step?:number
    }>(),{
        controlsPosition:'',
        tips:'',
        step:1
    })

</script>
<style lang="scss" scoped>
    .container{
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .numberInput{
        width: 70%;
    }

</style>