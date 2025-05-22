<template>
    <el-dialog 
        v-model="dialogFormVisible" 
        title="新增分组"
        width="30%"
        @closed="beforeClosed"
        >
        <el-form
        ref="ruleFormRef"
        :model="addGroupForm"
        :rules="rules"
        label-width="120px"
        >
        <el-form-item 
        label="分组名称："
        prop="name">
            <el-input 
            v-model="addGroupForm.name" 
            placeholder="请输入分组名称"
            />
        </el-form-item>
        <el-form-item 
        label="上级分组："
        prop="parent_id"
        >
            <fileGroupTree 
                v-model="addGroupForm.parent_id"
                :data="categoryList"
                check-strictly
                style="width: 100%;"
            />
        </el-form-item>
        <el-form-item label="排序：">
            <inputNumber
                v-model="addGroupForm.sort"
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
            @click="submitCategoryForm(ruleFormRef)"
            color="#ff82db"
            >确认</el-button>
        </span>
        </template>
    </el-dialog>

</template>
<script setup lang="ts">
import Api from '@/api'
import { onMounted, ref, reactive } from 'vue';
import { ElMessage, FormRules, FormInstance  } from 'element-plus'
import fileGroupTree from '@/components/fileGroupTree.vue'
import inputNumber from '@/components/inputNumber.vue'


const categoryId = ref(null)
const dialogFormVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
const categoryList = ref<Array<Object>>([])

// 接收父组件的刷新列表方法
const emit = defineEmits(['getFileGroupList'])
onMounted(() => {
    getParents()
})


interface IRuleForm {
    parent_id: number | string,
    name: string,
    sort: number | string,
}
const addGroupForm = ref<IRuleForm>({
    parent_id: 0,
    name: '',
    sort: 100,
})

const rules = reactive<FormRules<IRuleForm>>({
    name: [
        { required: true, message: '请输入分组名称', trigger: 'blur' },
        { min: 2, max: 10, message: '长度应在2-10个字符', trigger: 'blur' },
    ],
    parent_id: [
    {
        required: true,
        message: '请选择上级分组',
        trigger: 'change',
    },
    ]
})

// 获取parent列表
const getParents = () => {
    Api.Files.getFileGroupList().then(res => {
        let {data:{list}} = res
        list.unshift({
            group_id: 0,
            parent_id: 0,
            name: '顶级分组'
        })
        categoryList.value = list
    }).catch()
}




// 打开dialog
const openDialog = () => {
    // 请求菜单列表

    dialogFormVisible.value = true


}


// 新增
const submitCategoryForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
                await Api.Files.addFileGroup({form:addGroupForm.value})
                ElMessage({
                    message: '添加成功！',
                    type: 'success',
                })
            // 使用父组件发送过来的方法
            emit('getFileGroupList')
            // 重置表单校验规则
            formEl.resetFields()
            dialogFormVisible.value = false
    
        } else {
            return false
        }
    })
}

const beforeClosed = () => {
    ruleFormRef.value.resetFields()
    categoryId.value = null
    addGroupForm.value = {
        parent_id: 0,
        name: '',
        sort: 100,
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