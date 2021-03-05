import axios from "@/libs/api.request";

// 执行命令语句
export const doShellCmd = data => {
  return axios.request({
    url: "/koa/action/doShellCmd",
    data,
    method: "post"
  });
};
