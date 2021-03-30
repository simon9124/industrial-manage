import { parseTime } from "@/libs/util"; // function - 格式化时间

// IP列表
const IPList = [
  {
    address: "172.15.19.109",
    system: "",
    productName: "",
    factoryDescribe: "",
    kernelEdition: "",
    faultTimes: 0,
    createTime: "",
    status: "离线",
    id: "1",
    operate: false
  }
];

// 表格数据 - 系统
const systemDic = [
  {
    name: "_kernal_version",
    description: "应用程序内核版本",
    value: "5.0.0.1",
    dataType: "字符串"
  },
  {
    name: "_cpu",
    description: "CPU负荷",
    value: "0.000000",
    dataType: "浮点"
  },
  {
    name: "_mem_total",
    description: "内存总数(k)",
    value: 0,
    dataType: "整形"
  },
  {
    name: "_mem_used",
    description: "已经使用内存(k)",
    value: 0,
    dataType: "整形"
  },
  {
    name: "_m_run_time",
    description: "机器运行时间(小时)",
    value: "0.000000",
    dataType: "浮点"
  },
  {
    name: "_p_run_time",
    description: "采集程序运行时间(小时)",
    value: "0.000000",
    dataType: "浮点"
  },
  {
    name: "_m_sn",
    description: "本机编号",
    value: "123456",
    dataType: "字符串"
  },
  {
    name: "_time_zone",
    description: "时区",
    value: 8,
    dataType: "整形"
  },
  {
    name: "_local_time",
    description: "网关本地时间",
    value: parseTime(new Date()),
    dataType: "字符串"
  },
  {
    name: "_product_name",
    description: "产品名称",
    value: "本地运行",
    dataType: "字符串"
  },
  {
    name: "_project_name",
    description: "工程名称",
    value: "",
    dataType: "字符串"
  },
  {
    name: "_project_create_time",
    description: "工程创建时间",
    value: "",
    dataType: "字符串"
  },
  {
    name: "_plat_desc",
    description: "平台描述",
    value: "dll",
    dataType: "字符串"
  },
  {
    name: "_machine_code",
    description: "授权机器码",
    value: "18309394CC4BC966",
    dataType: "字符串"
  },
  {
    name: "_license_info",
    description: "授权信息",
    value: "未授权",
    dataType: "字符串"
  },
  {
    name: "_io_list",
    description: "支持的采集插件列表",
    value: "支持全部采集插件",
    dataType: "字符串"
  },
  {
    name: "_ds_list",
    description: "支持的转发插件列表",
    value: "支持全部转发插件",
    dataType: "字符串"
  },
  {
    name: "_left_time",
    description: "运行剩余时间(小时)",
    value: "1.47332",
    dataType: "字符串"
  },
  {
    name: "_max_db_count",
    description: "支持的采集标签数",
    value: 999999999,
    dataType: "整形"
  },
  {
    name: "_vendor",
    description: "授权单位",
    value: "中国电子系统技术有限公司",
    dataType: "字符串"
  },
  {
    name: "_device_type",
    description: "设备类型",
    value: "采集网关",
    dataType: "字符串"
  },
  {
    name: "_machine_active",
    description: "采集系统状态",
    value: 1,
    dataType: "布尔"
  },
  {
    name: "_tag_count",
    description: "数据标签总数",
    value: 0,
    dataType: "整形"
  },
  {
    name: "_api_client_count",
    description: "当前客户端个数",
    value: 0,
    dataType: "整形"
  }
];

// 表格数据 - 通道
const passDic = [
  {
    name: "_scan_count",
    description: "通道扫描计数器",
    value: "631",
    dataType: "字符串",
    type: "collect"
  },
  {
    name: "_ds_scan_count",
    description: "通道扫描计数器",
    value: "0",
    dataType: "字符串",
    type: "data"
  },
  {
    name: "_send_byte",
    description: "发送字节数(BYTE)",
    value: 0,
    dataType: "整形",
    type: "collect"
  },
  {
    name: "_rev_byte",
    description: "接收字节数(BYTE)",
    value: 0,
    dataType: "整形",
    type: "collect"
  },
  {
    name: "_io_status",
    description: "通道打开状态",
    value: 1,
    dataType: "布尔",
    type: "collect"
  },
  {
    name: "_ds_io_status",
    description: "通道打开状态",
    value: 0,
    dataType: "布尔",
    type: "data"
  },
  {
    name: "_plug_name",
    description: "插件名称",
    value: "",
    dataType: "字符串",
    type: "collect"
  },
  {
    name: "_ds_plug_name",
    description: "插件名称",
    value: "",
    dataType: "字符串",
    type: "data"
  },
  {
    name: "_plug_license",
    description: "插件授权状态",
    value: "已经授权",
    dataType: "字符串",
    type: "collect_data"
  },
  {
    name: "_write_count",
    description: "缓存下行点个数",
    value: 0,
    dataType: "整形",
    type: "collect"
  }
];

// 表格数据 - 设备
const equipmentDic = [
  {
    name: "_send_package",
    description: "发送帧个数",
    value: 0,
    dataType: "整形"
  },
  {
    name: "_rev_package",
    description: "接收帧个数",
    value: 0,
    dataType: "整形"
  },
  {
    name: "_success_rate",
    description: "通信成功率",
    value: "0.000000",
    dataType: "浮点"
  },
  {
    name: "_io_status",
    description: "设备状态",
    value: 0,
    dataType: "布尔"
  }
];

export { IPList, systemDic, passDic, equipmentDic };
