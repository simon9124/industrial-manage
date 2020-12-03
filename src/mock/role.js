// 用户列表
const userList = [
  {
    id: 1333294157053034496,
    userName: "admin",
    password: "e10adc3949ba59abbe56e057f20f883e",
    nickName: "超级管理员",
    realName: null,
    mobile: null,
    email: null,
    status: 0,
    token: "JHNGAY1ALF4CYV881IR0I4X4Z5WF0YW4WAAH",
    createTime: "2020-11-30T06:17:53.106+00:00",
    updateTime: "2020-11-30T06:17:53.106+00:00",
    roleId: 0
  }
];

// 角色列表
const roleList = [
  {
    name: "super_admin",
    title: "超级管理员",
    menus: [
      "doc",
      "control",
      "multilevel",
      "level_2_1",
      "level_2_2",
      "level_2_2_1",
      "screen2",
      "level_2_2_2",
      "level_2_3",
      "screen",
      "github",
      "singleMenu",
      "authority",
      "userManage",
      "roleManage",
      "menuManage"
    ],
    id: "1",
    description: "超级管理员，默认拥有全部功能，不可删除"
  },
  {
    name: "visitor",
    title: "访客",
    menus: [
      "control",
      "multilevel",
      "level_2_1",
      "level_2_2",
      "level_2_2_1",
      "level_2_2_2",
      "level_2_3",
      "screen",
      "singleMenu"
    ],
    id: "2",
    description: "访客，拥有部分功能，可删除"
  }
];

/** menuList路由列表
 * isOutSide：是否为外链
 * showLevel：路由层级，详见menuLevel路由层级列表
 * path：前端组件路径（根父组件为Main，非根父组件为parentView，外链任意但不能为空）
 */

// 路由层级
const menuLevel = [
  {
    label: "菜单显示该页面选项，页面不含菜单栏",
    value: "1"
  },
  {
    label: "菜单显示该页面选项，页面含菜单栏",
    value: "2"
  },
  {
    label: "菜单隐藏该页面选项，页面不含菜单栏",
    value: "3"
  }
];
// 路由列表
const allMenuList = [
  {
    id: "control",
    name: "control",
    title: "驾驶舱",
    url: "control",
    path: "screen",
    sort: 26,
    parentId: "root",
    ico: "md-laptop",
    isOutSide: false,
    showLevel: "1",
    description: "一级大屏"
  },
  {
    id: "userManage",
    name: "user/manage",
    title: "用户管理",
    url: "user/manage",
    path: "user",
    sort: 22,
    parentId: "root",
    ico: "ios-navigate",
    isOutSide: false,
    showLevel: "2",
    description: "用户管理",
    access: ["0"]
  }
];

export { userList, roleList, allMenuList, menuLevel };
