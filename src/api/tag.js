import axios from "@/libs/api.request";

// 获取标签列表
export const queryTagList = data => {
  return axios.request({
    url: "/network/label/queryList",
    data,
    method: "post"
  });
};

// 新增标签
export const addTag = data => {
  return axios.request({
    url: "/network/label/add",
    data,
    method: "post"
  });
};

// 获取标签详情
export const queryTagMessage = data => {
  return axios.request({
    url: "/network/label/queryMessage",
    data,
    method: "post"
  });
};

// 修改标签
export const updateTag = data => {
  return axios.request({
    url: "/network/label/update",
    data,
    method: "post"
  });
};

// 删除标签
export const deleteTag = data => {
  return axios.request({
    url: "/network/label/delete",
    data,
    method: "post"
  });
};
