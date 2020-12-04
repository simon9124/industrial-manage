import Vue from "vue";
import Router from "vue-router";
import {
  routes, // 总路由表
  constantRouter // 静态路由表
} from "./routers";
import store from "@/store";
import iView from "iview";
import { setToken, getToken, canTurnTo, localRead } from "@/libs/util";
// import config from "@/config";
// const { homeName } = config;

Vue.use(Router);
const router = new Router({
  routes
  // 部署到github gh-pages -> 取消history
  // mode: "history"
});
const LOGIN_PAGE_NAME = "login"; // 登录页
const whiteList = []; // 白名单

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) {
    // 有权限，可访问
    next();
  } else {
    // 无权限，重定向到401页面
    next({ replace: true, name: "error_401" });
  }
};

// 方法：初始化路由表刷新
export const refreshRoute = () => {
  const routes = [...constantRouter];
  // 新路由实例matcer，赋值给旧路由实例的matcher，（相当于replaceRouter）
  router.matcher = new Router({ routes }).matcher;
};

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  const token = getToken();
  if (whiteList.some(name => name === to.name)) {
    next(); // 在免登录白名单 -> 直接进入
  } else if (!token && to.name !== LOGIN_PAGE_NAME) {
    next({ name: LOGIN_PAGE_NAME }); // 未登录且要跳转的页面不是登录页 -> 跳转到登录页
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    next(); // 未登陆且要跳转的页面是登录页 -> 可跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // next({ name: homeName }); // 已登录且要跳转的页面是登录页 -> 跳转到homeName页
    next({ name: "home" }); // 已登录且要跳转的页面是登录页 -> 跳转到该角色的首页
    iView.LoadingBar.finish(); // 追加：已登录后点击浏览器返回按钮，滚动条结束
  } else {
    // 剩余情况：已登录且要跳转的页面不是登录页
    if (store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next);
    } else {
      store
        .dispatch("getRouters")
        .then(res => {
          // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
          turnTo(to, [localRead("gateway-access").toString()], next);
        })
        .catch(() => {
          setToken("");
          next({ name: "login" });
        });
    }
  }
});

router.afterEach(to => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;
