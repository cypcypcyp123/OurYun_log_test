<template>
    <p>服务承诺</p>
    <div class="topper">
        <el-button 
        color="#FF82DB" 
        :icon="Plus"
        class="addBtn"
        @click="toAdd"
        >新增</el-button>
        <el-input
        v-model="search"
        placeholder="请输入搜索信息"
        class="input-with-icon"
        @keydown.enter="getServiceList"
        >
        <template #append>
            <el-button 
            :icon="Search" 
            @click="getServiceList"
            />
        </template>
        </el-input>
    </div>
    <el-table 
    :data="serviceList" 
    style="width: 100%"
    v-loading="loading"
    element-loading-text="加载中..."
    stripe
    >
        <el-table-column prop="service_id" label="服务ID" width="180" sortable/>
        <el-table-column prop="name" label="服务名称" width="180" />
        <el-table-column prop="summary" label="概述" />
        <el-table-column width="100" label="是否默认">
            <template #default="scope">
                <el-tag v-if="scope.row.is_default === 0" type="danger">否</el-tag>
                <el-tag v-else type="success">是</el-tag>
            </template>
        </el-table-column>
        <el-table-column width="100" label="状态" sortable>
            <template #default="scope">
                <el-tag v-if="scope.row.status === 1" type="success">显示</el-tag>
                <el-tag v-else type="warning">隐藏</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="sort" width="100" label="排序" sortable/>
        <el-table-column prop="update_time" width="200" label="更新时间" sortable/>
        <el-table-column width="200" label="操作" >
            <template #default="scope">
                <el-button link type="primary" size="small" @click="toEdit(scope.row)">编辑</el-button>
                <el-button link type="danger" size="small" @click="toDialogDel(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <sDialog  ref="serviceDialog" @getServiceList="getServiceList"/>
    <comPagination 
        layout="total, prev, pager, next, jumper"
        :total="total" 
        :page-size="15"
        @CurrentChange="pageChange"
    />
</template>
<script setup lang="ts">
import Api from '@/api';
import { Plus, Search } from '@element-plus/icons-vue'
import comPagination from '@/components/comPagination.vue';
import sDialog from '@/views/goods/dialog/service-dialog.vue'

let pager = ref<number>(0)
const id = ref<number>()
const search = ref('')
const total = ref<number>(0)
const loading = ref<boolean>(false)
const serviceList = ref<object>()
onMounted(() => {
    getServiceList()
})

// 加载初始数据和搜索
const getServiceList = () => {
    loading.value = true
    Api.Goods.getServiceList(pager,search.value).then(res => {
        let {data:{list}} = res
        total.value = list.total
        serviceList.value = list.data
        loading.value = false
    }).catch(() => {})
}

const serviceDialog = ref()
const toEdit = (row:any) => {
    serviceDialog.value.openDialog(row)
}
const toAdd = () => {
    serviceDialog.value.openDialog()
}


const toDialogDel = (row:any) => {
    ElMessageBox.confirm(
        '确定要删除吗？删除后不可恢复',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            draggable: true,
        }
    )
    .then(async () => {
        id.value = row.service_id
        await Api.Goods.getServiceDel({serviceId: id.value})
        getServiceList()
        ElMessage({
            type: 'success',
            message: '删除成功！',
        })
        })
    .catch(() => {})
}

const pageChange = (page:any) => {
    pager = page
    getServiceList()
}

</script>
<style scoped>
.topper{
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
}
.input-with-icon{
    width: 40%;
}
</style>
