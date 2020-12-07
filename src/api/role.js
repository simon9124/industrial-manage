import axios from "@/libs/api.request";

// 获取角色列表
export const queryRoleList = object => {
  const data = { page: 1 };
  return axios.request({
    url: "/network/role//queryRoleList",
    data,
    method: "post"
  });
};
