<template>
    <el-radio-group v-model="modelValue" class="radio-group">
        <el-radio 
        v-for="item in options" 
        :key="item.value" 
        :label="item.value"
        >{{ item.label }}</el-radio>
    </el-radio-group>
</template>
<script setup lang="ts">
import { defineModel } from 'vue';
import { piniaStore } from '@/store'

let { dictsSource } = storeToRefs(piniaStore.useRadioInfo)
const modelValue = defineModel()

const props = withDefaults(defineProps<{
    type:string
}>(),{

})

let options = computed<Array<radioInfo>>(() => dictsSource.value[props.type])


</script>
<style lang="scss" scoped>


</style>