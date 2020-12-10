// 用户列表
const userList = [
  {
    id: 1334085279996182528,
    userName: "admin",
    password: "e10adc3949ba59abbe56e057f20f883e",
    nickName: "超级管理员",
    realName: "超级管理员",
    mobile: "13801380000",
    email: "1234@qq.com",
    status: 1,
    token: null,
    createTime: null,
    updateTime: null,
    idStr: "1334085279996182528",
    permissionsList: null,
    permissions: null,
    roleId: 0
  },
  {
    id: 1334701110568419328,
    userName: "factor",
    password: "e10adc3949ba59abbe56e057f20f883e",
    nickName: "factor",
    realName: "factor",
    mobile: "13801380000",
    email: "1234@qq.com",
    status: 1,
    token: null,
    createTime: 1607052516964,
    updateTime: 1607052516964,
    idStr: "1334701110568419328",
    permissionsList: null,
    permissions: null,
    roleId: 2
  },
  {
    id: 1334788962899722240,
    userName: "log",
    password: "e10adc3949ba59abbe56e057f20f883e",
    nickName: "log",
    realName: "factor",
    mobile: "13801380000",
    email: "1234@qq.com",
    status: 1,
    token: null,
    createTime: 1607073462592,
    updateTime: 1607073462592,
    idStr: "1334788962899722240",
    permissionsList: null,
    permissions: null,
    roleId: 1
  }
];

// 角色列表
const roleList = [
  {
    id: 0,
    roleName: "系统管理员",
    remark: null,
    idStr: "0"
  },
  {
    id: 1,
    roleName: "日志管理员",
    remark: null,
    idStr: "1"
  },
  {
    id: 2,
    roleName: "平台管理员",
    remark: null,
    idStr: "2"
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
    id: "gateway",
    name: "gateway",
    title: "网闸",
    url: "gateway",
    path: "gateway",
    sort: 26,
    parentId: "root",
    ico: "md-laptop",
    isOutSide: false,
    showLevel: "3",
    description: "网闸",
    access: ["2"]
  },
  {
    id: "userManage",
    name: "user/userManage",
    title: "用户管理",
    url: "user/manage",
    path: "user",
    sort: 24,
    parentId: "root",
    ico: "ios-navigate",
    isOutSide: false,
    showLevel: "2",
    description: "用户管理",
    access: ["0"]
  },
  {
    id: "logManage",
    name: "log/logManage",
    title: "日志管理",
    url: "log/manage",
    path: "log",
    sort: 22,
    parentId: "root",
    ico: "ios-navigate",
    isOutSide: false,
    showLevel: "2",
    description: "用户管理",
    access: ["1"]
  }
];

export { userList, roleList, allMenuList, menuLevel };
