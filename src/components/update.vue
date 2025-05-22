<template>
    <div class="upload">

        <el-upload
            action="#" 
            ref="uploadRef"
            v-model:file-list="fileList"
            :list-type="listType" 
            :auto-upload="false"
            :btnShow="btnShow"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
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
        <div 
        class="upload-btn"
        :class="{'no-show': !btnShow}"
        >
            <el-button @click="openFileDialog">
                <el-icon><Plus /></el-icon>
            </el-button>
        </div>
    </div>
    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" />
    </el-dialog>
    <fileDialog 
        ref="fileDialogRef"
        @ok="getImgInfo"
        :type="type"
    />
</template>

<script lang="ts" setup name="update">
import { ref } from 'vue'
import { Plus, Cloudy } from '@element-plus/icons-vue'
import fileDialog from '@/components/update/update-dialog.vue'
import type { UploadProps, UploadUserFile } from 'element-plus'

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
    type?:any
}>(), {
    multiple: false,
    drag: false,
    btnShow: true,
    isBtn:false,
    listType:'picture-card',
    showFileList: true,
    type:'picture'
})
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const imageIds = ref([])

watch(()=> props.goodsImages, (nVal)=>{
        if(Array.isArray(props.goodsImages)){
            fileList.value.push(...nVal.map(s => ({fileid: s.file_id, name: s.file_name, url: s.preview_url, vidUrl: s.external_url})))
        } else {
            nVal?.file_id &&  fileList.value.push({
                fileid: nVal?.file_id || null,
                name: nVal?.file_name || null,
                url: nVal?.preview_url || null,
                vidUrl: nVal?.external_url || null,
            })
        }
    },{
        immediate:true
    })
    
const emit = defineEmits<{
    'updateVideoPic': [vid: string | number | null | undefined],
    'updateVideo':  [vid: string | number | null | undefined],
}>()
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    fileList.value = uploadFiles
    if(props.type === 'picture'){
        props.modelValue.length = 0
        
        props.modelValue.push(...fileList.value.map(a => {if(a.fileid !== uploadFile.fileid) return a.fileid}))       
    } else if(props.type==='videoPic'){
        emit('updateVideoPic', null)
    } else {
        emit('updateVideo', null)
    }
    
}


const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    if(props.type === 'picture'){
        dialogImageUrl.value = uploadFile.url!
        dialogVisible.value = true
    } else{
        window.open(uploadFile.vidUrl, '_blank')
    }
}

// 打开弹窗
const fileDialogRef = ref()
const openFileDialog = () => {
    fileDialogRef.value.open()

}
const getImgInfo = (imgInfo) => {

    fileList.value.push(...imgInfo.map(s => ({
        fileid: s.file_id, 
        name: s.file_name, 
        url: s.preview_url,
        vidUrl: s.external_url
    })))


    if(props.type === 'picture'){
        imageIds.value.push(fileList.value.map(a => a.fileid))
        
        props.modelValue.push(...imgInfo.map(a => a.file_id))
        
    } else if(props.type==='videoPic'){
        emit('updateVideoPic', imgInfo[0].file_id)
    } else {
        emit('updateVideo', imgInfo[0].file_id)
    }
}
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
    
}







defineExpose({
    imageIds
})

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