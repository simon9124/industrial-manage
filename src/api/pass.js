import axios from "@/libs/api.request";

// 获取通道列表
export const queryPassList = data => {
  return axios.request({
    url: "/network/pipeline/queryList",
    data,
    method: "post"
  });
};

// 新增通道
export const addPass = data => {
  return axios.request({
    url: "/network/pipeline/add",
    data,
    method: "post"
  });
};
