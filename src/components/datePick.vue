<template>
    <div class="demo-date-picker">
        <el-date-picker 
        v-model="modelValue" 
        :type="type" 
        range-separator="~" 
        :start-placeholder="startPlaceholder"
        :end-placeholder="endPlaceholder" 
        :size="size" 
        :value-format="valueFormat"
        />
    </div>
</template>

<script lang="ts" setup>

const modelValue = defineModel()

withDefaults(defineProps<{
    size?: string, // 尺寸大小
    startPlaceholder?: string, // 开始的placeholder
    endPlaceholder?: string, // 结束的placeholder
    type?: string, // 类型
    valueFormat?: string, // 绑定日期的格式
}>(),{
    size: 'default', //'default' | 'large' | 'small'
    startPlaceholder: '请选择开始日期',
    endPlaceholder: '请选择结束日期',
    type: 'date', // year/month/date/dates/datetime/ week/datetimerange/daterange/ monthrange
    valueFormat: 'YYYY-MM-DD'
})

</script>

<style scoped>
.demo-date-picker {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
}

.demo-date-picker .block {
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
}

.demo-date-picker .block:last-child {
    border-right: none;
}

.demo-date-picker .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
}
</style>