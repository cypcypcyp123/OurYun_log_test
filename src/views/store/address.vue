<template>
    <p>地址管理</p>
    <div class="topper">
        <el-button 
        color="#FF82DB" 
        class="addBtn"
        :icon="Plus"
        @click="toAddAddress"
        >新增</el-button>
        <div class="topper-inner">
            <el-select v-model="typer" class="m-2" placeholder="请选择地址类型">
                <el-option
                v-for="item in addressType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                />
            </el-select>
            <el-input
            v-model="search"
            placeholder="请输入搜索信息"
            class="input-with-icon"
            @keydown.enter="toGetAddress"
            >
            <template #append>
                <el-button 
                :icon="Search"
                @click="toGetAddress"
                />
            </template>
            </el-input>
        </div>
    </div>
    <el-table
    v-loading="loading"
    element-loading-text="加载中..."
    :data="addressList" 
    stripe 
    style="width: 100%"
    size="large"
    >
        <el-table-column prop="address_id" label="地址ID" width="100" />
        <el-table-column prop="name" label="联系人姓名" width="180" />
        <el-table-column prop="phone" label="联系电话" width="180" />
        <el-table-column prop="full_address" label="详细地址" width="360" />
        <el-table-column label="地址类型" width="120">
                <template #default="scope">
                    <el-tag v-if="scope.row.type === 20" type="warning">退货地址</el-tag>
                    <el-tag v-else>发货地址</el-tag>
                </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="create_time" label="添加时间" width="200" />
        <el-table-column label="操作" width="180" >
            <template #default="scope">
                <el-button link type="primary" size="small" @click="toEdit(scope.row)">编辑</el-button>
                <el-button link type="danger" size="small" @click="toDialogDel(scope.row)">删除</el-button>
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
    <aDialog ref="addressDialog" @toGetAddress="toGetAddress"></aDialog>
</template>
<script setup lang="ts">
import Api from '@/api'
import { ref, onMounted } from 'vue';
import { Plus, Search } from '@element-plus/icons-vue'
import aDialog from './dialog/address-dialog.vue';
import comPagination from '@/components/comPagination.vue';

let pager = ref<number>(0)
let addressId = ref()
const dialogVisible = ref(false)
const loading = ref(false)
const search = ref('')
const typer = ref(0)
const total = ref(0)

const addressType = [
    {
        label: '全部',
        value: 0
    },
    {
        label:'退货地址',
        value: 20
    },
    {
        label: '发货地址',
        value: 10
    }
]

const addressList = ref<Array<Object>>()
onMounted(() => {
    toGetAddress()
})

// 获取数据
const toGetAddress = () => {
    loading.value = true
    Api.Store.getStoreAddressList(pager, search.value, typer.value).then(res => {
        let {data:{list}} = res
        total.value = list.total
        addressList.value = list.data
        loading.value = false
    })
}

const pageChange = (page:any) => {
    pager = page
    toGetAddress()
}

// 打开dialog
const addressDialog = ref()
const toAddAddress = () => {
    addressDialog.value.openDialog()
}

const toEdit = (row:object) => {
    
    addressDialog.value.openDialog(row)
}

// 打开删除弹窗
const toDialogDel = (row:any) => {
    addressId.value = row.address_id
    dialogVisible.value = true
}

// 删除
const deleteInfo = () => {
    Api.Store.getDelAddress(addressId.value).then(() => {
        ElMessage({
            message:'删除成功！',
            type: 'success'
        })
    }).catch(()=>{})
    dialogVisible.value = false
    toGetAddress()

}

</script>
<style scoped>
.topper{
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
}
.topper-inner{
    width: 500px;
}
.input-with-icon{
    margin-left: 20px;
    width: 50%;
}
</style>
