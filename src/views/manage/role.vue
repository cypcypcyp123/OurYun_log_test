<template>
    <p>角色管理</p>
    <div class="topper">
        <el-button 
        color="#FF82DB" 
        :icon="Plus"
        @click="toAddRole"
        class="addBtn"
        >新增</el-button>
    </div>
    <el-table
        v-loading="loading"
        element-loading-text="加载中..."
        :data="roleList"
        style="width: 100%; margin-bottom: 20px"
        row-key="role_id"
        >
        <el-table-column prop="role_id" label="角色ID" sortable />
        <el-table-column prop="role_name" label="角色名称" />
        <el-table-column prop="sort" label="排序" sortable />
        <el-table-column prop="update_time" label="添加时间" sortable />
        <el-table-column label="操作">
        <template #default="scoped">
            <el-button link type="primary" @click="toEditRole(scoped.row)">编辑</el-button>
            <el-button link type="danger" @click="toDelRole(scoped.row)">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    <rDialog ref="roleDialog" @toGetRoleList="toGetRoleList"></rDialog>
    <el-dialog
        title="提示"
        v-model="dialogVisible"
        width="30%">
        <span>确认删除吗？</span>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteInfo">确 定</el-button>
        </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import rDialog from '@/views/manage/dialog/role-dialog.vue'
import Api from '@/api'
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus'

const loading = ref(false)
const roleId = ref(null)
const roleList = ref<Array<Object>>([])
const dialogVisible = ref(false)


onMounted(() => {
    toGetRoleList()
})

// 获取列表数据
const toGetRoleList = async() => {
    loading.value = true
    let {data:{list}} = await Api.Role.getRoleList()
    roleList.value = list
    loading.value = false
    
}

// 打开删除dialog
const toDelRole = (row:any) => {
    roleId.value = row.role_id 
    dialogVisible.value = true
}

// 真删
const deleteInfo = () => {
    Api.Role.getDelRole(roleId.value).then(() => {
        ElMessage({
        message:'删除成功！',
        type: 'success'
    })
    }).catch()
    toGetRoleList()
    dialogVisible.value = false

}




const roleDialog = ref()
// 打开新增dialog
const toAddRole = () => {
    roleDialog.value.openDialog()
}
// 打开编辑dialog
const toEditRole = (row:any) => {
    roleDialog.value.openDialog(row)
}












</script>
<style scoped lang="scss">
.topper{
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
}
</style>
