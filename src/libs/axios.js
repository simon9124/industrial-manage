import axios from "axios";
import store from "@/store";
import { getToken } from "./util";
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
        getToken() && (config.headers.Authorization = "Bearer " + getToken());
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
        // 全局提示5秒的错误讯息
        res.data.success !== "200" &&
          Message.error({
            content: res.data.message,
            duration: 5
          });
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
