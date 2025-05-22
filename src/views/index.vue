<template>
    <el-row :gutter="20">
        <el-col :span="24"><div class="grid-content ep-bg-purple" />
        <h3>实时概况</h3>
        <div class="time-info">
            <div class="time-inner">
                <i class="icons iconfont icon-fukuan"></i>
                <p>销售额（元）<p class="inner-num">0.00</p></p>
                
            </div>
            <div class="time-inner">
                <p>支付订单数<p class="inner-num">0</p></p>
            </div>
            <div class="time-inner">
                <i class="icons iconfont icon-fapiao"></i>
                <p>新增会员数<p class="inner-num">0</p></p>
            </div>
            <div class="time-inner">
                <p>付款会员数<p class="inner-num">0</p></p>
            </div>
        </div>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="6"><div class="grid-content ep-bg-purple" />
            <div class="total-inner">
                <i class="icons iconfont icon-gouwu"></i>
                <p>商品总数量<p>33</p></p>
            </div>
        </el-col>
        <el-col :span="6"><div class="grid-content ep-bg-purple" />
            <div class="total-inner">
                <i class="icons iconfont icon-gaishuai"></i>
                <p>会员总人数<p>0</p></p>
            </div>
        </el-col>
        <el-col :span="6"><div class="grid-content ep-bg-purple" />
            <div class="total-inner">
                <i class="icons iconfont icon-duihuan"></i>
                <p>付款订单总量<p>0</p></p>
            </div>
        </el-col>
        <el-col :span="6"><div class="grid-content ep-bg-purple" />
            <div class="total-inner">
                <i class="icons iconfont icon-daishouhuo"></i>
                <p>消费总人数<p>0</p></p>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="24"><div class="grid-content ep-bg-purple" />
            <div class="statistics">
                <p>待发货订单（笔）<br><span>0</span></p>
                <p>售后订单（笔）<br><span>0</span></p>
                <p>待付款订单（笔）<br><span>0</span></p>
                <p>已售罄商品<br><span>0</span></p>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="24"><div class="grid-content ep-bg-purple" />
            <div id="main" style="width: 100%;height:500px;"></div>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="24"><div class="grid-content ep-bg-purple" />
        
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted } from 'vue';
type EChartsOption = echarts.EChartsOption;

onMounted(() => {
    var chartDom = document.getElementById('main')!;
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;

option = {
    title: {
        text: '上周交易走势'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['成交量', '交易额']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
        name: '成交量',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
        name: '交易额',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
        }
    ]
};
option && myChart.setOption(option);

})


</script>

<style scoped lang="scss">
.time-inner,
.total-inner{
    display: flex;
    align-items: center;
}
.icons{
    padding: 20px;
    font-size: 35px;
    color: #FF82DB;
}
h3{
    font-weight: 600;
}
.el-row {
  margin-bottom: 20px;
  justify-content: space-between;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
    padding: 15px 20px !important;
    border-radius: 4px;
    min-height: 110px;
    background-color: #f0f2f5;
}

.grid-content {
  border-radius: 4px;
}
.time-info,
.statistics
{
    display: flex;
    justify-content: space-around;
}
.statistics{
    text-align: center;
    span{
        font-size: 20px;
        color: red;
    }
}
.el-col-6{
    box-sizing: border-box;
}
.el-col-6{
    max-width: 24%;

}
.el-col-6:nth-child(1),
.el-col-6:nth-child(2),
.el-col-6:nth-child(3)
{
    margin-right: 10px;
}
.inner-num{
    font-size: 25px;
}
</style>
