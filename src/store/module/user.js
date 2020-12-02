import {
  login,
  // logout,
  getUserInfo
} from "@/api/user";
import { setToken, getToken, localSave } from "@/libs/util";

export default {
  state: {
    userName: "",
    userId: "",
    avatorImgPath: "",
    token: getToken(),
    access: "",
    hasGetInfo: false,
    permissions: []
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath;
    },
    setUserId(state, id) {
      state.userId = id;
    },
    setUserName(state, name) {
      state.userName = name;
    },
    setAccess(state, access) {
      state.access = access;
    },
    setToken(state, token) {
      state.token = token;
      setToken(token);
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status;
    },
    setPermissions(state, permissions) {
      // 追加：用户接口权限
      state.permissions = permissions;
    }
  },
  getters: {
    userAccess: state => state.access,
    userName: state => state.userName,
    token: state => state.token
  },
  actions: {
    // 登录
    handleLogin({ commit }, { userName, password }) {
      userName = userName.trim();
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        })
          .then(res => {
            const data = res.data.data;
            commit("setToken", data.token);
            commit("setHasGetInfo", true); // 追加：用户已登录
            /* 追加：用户接口权限 */
            // const permissions = [];
            // data.permissionsList.forEach(permission => {
            //   permissions.push(permission.id);
            // });
            commit("setPermissions", data.permissions);
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 退出登录
    handleLogOut({ state, commit }) {
      return new Promise((resolve, reject) => {
        // logout(state.token)
        //   .then(() => {
        //     // commit('setToken', '')
        //     commit("setAccess", []);
        //     resolve();
        //   })
        //   .catch(err => {
        //     reject(err);
        //   });
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit("setToken", "");
        commit("setAccess", []);
        localSave("dynamicRouter-gateway", []); // 清空本地存储localStorage中的dynamicRouter
        localSave("tagNaveList-template", []); // 清空localStorage中的tagNaveList记录
        resolve();
      });
    },
    // 获取用户相关信息
    getUserInfo({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token)
            .then(res => {
              const data = res.data.data;
              commit("setAvator", data.avator);
              commit("setUserName", data.name);
              commit("setUserId", data.user_id);
              commit("setAccess", data.access);
              commit("setHasGetInfo", true);
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        } catch (error) {
          reject(error);
        }
      });
    }
  }
};
