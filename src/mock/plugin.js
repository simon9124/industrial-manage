const pluginList = [
  {
    text: "通用标准",
    icon: "fa fa-list-alt",
    id: "1",
    level: 1,
    children: [
      {
        text: "MODBUS TCP",
        icon: "fa fa-cog",
        id: "1-1",
        level: 2,
        name: "IND_MODBUS_TCP",
        describe: "MODBUS TCP",
        factory: "莫迪康",
        classification: "通用标准",
        path:
          "C:\\Users\\43577\\Desktop\\软件\\CESTC\\PluginIo\\IND_MODBUS_RTU",
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
      {
        text: "T188 2004",
        icon: "fa fa-cog",
        id: "1-2",
        level: 2,
        name: "IND_CJT188_2004",
        describe: "T188 2004",
        factory: "城建",
        classification: "通用标准",
        path:
          "C:\\Users\\43577\\Desktop\\软件\\CESTC\\PluginIo\\IND_CJT188_2004",
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
      }
    ]
  },
  {
    text: "电力行业标准",
    icon: "fa fa-list-alt",
    id: "2",
    level: 1,
    children: [
      {
        text: "DNP3.0协议",
        icon: "fa fa-cog",
        id: "2-1",
        level: 2,
        name: "DL_DNP3",
        describe: "DNP3.0协议",
        factory: "",
        classification: "电力行业标准",
        path: "C:\\Users\\43577\\Desktop\\软件\\CESTC\\PluginIo\\DL_DNP3",
        plugins: [
          {
            name: "DL_DNP3.dll",
            platform: "dll",
            edition: "5.0.0.1",
            lastModifiedDate: "2019-02-19 03:45:30"
          }
        ]
      },
      {
        text: "376.1主站",
        icon: "fa fa-cog",
        id: "2-2",
        level: 2,
        name: "ELE_376_1_MASTER",
        describe: "376.1主站",
        factory: "电力规约",
        classification: "电力行业标准",
        path:
          "C:\\Users\\43577\\Desktop\\软件\\CESTC\\PluginIo\\ELE_376_1_MASTER",
        plugins: [
          {
            name: "ELE_376_1_MASTER.335x",
            platform: "335x",
            edition: "5.0.0.1",
            lastModifiedDate: "2017-11-08 07:55:30"
          },
          {
            name: "ELE_376_1_MASTER.dll",
            platform: "dll",
            edition: "5.0.0.1",
            lastModifiedDate: "2019-02-19 03:45:30"
          },
          {
            name: "ELE_376_1_MASTER.xt",
            platform: "xt",
            edition: "",
            lastModifiedDate: "2020-02-22 08:47:32"
          }
        ]
      }
    ]
  },
  {
    text: "PLC",
    icon: "fa fa-list-alt",
    id: "3",
    level: 1,
    children: [
      {
        text: "AB DF1串口协议",
        icon: "fa fa-cog",
        id: "3-1",
        level: 2,
        name: "PLC_AB_DF1",
        describe: "AB DF1串口协议",
        factory: "AB(罗克韦尔)",
        classification: "PLC",
        path: "C:\\Users\\43577\\Desktop\\软件\\CESTC\\PluginIo\\PLC_AB_DF1",
        plugins: [
          {
            name: "PLC_AB_DF1.335x",
            platform: "335x",
            edition: "5.0.0.1",
            lastModifiedDate: "2017-11-08 07:55:30"
          },
          {
            name: "PLC_AB_DF1.dll",
            platform: "dll",
            edition: "5.0.0.1",
            lastModifiedDate: "2019-02-19 03:45:30"
          },
          {
            name: "PLC_AB_DF1.xt",
            platform: "xt",
            edition: "",
            lastModifiedDate: "2020-02-22 08:47:32"
          }
        ]
      },
      {
        text: "AB LOGIX 5000 TCP",
        icon: "fa fa-cog",
        id: "3-2",
        level: 2,
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
      }
    ]
  }
];

export { pluginList };
