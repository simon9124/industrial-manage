// 串口总数据
const collectChannelList = [
  {
    id: 0,
    serial: 0,
    bps: 7,
    dataBit: 8,
    checkBit: 0,
    stopBit: 0,
    serialList: [
      "com1",
      "com2",
      "com3",
      "com4",
      "com5",
      "com6",
      "com7",
      "com8",
      "com9",
      "com11",
      "com12",
      "com13",
      "com14",
      "com15",
      "com16",
      "com17",
      "com18",
      "com19",
      "com20",
      "com21",
      "com22",
      "com23",
      "com24",
      "com25",
      "com26",
      "com27",
      "com28",
      "com29",
      "com30",
      "com31",
      "com32"
    ],
    baudRateList: [
      300,
      600,
      1200,
      1800,
      2400,
      4800,
      7200,
      9600,
      14400,
      19200,
      38400,
      56000,
      57600,
      115200,
      230400,
      460800,
      921600
    ],
    checkBitList: ["无校验", "奇校验", "偶校验", "MARK校验", "SPACE校验"],
    stopBitList: ["1", "1.5", "2"],
    dataBitsList: [4, 5, 6, 7, 8]
  },
  {
    id: 1,
    ip: "192.168.0.88",
    port: "502",
    localIp: null
  },
  {
    id: 2,
    ip: "192.168.0.253",
    port: "50001",
    ipList: null
  },
  {
    id: 3,
    ip: "192.168.0.253",
    port: "50001"
  },
  {
    id: 4
  }
];

// 通道类型
const passTypeList = [
  {
    id: 0,
    value: "串口"
  },
  {
    id: 1,
    value: "TCP客户端"
  },
  {
    id: 2,
    value: "TCP服务端"
  },
  {
    id: 3,
    value: "UDP"
  },
  {
    id: 4,
    value: "虚拟端口"
  }
];

export { collectChannelList, passTypeList };
