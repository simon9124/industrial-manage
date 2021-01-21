import axios from "@/libs/api.request";

// 获取工程列表
export const queryProjectList = teamId => {
  const data = { page: 1, size: 1000, sort: "id", teamId: teamId };
  return axios.request({
    url: "/network/project/queryList",
    data,
    method: "post"
  });
};

// 新增工程
export const addProject = data => {
  return axios.request({
    url: "/network/project/add",
    data,
    method: "post"
  });
};

// 修改工程
export const updateProject = data => {
  return axios.request({
    url: "/network/project/update",
    data,
    method: "post"
  });
};

// 删除工程
export const deleteProject = data => {
  return axios.request({
    url: "/network/project/delete",
    data,
    method: "post"
  });
};

// 生成工程配置文件
export const saveProjectXml = data => {
  return axios.request({
    url: "/network/project/saveProjectXml",
    data,
    method: "post"
  });
};
