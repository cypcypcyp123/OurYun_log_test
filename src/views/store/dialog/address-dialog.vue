<template>
    <el-dialog 
    v-model="dialogFormVisible" 
    :title="addressId ? '编辑地址' : '新增地址'"
    width="40%"
    @closed="beforeClosed"
    >
    <el-form 
    ref="ruleFormRef"
    :model="addAddressForm"
    label-width="120px"
    :rules="rules"
    >
        <el-form-item label="地址类型：" prop="type">
            <el-radio-group v-model="addAddressForm.type" class="ml-4">
                <el-radio :label=10 size="large">发货地址</el-radio>
                <el-radio :label=20 size="large">退货地址</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="联系人姓名：" prop="name">
            <el-input v-model="addAddressForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
            <el-input v-model="addAddressForm.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="选择地区：" prop="cascader">
            <el-cascader 
            :props="props"
            v-model="addAddressForm.cascader" 
            :options="regionTree" />
        </el-form-item>
        <el-form-item label="详细地址：" prop="detail">
            <el-input v-model="addAddressForm.detail" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="排序：">
            <el-input-number
                v-model="addAddressForm.sort"
                :min="90"
                :max="110"
                controls-position="right"
                style="width: 40%;"
            />
        </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button 
            class="cancel"
            @click="dialogFormVisible = false"
            >
            取消
            </el-button>
            <el-button 
            type="primary" 
            @click="submitAddressForm(ruleFormRef)"
            color="#ff82db"
            >
            确认
            </el-button>
        </span>
        </template>
    </el-dialog>

</template>
<script setup lang="ts">
import { FormInstance, FormRules, ElMessage  } from 'element-plus'
import Api from '@/api';
const dialogFormVisible = ref(false)
const regionTree = ref([])
const ruleFormRef = ref<FormInstance>()
let addressId = ref(null)

interface IAddress {
    cascader: object,
    detail: string,
    name: string,
    phone: string | number,
    sort: number,
    type: number
}

const addAddressForm = ref<IAddress>({
    cascader: [],
    detail: '',
    name: '',
    phone: '',
    sort: 100,
    type: null
})

const props = {
    value: 'id',
    label: 'name',
}

const rules = reactive<FormRules<IAddress>>({
    name: [
        { required: true, message: '请输入联系人姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '长度应在2-10个字符', trigger: 'blur' },
    ],
    cascader: [
    {
        required: true,
        message: '请至少选择一个角色',
        trigger: 'change',
    },
    ],
    detail: [
        { required: true, message: '请输入详细地址', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入联系电话', trigger: 'blur' }
    ],
    type: [
        { required: true, message: '请选择地址类型', trigger: 'blur' }
    ],

})

// 打开dialog
const openDialog = (rowInfo?:any) => {
    if(rowInfo){
        addressId.value = rowInfo.address_id
        addAddressForm.value = {
            cascader: rowInfo.cascader,
            detail: rowInfo.detail,
            name: rowInfo.name,
            phone: rowInfo.phone,
            type: rowInfo.type,
            sort: rowInfo.sort,
        }
    }
    Api.Store.getRegionTree().then(res => {
        let {data:{list}} = res
        regionTree.value = filterTreeInfo(Object.values(list))
        console.log(regionTree.value);
    })
    dialogFormVisible.value = true
    
}

const filterTreeInfo = info => {
    info.forEach(item => {
        item?.city && (item.children = Object.values(item.city))
        item?.children &&  item.children.forEach(keys => keys.children = Object.values(keys.region))
    })
    return info
}

const emit = defineEmits(['toGetAddress'])

const submitAddressForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if(addressId.value !== null){
                Api.Store.getEditAddress({form:addAddressForm.value, addressId: addressId.value}).then(() => {
                    ElMessage({
                    message: '修改成功！',
                    type: 'success',
                })
                }).catch()
            } else {
                Api.Store.getAddAddress({form:addAddressForm.value}).then(() => {
                    ElMessage({
                    message: '添加成功！',
                    type: 'success',
                })
                }).catch()
            }
            // 使用父组件发送过来的方法
            // 重置表单校验规则
            formEl.resetFields()
            emit('toGetAddress')
            dialogFormVisible.value = false
        } else {
            return false
        }
    })

}

const beforeClosed = () => {
    ruleFormRef.value.resetFields()
    addressId.value = null
    addAddressForm.value = {
        cascader: [],
        detail: '',
        name: '',
        phone: '',
        sort: 100,
        type: null
    }
}


defineExpose({
    openDialog
})

</script>
<style scoped lang="scss">
.cancel{
    color: #000 !important;
}
.el-button{
    color: #fff;
}

</style>