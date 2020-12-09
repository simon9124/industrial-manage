// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import i18n from "@/locale";
import config from "@/config";
import importDirective from "@/directive";
import installPlugin from "@/plugin";
import "./index.less";
import "@/assets/icons/iconfont.css";
import md5 from "js-md5"; // MD5加密

import iView from "iview";
import "iview/dist/styles/iview.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./styles/fontawesome/css/font-awesome.min.css"; // fontawesome

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
});

// isMock时，引入一些mockjs接口
if (config.isMock) require("@/mock");
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue);
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false;
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;
Vue.prototype.isMock = config.isMock;
Vue.prototype.$md5 = md5;
/**
 * @description 全局事件总线注册
 */
Vue.prototype.$EventBus = new Vue();
/**
 * 注册指令
 */
importDirective(Vue);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  i18n,
  store,
  render: h => h(App)
});
