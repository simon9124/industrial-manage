import axios from "axios";
import store from "@/store";
import { getToken } from "./util";
import router from "@/router";
import { Message } from "iview";
// import { Spin } from 'iview'

const addErrorLog = errorInfo => {
  const {
    statusText,
    success,
    request: { responseURL }
  } = errorInfo;
  let info = {
    type: "ajax",
    code: success,
    mes: statusText,
    url: responseURL
  };
  if (!responseURL.includes("save_error_logger")) {
    store.dispatch("addErrorLog", info);
  }
};

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {}
    };
    return config;
  }
  destroy(url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 如果响应含有token -> 让每个请求携带token，将token放入请求头的Authorization
        // getToken() && (config.headers.Authorization = "Bearer " + getToken());
        // 自定义headers
        getToken() && (config.headers.token = getToken());
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[url] = true;
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        if (res.data.success === "4081") {
          // token过期
          store.dispatch("handleLogOut");
          router.push({ path: "/login" });
        } else {
          // 非token过期
          res.data.success !== "200" &&
            Message.error({
              // 全局提示5秒的错误讯息
              content: res.data.message,
              duration: 5
            });
        }
        this.destroy(url);
        const { data } = res;
        return { data };
      },
      error => {
        this.destroy(url);
        addErrorLog(error.response);
        return Promise.reject(error);
      }
    );
  }
  request(options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}
export default HttpRequest;
