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
    describe: "应用程序内核版本",
    curValue: "5.0.0.1",
    dataType: "字符串"
  },
  {
    name: "_cpu",
    describe: "CPU负荷",
    curValue: "0.000000",
    dataType: "浮点"
  },
  {
    name: "_mem_total",
    describe: "内存总数(k)",
    curValue: 0,
    dataType: "整形"
  },
  {
    name: "_mem_used",
    describe: "已经使用内存(k)",
    curValue: 0,
    dataType: "整形"
  },
  {
    name: "_m_run_time",
    describe: "机器运行时间(小时)",
    curValue: "0.000000",
    dataType: "浮点"
  },
  {
    name: "_p_run_time",
    describe: "采集程序运行时间(小时)",
    curValue: "0.000000",
    dataType: "浮点"
  },
  {
    name: "_m_sn",
    describe: "本机编号",
    curValue: "123456",
    dataType: "字符串"
  },
  {
    name: "_time_zone",
    describe: "时区",
    curValue: 8,
    dataType: "整形"
  },
  {
    name: "_local_time",
    describe: "网关本地时间",
    curValue: parseTime(new Date()),
    dataType: "字符串"
  },
  {
    name: "_product_name",
    describe: "产品名称",
    curValue: "本地运行",
    dataType: "字符串"
  },
  {
    name: "_project_name",
    describe: "工程名称",
    curValue: "",
    dataType: "字符串"
  },
  {
    name: "_project_create_time",
    describe: "工程创建时间",
    curValue: "",
    dataType: "字符串"
  },
  {
    name: "_plat_desc",
    describe: "平台描述",
    curValue: "dll",
    dataType: "字符串"
  },
  {
    name: "_machine_code",
    describe: "授权机器码",
    curValue: "18309394CC4BC966",
    dataType: "字符串"
  },
  {
    name: "_license_info",
    describe: "授权信息",
    curValue: "未授权",
    dataType: "字符串"
  },
  {
    name: "_io_list",
    describe: "支持的采集插件列表",
    curValue: "支持全部采集插件",
    dataType: "字符串"
  },
  {
    name: "_ds_list",
    describe: "支持的转发插件列表",
    curValue: "支持全部转发插件",
    dataType: "字符串"
  },
  {
    name: "_left_time",
    describe: "运行剩余时间(小时)",
    curValue: "1.47332",
    dataType: "字符串"
  },
  {
    name: "_max_db_count",
    describe: "支持的采集标签数",
    curValue: 999999999,
    dataType: "整形"
  },
  {
    name: "_vendor",
    describe: "授权单位",
    curValue: "中国电子系统技术有限公司",
    dataType: "字符串"
  },
  {
    name: "_device_type",
    describe: "设备类型",
    curValue: "采集网关",
    dataType: "字符串"
  },
  {
    name: "_machine_active",
    describe: "采集系统状态",
    curValue: 1,
    dataType: "布尔"
  },
  {
    name: "_tag_count",
    describe: "数据标签总数",
    curValue: 0,
    dataType: "整形"
  },
  {
    name: "_api_client_count",
    describe: "当前客户端个数",
    curValue: 0,
    dataType: "整形"
  }
];

// 表格数据 - 通道
const passDic = [
  {
    name: "_scan_count",
    describe: "通道扫描计数器",
    curValue: "631",
    dataType: "字符串",
    type: "collect"
  },
  {
    name: "_ds_scan_count",
    describe: "通道扫描计数器",
    curValue: "0",
    dataType: "字符串",
    type: "data"
  },
  {
    name: "_send_byte",
    describe: "发送字节数(BYTE)",
    curValue: 0,
    dataType: "整形",
    type: "collect"
  },
  {
    name: "_rev_byte",
    describe: "接收字节数(BYTE)",
    curValue: 0,
    dataType: "整形",
    type: "collect"
  },
  {
    name: "_io_status",
    describe: "通道打开状态",
    curValue: 1,
    dataType: "布尔",
    type: "collect"
  },
  {
    name: "_ds_io_status",
    describe: "通道打开状态",
    curValue: 0,
    dataType: "布尔",
    type: "data"
  },
  {
    name: "_plug_name",
    describe: "插件名称",
    curValue: "",
    dataType: "字符串",
    type: "collect"
  },
  {
    name: "_ds_plug_name",
    describe: "插件名称",
    curValue: "",
    dataType: "字符串",
    type: "data"
  },
  {
    name: "_plug_license",
    describe: "插件授权状态",
    curValue: "已经授权",
    dataType: "字符串",
    type: "collect_data"
  },
  {
    name: "_write_count",
    describe: "缓存下行点个数",
    curValue: 0,
    dataType: "整形",
    type: "collect"
  }
];

// 表格数据 - 设备
const equipmentDic = [
  {
    name: "_send_package",
    describe: "发送帧个数",
    curValue: 0,
    dataType: "整形"
  },
  {
    name: "_rev_package",
    describe: "接收帧个数",
    curValue: 0,
    dataType: "整形"
  },
  {
    name: "_success_rate",
    describe: "通信成功率",
    curValue: "0.000000",
    dataType: "浮点"
  },
  {
    name: "_io_status",
    describe: "设备状态",
    curValue: 0,
    dataType: "布尔"
  }
];

export { IPList, systemDic, passDic, equipmentDic };
