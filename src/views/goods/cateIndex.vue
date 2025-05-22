<template>
    <p>分类列表</p>
    <div class="topper">
        <el-button 
        color="#FF82DB" 
        :icon="Plus"
        @click="toAddCategory"
        class="addBtn"
        >新增</el-button>
    </div>
    <el-table
        v-loading="loading"
        element-loading-text="加载中..."
        :data="categoryList"
        style="width: 100%; margin-bottom: 20px"
        row-key="category_id"
        >
        <el-table-column prop="category_id" label="分类ID" sortable />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="status" label="状态" sortable >
            <template #default="scope">
                <el-tag v-if="scope.row.status === 1">显示</el-tag>
                <el-tag v-else type="warning">隐藏</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" sortable />
        <el-table-column prop="update_time" label="添加时间" sortable />
        <el-table-column label="操作">
        <template #default="scoped">
            <el-button link type="primary" @click="toEditCategory(scoped.row)">编辑</el-button>
            <el-button link type="danger" @click="toDelCategory(scoped.row)">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    <cDialog ref="categoryDialog" @toGetCategoryList="toGetCategoryList"></cDialog>
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
import cDialog from '@/views/goods/dialog/category-dialog.vue'
import Api from '@/api'
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus'

const loading = ref(false)
const categoryId = ref(null)
const categoryList = ref<Array<Object>>([])
const dialogVisible = ref(false)


onMounted(() => {
    toGetCategoryList()
})

// 获取列表数据
const toGetCategoryList = async() => {
    loading.value = true
    let {data:{list}} = await Api.Category.getCategoryList()
    categoryList.value = list
    loading.value = false
    
}

// 打开删除dialog
const toDelCategory = (row:any) => {
    categoryId.value = row.category_id 
    dialogVisible.value = true
}

// 真删
const deleteInfo = async () => {
    await Api.Category.getDelCategory(categoryId.value)
    ElMessage({
        message:'删除成功！',
        type: 'success'
    })
    toGetCategoryList()
    dialogVisible.value = false

}




const categoryDialog = ref()
// 打开新增dialog
const toAddCategory = () => {
    categoryDialog.value.openDialog()
}
// 打开编辑dialog
const toEditCategory = (row:any) => {
    categoryDialog.value.openDialog(row)
}






</script>
<style scoped lang="scss">

.topper{
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
}
</style>
