<template>
    <p>管理员列表</p>
    <div class="topper">
        <el-button 
        color="#FF82DB" 
        :icon="Plus"
        @click="toAddUser"
        class="addBtn"
        >新增</el-button>
        <el-input
        v-model="search"
        placeholder="请输入搜索信息"
        class="input-with-icon"
        @keydown.enter="toGetUserList"
        >
        <template #append>
            <el-button 
            :icon="Search" 
            @click="toGetUserList"
            />
        </template>
        </el-input>
    </div>
    <el-table 
    v-loading="loading"
    element-loading-text="加载中..."
    :data="userList" 
    stripe 
    style="width: 100%"
    height="600px"
    size="large"
    >
        <el-table-column 
        prop="store_user_id" 
        label="管理员ID" 
        width="200" 
        sortable
        >
        </el-table-column>
        <el-table-column 
        prop="user_name" 
        label="用户名" 
        width="200" 
        >
        </el-table-column>
        <el-table-column 
        prop="real_name" 
        label="姓名" 
        width="300"
        >
        <template #default="scope">
            {{ scope.row.real_name }}
            <el-tag 
            :type="scope.row.is_super ? 'danger' : 'success'"
            size="small"
            >
            {{ scope.row.is_super ? '超级管理员' : getRoler(scope.row) }}
            </el-tag>
        </template>
        </el-table-column>
        <el-table-column 
        prop="sort" 
        label="排序" 
        width="150"
        sortable
        >
        </el-table-column>
        <el-table-column 
        prop="update_time" 
        label="添加时间" 
        sortable
        >
        </el-table-column>
        <el-table-column 
        label="操作" 
        width="200"
        >
            <template #default="scope">
                <el-button link type="primary" size="small" @click="toEdit(scope.row)">编辑</el-button>
                <el-button v-if="!scope.row.is_super" link type="danger" size="small" @click="toDialogDel(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="example-pagination-block">
        <comPagination
            layout="total, prev, pager, next, jumper" 
            :total="total" 
            @CurrentChange="pageChange"
            :page-size="15"
        />
    </div>
    <el-dialog
        title="提示"
        v-model="dialogVisible"
        width="30%">
        <span>确认删除吗？</span>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteInfo()">确 定</el-button>
        </span>
        </template>
    </el-dialog>
    <uDialog ref="userDialog" @toGetUserList="toGetUserList"></uDialog>
</template>
<script setup lang="ts">
import Api from '@/api'
import { onMounted, ref } from 'vue';
import { Plus, Search } from '@element-plus/icons-vue'
import uDialog from '@/views/manage/dialog/user-dialog.vue'
import { ElMessage } from 'element-plus'
import comPagination from '@/components/comPagination.vue';

let pager = ref(0)
let userId = ref(null)
const search = ref('')
const userList = ref<Array<Object>>([]) 
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)

onMounted(() => {
    toGetUserList()
})

// 打开新增dialog
const userDialog = ref()
const toAddUser = () => {
    userDialog.value.openDialog()
}

// 打开编辑dialog
const toEdit = (row:object) => {
    userDialog.value.openDialog(row)
}


// 加载初始数据和搜索
const toGetUserList = () => {
    loading.value = true
    Api.User.getUserList(pager,search.value).then(res => {
        let {data:{list}} = res
        total.value = list.total
        userList.value = list.data
        loading.value = false
    }).catch(() => {})
}

const pageChange = (page:any) => {
    pager = page
    toGetUserList()
}


// 打开删除弹窗
const toDialogDel = (row:any) => {
    userId.value = row.store_user_id
    dialogVisible.value = true
}

// 删除
const deleteInfo = () => {
    Api.User.getDelUser(userId.value).then(() => {
        ElMessage({
            message:'删除成功！',
            type: 'success'
        })

    }).catch(()=>{})
    toGetUserList()
    dialogVisible.value = false
}

// 获取标签信息 
const getRoler = (row:any) => {
    return row.role.map(item => item.role_name).join('-')
}







</script>
<style scoped lang="scss">
.topper{
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
}
.input-with-icon{
    width: 40%;
}
</style>
