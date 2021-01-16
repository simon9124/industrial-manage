import axios from "@/libs/api.request";

// 获取设备列表
export const queryEqupementList = data => {
  return axios.request({
    url: "/network/device/queryList",
    data,
    method: "post"
  });
};

// 新增设备
export const addEqupement = data => {
  return axios.request({
    url: "/network/device/add",
    data,
    method: "post"
  });
};

// 获取设备详情
export const queryEqupementMessage = data => {
  return axios.request({
    url: "/network/device/queryMessage",
    data,
    method: "post"
  });
};

// 修改通道
export const updateEqupement = data => {
  return axios.request({
    url: "/network/device/update",
    data,
    method: "post"
  });
};

// 删除设备
export const deleteEqupement = data => {
  return axios.request({
    url: "/network/device/delete",
    data,
    method: "post"
  });
};
