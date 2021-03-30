import axios from "@/libs/api.request";

// 获取远程监视列表
export const queryRemoteMonitorList = data => {
  return axios.request({
    url: "/network/remoteMonitoring/queryList",
    data,
    method: "post"
  });
};
