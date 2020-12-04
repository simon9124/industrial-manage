import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead
} from "@/libs/util";
import beforeClose from "@/router/before-close";
import { saveErrorLogger } from "@/api/data";
import router from "@/router";
import config from "@/config";
import {
  routerDataHanding, // 遍历后台返回的路由数据，转为路由基础数据
  filterAsyncRouter, // 遍历路由基础数据，转换为前端组件对象
  menuListHanding, // 遍历菜单数据，将"原本不应挂载在根菜单"的数据，重新挂载到相应位置
  routerUpdateHandle // 遍历routes路由数据，1.手动往router.options.routes里添加数据；2.如routes里的name有变化，手动修改router.options.routes的name
} from "@/libs/router-util";
// import { getValueByKey } from "@/libs/dataHanding"; // 根据对象数组某个key的value，查询另一个key的value
import { allMenuList } from "@/mock/role"; // mockData - 菜单列表

const { homeName } = config;
const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route);
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route);
  });
  router.push(nextRoute);
};

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead("local"),
    errorList: [],
    hasReadErrorPage: false,
    menuList: [], // 菜单数据
    redirectRouter: [] //  动态重定向路由 - 动态首页时使用
  },
  getters: {
    menuList: (state, getters, rootState) => state.menuList, // 改造：动态菜单渲染
    errorCount: state => state.errorList.length
  },
  mutations: {
    setBreadCrumb(state, route) {
      // state.breadCrumbList = getBreadCrumbList(route, state.homeRoute);
      state.breadCrumbList = getBreadCrumbList(route);
    },
    // 配置主页route
    setHomeRoute(state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName);
    },
    setTagNavList(state, list) {
      let tagList = [];
      if (list) {
        tagList = [...list];
      } else tagList = getTagNavListFromLocalstorage() || [];
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift();
      let homeTagIndex = tagList.findIndex(item => item.name === homeName);
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0];
        tagList.unshift(homeTag);
      }
      state.tagNavList = tagList;
      setTagNavListInLocalstorage([...tagList]);
    },
    closeTag(state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route));
      route = tag[0] ? tag[0] : null;
      if (!route) return;
      if (
        route.meta &&
        route.meta.beforeCloseName &&
        route.meta.beforeCloseName in beforeClose
      ) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route);
          }
        });
      } else {
        closePage(state, route);
      }
    },
    addTag(state, { route, type = "unshift" }) {
      let router = getRouteTitleHandled(route);
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === "push") state.tagNavList.push(router);
        else {
          if (router.name === homeName) state.tagNavList.unshift(router);
          else state.tagNavList.splice(1, 0, router);
        }
        setTagNavListInLocalstorage([...state.tagNavList]);
      }
    },
    setLocal(state, lang) {
      localSave("local", lang);
      state.local = lang;
    },
    addError(state, error) {
      state.errorList.push(error);
    },
    setHasReadErrorLoggerStatus(state, status = true) {
      state.hasReadErrorPage = status;
    },
    // 修改state.menuList，生成左侧菜单
    setMenuList(state, data) {
      state.menuList = getMenuByRouter(data.menuList, data.access);
    },
    // 动态重定向路由， 动态首页时使用
    setRedirectRouter(state, data) {
      state.redirectRouter = data;
    }
  },
  actions: {
    addErrorLog({ commit, rootState }, info) {
      if (!window.location.href.includes("error_logger_page")) {
        commit("setHasReadErrorLoggerStatus", false);
      }
      const {
        user: { token, userId, userName }
      } = rootState;
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      };
      saveErrorLogger(info).then(() => {
        commit("addError", data);
      });
    },
    // 动态添加路由数据 -> 首次登录挂载路由
    addRouterData({ commit, rootState }, routes) {
      /* 1.动态添加路由（不会立刻刷新，需要手动往router.options.routes里添加数据） */
      router.addRoutes(routes.concat(rootState.app.redirectRouter)); // 动态添加路由
      routerUpdateHandle(routes, router); // 手动添加路由数据
      console.log("动态添加路由：", routes);
      /* 3.处理菜单数据 */
      var menuList = JSON.parse(JSON.stringify(routes));
      menuList = menuListHanding(menuList); // 将"原本不应挂载在根菜单"的数据，重新挂载到相应位置
      console.log("左侧动态菜单：", menuList);
      /* 4.提交到 setMenuList，修改state.menuList */
      commit("setMenuList", {
        menuList: menuList,
        access: rootState.user.access
      });
    },
    // 获取动态路由数据
    getRouters({ dispatch, commit, rootState }, routes) {
      return new Promise((resolve, reject) => {
        var gotRouter = []; // 设置动态路由
        if (localRead("dynamicRouter-gateway") === "") {
          /* localStorage里dynamicRouter值为空 -> 没有路由数据 -> 获取路由数据 */
          console.log("获取路由：从api");
          /* 1.拿到路由接口数据 */
          var routerData = allMenuList;
          /* 2.根据用户角色，处理该角色的路由数据 */
          routerData = routerDataHanding(
            JSON.parse(JSON.stringify(routerData))
          ); // 过滤路由，转为路由基础数据
          /* 3.处理路由重定向 - 不同角色用户的动态首页 */
          const redirectRouter = [
            {
              path: "/",
              redirect:
                localRead("gateway-access") === "0"
                  ? "/user/manage"
                  : localRead("gateway-access") === "1"
                    ? "/log/manage"
                    : "/control",
              meta: {
                id: Math.random()
                  .toString(36)
                  .substr(-10)
              },
              name: "home"
            }
          ];
          localSave("redirectRouter-gateway", JSON.stringify(redirectRouter)); // 存储到localStorage
          commit("setRedirectRouter", redirectRouter); // 提交到 setRedirectRouter，修改state.redirectRouter
          /* 4.处理后路由数据生成路由和菜单等 */
          localSave("dynamicRouter-gateway", JSON.stringify(routerData)); // 存储到localStorage
          gotRouter = filterAsyncRouter(routerData); // 过滤路由，路由组件转换
          dispatch("addRouterData", gotRouter).then(res => {
            resolve(gotRouter);
          });
        } else {
          /* 有路由数据 -> 直接从localStorage里面获取 */
          console.log("获取路由：从localStorage");
          /* 1.动态路由数据 */
          gotRouter = filterAsyncRouter(
            JSON.parse(localRead("dynamicRouter-gateway"))
          ); // 过滤路由，路由组件转换
          console.log("动态路由数据：", gotRouter);
          /* 2.处理菜单数据 */
          var menuList = JSON.parse(JSON.stringify(gotRouter));
          menuList = menuListHanding(menuList); // 将"原本不应挂载在根菜单"的数据，重新挂载到相应位置
          console.log("左侧动态菜单：", menuList);
          /* 3.提交到 setMenuList，修改state.menuList */
          commit("setMenuList", {
            menuList: menuList,
            access: [localRead("gateway-access").toString()]
          });
          resolve();
        }
      });
    }
  }
};
