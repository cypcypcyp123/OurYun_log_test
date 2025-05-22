<template>
    <div class="upload">

        <el-upload
            action="#" 
            ref="uploadRef"
            v-model:file-list="fileList"
            :list-type="listType" 
            :auto-upload="false"
            :btnShow="btnShow"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-change="handleChange"
            :multiple="multiple"
            :drag="drag"
            :limit="limit"
            :isBtn="isBtn"
            :show-file-list	="showFileList"
            :type="type"
        >
            <el-icon v-if="isBtn"><Plus /></el-icon>
            <el-button 
            v-else 
            type="primary"
            color="#ff82db"
            :icon="Cloudy"
            style="color: #fff;"
            >点击上传</el-button>
        </el-upload>

    </div>

</template>

<script lang="ts" setup name="update">
import { ref } from 'vue'
import { Plus, Cloudy } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import Api from '@/api';

let fileList = ref<any[]>([])
const props = withDefaults(defineProps<{
    modelValue?:any,
    multiple?: boolean, // 是否支持多选
    drag?: boolean, // 是否启用拖拽上传
    limit?: number, // 允许上传文件的最大数量
    btnShow?:boolean, // upload是否显示 为true隐藏 false显示
    isBtn?:boolean, // 是否是按钮类型
    listType?:string, // 文件列表的类型 'text' | 'picture' | 'picture-card'
    showFileList?:boolean, // 是否隐藏文件列表
    goodsImages?: any,
    type?:any,
    groupId?:number,
    getFilesList?:Function
}>(), {
    multiple: false,
    drag: false,
    btnShow: true,
    isBtn:false,
    listType:'picture-card',
    showFileList: true,
    type:'picture',
    groupId: -1
})

// 文件上传失败钩子
const handleError = (uploadFile, uploadFiles) => {
    ElMessage.error('文件上传失败')

}
// 文件上传成功钩子
const handleSuccess: UploadProps['onSuccess'] = (response,uploadFile, uploadFiles) => {
    console.log(response,uploadFile, uploadFiles,'12121');
}

const handleChange = (uploadFile, uploadFiles) => {
    console.log(uploadFile,'上传');
    toUploadFiles(uploadFile, uploadFiles)
}

const toUploadFiles = (file, flies) => {

    const formData = new FormData()
    formData.append('iFile',file.raw)
    formData.append('groupId', props.groupId)
    Api.Upload.uploadImage(formData).then(res => {
        ElMessage.success('文件上传成功')
        props.getFilesList()
    })
}






</script>
<style scoped lang="scss">
.upload::v-deep{
    display: flex;
    flex-wrap: wrap;
    .no-show{
        display: none;
    }
    .el-upload--picture-card{
        display: none !important;
    }
}

.upload-btn::v-deep{
    .el-button{
        width: 100%;
        height: 100%;
        font-size: 20px;
    }
    width: 148px;
    height: 148px;
}

.el-dialog__body{
    img{
        width: 100%;
    }
}
</style>