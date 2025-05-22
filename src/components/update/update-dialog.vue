<template>
    <el-dialog 
    v-model="dialogVisible" 
    title="文件列表" 
    width="800px"
    @closed="beforeClosed"
    >
    <div class="container">
        <div class="group">
            <ul>
                <li @click="changeTab(0, 0)" :class="{ 'highLight' : flag === 0 }">全部</li>
                <li @click="changeTab(1, -1)" :class="{ 'highLight' : flag === 1 }">未分组</li>
                <li @click="changeTab(index + 2, item.group_id)" :class="{ 'highLight' : flag === index+2 }" v-for="(item,index) in groupList" :key="item.group_id">
                    {{ item.name }}
                </li>
            </ul>
            <div class="add-group">
                <el-button link type="primary" @click="toAddGroup">新增分组</el-button>
            </div>
        </div>
        <div class="files" v-loading="loading">
            <div class="fileTopper">
                <el-input
                v-model="fileSourse.fileName"
                placeholder="请输入搜索信息"
                class="input-with-icon"
                @keydown.enter="getFilesList"
                >
                <template #append>
                    <el-button 
                    :icon="Search" 
                    @click="getFilesList"
                    />
                </template>
                </el-input>
                <updateFile 
                    multiple
                    :btnShow="false"
                    listType="text"
                    :showFileList="false"
                    :getFilesList="getFilesList"
                />
            </div>

            <ul>
                <li 
                class="imgLi"
                @click="maskShow(item,index)" 
                v-for="(item, index) in fileList" 
                :key="item.file_id"
                >
                    <img :src="item.preview_url" />
                    <span>{{ item.file_name }}</span>
                    <div
                    class="select-mask"
                    >
                        <el-icon><Select /></el-icon>
                    </div>
                </li>
            </ul>
            <el-empty v-if="fileList.length == 0" description="暂无数据" />
            <comPagination
                class="pagination"
                layout="total, prev, pager, next" 
                :total="total" 
                @CurrentChange="pageChange"
                :page-size="15"
            />
        </div>
    </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button 
                    type="primary" 
                    @click="submit"
                    color="#ff82db"
                    style="color: #fff;"
                >
                    确定
                </el-button>
            </span>
        </template>
        <gDialog ref="groupDialog" @getFileGroupList="getFileGroupList"></gDialog>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Api from '@/api'
import comPagination from '../comPagination.vue';
import update from '@/components/update.vue';
import updateFile from '@/components/update/updateFile.vue';

import { Search } from '@element-plus/icons-vue'
import gDialog from '@/components/update/group-dialog.vue'

const flag = ref(0)
const total = ref(0)
const dialogVisible = ref(false)
const fileList = ref([])
const emitFileList = ref<any[]>([])
const groupList = ref()
const loading = ref(false)


let props = defineProps<{
    type?:any,
}>()

let fileType = ref()

if(props.type === 'picture' || props.type === 'videoPic'){
    fileType.value = '10'
} else {
    fileType.value = '30'
}


interface IFilesource {
    fileType?: any;
    channel?: number;
    page?: number;
    fileName?: string;
    groupId?: number | string;
}

let fileSourse = reactive<IFilesource>({
    fileType: fileType.value,
    channel: 10,
    page:1,
    fileName: '',
    groupId: -1,
})




const open = () => {
    dialogVisible.value = true
    getFileGroupList()
    getFilesList()
}

const pageChange = (page:any) => {
    fileSourse.page = page
    getFilesList()
}

const getFileGroupList = () => {
    Api.Files.getFileGroupList().then(res => {
        let {data:{list}} = res
        groupList.value = list
        
    }).catch()
}

// 打开mask


const maskShow = (item:any, index:number) => {
    let selectMasks = document.querySelectorAll('.select-mask')

    if(selectMasks.length <= 15){
        selectMasks[index].classList.toggle('active')
    } else if(selectMasks.length > 15 && selectMasks.length <= 19){
        selectMasks[index + 15].classList.toggle('active')
    } else {
        selectMasks[index + 19].classList.toggle('active')
    }

    if(emitFileList.value.includes(item)){
        emitFileList.value = emitFileList.value.filter(a=> a.file_id !== item.file_id)
    }
    else {
        emitFileList.value.push(item)    
    }
    
}

// 分发数据
const emit = defineEmits<{
    'ok':[item:any]
}>()
// 确定
const submit = () => {
    
    emit('ok', emitFileList.value)
    dialogVisible.value = false
}


const getFilesList = () => {
    loading.value = true
    Api.Files.getFilesList(fileSourse).then(res => {
        let {data:{list}} = res
        total.value = list.total
        fileList.value = list.data
        loading.value = false
        
    }).catch()
}

// 切换分组tab
const changeTab = (code:number,groupId:number) => {
    flag.value = code
    fileSourse.groupId = groupId
    getFilesList()
    emitFileList.value = []
}

const beforeClosed = () => {
    emitFileList.value = []
    let selectMasks = document.querySelectorAll('.select-mask')
    for(let i = 0; i < selectMasks.length; i++){
        selectMasks[i].classList.remove('active')
    }

    
}

// 新增分组
const groupDialog = ref()
const toAddGroup = () => {
    groupDialog.value.openDialog()
}


defineExpose({
    open,
    emitFileList
})

</script>
<style scoped lang="scss">
ul{
    padding-left: 20px;
}
li{
    cursor: pointer;
}

.fileTopper::v-deep{
    display: flex;
    justify-content: space-between;
    .upload{
    height: 32px;
}
}
.pagination{
    display: flex;
    justify-content: flex-end;
}
.container{
    display: flex;
    .group{
        li{
            padding-left: 8px;
            width: 100px;
        }
    }
}
.el-empty{
    min-height: 460px;

}
.files{
    ul{
        width: 600px;
        display: flex;
        flex-wrap: wrap;
        li:hover{
            border: 1px solid #FF82DB;
        }
        li{
            position: relative;
            padding: 5px;
            width: 20%;
            span{
                display: inline-block;
                font-size: 14px;
                width: 102px;
                overflow: hidden;
                text-align: center;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            img{
                width: 100%;
            }
        }
    }
}
.highLight{
    background-color: #FF82DB;
    color: #fff;
}
.input-with-icon{
    width: 40%;
    padding-left: 30px;
}

.select-mask{
    display: none;
    background-color: rgba(0,0,0,.41);
    position: absolute;
    line-height: 50%;
    z-index: 999;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    font-size: 20px;
    color: #fff;
    .el-icon{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
.active{
    display: block;
}
.add-group{
    position: absolute;
    left: 45px;
    bottom: 100px;
}
</style>