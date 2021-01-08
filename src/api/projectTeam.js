import axios from "@/libs/api.request";

// 获取工程组列表
export const queryProjectTeamList = object => {
  const data = { page: 1, size: 20, sort: "id" };
  return axios.request({
    url: "/network/projectTeam/queryList",
    data,
    method: "post"
  });
};

// 新增工程组
export const addProjectTeam = data => {
  return axios.request({
    url: "/network/projectTeam/add",
    data,
    method: "post"
  });
};

// 修改工程组
export const updateProjectTeam = data => {
  return axios.request({
    url: "/network/projectTeam/update",
    data,
    method: "post"
  });
};

// 删除工程组
export const deleteProjectTeam = data => {
  return axios.request({
    url: "/network/projectTeam/delete",
    data,
    method: "post"
  });
};
