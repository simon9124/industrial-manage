// 通道数据
const passList = [
  {
    id: "1-1",
    pipelineName: "C1",
    description: "通道1",
    plugin: {
      name: "IND_MODBUS_TCP",
      describe: "MODBUS TCP",
      factory: "莫迪康",
      classification: "通用标准",
      path: "C:\\Users\\43577\\Desktop\\软件\\CESTC\\PluginIo\\IND_MODBUS_RTU",
      plugins: [
        {
          name: "BA_BACNET_IP.335x",
          platform: "335x",
          edition: "5.0.0.1",
          lastModifiedDate: "2017-11-08 07:55:30"
        },
        {
          name: "BA_BACNET_IP.dll",
          platform: "dll",
          edition: "5.0.0.1",
          lastModifiedDate: "2019-02-19 03:45:30"
        },
        {
          name: "BA_BACNET_IP.xt",
          platform: "xt",
          edition: "",
          lastModifiedDate: "2020-02-22 08:47:32"
        }
      ]
    },
    channelId: 1,
    channel: {
      bps: 7,
      checkBit: 0,
      dataBit: 8,
      serial: 0,
      stopBit: 0
    },
    passParams: {
      delayIs: true,
      delay: 100,
      resetIs: true,
      reset: 60,
      alertIs: true,
      alert: 60,
      faultShooting: "1",
      packetScanning: "1",
      alternatePass: true,
      channelId: "串口",
      channel: {
        bps: 7,
        checkBit: 0,
        dataBit: 8,
        serial: 0,
        stopBit: 0
      }
      // sata: "COM01",
      // baudRate: "9600",
      // dataBits: "8",
      // checkBits: "无校验",
      // stopBits: "1",
      // ip: "192.168.0.253",
      // port: "50001"
    },
    delay: 10,
    idFactory: "factory-1"
  },
  {
    id: "1-2",
    pipelineName: "C2",
    description: "通道2",
    plugin: {
      name: "IND_CJT188_2004",
      describe: "T188 2004",
      factory: "城建",
      classification: "通用标准",
      path: "C:\\Users\\43577\\Desktop\\软件\\CESTC\\PluginIo\\IND_CJT188_2004",
      plugins: [
        {
          name: "IND_CJT188_2004.335x",
          platform: "335x",
          edition: "5.0.0.1",
          lastModifiedDate: "2017-11-08 07:55:30"
        },
        {
          name: "IND_CJT188_2004.dll",
          platform: "dll",
          edition: "5.0.0.1",
          lastModifiedDate: "2019-02-19 03:45:30"
        },
        {
          name: "IND_CJT188_2004.xt",
          platform: "xt",
          edition: "",
          lastModifiedDate: "2020-02-22 08:47:32"
        }
      ]
    },
    channelId: "虚拟端口",
    channel: {
      bps: 7,
      checkBit: 0,
      dataBit: 8,
      serial: 0,
      stopBit: 0
    },
    // sata: "COM01",
    // baudRate: "9600",
    // dataBits: "8",
    // checkBits: "无校验",
    // stopBits: "1",
    // ip: "192.168.0.253",
    // port: "50001",
    // bindingIp: "192.168.200.161",
    passParams: {
      delayIs: true,
      delay: 100,
      resetIs: false,
      reset: 60,
      alertIs: true,
      alert: 60,
      faultShooting: "1",
      packetScanning: "1",
      alternatePass: false,
      channelId: "串口",
      channel: {
        bps: 7,
        checkBit: 0,
        dataBit: 8,
        serial: 0,
        stopBit: 0
      }
      // sata: "COM01",
      // baudRate: "9600",
      // dataBits: "8",
      // checkBits: "无校验",
      // stopBits: "1",
      // ip: "192.168.0.253",
      // port: "50001"
    },
    delay: 10,
    idFactory: "factory-1"
  },
  {
    id: "2-1",
    pipelineName: "C3",
    description: "通道3",
    plugin: {
      name: "PLC_AB_LOGIX_TCP",
      describe: "AB LOGIX 5000 TCP",
      factory: "AB",
      classification: "PLC",
      path:
        "C:\\Users\\43577\\Desktop\\软件\\CESTC\\PluginIo\\PLC_AB_LOGIX_TCP",
      plugins: [
        {
          name: "PLC_AB_LOGIX_TCP.335x",
          platform: "335x",
          edition: "5.0.0.1",
          lastModifiedDate: "2017-11-08 07:55:30"
        },
        {
          name: "PLC_AB_LOGIX_TCP.dll",
          platform: "dll",
          edition: "5.0.0.1",
          lastModifiedDate: "2019-02-19 03:45:30"
        },
        {
          name: "PLC_AB_LOGIX_TCP.xt",
          platform: "xt",
          edition: "",
          lastModifiedDate: "2020-02-22 08:47:32"
        }
      ]
    },
    channelId: "串口",
    channel: {
      bps: 7,
      checkBit: 0,
      dataBit: 8,
      serial: 0,
      stopBit: 0
    },
    // sata: "COM01",
    // baudRate: "9600",
    // dataBits: "8",
    // checkBits: "无校验",
    // stopBits: "1",
    // ip: "192.168.0.253",
    // port: "50001",
    // bindingIp: "192.168.200.161",
    passParams: {
      delayIs: false,
      delay: 100,
      resetIs: false,
      reset: 60,
      alertIs: false,
      alert: 60,
      faultShooting: "1",
      packetScanning: "1",
      alternatePass: false,
      channelId: "串口",
      channel: {
        bps: 7,
        checkBit: 0,
        dataBit: 8,
        serial: 0,
        stopBit: 0
      }
      // sata: "COM01",
      // baudRate: "9600",
      // dataBits: "8",
      // checkBits: "无校验",
      // stopBits: "1",
      // ip: "192.168.0.253",
      // port: "50001"
    },
    delay: 10,
    dataTags: [
      {
        id: "1",
        name: "C1.D1.Tag1",
        describe: "通道1 设备1 标签1",
        ratioCalculation: true,
        magnification: "2.0000",
        base: "0.0000",
        dataType: "浮点",
        direction: "只读",
        acquisitionCycle: "1000",
        IOTag: "io.C1.D1.Tag1",
        IOTagParentId: "1-1-1",
        IOTagSelectId: "1-1-1-1",
        slaveStationID: "1",
        registerType: 2,
        registerAddr: "0",
        dataFormat: 0
      },
      {
        id: "2",
        name: "C1.D1.Tag2",
        describe: "通道1 设备1 标签1",
        ratioCalculation: true,
        magnification: "1.0000",
        base: "0.0000",
        dataType: "浮点",
        direction: "只读",
        acquisitionCycle: "1000",
        IOTag: "at.C1._io_status",
        IOTagParentId: "1-1",
        IOTagSelectId: 2,
        slaveStationID: "1",
        registerType: 2,
        registerAddr: "0",
        dataFormat: 0
      },
      {
        id: "3",
        name: "C1.D2.Tag1",
        describe: "通道1 设备2 标签1",
        ratioCalculation: false,
        magnification: "2.0000",
        base: "0.0000",
        dataType: "整型",
        direction: "只读",
        acquisitionCycle: "1000",
        IOTag: "io.C2.D3.Tag2",
        IOTagParentId: "1-2-1",
        IOTagSelectId: "1-2-1-1",
        slaveStationID: "1",
        registerType: 2,
        registerAddr: "0",
        dataFormat: 0
      },
      {
        id: "4",
        name: "C1.D2.Tag2",
        describe: "通道1 设备2 标签2",
        ratioCalculation: false,
        magnification: "1.0000",
        base: "0.0000",
        dataType: "字符串",
        direction: "只读",
        acquisitionCycle: "1000",
        IOTag: "at._kernal_version",
        IOTagParentId: "1",
        IOTagSelectId: 0,
        slaveStationID: "1",
        registerType: 2,
        registerAddr: "0",
        dataFormat: 0
      }
    ],
    idFactory: "factory-1"
  }
];

// 设备数据
const equipmentList = [
  {
    id: "1-1-1",
    equipmentName: "D1",
    equipmentDescribe: "设备1",
    userParam: "",
    MODBUSAdd: "1",
    searchNum: 32,
    singleRegister: true,
    multiRegister: true,
    correspondingValue: "FF00",
    subCorrespondingValue: "0000",
    doubleByteCheck: true,
    passParams: {
      delay: 3000,
      failedTryAgain: true,
      failedTryTimes: 1,
      alertIs: true,
      continuousQueryFailed: 5,
      noReceivedLongTime: 120,
      faultDataProcess: "保持之前值，质量戳为GOOD",
      faultScanProcess: "正常扫描",
      queryPeriod: 30,
      equipmentFactor: true,
      factorR1: "1.000",
      factorR2: "1.000"
    },
    dataTags: [
      {
        id: "1-1-1-1",
        name: "Tag1",
        describe: "标签1",
        passParams: {
          takeAbsoluteValue: true,
          absoluteValue: "",
          calculation: "不参与计算",
          ratioCalculation: true,
          magnification: "2.0000",
          base: "0.0000",
          reverseCoefficient: false,
          rangeConversion: true,
          maxRange: 10,
          maxGather: 4096,
          minRange: 0,
          minGather: 0,
          dataFilter: true,
          maxData: 100,
          minData: 0,
          dataRadio: "1",
          advancedOperation: "科学计数法",
          param1: "",
          param2: "",
          code: 0,
          cache: false,
          alert: false,
          maxLimit: "100.0",
          upperLimit: "80.0",
          lowerLimit: "20.0",
          minLimit: "0.0",
          alarmDelay: "3",
          alarmLevel: "3"
        },
        dataType: "浮点",
        direction: "只读",
        acquisitionCycle: "1000",
        registerType: 0,
        registerAddr: "0",
        analyticalMethod: 1,
        displacementDeviation: "0",
        useBCD: true
      },
      {
        id: "1-1-1-2",
        name: "Tag2",
        describe: "标签2",
        passParams: {
          takeAbsoluteValue: false,
          absoluteValue: "",
          calculation: "不参与计算",
          ratioCalculation: true,
          magnification: "2.0000",
          base: "0.0000",
          reverseCoefficient: true,
          rangeConversion: false,
          maxRange: 10,
          maxGather: 4096,
          minRange: 0,
          minGather: 0,
          dataFilter: true,
          maxData: 100,
          minData: 0,
          dataRadio: "2",
          advancedOperation: "科学计数法",
          param1: "",
          param2: "",
          code: 0,
          cache: false,
          alert: false,
          maxLimit: "100.0",
          upperLimit: "80.0",
          lowerLimit: "20.0",
          minLimit: "0.0",
          alarmDelay: "3",
          alarmLevel: "3"
        },
        dataType: "整型",
        direction: "只读",
        acquisitionCycle: "1000",
        registerType: 2,
        registerAddr: "0",
        analyticalMethod: 3,
        displacementDeviation: "0",
        useBCD: false
      }
    ],
    idFactory: "factory-1"
  },
  {
    id: "1-1-2",
    equipmentName: "D2",
    equipmentDescribe: "设备2",
    userParam: "",
    MODBUSAdd: "2",
    searchNum: 32,
    singleRegister: true,
    multiRegister: true,
    correspondingValue: "FF00",
    subCorrespondingValue: "0000",
    doubleByteCheck: true,
    passParams: {
      delay: 3000,
      failedTryAgain: true,
      failedTryTimes: 1,
      alertIs: false,
      continuousQueryFailed: 5,
      noReceivedLongTime: 120,
      faultDataProcess: "保持之前值，质量戳为BAD",
      faultScanProcess: "正常扫描",
      queryPeriod: 30,
      equipmentFactor: true,
      factorR1: "1.000",
      factorR2: "1.000"
    },
    dataTags: [
      {
        id: "1-1-2-1",
        name: "Tag1",
        describe: "标签1",
        passParams: {
          takeAbsoluteValue: true,
          absoluteValue: "",
          calculation: "乘设备系数R1",
          ratioCalculation: true,
          magnification: "2.0000",
          base: "0.0000",
          reverseCoefficient: false,
          rangeConversion: true,
          maxRange: 10,
          maxGather: 4096,
          minRange: 0,
          minGather: 0,
          dataFilter: false,
          maxData: 100,
          minData: 0,
          dataRadio: "1",
          advancedOperation: "科学计数法",
          param1: "",
          param2: "",
          code: 0,
          cache: false,
          alert: false,
          maxLimit: "100.0",
          upperLimit: "80.0",
          lowerLimit: "20.0",
          minLimit: "0.0",
          alarmDelay: "3",
          alarmLevel: "3"
        },
        dataType: "布尔",
        direction: "只读",
        acquisitionCycle: "1000",
        registerType: 0,
        registerAddr: "0",
        analyticalMethod: 2,
        displacementDeviation: "0",
        useBCD: false
      },
      {
        id: "1-1-2-2",
        name: "Tag2",
        describe: "标签2",
        passParams: {
          takeAbsoluteValue: false,
          absoluteValue: "",
          calculation: "不参与计算",
          ratioCalculation: true,
          magnification: "2.0000",
          base: "0.0000",
          reverseCoefficient: true,
          rangeConversion: false,
          maxRange: 10,
          maxGather: 4096,
          minRange: 0,
          minGather: 0,
          dataFilter: false,
          maxData: 100,
          minData: 0,
          dataRadio: "1",
          advancedOperation: "科学计数法",
          param1: "",
          param2: "",
          code: 0,
          cache: false,
          alert: false,
          maxLimit: "100.0",
          upperLimit: "80.0",
          lowerLimit: "20.0",
          minLimit: "0.0",
          alarmDelay: "3",
          alarmLevel: "3"
        },
        dataType: "字符串",
        direction: "只读",
        acquisitionCycle: "1000",
        registerType: 3,
        registerAddr: "0",
        analyticalMethod: 3,
        displacementDeviation: "0",
        useBCD: false
      }
    ],
    idFactory: "factory-1"
  },
  {
    id: "1-2-1",
    equipmentName: "D3",
    equipmentDescribe: "设备3",
    userParam: "",
    MODBUSAdd: "3",
    searchNum: 32,
    singleRegister: true,
    multiRegister: true,
    correspondingValue: "FF00",
    subCorrespondingValue: "0000",
    doubleByteCheck: true,
    passParams: {
      delay: 3000,
      failedTryAgain: false,
      failedTryTimes: 1,
      alertIs: true,
      continuousQueryFailed: 5,
      noReceivedLongTime: 120,
      faultDataProcess: "保持之前值，质量戳为GOOD",
      faultScanProcess: "正常扫描",
      queryPeriod: 30,
      equipmentFactor: false,
      factorR1: "1.000",
      factorR2: "1.000"
    },
    dataTags: [
      {
        id: "1-2-1-1",
        name: "Tag1",
        describe: "标签1",
        passParams: {
          takeAbsoluteValue: true,
          absoluteValue: "",
          calculation: "乘设备系数R2",
          ratioCalculation: true,
          magnification: "2.0000",
          base: "0.0000",
          reverseCoefficient: false,
          rangeConversion: true,
          maxRange: 10,
          maxGather: 4096,
          minRange: 0,
          minGather: 0,
          dataFilter: true,
          maxData: 100,
          minData: 0,
          dataRadio: "1",
          advancedOperation: "科学计数法",
          param1: "",
          param2: "",
          code: 0,
          cache: false,
          alert: false,
          maxLimit: "100.0",
          upperLimit: "80.0",
          lowerLimit: "20.0",
          minLimit: "0.0",
          alarmDelay: "3",
          alarmLevel: "3"
        },
        dataType: "整型",
        direction: "只读",
        acquisitionCycle: "1000",
        registerType: 1,
        registerAddr: "0",
        analyticalMethod: 2,
        displacementDeviation: "0",
        useBCD: false
      },
      {
        id: "1-2-1-2",
        name: "Tag2",
        describe: "标签2",
        passParams: {
          takeAbsoluteValue: false,
          absoluteValue: "",
          calculation: "不参与计算",
          ratioCalculation: true,
          magnification: "2.0000",
          base: "0.0000",
          reverseCoefficient: true,
          rangeConversion: false,
          maxRange: 10,
          maxGather: 4096,
          minRange: 0,
          minGather: 0,
          dataFilter: true,
          maxData: 100,
          minData: 0,
          dataRadio: "2",
          advancedOperation: "科学计数法",
          param1: "",
          param2: "",
          code: 0,
          cache: false,
          alert: false,
          maxLimit: "100.0",
          upperLimit: "80.0",
          lowerLimit: "20.0",
          minLimit: "0.0",
          alarmDelay: "3",
          alarmLevel: "3"
        },
        dataType: "整型",
        direction: "只读",
        acquisitionCycle: "1000",
        registerType: 0,
        registerAddr: "0",
        analyticalMethod: 0,
        displacementDeviation: "0",
        useBCD: false
      }
    ],
    idFactory: "factory-1"
  },
  {
    id: "1-2-2",
    equipmentName: "D4",
    equipmentDescribe: "设备4",
    userParam: "",
    MODBUSAdd: "4",
    searchNum: 32,
    singleRegister: true,
    multiRegister: true,
    correspondingValue: "FF00",
    subCorrespondingValue: "0000",
    doubleByteCheck: true,
    passParams: {
      delay: 3000,
      failedTryAgain: false,
      failedTryTimes: 1,
      alertIs: false,
      continuousQueryFailed: 5,
      noReceivedLongTime: 120,
      faultDataProcess: "保持之前值，质量戳为GOOD",
      faultScanProcess: "正常扫描",
      queryPeriod: 30,
      equipmentFactor: false,
      factorR1: "1.000",
      factorR2: "1.000"
    },
    dataTags: [
      {
        id: "1-2-2-1",
        name: "Tag1",
        describe: "标签1",
        passParams: {
          takeAbsoluteValue: true,
          absoluteValue: "",
          calculation: "乘设备系数R1*R2",
          ratioCalculation: true,
          magnification: "2.0000",
          base: "0.0000",
          reverseCoefficient: false,
          rangeConversion: true,
          maxRange: 10,
          maxGather: 4096,
          minRange: 0,
          minGather: 0,
          dataFilter: false,
          maxData: 100,
          minData: 0,
          dataRadio: "1",
          advancedOperation: "科学计数法",
          param1: "",
          param2: "",
          code: 0,
          cache: false,
          alert: false,
          maxLimit: "100.0",
          upperLimit: "80.0",
          lowerLimit: "20.0",
          minLimit: "0.0",
          alarmDelay: "3",
          alarmLevel: "3"
        },
        dataType: "整型",
        direction: "只读",
        acquisitionCycle: "1000",
        registerType: 0,
        registerAddr: "0",
        analyticalMethod: 3,
        displacementDeviation: "0",
        useBCD: false
      },
      {
        id: "1-2-2-2",
        name: "Tag2",
        describe: "标签2",
        passParams: {
          takeAbsoluteValue: false,
          absoluteValue: "",
          calculation: "不参与计算",
          ratioCalculation: true,
          magnification: "2.0000",
          base: "0.0000",
          reverseCoefficient: true,
          rangeConversion: false,
          maxRange: 10,
          maxGather: 4096,
          minRange: 0,
          minGather: 0,
          dataFilter: false,
          maxData: 100,
          minData: 0,
          dataRadio: "1",
          advancedOperation: "科学计数法",
          param1: "",
          param2: "",
          code: 0,
          cache: false,
          alert: false,
          maxLimit: "100.0",
          upperLimit: "80.0",
          lowerLimit: "20.0",
          minLimit: "0.0",
          alarmDelay: "3",
          alarmLevel: "3"
        },
        dataType: "二进制",
        direction: "只写",
        acquisitionCycle: "2000",
        registerType: 1,
        registerAddr: "0",
        analyticalMethod: 5,
        displacementDeviation: "0",
        useBCD: false
      }
    ],
    idFactory: "factory-1"
  }
];

export { passList, equipmentList };
