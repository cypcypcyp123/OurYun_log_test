<template>
    <p>订单列表</p>
    <div class="topper">
        <el-form 
        :inline="true" 
        :model="orderInfo" 
        class="demo-form-inline"
        :label-width="90"
        >
            <el-form-item style="width: 99%;">
                <el-radio-group 
                v-model="orderInfo.dataType" 
                style="width: 100%;"
                fill="#ff82db"
                @change="getOrderList"
                >
                    <el-radio-button label="all">
                        全部订单
                    </el-radio-button>
                    <el-radio-button label="delivery">
                        待发货
                    </el-radio-button>
                    <el-radio-button label="receipt">
                        待收货
                    </el-radio-button>
                    <el-radio-button label="pay">
                        待付款
                    </el-radio-button>
                    <el-radio-button label="complete">
                        已完成
                    </el-radio-button>
                    <el-radio-button label="cancel">
                        已取消
                    </el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="关键词：">
                <el-select 
                v-model="orderInfo.searchType"
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
                    v-model="orderInfo.searchValue" 
                    placeholder="请输入关键词" 
                    style="width: 70%;"
                />
            </el-form-item>
            <el-form-item label="订单来源：">
                <el-select 
                v-model="orderInfo.orderSource"
                >
                    <el-option
                        v-for="item in searchOrderSource"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="支付方式：">
                <el-select 
                v-model="orderInfo.payType"
                >
                    <el-option
                        v-for="item in searchPayType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="配送方式：">
                <el-select 
                v-model="orderInfo.deliveryType"
                >
                    <el-option
                        v-for="item in searchDeliveryType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="下单时间：">
                <datePick 
                    v-model="orderInfo.betweenTime"
                    type="daterange"
                    valueFormat="YYYY-MM-DDT01:48:27.278Z"
                />
            </el-form-item>
            <el-form-item>
                <el-button 
                type="primary"
                :icon="Search" 
                @click="getOrderList"
                color="#ff82db"
                style="color: #fff;"
                >搜索</el-button>
                <el-button 
                plain 
                :icon="RefreshRight" 
                @click="resetOrderList"
                >重置</el-button>
            </el-form-item>
        </el-form>
        <el-table 
        :data="orderList" 
        style="width: 100%"
        v-loading="loading"
        element-loading-text="加载中..."
        height="600"
        >
            <el-table-column label="商品信息" width="180" />
            <el-table-column label="单价/数量" width="180" />
            <el-table-column label="实付款" width="180" />
            <el-table-column label="买家" width="180" />
            <el-table-column label="支付方式" width="180" />
            <el-table-column label="配送方式" width="180" />
            <el-table-column label="交易状态" />
            <el-table-column label="操作" />
        </el-table>
    </div>
</template>
<script setup lang="ts">
import datePick from '@/components/datePick.vue';
import { Search, RefreshRight } from '@element-plus/icons-vue'
import Api from '@/api';

const loading = ref(false)
const orderList = ref<Array<object>>()
const orderInfo = ref<IOrderSeach>({
    dataType: 'all', // 订单数据类型 -- 全部-待发货...
    searchType: null, // 关键词类型
    searchValue: '', // 搜索值
    orderSource: null, // 订单来源 -- -1(全部) - 10(普通订单)
    payType: null, // 支付方式
    deliveryType: null, // 配送方式
    betweenTime: [], // 时间
    page: 1 // 页码
})

const searchDataType = [
    {value: 10,label: '订单号',},
    {value: 20,label: '会员昵称',},
    {value: 30,label: '会员ID',},
    {value: 40,label: '收货人姓名',},
    {value: 50,label: '收货人电话',},
]

const searchOrderSource = [
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
    getOrderList()
})

const getOrderList = async () => {
    loading.value = true
    let {data:{list}} = await Api.Order.getOrderList(orderInfo.value)
    orderList.value = list.data    
    loading.value = false
}

// 重置
const resetOrderList = () => {
    orderInfo.value.dataType = 'all', 
    orderInfo.value.searchType = null, 
    orderInfo.value.searchValue = '', 
    orderInfo.value.orderSource = null, 
    orderInfo.value.payType = null, 
    orderInfo.value.deliveryType = null,
    orderInfo.value.betweenTime = [],
    orderInfo.value.page = 1,
    getOrderList()
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