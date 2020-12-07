import axios from "@/libs/api.request";

// 用户登录
export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  };
  return axios.request({
    url: "/network/user/login",
    data,
    method: "post"
  });
};

export const getUserInfo = token => {
  return axios.request({
    url: "get_info",
    params: {
      token
    },
    method: "get"
  });
};

export const logout = token => {
  return axios.request({
    url: "logout",
    method: "post"
  });
};

// 获取用户列表
export const queryUserList = object => {
  const data = {
    page: object.pageNum,
    size: object.pageSize,
    sort: object.sort
  };
  return axios.request({
    url: "/network/user/queryUserList",
    data,
    method: "post"
  });
};

// 新增用户
export const userAdd = data => {
  return axios.request({
    url: "/network/user/add",
    data,
    method: "post"
  });
};

// 修改用户
export const userUpdate = data => {
  return axios.request({
    url: "/network/user/update",
    data,
    method: "post"
  });
};

// 删除用户
export const userDelete = data => {
  return axios.request({
    url: "/network/user/delete",
    data,
    method: "post"
  });
};
