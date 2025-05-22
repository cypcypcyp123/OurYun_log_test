<template>
    <el-dialog 
    v-model="dialogFormVisible" 
    :title="userId ? '编辑管理员' : '新增管理员'"
    width="30%"
    @closed="beforeClosed"
    >
        <el-form
        ref="ruleFormRef"
        :model="addUserForm"
        :rules="rules"
        label-width="120px"
        >
        <el-form-item 
        label="管理员姓名："
        prop="real_name">
            <el-input 
            v-model="addUserForm.real_name" 
            placeholder="请输入管理员姓名"
            />
        </el-form-item>
        <el-form-item 
        label="用户名："
        prop="user_name"
        >
            <el-input 
            v-model="addUserForm.user_name" 
            placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item 
        label="所属角色："
        prop="roles"
        >
            <el-tree-select
                v-model="addUserForm.roles"
                :data="roleList"
                :props="defaultProps"
                :render-after-expand="false"
                node-key="role_id"
                multiple
                check-strictly
                show-checkbox
                style="width: 100%;"
            />
        </el-form-item>
        <el-form-item 
        label="用户密码："
        :prop=" userId !== null ? 'editRePassword' : 'password'"
        >
            <el-input
                v-model="addUserForm.password"
                type="password"
                placeholder="请输入用户密码"
                show-password
            />
        </el-form-item>
        <el-form-item 
        label="确认密码："
        :prop=" userId !== null ? 'editPassword' : 'password_confirm'"
        >
            <el-input
                v-model="addUserForm.password_confirm"
                type="password"
                placeholder="请再次输入密码"
                show-password
            />
        </el-form-item>
        <el-form-item label="排序：">
            <el-input-number
                v-model="addUserForm.sort"
                :min="90"
                :max="110"
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
            @click="submitUserForm(ruleFormRef)"
            color="#ff82db"
            >确认</el-button>
        </span>
        </template>
    </el-dialog>

</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Api from '@/api'
import { FormInstance, FormRules, ElMessage  } from 'element-plus'

let userId = ref(null)
const dialogFormVisible = ref(false)
let roleList = ref([])
const ruleFormRef = ref<FormInstance>()

// 接收父组件的刷新列表方法
const emit = defineEmits(['toGetUserList'])

onMounted(()=> {
    
})


interface IUserForm {
    real_name: string,
    user_name: string,
    roles: any,
    password: string,
    password_confirm: string,
    sort: number | string,
}
const addUserForm = ref<IUserForm>({
    real_name: '',
    user_name: '',
    roles: [],
    password: '',
    password_confirm: '',
    sort: 100,
})


// 自定义密码校验
const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        if (addUserForm.value.password_confirm !== '') {
        if (!ruleFormRef.value) return
        ruleFormRef.value.validateField('password_confirm', () => null)
        }
        callback()
    }
    }
    const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== addUserForm.value.password) {
        callback(new Error("两次输入密码不一致"))
    } else {
        callback()
    }
}

const rules = reactive<FormRules<IUserForm>>({
    real_name: [
        { required: true, message: '请输入管理员姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '长度应在2-10个字符', trigger: 'blur' },
    ],
    user_name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 10, message: '长度应在2-10个字符', trigger: 'blur' },
    ],
    roles: [
    {
        required: true,
        message: '请至少选择一个角色',
        trigger: 'change',
    },
    ],
    password: [
        { required: true, validator: validatePass, trigger: 'blur' },
        { min: 6, max: 15, message: '长度应在6-15个字符', trigger: 'blur' }
    ],
    password_confirm: [
        { required: true, validator: validatePass2, trigger: 'blur' },
        { min: 6, max: 15, message: '长度应在6-15个字符', trigger: 'blur' }
    ],
    edittPassword: [
        { required: false }
    ],
    editRePassword: [
        { required: false }
    ]

})

// 默认规则
const defaultProps = {
    children: 'children',
    label: 'role_name',
    value: 'role_id',
    disabled: 'disabled'
}


// 打开dialog
const openDialog = (rowInfo:any) => {
    dialogFormVisible.value = true
    if(rowInfo){
        userId.value = rowInfo.store_user_id
        addUserForm.value = {
            real_name: rowInfo.real_name,
            user_name: rowInfo.user_name,
            roles: rowInfo.roleIds,
            password: '',
            password_confirm: '',
            sort: rowInfo.sort,
        }
    }
}



const getRoleList = () => {
    Api.Role.getRoleList().then(res => {
        let {data:{list}} = res
        roleList.value = list
    }).catch(() => {})
}
getRoleList()




const submitUserForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if(userId.value !== null){
                Api.User.getEditUser({
                    form:addUserForm.value,
                    userId: userId.value
                }).then(() => {
                    ElMessage({
                    message: '修改成功！',
                    type: 'success',
                })
                }).catch(()=>{})
                
            } else {
                Api.User.getAddUser({form:addUserForm.value}).then(() => {
                ElMessage({
                    message: '添加成功！',
                    type: 'success',
                })
            }).catch(() => {})
            }
            // 使用父组件发送过来的方法
            emit('toGetUserList')
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
    userId.value = null
    addUserForm.value = {
            real_name: '',
            user_name: '',
            roles: '',
            password: '',
            password_confirm: '',
            sort: 100,
    }
}


defineExpose({
    beforeClosed,
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