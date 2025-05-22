<template>
    <el-form
    :model="detail"
    :rules="rules"
    label-width="140px"
    v-loading="false"
    ref="goodsDetail"
    >
        <h3>基本信息</h3>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item label="商品名称：" prop="form.goods_name" >
                    <el-input type="text" v-model="detail.form.goods_name" placeholder="请输入商品名称" clearable />
                </el-form-item>
            </el-col>
            <el-col :span="6">
            <div class="inner">
                <el-form-item label="商品分类：" prop="form.categoryIds">
                    <goodsCateTree 
                        v-model="detail.form.categoryIds"
                        multiple
                        collapse-tags
                        show-checkbox
                        check-strictly
                        :max-collapse-tags="1"
                        clearable
                        node-key="category_id"
                        placeholder="请选择商品分类"
                    />
                </el-form-item>
            </div>
            </el-col>
            <el-col :span="6">
            <div class="inner">
                <el-form-item label="商品编码：">
                    <el-input type="text" v-model="detail.form.goods_no" placeholder="请输入商品编码" clearable />
                </el-form-item>
            </div>
            </el-col>
            <el-col :span="6">
            <div class="inner">
                <el-form-item label="运费模板：" prop="form.delivery_id">
                    <el-select v-model="detail.form.delivery_id" class="m-2" placeholder="请选择运费模板">
                        <el-option
                        v-for="item in delivery"
                        :key="item.delivery_id"
                        :label="item.name"
                        :value="item.delivery_id"
                        />
                    </el-select>
                </el-form-item>
            </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
            <div class="inner">
                <el-form-item label="商品状态：" prop="form.status">
                    <radioGroup 
                        v-model="detail.form.status"
                        type="goods_status"
                    />
                </el-form-item>
            </div>
            </el-col>
            <el-col :span="6">
            <div class="inner">
                <el-form-item label="商品排序：" prop="form.sort">
                    <el-input-number
                        style="width: 100%;"
                        v-model="detail.form.sort"
                        class="mx-4"
                        :min="90"
                        :max="110"
                        controls-position="right"
                    />
                </el-form-item>
            </div>
            </el-col>
            <el-col :span="12">
                <el-form-item  
                label="商品图片：" 
                >
                    <div style="margin-left: 50px;">
                        <update 
                            :goodsImages="detail.form.goods_images"
                            v-model="detail.form.imagesIds"
                            ref="imgUpdate"
                            multiple
                        />
                    </div>
                </el-form-item>
            </el-col>
        </el-row>
        <el-divider />
        <h3>规格/库存</h3>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item label="规格类型：">
                    <radioGroup 
                        v-model="detail.form.spec_type"
                        type="spec_type"
                    />
                </el-form-item>
            </el-col>
            <el-col :span="6">
            <div class="inner">
                <el-form-item label="商品价格：" prop="form.goods_price">
                    <inputNumber 
                        v-model="detail.form.goods_price"
                        controlsPosition="right"
                        tips="元"
                        :min="1"
                        :precision="2"
                    />
                </el-form-item>
            </div>
            </el-col>
            <el-col :span="6">
            <div class="inner">
                <el-form-item label="划线价格：">
                    <inputNumber 
                        v-model="detail.form.line_price"
                        controlsPosition="right"
                        tips="元"
                        :min="1"
                        :precision="2"
                    />
                </el-form-item>
            </div>
            </el-col>
            <el-col :span="6">
            <div class="inner">
                <el-form-item label="当前库存数：" prop="form.stock_num">
                    <inputNumber 
                        v-model="detail.form.stock_num"
                        controlsPosition="right"
                        tips="件"
                        :min="0"
                    />
                </el-form-item>
            </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
            <div class="inner">
                <el-form-item label="商品重量：" prop="form.goods_weight">
                    <inputNumber 
                        v-model="detail.form.goods_weight"
                        controlsPosition="right"
                        tips="千克(kg)"
                        :min="1"
                    />
                </el-form-item>
            </div>
            </el-col>
            <el-col :span="18">
            <div class="inner">
                <el-form-item label="库存计算方式：" prop="form.deduct_stock_type">
                    <radioGroup 
                        v-model="detail.form.deduct_stock_type"
                        type="deduct_stock_type"
                    />
                </el-form-item>
            </div>
            </el-col>
        </el-row>
        <el-divider />
        <h3>更多设置</h3>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="主图视频：">
                    <div style="margin-left: 50px;">
                        <update
                            v-model="detail.form.video_id"
                            :goodsImages="detail.form.video"
                            @updateVideo="updateVideo"
                            multiple
                            type="video"
                        />
                    </div>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="视频封面：">
                    <div style="margin-left: 50px;">
                        <update 
                            v-model="detail.form.video_cover_id"
                            :goodsImages="detail.form.videoCover"
                            @updateVideoPic="updateVideoPic"
                            multiple
                            type="videoPic"
                        />
                    </div>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item label="商品卖点：">
                    <el-input type="text" v-model="detail.form.selling_point" placeholder="请输入商品卖点" clearable />
                </el-form-item>
            </el-col>
            <el-col :span="6">
            <div class="inner">
                <el-form-item label="服务与承诺：">
                    <el-select 
                    v-model="detail.form.serviceIds" 
                    multiple
                    collapse-tags
                    >
                        <el-option
                            v-for="item in service"
                            :key="item.service_id"
                            :label="item.name"
                            :value="item.service_id"
                        />
                    </el-select>
                </el-form-item>
            </div>
            </el-col>
            <el-col :span="6">
            <div class="inner">
                <el-form-item label="初始销量：">
                    <inputNumber 
                        v-model="detail.form.sales_initial"
                        controlsPosition="right"
                        tips="件"
                        :min="0"
                    />
                </el-form-item>
            </div>
            </el-col>
        </el-row>
        <el-divider content-position="left"><span class="inner-span">积分设置</span></el-divider>
        <el-row :gutter="20">
            <el-col :span="12">
            <div class="inner">
                <el-form-item required label="积分赠送：">
                    <radioGroup 
                        v-model="detail.form.is_points_gift"
                        type="is_points_gift"
                    />
                </el-form-item>
            </div>
            </el-col>
            <el-col :span="12">
            <div class="inner">
                <el-form-item required label="积分抵扣：">
                    <radioGroup 
                        v-model="detail.form.is_points_discount"
                        type="is_points_discount"
                    />
                </el-form-item>
            </div>
            </el-col>
        </el-row>
        <el-divider content-position="left"><span class="inner-span">会员折扣设置</span></el-divider>
        <el-row :gutter="20">
            <el-col :span="12">
            <div class="inner">
                <el-form-item required label="会员折扣：">
                    <radioGroup 
                        v-model="detail.form.is_enable_grade"
                        type="is_enable_grade"
                    />
                </el-form-item>
            </div>
            </el-col>
            <el-col :span="12">
            <div class="inner">
                <el-form-item label="会员折扣设置：" v-if="detail.form.is_enable_grade">
                    <radioGroup 
                        v-model="detail.form.is_alone_grade"
                        type="is_alone_grade"
                    />
                </el-form-item>
            </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8">
            <div class="inner">
                <el-form-item label="黄金会员：" v-if="detail.form.is_enable_grade && detail.form.is_alone_grade">
                    <inputNumber 
                        v-model="otherFormInfo.alone_grade_equity.grade_id10001"
                        controlsPosition="right"
                        tips="折"
                        :precision="1"
                        :step="0.1"
                        :min="1"
                        :max="10"
                    />
                </el-form-item>
            </div>
            </el-col>
            <el-col :span="8">
            <div class="inner">
                <el-form-item label="铂金会员：" v-if="detail.form.is_enable_grade && detail.form.is_alone_grade">
                    <inputNumber 
                        v-model="otherFormInfo.alone_grade_equity.grade_id10002"
                        controlsPosition="right"
                        tips="折"
                        :precision="1"
                        :step="0.1"
                        :min="1"
                        :max="10"
                    />
                </el-form-item>
            </div>
            </el-col>
            <el-col :span="8">
            <div class="inner">
                <el-form-item label="钻石会员：" v-if="detail.form.is_enable_grade && detail.form.is_alone_grade">
                    <inputNumber 
                        v-model="otherFormInfo.alone_grade_equity.grade_id10003"
                        controlsPosition="right"
                        tips="折"
                        :precision="1"
                        :step="0.1"
                        :min="1"
                        :max="10"
                    />
                </el-form-item>
            </div>
            </el-col>
        </el-row>
        <el-divider />
        <h3>商品详情</h3>
            <el-row>
                <el-col :span="24">
                    <wangEditor 
                        v-model="detail.form.content"
                    />
                </el-col>
            </el-row>
            <el-row style="margin-top: 20px; text-align: center;">
                <el-col :span="24">
                    <el-button type="primary" @click="submitGoods(goodsDetail)">提交</el-button>
                    <el-button @click="$router.go(-1)">返 回</el-button>
                </el-col>
            </el-row>
    </el-form>
</template>
<script setup lang="ts">
import Api from '@/api';
import type { UploadFile, UploadProps, FormInstance, FormRules } from 'element-plus'
import goodsCateTree from '@/components/goodsCateTree.vue';
import radioGroup from '@/components/radioGroup.vue';
import inputNumber  from '@/components/inputNumber.vue';
import wangEditor from '@/components/wangEditor.vue'
import update from '@/components/update.vue';

const goodsDetail = ref<FormInstance>()
const delivery = ref<any>()
const service = ref<any>()
const $router = useRouter()
const $route = useRoute()



onMounted(() => {
    getService()
    if($route.params.id){
        toGetGoodsDetail($route.params.id)
    }
    getDeliveryAll()
})



// 表单信息源
let detail = reactive<any>({
    form:{
        categoryIds:[], //商品分类
        imagesIds:[], // 图片ids
        sort:100,
        status:10, //10 上架 ， 20 下架
        serviceIds:[], //服务承诺
        spec_type:10, //规格类型
        goods_price:1.00,
        goods_weight:0, // 商品重量
        deduct_stock_type:10, //库存计算方式
        stock_num:100, //当前库存数量
        is_points_gift:1, //积分赠送 - 1开启， 0 关闭
        is_points_discount:1, //积分抵扣 - 1开启， 0 关闭
        is_enable_grade:1, //会员折扣 - 1开启， 0 关闭
        is_alone_grade: 0,  //0默认等级折扣 - 1：单独设置折扣
        goods_images:[], // 图片全信息列表
        alone_grade_equity:{}, //会员折扣列表
        sales_initial:0, //初始销量
        video_id:[],
        video_cover_id:[]
    },
    goodsId: null,
})

// 表单信息校验
let rules = reactive<FormRules>({
        'form.goods_name': [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        'form.categoryIds': [
            { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
        'form.delivery_id': [
            { required: true, message: '请选择运费模板', trigger: 'blur' },
        ],
        'form.status': [
            { required: true, message: '请选择商品状态', trigger: 'blur' },
        ],
        'form.sort': [
            { required: true, message: '请输入商品排序', trigger: 'blur' },
        ],
        'form.goods_price': [
            { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        'form.stock_num': [
            { required: true, message: '请输入当前库存量', trigger: 'blur' },
        ],
        'form.goods_weight': [
            { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        'form.deduct_stock_type': [
            { required: true, message: '请选择库存计算方式', trigger: 'blur' },
        ],
        'form.content': [
            { required: true, message: '请输入商品详情', trigger: 'blur' },
        ],
})

// 表单其他构造信息
let otherFormInfo = reactive({
    alone_grade_equity:{
        grade_id10001: 9.6,
        grade_id10002:9.4,
        grade_id10003: 9.2,
    }
})

// 监听会员折扣赋值
watch(
[()=> detail.form.is_enable_grade, ()=> detail.form.is_alone_grade, ()=> otherFormInfo.alone_grade_equity], ()=> {
    if(detail.form.is_enable_grade && detail.form.is_alone_grade){
        detail.form.alone_grade_equity = {
            'grade_id:10001': otherFormInfo.alone_grade_equity.grade_id10001,
            'grade_id:10002': otherFormInfo.alone_grade_equity.grade_id10002,
            'grade_id:10003': otherFormInfo.alone_grade_equity.grade_id10003,
        }
    } else {
        detail.form.alone_grade_equity = {}
    }
},{
    deep: true
})


const submitGoods = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate( async (valid) => {
        if (valid) {
            if(detail.goodsId === null){
                await Api.Goods.getGoodsAdd(detail)

                
                ElMessage({
                    message: '添加成功！',
                    type: 'success',
                })
            } else {
                await Api.Goods.getGoodsEdit(detail)
                ElMessage({
                    message: '修改成功！',
                    type: 'success',
                })
            }
            $router.push('/goods/index')
        } else {
            return false
        }
    })
}

// 获取运费模板
const getDeliveryAll = async () => {
    let {data:{list}} = await Api.Goods.getDeliveryAll()
    delivery.value = list
}
// 获取服务承诺
const getService = async () => {
    let {data:{list}} = await Api.Goods.getServiceAll()
    service.value = list
    // 默认服务承诺选中
    if(detail.form.serviceIds.length === 0){
        let defaultList = list.filter(a => a.is_default).map(b => b.service_id)
        detail.form.serviceIds = defaultList
    }
}

// 视频封面id
const updateVideoPic = (vid)=>{
    detail.form.video_cover_id = vid
}
// 视频id
const updateVideo = (vid)=>{
    detail.form.video_id = vid
}

// 获取编辑时的商品详情
const toGetGoodsDetail = (goodsId:any) => {
    detail.form.serviceIds = []
    Api.Goods.getGoodsDetail({goodsId}).then(res => {
        let goodsInfo = res.data.goodsInfo
        detail.goodsId = goodsInfo.goods_id

        
        detail.form = {
            ...goodsInfo,
            goods_price: parseFloat(goodsInfo.skuList[0].goods_price),
            line_price: parseFloat(goodsInfo.skuList[0].line_price),
            stock_num: parseFloat(goodsInfo.skuList[0].stock_num),
            goods_weight: parseFloat(goodsInfo.skuList[0].goods_weight),
            create_time: '',
            imagesIds: goodsInfo.goods_images.map(a => a.file_id)
        }
        delete detail.form.create_time


        
        
    }).catch()
}





</script>
<style scoped lang="scss">

    .tips{
        position: absolute;
        top: -1px;
        right: 55px;
    }
    .radio-group{
        border: 1px solid #d7d7d7;
        width: 100%;
        height: 32px;
        padding-left: 15px;
        display: flex;
        align-items: center;
        .el-radio{
            height: 100%;
        }
    }
    h3, .inner-span{
        color: #FF82DB;
        position: relative;
    }
    h3::before{
        content: '';
        display: block;
        width: 10px;
        height: 30px;
        border-left: 4px solid #FF82DB;
        position: absolute;
        left: -17px;
    }
    .el-row{
        display: flex;
        align-items: center;
    }
    .el-form-item{
        align-items: center;
    }
    .el-form-item::v-deep{
        .el-form-item__label{
            padding-left: 20px;
            background-color: #ececec;
            justify-content: space-around;
        }
    }
</style>
