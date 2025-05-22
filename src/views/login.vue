<template>
        <div class="box">
        <div class="left"></div>
        <div class="right">
            <h4>
                {{ comTit }}
            </h4>
            <el-form 
            :model="adminForm" 
            :rules="rules" 
            class="admin-form"
            ref="ruleFormRef"
            >
                <el-form-item prop="name">
                    <el-input 
                    class="acc" 
                    type="text" 
                    placeholder="用户名" 
                    prefix-icon="User"
                    v-model="adminForm.name">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input 
                    class="acc" 
                    type="password" 
                    placeholder="密码" 
                    prefix-icon="Lock"
                    v-model="adminForm.password"
                    show-password
                    @keydown.enter="submitForm(ruleFormRef)"
                    >
                    </el-input>
                </el-form-item>
                
                <el-button class="submit" 
                @click="submitForm(ruleFormRef)"
                :loading-icon="Eleme" 
                :loading="loading"
                >
                    登录
                </el-button>
            </el-form>
            <div class="fn">
                <a href="###">注册账号</a>
                <a href="###">找回密码</a>
            </div>
        </div>
    </div>

</template>
<script setup lang="ts" name="login">
import { reactive, ref, watch } from 'vue'
import { FormInstance, FormRules ,ElNotification } from 'element-plus'
import { Eleme } from '@element-plus/icons-vue'
import { useRouter,useRoute } from 'vue-router'
import { setToken } from '@/utils/auth'
import Api from '@/api'
const ruleFormRef = ref<FormInstance>()
const $router = useRouter()
const $route = useRoute()
const comTit = import.meta.env.VITE_APP_TITLE

const adminForm = reactive<AdminForm>({
    name: '',
    password: ''
})
interface AdminForm {
    name: string
    password: string
}

const rules = reactive<FormRules<AdminForm>>({
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 12, message: '用户名长度应在3-12个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 3, max: 12, message: '密码长度应在3-12个字符', trigger: 'blur' },
    ]
})
const loading = ref(false)
const redirect = ref(undefined)

// 监听$route
watch(
    $route,(to) => {
        redirect.value = to.redirectedFrom && to.redirectedFrom.fullPath
    },
    {
        immediate: true
    }
    );

const submitForm = async (formEl: FormInstance | undefined) => {

    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            loading.value = true
            Api.Login.login(adminForm.name, adminForm.password).then(res => {
                // 判断返回的 result 
                if(res !== undefined && res !== null){
                        // 判断从哪个页面来的
                        $router.replace({
                            path: redirect.value || '/',
                            // 跳转不成功重置loading
                        }).catch(() => loading.value = false)
                    }
                    setToken(res.data.token)
                    
                    ElNotification({
                    title: '登录成功',
                    message: '欢迎回来IKUN！',
                    type: 'success',
                    duration:2000
                })
                loading.value = false
            }).catch(() => {
                loading.value = false
            })
        } else return false
    })
}


</script>
<style scoped lang="scss">
    .admin-form{
        width: 400px;
        height: 330px;
    }
    .box{
        display: flex;
        overflow: hidden;
        width: 90rem;
        height: 55rem;
        background-color: rgba(255,255,255,.6);
        border-radius: 1.5rem;
        margin: 10% auto;
        box-shadow: 0 0 1rem .2rem rgb(0 0 0 / 10%);
        .left {
        position: relative;
        width: 35%;
        height: 100%;
        background-color: skyblue;
        }
        .left::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: url(@/assets/images/login.jpg);
            background-size: cover;
            opacity: 90%;
        }
        .right{
            display: flex;
            width: 65%;
            flex-direction: column;
            align-items: center;
            h4{
                color: #6cc8fd;
                font-size: 3rem;
                margin-top: 5rem;
            }
            form .acc{
                outline: none;
                width: 90%;
                height: 5rem;
                font-size: 1.6rem;
                margin-top: 5rem;
                border: none;
                border-bottom: 1px solid rgb(144,129,241);
                color: rgb(144,129,241);
                background-color: rgba(0,0,0,0);
            }
            form .acc:focus {
                outline: none;
                color: rgb(144,129,241);
                padding: 1rem 0 0 1.6rem;
            }
            .submit{
                width: 60%;
                height: 5rem;
                color: #f6f6f6;
                background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
                font-size: 1.4rem;
                border: none;
                border-radius: 0.5rem;
                margin: 6rem 0 0 50%;
                transform: translateX(-50%);
            }
            .submit:hover{
                cursor: pointer;
                box-shadow: 0 0 2rem -0.5rem rgb(0 0 0 / 15%);
            }
            .fn{
                display: flex;
                justify-content: space-between;
                margin-top: -4rem;
                width: 80%;
                a{
                    font-size: 1.3rem;
                    margin-top: 5rem;
                    padding: 1rem 2rem;
                    color: #666;
                }
                a:hover{
                    color: rgb(144,129,241);
                }
            }
        }
    }

    






</style>
