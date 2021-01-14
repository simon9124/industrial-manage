import axios from "@/libs/api.request";

// 获取插件类型列表
export const queryPlushTypeList = data => {
  return axios.request({
    url: "/network/plush/queryPlushTypeList",
    data,
    method: "post"
  });
};

// 获取插件列表
export const queryPlushList = data => {
  return axios.request({
    url: "/network/plush/queryPlushList",
    data,
    method: "post"
  });
};
