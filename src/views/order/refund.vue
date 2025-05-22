<template>
    <p>售后管理</p>
    <div class="topper">
        <el-form 
        :inline="true" 
        :model="refundInfo" 
        class="demo-form-inline"
        :label-width="100"
        >
            <el-form-item label="关键词查询：">
                <el-select 
                v-model="refundInfo.searchType"
                style="width: 30%;"
                class="demo1"
                >
                    <el-option
                        v-for="item in searchDataType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
                <el-input 
                    v-model="refundInfo.searchValue" 
                    placeholder="请输入关键词" 
                    style="width: 70%;"
                />
            </el-form-item>
            <el-form-item label="售后类型：">
                <el-select 
                v-model="refundInfo.refundSource"
                >
                    <el-option
                        v-for="item in searchRefundSource"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="售后单状态：">
                <el-select 
                v-model="refundInfo.payType"
                >
                    <el-option
                        v-for="item in searchPayType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            
            <el-form-item label="申请时间：">
                <datePick 
                    v-model="refundInfo.betweenTime"
                    type="daterange"
                    valueFormat="YYYY-MM-DDT01:48:27.278Z"
                />
            </el-form-item>
            <el-form-item>
                <el-button 
                type="primary"
                :icon="Search" 
                @click="getRefundList"
                color="#ff82db"
                style="color: #fff;"
                >搜索</el-button>
                <el-button 
                plain 
                :icon="RefreshRight" 
                @click="resetRefundList"
                >重置</el-button>
            </el-form-item>
        </el-form>
        <el-table 
        :data="refundList" 
        style="width: 100%"
        v-loading="loading"
        element-loading-text="加载中..."
        height="600"
        >
            <el-table-column label="商品信息" width="180" />
            <el-table-column label="单价/数量" width="180" />
            <el-table-column label="付款金额" width="180" />
            <el-table-column label="买家" width="180" />
            <el-table-column label="售后类型" width="180" />
            <el-table-column label="处理进度" width="180" />
            <el-table-column label="售后单状态" />
            <el-table-column label="操作" />
        </el-table>
    </div>
</template>
<script setup lang="ts">
import datePick from '@/components/datePick.vue';
import { Search, RefreshRight } from '@element-plus/icons-vue'
import Api from '@/api';

interface IRefundSeach {
    dataType?: string, // 订单数据类型 -- 全部-待发货...
    searchType?: string | number, // 关键词类型
    searchValue?: string, // 搜索值
    refundSource?: string | number, // 订单来源 -- -1(全部) - 10(普通订单)
    payType?: string | number, // 支付方式
    deliveryType?: string | number, // 配送方式
    betweenTime?: any, // 时间
    page: number // 页码
}
const loading = ref(false)
const refundList = ref<Array<object>>()
const refundInfo = ref<IRefundSeach>({
    dataType: 'all', // 订单数据类型 -- 全部-待发货...
    searchType: null, // 关键词类型
    searchValue: '', // 搜索值
    refundSource: null, // 订单来源 -- -1(全部) - 10(普通订单)
    payType: null, // 支付方式
    deliveryType: null, // 配送方式
    betweenTime: [], // 时间
    page: 1 // 页码
})

const searchDataType = [
    {value: 10,label: '订单号',},
    {value: 20,label: '会员昵称',},
    {value: 30,label: '会员ID',}
]

const searchRefundSource = [
    {value: -1,label: '全部'},
    {value: 10,label: '普通订单'}
]

const searchPayType = [
    {value: -1,label: '全部'},
    {value: 10,label: '余额支付'},
    {value: 20,label: '微信支付'}
]

const searchDeliveryType = [
    {value: -1,label: '全部'},
    {value: 10,label: '快递配送'}
]

onMounted(() => {
    getRefundList()
})

const getRefundList = async () => {
    loading.value = true
    let {data:{list}} = await Api.Order.getRefundList(refundInfo.value)
    refundList.value = list.data    
    loading.value = false
}

// 重置
const resetRefundList = () => {
    refundInfo.value.dataType = 'all', 
    refundInfo.value.searchType = null, 
    refundInfo.value.searchValue = '', 
    refundInfo.value.refundSource = null, 
    refundInfo.value.payType = null, 
    refundInfo.value.deliveryType = null,
    refundInfo.value.betweenTime = [],
    refundInfo.value.page = 1,
    getRefundList()
}

</script>
<style lang="scss" scoped>
    .el-radio-button::v-deep{
        width: 16.66%;
        .el-radio-button__inner{
            width: 100%;
        }
    }
    .topper{
        margin-top: 20px;
    }
    .el-form-item::v-deep{
        .demo1 .el-input__wrapper{
        background-color: #f4f4f4;
    }
        .el-form-item__label{
            justify-content: flex-start;
        }
    }
</style>