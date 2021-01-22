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

// 获取通道详情
export const queryPassMessage = data => {
  return axios.request({
    url: "/network/pipeline/queryMessage",
    data,
    method: "post"
  });
};

// 修改通道
export const updatePass = data => {
  return axios.request({
    url: "/network/pipeline/update",
    data,
    method: "post"
  });
};

// 删除通道
export const deletePass = data => {
  return axios.request({
    url: "/network/pipeline/delete",
    data,
    method: "post"
  });
};

// 复制通道
export const copyPass = data => {
  return axios.request({
    url: "/network/pipeline/copy",
    data,
    method: "post"
  });
};
