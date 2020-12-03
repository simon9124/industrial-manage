import axios from "@/libs/api.request";

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

export const queryUserList = () => {
  const data = {
    page: 1
  };
  return axios.request({
    url: "/network/user/queryUserList",
    data,
    method: "post"
  });
};
