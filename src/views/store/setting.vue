<template>
    <p>店铺设置</p>
    <el-form 
    :model="storeInfoForm" 
    label-width="120px" 
    :rules="rules" 
    ref="settingRef"
    v-loading="loading"
    element-loading-text="加载中..."
    >
        <el-form-item label="商城名称" prop="store_name">
            <el-input 
            v-model="storeInfoForm.store_name"
            style="width: 40%;"
            />
        </el-form-item>
        <el-form-item label="商城简介">
            <el-input 
            v-model="storeInfoForm.describe" 
            type="textarea"
            style="width: 40%;"
            />
        </el-form-item>
        <el-form-item label="商城Logo">
            <update />
        </el-form-item>
        <el-form-item>
            <el-button color="#FF82DB" class="addBtn" @click="submitForm(settingRef)">提交</el-button>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import Api from '@/api'
import update from '@/components/update.vue';

interface IStoreInfo {
    describe: string,
    logo_image_id: number,
    store_name: string
}

const settingRef = ref<FormInstance>()
const loading = ref(false)
const storeInfoForm = ref<IStoreInfo>({
    describe: '',
    logo_image_id: 0,
    store_name: ''
})

const rules = reactive<FormRules<IStoreInfo>>({
    store_name: [
    { required: true, message: '请输入店铺名称', trigger: 'blur' },
    { min: 3, max: 10, message: '长度应在3-10个字符', trigger: 'blur' },
    ]
})

onMounted(() => {
    Api.Login.getStoreInfo().then(res => {
        let {data:{storeInfo}} = res
        storeInfoForm.value.describe = storeInfo.describe
        storeInfoForm.value.store_name = storeInfo.store_name
    }).catch()
})


const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            loading.value = true
            Api.Store.getStorepdate({form:storeInfoForm.value}).then( res => {
                ElMessage({
                message: '修改成功！',
                type: 'success',
            })
            loading.value = false
            })
        } else {
        console.log('error submit!', fields)
        }
    })
}




</script>
<style scoped>
    .el-form{
        padding: 50px 100px;
    }



</style>
