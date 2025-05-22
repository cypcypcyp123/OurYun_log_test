<template>
    <el-dialog 
        v-model="dialogFormVisible" 
        :title="roleId ? '编辑角色' : '新增角色'"
        width="30%"
        @closed="beforeClosed"
        >
        <el-form
        ref="ruleFormRef"
        :model="addRoleForm"
        :rules="rules"
        label-width="120px"
        >
        <el-form-item 
        label="角色名称："
        prop="role_name">
            <el-input 
            v-model="addRoleForm.role_name" 
            placeholder="请输入角色名称"
            />
        </el-form-item>
        <el-form-item 
        label="上级角色"
        prop="parent_id"
        >
            <el-tree-select
                ref=""
                v-model="addRoleForm.parent_id"
                :data="roleList"
                :props="defaultProps"
                :render-after-expand="false"
                check-strictly
                style="width: 100%;"
                placeholder="请选择所属角色"
            />
        </el-form-item>

        <el-form-item label="菜单权限">
            <el-tree
                :data="menuList"
                show-checkbox
                check-strictly
                node-key="menu_id"
                ref="treeRef"
                highlight-current
                :props="menuProps"
                :default-checked-keys="defaultChecked"
            >
            </el-tree>
        </el-form-item>
        <el-form-item label="排序：">
            <el-input-number
                v-model="addRoleForm.sort"
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
            @click="submitRoleForm(ruleFormRef)"
            color="#ff82db"
            >确认</el-button>
        </span>
        </template>
    </el-dialog>

</template>
<script setup lang="ts">
import Api from '@/api'
import { onMounted, ref, reactive } from 'vue';
import { ElMessage, FormRules, FormInstance, ElTree  } from 'element-plus'

const roleId = ref(null)
const dialogFormVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
const menuList = ref<Array<Object>>([])
const defaultChecked = ref([])
const roleList = ref<Array<Object>>([])
const menuProps = {
    children: 'children',
    label: 'name',
}
// 接收父组件的刷新列表方法
const emit = defineEmits(['toGetRoleList'])
onMounted(() => {
    getParents()
})


interface IRuleForm {
    parent_id: number | string,
    role_name: string,
    menus: any,
    sort: number | string,
}
const addRoleForm = ref<IRuleForm>({
    parent_id: null,
    role_name: '',
    menus: [],
    sort: 100,
})

const rules = reactive<FormRules<IRuleForm>>({
    role_name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        { min: 2, max: 15, message: '长度应在2-15个字符', trigger: 'blur' },
    ],
    parent_id: [
    {
        required: true,
        message: '请选择上级角色',
        trigger: 'change',
    },
    ]
})

// 获取parent列表
const getParents = () => {
    Api.Role.getRoleList().then(res => {
        let {data:{list}} = res
        list.unshift({
            role_id: 0,
            parent_id: 0,
            role_name: '顶级角色'
        })
        roleList.value = list
    }).catch()
}

// 默认规则
const defaultProps = {
    children: 'children',
    label: 'role_name',
    value: 'role_id',
    disabled: 'disabled'
}


// 打开dialog
const openDialog = (rowInfo:any) => {
    // 请求菜单列表
    Api.Role.getMenuList().then(res => {
        let {data:{list}} = res
        menuList.value = list
    }).catch()
    dialogFormVisible.value = true

    if(rowInfo){
        defaultChecked.value = rowInfo.menuIds
        roleId.value = rowInfo.role_id
        addRoleForm.value = {
            parent_id: rowInfo.parent_id,
            role_name: rowInfo.role_name,
            menus: rowInfo.menuIds,
            sort: rowInfo.sort
        }

    }
}
const treeRef = ref<InstanceType<typeof ElTree>>()


// 新增或编辑
const submitRoleForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // 更新菜单数组
            addRoleForm.value.menus = treeRef.value!.getCheckedNodes(false, false).map(item => item.menu_id)
            if(roleId.value !== null){
                Api.Role.getEditRole({
                    form:addRoleForm.value,
                    roleId: roleId.value
                }).then(() => {
                    ElMessage({
                    message: '修改成功！',
                    type: 'success',
                })
                }).catch(()=>{})
            } else {
                console.log(addRoleForm.value);
                Api.Role.getAddRole({form:addRoleForm.value}).then(() => {
                ElMessage({
                    message: '添加成功！',
                    type: 'success',
                })
            }).catch(() => {})

            }
            // 使用父组件发送过来的方法
            emit('toGetRoleList')
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
    roleId.value = null
    defaultChecked.value = []
    menuList.value = []
    addRoleForm.value = {
        parent_id: null,
        role_name: '',
        menus: '',
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