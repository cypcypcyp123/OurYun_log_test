<template>
    <p>商品列表</p>
    <div class="topper">
        <el-form 
        :inline="true" 
        :model="goodsSearchForm" 
        class="demo-form-inline"
        :label-width="100"
        >
            <el-form-item label="商品名称：">
            <el-input v-model="goodsSearchForm.goodsName" placeholder="请输入名称" clearable />
            </el-form-item>
            <el-form-item label="商品编码：">
            <el-input v-model="goodsSearchForm.goodsNo" placeholder="请输入编码" clearable />
            </el-form-item>
            <el-form-item label="商品分类：">
                <goodsCateTree
                    v-model="goodsSearchForm.categoryId"
                    check-strictly
                    placeholder="请选择分类"
                />
            </el-form-item>
            <el-form-item>
            <el-button 
            type="primary"
            :icon="Search" 
            @click="getGoodsList"
            color="#ff82db"
            style="color: #fff;"
            >搜索</el-button>
            <el-button 
            plain 
            :icon="RefreshRight" 
            @click="resetGoodsList"
            >重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="top-radio-btn">
        <el-radio-group
        fill="#ff82db"
        v-model="goodsSearchForm.listType"
        @change="getGoodsList"
        >
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="on_sale">出售中</el-radio-button>
            <el-radio-button label="off_sale">已下架</el-radio-button>
            <el-radio-button label="sold_out">已售罄</el-radio-button>
        </el-radio-group>
        <el-button 
        type="primary" 
        :icon="Plus" 
        @click="toAddGoods"
        style="margin-left: 10px; color: #fff;"
        color="#ff82db"
        >新增商品</el-button>
    </div>
    <el-table 
    :data="goodsTable" 
    style="width: 100%"
    v-loading="loading"
    element-loading-text="加载中..."
    height="800"
    >
        <el-table-column type="selection" width="55"  />
        <el-table-column 
        prop="goods_id" 
        label="商品ID" 
        width="100" />
        <el-table-column 
        prop="goods_image" 
        label="商品图片" 
        width="150"
        align="center"
        >
            <template #default="scope">
                <el-image 
                    :src="scope.row.goods_image"  
                    :preview-src-list="[scope.row.goods_image]" 
                    :z-index="99"
                    hide-on-click-modal
                    preview-teleported
                    fit="cover"
                />
            </template>
        </el-table-column>
        <el-table-column 
        prop="goods_name" 
        label="商品名称" 
        width="150" />
        <el-table-column 
        prop="goods_price_max" 
        label="商品价格" 
        width="120" />
        <el-table-column 
        prop="sales_actual" 
        label="总销量" 
        width="120" />
        <el-table-column 
        prop="stock_total" 
        label="库存总量" 
        width="120" />
        <el-table-column 
        label="状态" 
        width="120">
            <template #default="scope">
                <el-tag v-if="scope.row.status === 20" type="danger">下架</el-tag>
                <el-tag v-else type="success">上架</el-tag>
            </template>
        </el-table-column>
        <el-table-column 
        prop="sort" 
        label="排序" 
        width="120" />
        <el-table-column 
        prop="update_time" 
        label="添加时间" />
        <el-table-column 
        fixed="right" 
        label="操作" 
        width="120"
        align="center"
        >
        <template #default="scope">
            <el-button link 
            type="primary" 
            size="large"
            @click="toEditGoods(scope.row)"
            >编辑</el-button
            >
            <el-button 
            link 
            type="danger" 
            size="large"
            @click="toDelGoods(scope.row.goods_id)"
            >删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    <div class="example-pagination-block">
        <comPagination 
            layout="total, prev, pager, next, jumper" 
            :total="total" 
            :page-size="15"
            @CurrentChange="pageChange"
        />
    </div>

</template>
<script setup lang="ts">
import Api from '@/api';
import goodsCateTree from '@/components/goodsCateTree.vue'
import { Plus, Search, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import comPagination from '@/components/comPagination.vue';

const $router = useRouter()

const goodsTable = ref([])
const total = ref(0)
const loading = ref(false)
let goodsSearchForm = reactive<ISeach>({
    page: 1,
    listType: 'all',
    goodsName: '',
    goodsNo: '',
    categoryId: null,
    per_page: 15,
})

onMounted(() => {
    getGoodsList()
// Api.Goods.getGoodsDel({ goodsIds: [10131]})

})



const pageChange = (page:any) => {
    goodsSearchForm.page = page
    getGoodsList()
}

const getGoodsList = async () => {
    loading.value = true
    let {data:{list}} = await Api.Goods.getGoodsList(goodsSearchForm)
    total.value = list.total
    goodsTable.value = list.data
    loading.value = false
}

// 重置
const resetGoodsList = () => {
    goodsSearchForm.page = 1, 
    goodsSearchForm.listType = 'all', 
    goodsSearchForm.goodsName = null, 
    goodsSearchForm.goodsNo = null, 
    goodsSearchForm.categoryId = null, 
    goodsSearchForm.per_page = 15
    getGoodsList()
}

// 新增
const toAddGoods = () => {
    $router.push('/goods/edit')
}

// 编辑
const toEditGoods = (row:any) => {
    $router.push(`/goods/edit/${row.goods_id}`)
}

// 去删除
const toDelGoods = (id: any) => {
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
            await Api.Goods.getGoodsDel({ goodsIds: [id]})
            getGoodsList()
            ElMessage({
                type: 'success',
                message: '删除成功！',
            })
            })
        .catch(() => {})
}
</script>
<style scoped>
    .el-image{
        width: 80px;
    }
    .topper{
        margin-top: 20px;
    }
    .el-form-item{
        width: 280px;
        margin-right: 15px;
    }
    .top-radio-btn{
        margin-bottom: 20px;
        display: flex;
        align-items: center;
    }
</style>
