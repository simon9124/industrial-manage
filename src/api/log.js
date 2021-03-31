import axios from "@/libs/api.request";

// 获取日志列表
export const queryLogList = data => {
  return axios.request({
    url: "/network/logs/queryList",
    data,
    method: "post"
  });
};

// 获取设备采集日志列表
export const queryDeviceLogList = data => {
  return axios.request({
    url: "/network/deviceLog/queryList",
    data,
    method: "post"
  });
};
