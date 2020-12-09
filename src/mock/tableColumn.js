// 表格列项 - 通道
const passTagColumn = [
  {
    prop: "name",
    label: "名称（英文）",
    minWidth: 120
  },
  {
    prop: "describe",
    label: "描述（中文）",
    minWidth: 160
  },
  {
    prop: "dataType",
    label: "数据类型",
    minWidth: 70
  },
  {
    prop: "direction",
    label: "读写方向",
    minWidth: 70
  },
  {
    prop: "acquisitionCycle",
    label: "采集周期",
    minWidth: 70
  },
  {
    prop: "IOTag",
    label: "IO标签链接",
    minWidth: 170
  },
  {
    prop: "slaveStationID",
    label: "从站ID",
    minWidth: 55
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
    prop: "dataFormat",
    label: "数据格式",
    minWidth: 70
  }
];

// 表格列项 - 设备
const equipmentTagColumn = [
  {
    prop: "name",
    label: "名称（英文）",
    minWidth: 110
  },
  {
    prop: "describe",
    label: "描述（中文）",
    minWidth: 140
  },
  {
    prop: "dataType",
    label: "数据类型",
    minWidth: 70
  },
  {
    prop: "direction",
    label: "读写方向",
    minWidth: 70
  },
  {
    prop: "acquisitionCycle",
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
    "describe",
    "dataType",
    "direction",
    "acquisitionCycle",
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
    "describe",
    "dataType",
    "direction",
    "acquisitionCycle",
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
  describe: "描述（中文）",
  dataType: "数据类型",
  direction: "读写方向",
  acquisitionCycle: "采集周期",
  IOTag: "IO标签链接",
  slaveStationID: "从站ID",
  registerType: "寄存器类型",
  registerAddr: "寄存器地址",
  dataFormat: "数据格式",
  analyticalMethod: "解析方式",
  displacementDeviation: "位移偏量",
  useBCD: "按BCD"
};

export {
  passTagColumn,
  equipmentTagColumn,
  passTagHeader,
  equipmentTagHeader,
  tagTranslation
};
