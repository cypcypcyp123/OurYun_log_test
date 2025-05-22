import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {

  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue({
        script:{
          defineModel: true  // 打开defineModel编译宏函数
        }
      }),
      vueSetupExtend(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        // !引入常用的api文件自动导入，后期 .vue文件中可以直接使用
        imports: ['vue', 'vue-router',  { 'pinia' : ['storeToRefs']}],
        //! 指定auto-import.d.ts生成的地址路径
        dts: 'src/auto-import.d.ts'
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server:{
      host:'127.0.0.1',//打开时候浏览器的地址
      port:8080,//配置启动的端口
      open:true,//启动自动运行
      proxy:{
        [env.VITE_APP_BASEURL]:{
          target: env.VITE_APP_PROXY, //代理接口的主路径地址
          changeOrigin:true,//是否允许跨域
          //重写匹配字段,如果不需要放在请求路径上，后边第二个值重写''
          //通过new RegExp()将系统变量字符串形式的正则转化为真正的正则
          rewrite:(path)=>path.replace(new RegExp(env.VITE_APP_REG_URL),'')
        }
      }
    }
  }
})

