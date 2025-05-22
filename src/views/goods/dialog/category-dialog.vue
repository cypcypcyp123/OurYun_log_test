<template>
    <el-dialog 
        v-model="dialogFormVisible" 
        :title="categoryId ? '编辑分类' : '新增分类'"
        width="30%"
        @closed="beforeClosed"
        >
        <el-form
        ref="ruleFormRef"
        :model="addCategoryForm"
        :rules="rules"
        label-width="120px"
        >
        <el-form-item 
        label="分类名称："
        prop="name">
            <el-input 
            v-model="addCategoryForm.name" 
            placeholder="请输入分类名称"
            />
        </el-form-item>
        <el-form-item 
        label="上级分类："
        prop="parent_id"
        >
            <goodsCateTree 
                v-model="addCategoryForm.parent_id"
                :data="categoryList"
                check-strictly
                style="width: 100%;"
            />
        </el-form-item>

        <el-form-item label="状态：" prop="status">
            <radioGroup
                type="category_status"
                v-model="addCategoryForm.status"
            />
        </el-form-item>
        <el-form-item label="分类图片：">
            <update
                multiple
            />
        </el-form-item>
        <el-form-item label="排序：">
            <inputNumber
                v-model="addCategoryForm.sort"
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
import goodsCateTree from '@/components/goodsCateTree.vue'
import inputNumber from '@/components/inputNumber.vue'
import radioGroup from '@/components/radioGroup.vue'
import update from '@/components/update.vue'

const categoryId = ref(null)
const dialogFormVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
const categoryList = ref<Array<Object>>([])

// 接收父组件的刷新列表方法
const emit = defineEmits(['toGetCategoryList'])
onMounted(() => {
    getParents()
})


interface IRuleForm {
    parent_id: number | string,
    name: string,
    status: number,
    sort: number | string,
}
const addCategoryForm = ref<IRuleForm>({
    parent_id: 0,
    name: '',
    status: 1,
    sort: 100,
})

const rules = reactive<FormRules<IRuleForm>>({
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { min: 2, max: 10, message: '长度应在2-10个字符', trigger: 'blur' },
    ],
    parent_id: [
    {
        required: true,
        message: '请选择上级分类',
        trigger: 'change',
    },
    ],
    status: [
        {
            required: true,
            message: '请选择分类状态',
            trigger: 'change',
        }
    ]
})

// 获取parent列表
const getParents = () => {
    Api.Category.getCategoryList().then(res => {
        let {data:{list}} = res
        list.unshift({
            category_id: 0,
            parent_id: 0,
            name: '顶级分类'
        })
        categoryList.value = list
    }).catch()
}




// 打开dialog
const openDialog = (rowInfo:any) => {
    // 请求菜单列表

    dialogFormVisible.value = true

    if(rowInfo){
        categoryId.value = rowInfo.category_id
        addCategoryForm.value = {
            parent_id: rowInfo.parent_id,
            name: rowInfo.name,
            status: rowInfo.status,
            sort: rowInfo.sort
        }

    }
}


// 新增或编辑
const submitCategoryForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            if(categoryId.value !== null){
                await Api.Category.getEditCategory({
                    form:addCategoryForm.value,
                    categoryId: categoryId.value
                })
                ElMessage({
                    message: '修改成功！',
                    type: 'success',
                })
            } else {
                await Api.Category.getAddCategory({form:addCategoryForm.value})
                ElMessage({
                    message: '添加成功！',
                    type: 'success',
                })

            }
            // 使用父组件发送过来的方法
            emit('toGetCategoryList')
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
    addCategoryForm.value = {
        parent_id: 0,
        name: '',
        status: 1,
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