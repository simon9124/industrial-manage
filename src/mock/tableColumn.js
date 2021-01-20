// 表格列项 - 通道
const passTagColumn = [
  {
    prop: "name",
    label: "名称（英文）",
    minWidth: 120
  },
  {
    prop: "description",
    label: "描述（中文）",
    minWidth: 160
  },
  {
    prop: "typeTable",
    label: "数据类型",
    minWidth: 70
  },
  {
    prop: "rwTable",
    label: "读写方向",
    minWidth: 70
  },
  {
    prop: "cycle",
    label: "采集周期",
    minWidth: 70
  }
  // {
  //   prop: "IOTag",
  //   label: "IO标签链接",
  //   minWidth: 170
  // },
  // {
  //   prop: "slaveStationID",
  //   label: "从站ID",
  //   minWidth: 55
  // },
  // {
  //   prop: "registerType",
  //   label: "寄存器类型",
  //   minWidth: 85
  // },
  // {
  //   prop: "registerAddr",
  //   label: "寄存器地址",
  //   minWidth: 85
  // },
  // {
  //   prop: "dataFormat",
  //   label: "数据格式",
  //   minWidth: 70
  // }
];

// 表格列项 - 设备
const equipmentTagColumn = [
  {
    prop: "name",
    label: "名称（英文）",
    minWidth: 110
  },
  {
    prop: "description",
    label: "描述（中文）",
    minWidth: 140
  },
  {
    prop: "type",
    label: "数据类型",
    minWidth: 70
  },
  {
    prop: "rw",
    label: "读写方向",
    minWidth: 70
  },
  {
    prop: "cycle",
    label: "采集周期",
    minWidth: 70
  },
  {
    prop: "registerType",
    label: "寄存器类型",
    minWidth: 85
  },
  {
    prop: "registerAddr",
    label: "寄存器地址",
    minWidth: 85
  },
  {
    prop: "analyticalMethod",
    label: "解析方式",
    minWidth: 70
  },
  {
    prop: "displacementDeviation",
    label: "位移偏量",
    minWidth: 70
  }
];

// 导出的表头 - 通道
const passTagHeader = {
  tHeader: [
    "序号",
    "名称（英文）",
    "描述（中文）",
    "数据类型",
    "读写方向",
    "采集周期",
    "IO标签链接",
    "从站ID",
    "寄存器类型",
    "寄存器地址",
    "数据格式"
  ],
  filterVal: [
    "index",
    "name",
    "description",
    "type",
    "rw",
    "cycle",
    "IOTag",
    "slaveStationID",
    "registerType",
    "registerAddr",
    "dataFormat"
  ]
};

// 导出的表头 - 设备
const equipmentTagHeader = {
  tHeader: [
    "序号",
    "名称（英文）",
    "描述（中文）",
    "数据类型",
    "读写方向",
    "采集周期",
    "寄存器类型",
    "寄存器地址",
    "解析方式",
    "位移偏量",
    "按BCD"
  ],
  filterVal: [
    "index",
    "name",
    "description",
    "type",
    "rw",
    "cycle",
    "registerType",
    "registerAddr",
    "analyticalMethod",
    "displacementDeviation",
    "useBCD"
  ]
};

// 表头中英文对照
const tagTranslation = {
  index: "序号",
  name: "名称（英文）",
  description: "描述（中文）",
  type: "数据类型",
  rw: "读写方向",
  cycle: "采集周期",
  IOTag: "IO标签链接",
  slaveStationID: "从站ID",
  registerType: "寄存器类型",
  registerAddr: "寄存器地址",
  dataFormat: "数据格式",
  analyticalMethod: "解析方式",
  displacementDeviation: "位移偏量",
  useBCD: "按BCD"
};

// tag其他参数 - 设备系数列表
const calculationList = [
  {
    label: "不参与计算",
    value: 0
  },
  {
    label: "乘设备系数R1",
    value: 1
  },
  {
    label: "乘设备系数R2",
    value: 2
  },
  {
    label: "乘设备系数R1*R2",
    value: 3
  }
];

// tag其他参数 - 高级运算列表
const advancedOperationList = [
  { label: "无计算", value: 0 },
  { label: "科学计数法", value: 1 },
  { label: "1字节无符号", value: 2 },
  { label: "1字节有符号", value: 3 },
  { label: "2字节无符号 先高后低", value: 4 },
  { label: "2字节无符号 先低后高", value: 5 },
  { label: "2字节有符号 先高后低", value: 6 },
  { label: "2字节有符号 先低后高", value: 7 },
  { label: "3字节无符号 先高后低", value: 8 },
  { label: "3字节无符号 先低后高", value: 9 },
  { label: "3字节有符号 先高后低", value: 10 },
  { label: "3字节有符号 先低后高", value: 11 },
  { label: "4字节无符号 顺序4321", value: 12 },
  { label: "4字节无符号 顺序3412", value: 13 },
  { label: "4字节无符号 顺序2143", value: 14 },
  { label: "4字节无符号 顺序1234", value: 15 },
  { label: "4字节有符号 顺序4321", value: 16 },
  { label: "4字节有符号 顺序3412", value: 17 },
  { label: "4字节有符号 顺序2143", value: 18 },
  { label: "4字节有符号 顺序1234", value: 19 },
  { label: "4字节浮点数 顺序4321", value: 20 },
  { label: "4字节浮点数 顺序3412", value: 21 },
  { label: "4字节浮点数 顺序2143", value: 22 },
  { label: "4字节浮点数 顺序1234", value: 23 },
  { label: "8字节浮点数 顺序87654321", value: 24 },
  { label: "8字节浮点数 顺序65872143", value: 25 },
  { label: "8字节浮点数 顺序12345678", value: 26 },
  { label: "8字节浮点数 顺序34127856", value: 27 },
  { label: "取子字符串", value: 28 },
  { label: "按位取", value: 29 }
];

export {
  passTagColumn,
  equipmentTagColumn,
  passTagHeader,
  equipmentTagHeader,
  tagTranslation,
  calculationList,
  advancedOperationList
};
