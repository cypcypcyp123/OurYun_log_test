import { createApp,createVNode  } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import '@/assets/css/style.scss'
import { store }  from '@/store'
import App from './App.vue'
// 引入图标样式
import '@/assets/iconfont/iconfont.css'
import * as Icons from "@element-plus/icons-vue";
// 引入拦截js
import '@/permission'

// ---------- 引入vue-router --------------
import router from './router'
const app = createApp(App)
// 全局注册icon
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key]);
});
  
// Icon自定组件
const Icon = (props) => {
  const { icon } = props;
  return createVNode(Icons[icon]);
};
app.component("Icon", Icon);
app.use(store)
app.use(ElementPlus, {
  locale: zhCn
})
app.use(router)
app.mount('#app')