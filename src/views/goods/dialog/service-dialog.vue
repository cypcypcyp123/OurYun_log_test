<template>
    <el-dialog 
        v-model="dialogFormVisible" 
        :title="serviceId ? '编辑服务信息' : '新增服务信息'"
        width="30%"
        @closed="beforeClosed"
        >
        <el-form
        ref="ruleFormRef"
        :model="serviceForm"
        label-width="120px"
        :rules="rules"
        >
        <el-form-item 
        label="服务名称："
        prop="name">
            <el-input 
            v-model="serviceForm.name" 
            placeholder="请输入服务名称"
            />
        </el-form-item>
        <el-form-item
            label="概述"
        >
        <el-input
            v-model="serviceForm.summary"
            :rows="4"
            type="textarea"
            placeholder="请输入商品描述（300字符以内）"
        />
        </el-form-item>
        <el-form-item label="是否默认：" prop="is_default">
            <radioGroup
                type="is_default"
                v-model="serviceForm.is_default"
            />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
            <radioGroup
                type="category_status"
                v-model="serviceForm.status"
            />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
            <inputNumber
                v-model="serviceForm.sort"
                :min="1"
                controls-position="right"
                style="width: 40%;"
            />
        </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button 
            @click="dialogFormVisible = false" 
            class="cancel"
            >取消</el-button>
            <el-button 
            type="primary" 
            @click="submitService(ruleFormRef)"
            color="#ff82db"
            >确认</el-button>
        </span>
        </template>
    </el-dialog>


</template>
<script setup lang="ts">
import { ref } from 'vue'
import inputNumber from '@/components/inputNumber.vue'
import radioGroup from '@/components/radioGroup.vue'
import { ElMessage, FormRules, FormInstance  } from 'element-plus'
import Api from '@/api'
const ruleFormRef = ref<FormInstance>()

const dialogFormVisible = ref(false)
const serviceId = ref(null)
const emit = defineEmits(['getServiceList'])


const rules = reactive<FormRules<IRuleForm>>({
    name: [
        { required: true, message: '请输入服务名称', trigger: 'blur' },
        { min: 2, max: 10, message: '长度应在2-10个字符', trigger: 'blur' },
    ],
    status: [
        { required: true, message: '请选择服务状态', trigger: 'change' }
    ],
    is_default: [
        { required: true, message: '请选择服务是否默认', trigger: 'change' }
    ],
    sort: [
        { required: true, message: '请选择服务顺序', trigger: 'change',}
    ]
})

interface IRuleForm {
    is_default: number,
    name: string,
    status: number,
    sort: number | string,
    summary: string
}
const serviceForm = ref<IRuleForm>({
    is_default: 1,
    name: '',
    status: 1,
    sort: 100,
    summary: ''
})

const submitService = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            if(serviceId.value !== null){
                await Api.Goods.getServiceEdit({
                    form:serviceForm.value,
                    serviceId: serviceId.value
                })
                ElMessage({
                    message: '修改成功！',
                    type: 'success',
                })
            } else {
                await Api.Goods.getServiceAdd({form:serviceForm.value})
                ElMessage({
                    message: '添加成功！',
                    type: 'success',
                })
            }
            dialogFormVisible.value = false

            // 使用父组件发送过来的方法
            emit('getServiceList')
            // 重置表单校验规则
            formEl.resetFields()
        } else {
            return false
        }
    })
}



// 打开dialog
const openDialog = (rowInfo:any) => {
    // 请求菜单列表
    dialogFormVisible.value = true
    if(rowInfo){
        serviceId.value = rowInfo.service_id
        serviceForm.value = {
            is_default: rowInfo.is_default,
            name: rowInfo.name,
            status: rowInfo.status,
            sort: rowInfo.sort,
            summary: rowInfo.summary
        }
    }
    

}



const beforeClosed = () => {
    // 重置rule规则
    ruleFormRef.value.resetFields()
    serviceId.value = null
    serviceForm.value = {
        is_default: 1,
        name: '',
        status: 1,
        sort: 100,
        summary: ''
    }
}

defineExpose({
    openDialog
})
</script>
<style scoped lang="scss">
.cancel{
    color: #000 !important;
}
.el-button{
    color: #fff;
}

</style>