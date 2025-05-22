// axios
import axios, { AxiosResponse } from "axios"
// element-plus组件
import { ElNotification, ElMessageBox, ElLoading, ElMessage } from "element-plus";
// 自己对应pinia仓库路径引入
import { piniaStore } from '@/store'
// 拿上次的直接用
import { getToken } from "@/utils/auth";
// 将文件放到指定目录引入
import { tansParams } from "@/utils/tool";
// 将文件放到指定目录引入
import cache from "@/plugins/cache";
import errorCode from "@/utils/errorCode";
// 需要 npm i nanoid
import { nanoid } from "nanoid";

// 配置请求头默认新信息
axios.defaults.headers['Content-Type'] = 'multipart/form-data'

// 创建axios实例
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASEURL,
    timeout: 20 * 10000 //超时
})


// 是否显示重新登录
export let isRelogin = { show: false };

// 请求拦截
service.interceptors.request.use((config: any) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
    const requestId = nanoid();
    if (getToken() && !isToken) {
        // 请求加上随机ID
        config.headers["RequestId"] = requestId;
        // 让每个请求携带自定义token 请根据实际情况自行修改
        // config.headers["Authorization"] = "Bearer " + getToken(); 
        config.headers['Access-Token'] = getToken();
    }
    // get请求映射params参数
    if (config.method === "get" && config.params) {

        // 正常来讲这个地方要加 ? 但是我们这个接口是例外，全局环境里变量里已经有 ? 了所以要加 &
        // let url = config.url + "?" + tansParams(config.params);

        let url = config.url + "&" + tansParams(config.params);
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
    }
    // post 与 put请求处理
    if (!isRepeatSubmit && (config.method === "post" || config.method === "put")) {
        const requestObj = {
            url: config.url,
            data: typeof config.data === "object" ? JSON.stringify(config.data) : config.data,
            time: new Date().getTime()
        };

        const sessionObj = cache.session.getJSON("sessionObj");

        if (sessionObj === undefined || sessionObj === null || sessionObj === "") {
            cache.session.setJSON("sessionObj", requestObj);
        } else {
            const s_url = sessionObj.url; // 请求地址
            const s_data = sessionObj.data; // 请求数据
            const s_time = sessionObj.time; // 请求时间
            const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
            // 做数据提交防抖处理
            if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
                const message = "数据正在处理，请勿重复提交";
                console.warn(`[${s_url}]: ` + message);
                return Promise.reject(new Error(message));
            } else {
                cache.session.setJSON("sessionObj", requestObj);
            }
        }
    }
    return config;
},
    (error: any) => {
        Promise.reject(error)
    }
);

// 响应应拦截
service.interceptors.response.use((res: AxiosResponse) => {

    // 未设置状态码则默认成功状态 -- 此处 一般接口状态返回的字段为 code 或者 status 根据接口字段来
    // const code = res.data.code || 200;
    
    const code = res.data.status || 200;
    // 此处返回的状态信息字段也根据实际情况来
    const msg = errorCode[code] || res.data.message || errorCode
    // 二进制数据则直接返回
    if (res.request.responseType === "blob" || res.request.responseType === "arraybuffer") {
        return res.data;
    }
    if (code === 401) {
        if (!isRelogin.show) {
            isRelogin.show = true;
            ElMessageBox.confirm(
                "登录状态已过期，您可以继续留在该页面，或者重新登录",
                "系统提示",
                {
                    confirmButtonText: "重新登录",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(() => {
                    isRelogin.show = false;
                    // 需要 在 pinia 写 logOut登出方法
                    piniaStore.useUserStore.logOut().then(() => {
                        // 重新登录要返回的页面 - 根据实际情况来
                        // location.href = "/index";
                    });
                })
                .catch(() => {
                    isRelogin.show = false;
                });
        }
        return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
    } else if (code === 500) {
        ElMessage({
            message: msg,
            type: "error"
        });
        return Promise.reject(new Error(msg));
    } else if (code !== 200) {
        ElNotification.error({
            title: msg
        });
        return Promise.reject("error");
    } else {
        return res.data;
    }

},
(error: any) => {
        let { message } = error;
        if (message == "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        ElMessage({
            message: message,
            type: "error",
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
)

export default service;