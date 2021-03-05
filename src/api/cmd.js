import axios from "@/libs/api.request";

// 获取设备列表
export const doShellCmd = () => {
  return axios.request({
    url: "/koa/action/doShellCmd",
    method: "get"
  });
};
