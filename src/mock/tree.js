// 服务导航 - 完整
const treeData = [
  {
    text: "采集服务",
    icon: "fa fa-folder",
    id: "1",
    level: 1,
    selected: true,
    children: [
      {
        text: "C1[通道1]",
        icon: "fa fa-laptop",
        id: "1-1",
        level: 2,
        children: [
          {
            text: "D1[设备1]",
            icon: "fa fa-edit",
            id: "1-1-1",
            level: 3
          },
          {
            text: "D2[设备2]",
            icon: "fa fa-edit",
            id: "1-1-2",
            level: 3
          }
        ]
      },
      {
        text: "C2[通道2]",
        icon: "fa fa-laptop",
        id: "1-2",
        level: 2,
        children: [
          {
            text: "D3[设备3]",
            icon: "fa fa-edit",
            id: "1-2-1",
            level: 3
          },
          {
            text: "D4[设备4]",
            icon: "fa fa-edit",
            id: "1-2-2",
            level: 3
          }
        ]
      }
    ]
  },
  {
    text: "数据服务",
    icon: "fa fa-database",
    id: "2",
    level: 1,
    children: [
      {
        text: "C3[通道3]",
        icon: "fa fa-laptop",
        id: "2-1",
        level: 2
      }
    ]
  }
];

// 服务导航 - 模板
const treeTempleteData = [
  {
    text: "采集服务",
    icon: "fa fa-folder",
    id: "1",
    level: 1,
    selected: true,
    opened: true, // 父节点须设置opened为true，否则子节点首次新增时打不开
    children: []
  },
  {
    text: "数据服务",
    icon: "fa fa-database",
    id: "2",
    level: 1,
    opened: true,
    selected: false, // 未被选中的父节点需设置selected为false，否则该节点切换时会有bug
    children: []
  }
];

// 工程数据
const factoryData = [
  {
    text: "工程组列表",
    icon: "fa fa-folder",
    id: "root",
    level: 1,
    children: [
      {
        text: "工程组1",
        describe: "第一工程组",
        creatTime: "2020-06-20 18:25:20",
        icon: "fa fa-laptop",
        id: "group-1",
        level: 2,
        children: [
          {
            text: "采集器工程1",
            describe: "第一工程",
            creatTime: "2020-06-20 18:25:20",
            icon: "fa fa-edit",
            id: "factory-1",
            selected: true,
            level: 3,
            treeData: treeData,
            parentId: "group-1"
          },
          {
            text: "采集器工程2",
            describe: "第二工程",
            creatTime: "2020-06-20 18:25:20",
            icon: "fa fa-edit",
            id: "factory-2",
            level: 3,
            treeData: treeTempleteData,
            parentId: "group-1"
          }
        ]
      },
      {
        text: "工程组2",
        describe: "第二工程组",
        creatTime: "2020-08-25 18:25:20",
        icon: "fa fa-laptop",
        id: "group-2",
        level: 2,
        children: []
      }
    ]
  }
];

export { factoryData, treeTempleteData };
