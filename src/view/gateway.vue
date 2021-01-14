<template>
  <div class="table-tree-container"
       v-loading="pageLoading">
    <el-container>

      <!-- 顶 · 头 -->
      <el-header>
        <Header ref="header"
                :handleType="handleType"
                :level="level"
                :id="id"
                :service-type="serviceType"
                :id-factory="idFactory"
                :tree-data="treeData"
                :factory-data="factoryData"
                :pass-list="passList"
                :plugin-list="pluginList"
                :pass-type-list="passTypeList"
                :collect-channel-list="collectChannelList"
                :equipment-list="equipmentList"
                :lazy-tree-data="lazyTreeData"
                @item-add="itemAdd"
                @items-copy="itemsCopy"
                @item-delete="itemHandle('del')"
                @item-submit="itemSubmit"
                @factory-select="factorySelect"
                @factory-handle="factoryHandle"></Header>
      </el-header>

      <!-- 中 · 内容 -->
      <el-container>

        <!--左 · 树-->
        <el-aside class="left-panel"
                  :style="{height:contentHeight}">
          <div class="left-panel-title">服务导航</div>
          <left-tree v-if="treeData.length!==0"
                     class="left-panel-tree"
                     :data="treeData"
                     :id="id"
                     @item-click="itemClick"
                     @item-handle="itemHandle">
          </left-tree>
          <div v-else
               class="left-panel-tree">未选中工程</div>
        </el-aside>

        <!--右 · 表-->
        <el-container class="right-panel is-vertical">
          <!-- <Group v-if="level===1"
                 ref="group"
                 :service-id="serviceId"
                 :factory-data="factoryData"
                 :service-data="serviceData"
                 :pass-list="passList"
                 :equipment-list="equipmentList"
                 :pass-type-list="passTypeList"
                 :serial-list="serialList"
                 :baud-rate-ist="baudRateList"
                 :data-bits-list="dataBitsList"
                 :check-bit-list="checkBitList"
                 :stop-bit-list="stopBitList"></Group> -->
          <!-- <Pass v-if="level===2"
                ref="pass"
                :id="id"
                :tree-data="treeData"
                :pass-list="passList"
                :equipment-list="equipmentList"
                :plugin-list="pluginList"
                :pass-type-list="passTypeList"
                :serial-list="serialList"
                :baud-rate-ist="baudRateList"
                :data-bits-list="dataBitsList"
                :check-bit-list="checkBitList"
                :stop-bit-list="stopBitList"></Pass> -->
          <Equipment v-if="level===3"
                     ref="equipment"
                     :id="id"
                     :tree-data="treeData"
                     :equipment-list="equipmentList"></Equipment>
        </el-container>

      </el-container>

    </el-container>
  </div>
</template>

<script>
/* components */
import Header from "@/components/Header"; // 组件：头部
import LeftTree from "@/components/Tree"; // 组件：左侧树
import Group from "@/components/content/Group"; // 组件：右侧内容 - 组
import Pass from "@/components/content/Pass"; // 组件：右侧内容 - 通道
import Equipment from "@/components/content/Equipment"; // 组件：右侧内容 - 通道
/* function */
import { parseTime } from "@/libs/util"; // function - 格式化时间
import { getValueByKey } from "@/libs/dataHanding"; // 根据对象数组某个key的value，查询另一个key的value
/* mockData */
import {
  factoryData, // mockData - 工程总数居
  treeTempleteData // mockData - 服务导航模板数据
} from "@/mock/tree.js";
import { pluginList } from "@/mock/plugin.js"; // mockData - 插件列表
import { collectChannelList, passTypeList } from "@/mock/serial.js"; // mockData - 串口列表
import {
  passList, // mockData - 通道列表
  equipmentList // mockData - 设备列表
} from "@/mock/content.js";
/* api */
import { queryProjectTeamList } from "@/api/projectTeam.js"; // 工程组
import { queryProjectList } from "@/api/project.js"; // 工程
import { queryPassList, addPass } from "@/api/pass.js"; // 通道
import { queryPlushTypeList, queryPlushList } from "@/api/plugin.js"; // 插件

export default {
  components: { Header, LeftTree, Group, Pass, Equipment },
  data () {
    return {
      /* data */
      treeData: [], // 树数据
      factoryData: [], // 工程数据
      passList: [], // 通道列表
      pluginList: [], // 插件列表
      equipmentList: [], // 设备列表
      serviceData: {}, // 当前服务数据
      serviceId: "", // 当前服务的id
      collectChannelList: [], // 串口总数据
      passTypeList: [], // select - 通道总类型
      serialList: [], // select - 串口
      baudRateList: [], // select - 波特率
      dataBitsList: [], // select - 数据位
      checkBitList: [], // select - 校验位
      stopBitList: [], // select - 停止位
      /* tree */
      level: 1, // 被选择的树的层级 - 服务导航
      id: null, // 被选择内容的id - 服务导航
      serviceType: 0, // 0/1 采集服务/数据服务
      handleType: "", // 树节点的操作方式
      idFactory: null, // 被选择内容的id - 工程管理
      idTeam: null, // 被选择内容的id - 工程组
      /* plugins */
      idPlugin: null, // 被选择内容的id - 插件
      pluginTeamName: null, // 被选择内容的name - 插件类型
      /* lazyData */
      lazyTreeData: [{
        id: "xxx",
        text: "Loading...",
        value: "Loading...",
        icon: "",
        open: false,
        loading: true,
        selected: true,
        children: []
      }], // 懒加数据 - 工程管理
      pageLoading: false, // 页面loading
      /* 动态高度 */
      contentHeight: "0px" // 中部内容
    };
  },
  created () {
    const screenHeight = document.documentElement.clientHeight;
    // console.log(screenHeight);
    this.contentHeight = (screenHeight - 8 * 2 - 74) + "px";
    this.idFactory = localStorage.getItem("project-id");
    this.idTeam = localStorage.getItem("team-id");
    this.idPlugin = localStorage.getItem("plugin-id");
    this.pluginTeamName = localStorage.getItem("plugin-teamName");
    this.getSerialData();
    this.getAllData();
  },
  methods: {
    // 串口数据处理
    getSerialData () {
      this.collectChannelList = JSON.parse(JSON.stringify(collectChannelList));
      this.passTypeList = JSON.parse(JSON.stringify(passTypeList));
      this.selectDataHanding(["serialList", "baudRateList", "checkBitList", "stopBitList", "dataBitsList"]);
      // console.log(this.collectChannelList);
    },
    // 封装：select选择框数据
    selectDataHanding (keys) {
      keys.forEach(key => {
        let arr = [];
        const _arr = getValueByKey(this.collectChannelList, "id", 0, key);
        _arr.forEach((item, i) => {
          arr.push({ label: item, value: i });
        });
        this.$set(this.collectChannelList[0], key, arr);
      });
    },
    // 获取数据
    async getAllData () {
      if (this.isMock) { // mock数据
        this.factoryData = factoryData;
        this.factoryData.length !== 0 && this.factoryData[0].children.forEach(group => {
          group.children.forEach(factory => {
            if (factory.selected) {
              this.serviceData = factory;
              this.serviceId = this.serviceData.id;
              this.treeData = factory.treeData;
              this.id = this.treeData[0].id;
            }
          });
        });
        this.pluginList = pluginList;
        this.passListAll = passList;
        this.equipmentListAll = equipmentList;
        this.refreshData();
      } else { // 接口数据
        this.pageLoading = true;
        await this.getFactoryData(this.idFactory, this.idTeam); // 工程组和要展开的工程数据
        await this.getPluginList(this.serviceType, this.idPlugin, this.pluginTeamName);// 插件类型数据
        this.pageLoading = false;
      }
    },
    // 筛选数据
    refreshData () {
      this.passList = this.passListAll.filter(pass => pass.idFactory === this.idFactory);
      this.equipmentList = this.equipmentListAll.filter(equipment => equipment.idFactory === this.idFactory);
      // console.log(this.passList);
      // console.log(this.equipmentList);
    },
    // 获取工程组和要展开的工程数据 - 仅接口
    async getFactoryData (projectId, teamId) {
      /* 1.工程数据 */
      var projectList;
      teamId && (projectList = (await queryProjectList(teamId)).data.data.map(project => {
        this.$set(project, "text", project.projectName);
        this.$set(project, "describe", project.remark);
        this.$set(project, "creatTime", parseTime(project.createTime));
        this.$set(project, "icon", "fa fa-edit");
        this.$set(project, "id", project.idStr);
        this.$set(project, "level", 3);
        this.$set(project, "selected", projectId === project.idStr);
        this.$set(project, "teamId", teamId);
        return project;
      }));
      // console.log(projectList);
      /* 2.工程组数据 */
      this.factoryData = this.lazyTreeData; // 懒加载数据
      const groupData = (await queryProjectTeamList()).data.data.map(projectTeam => { // 工程组数据
        this.$set(projectTeam, "text", projectTeam.teamName);
        this.$set(projectTeam, "describe", projectTeam.description);
        this.$set(projectTeam, "creatTime", parseTime(projectTeam.createTime));
        this.$set(projectTeam, "icon", "fa fa-laptop");
        this.$set(projectTeam, "id", projectTeam.idStr);
        this.$set(projectTeam, "level", 2);
        this.$set(projectTeam, "children", projectTeam.id === teamId ? projectList : this.lazyTreeData);
        this.$set(projectTeam, "selected", false);
        this.$set(projectTeam, "opened", projectTeam.id === teamId);
        return projectTeam;
      });
      /* 3.工程组列表 */
      this.factoryData = [
        {
          text: "工程组列表",
          icon: "fa fa-folder",
          id: "root",
          level: 1,
          opened: true,
          selected: localStorage.getItem("project-id") === "root",
          children: groupData
        }
      ];
      /* 4.调用子组件事件 */
      this.$nextTick(() => {
        this.$refs.header.getSelectedFactory(projectId);
      });
    },
    // 获取服务导航数据 - 仅接口
    async getPassServiceData (projectId) {
      this.treeData = JSON.parse(JSON.stringify(treeTempleteData));
      const passServiceList = (await queryPassList({ projectId: projectId, type: 0 })).data.data;
      this.treeData.forEach(service => {
        service.id === "1" && (service.children = passServiceList);
      });
    },
    // 获取插件类型数据 - 仅接口
    async getPluginList (type, pluginId, teamName) {
      /* 1.插件数据 */
      var plushList;
      teamName && (plushList = (await queryPlushList({ // 展开的插件数据
        plushTypeName: teamName,
        serviceType: this.serviceType
      })).data.data).map(plush => {
        this.$set(plush, "text", plush.description);
        this.$set(plush, "icon", "fa fa-cog");
        this.$set(plush, "selected", pluginId === plush.id.toString());
        this.$set(plush, "level", 2);
        return plush;
      });
      /* 2.插件类型数据 */
      const collectPluginList = (await queryPlushTypeList({ type: 0 })).data.data;
      const dataPluginList = (await queryPlushTypeList({ type: 1 })).data.data;
      const pluginList = this.serviceType === 0 ? collectPluginList : dataPluginList;
      this.pluginList = pluginList.map(plugin => {
        this.$set(plugin, "text", plugin.name);
        this.$set(plugin, "icon", "fa fa-list-alt");
        this.$set(plugin, "children", plugin.name === teamName ? plushList : this.lazyTreeData);
        this.$set(plugin, "selected", false);
        this.$set(plugin, "opened", plugin.name === teamName);
        this.$set(plugin, "level", 1);
        return plugin;
      });
    },
    // 点击树节点
    itemClick (param) {
      console.log(param);
      const { level, id, type } = param;
      this.level = level;
      this.id = id; // 临时
      this.serviceType = type;
    },
    // 树节点操作 - 增删改查
    itemHandle (type) {
      this.handleType = type;
      if (this.handleType === "up" || this.handleType === "down") { // 上移 / 下移
        this.treeData.forEach((service, i) => {
          if (this.handleType === "up") { // 上移 -> 循环service.children
            service.children.forEach((pass, _i) => {
              if (this.level === 2 && pass.id === this.id) { // 通道
                if (!service.children[_i - 1]) {
                  this.moveEnd("已经到最顶层");
                  return false;
                }
                this.toggleExchange(service.children, _i, "up");
                pass.selected = false; // 取消当前选择的通道
                this.refreshSelect(); // 重设树，选中顶部 "采集服务"
              }
              if (this.level === 3) { // 设备 -> 循环pass.children
                pass.children.forEach((equipment, __i) => {
                  if (equipment.id === this.id) {
                    if (!pass.children[__i - 1]) {
                      this.moveEnd("已经到最顶层");
                      return false;
                    }
                    this.toggleExchange(pass.children, __i, "up");
                    equipment.selected = false; // 取消当前选择的设备
                    this.refreshSelect(); // 重设树，选中顶部 "采集服务"
                  }
                });
              }
            });
          }
          if (this.handleType === "down") { // 下移 -> 逆循环service.children
            for (let _i = service.children.length - 1; _i >= 0; _i--) {
              if (this.level === 2 && service.children[_i].id === this.id) { // 通道
                if (!service.children[_i + 1]) {
                  this.moveEnd("已经到最底层");
                  return false;
                }
                this.toggleExchange(service.children, _i, "down");
                service.children[_i + 1].selected = false; // 取消当前选择的通道
                this.refreshSelect(); // 重设树，选中顶部 "采集服务"
              }
              if (this.level === 3) { // 设备 -> 逆循环service.children[_i].children
                for (let __i = service.children[_i].children.length - 1; __i >= 0; __i--) {
                  if (service.children[_i].children[__i].id === this.id) {
                    if (!service.children[_i].children[__i + 1]) {
                      this.moveEnd("已经到最底层");
                      return false;
                    }
                    this.toggleExchange(service.children[_i].children, __i, "down");
                    service.children[_i].children[__i + 1].selected = false; // 取消当前选择的设备
                    this.refreshSelect(); // 重设树，选中顶部 "采集服务"
                  }
                }
              }
            }
          }
        });
      }
      if (this.handleType === "del") { // 删除
        this.$confirm(`将删除采集${this.level === 2 ? "通道" : "设备"}, 是否继续?`, "提示", {
          type: "warning"
        }).then(() => {
          this.treeData.forEach(service => {
            service.children.forEach((pass, i) => {
              /* 删除通道 */
              if (this.level === 2 && this.id === pass.id) {
                pass.children.forEach((equipment, _i) => { // 从设备列表删除 - 通道下面的设备
                  this.equipmentListAll.forEach((_equipment, __i) => {
                    equipment.id === _equipment.id && this.equipmentListAll.splice(__i, 1);
                  });
                });
                service.children.splice(i, 1); // 从树中删除
                this.passListAll.forEach((_pass, _i) => { // 从通道列表删除
                  _pass.id === pass.id && this.passListAll.splice(_i, 1);
                });
                this.refreshData(); // 刷新数据
              }
              /* 删除设备 */
              this.level === 3 && pass.children.forEach((equipment, _i) => {
                if (this.id === equipment.id) {
                  pass.children.splice(_i, 1); // 从树中删除
                  this.equipmentListAll.forEach((_equipment, __i) => { // 从设备列表删除
                    _equipment.id === equipment.id && this.equipmentListAll.splice(__i, 1);
                  });
                }
              });
            });
          });
          this.refreshData(); // 刷新数据
          this.refreshSelect(); // 重设树，选中顶部 "采集服务"
          // console.log(this.treeData);
        }).catch(() => { });
      }
      if (this.handleType === "add") { // 新增
        this.$refs.header.newBuild();
      }
      if (this.handleType === "copy") { // 复制
        this.$refs.header.copyItems();
      }
    },
    // 封装：上移、下移、删除后，重新选中顶部 "采集服务"
    refreshSelect () {
      this.$nextTick(() => {
        this.level = 1;
        this.id = this.treeData[0].id;
        this.$set(this.treeData[0], "selected", true);
      });
    },
    // 封装：上移/下移，已经到最底层的message错误提示信息
    moveEnd (msg) {
      this.$message({
        message: msg,
        type: "error",
        duration: 1000
      });
    },
    // 封装：上移/下移，数据arr中下标为index的对象，与前一项(type:up)/后一项(type:down)交换位置
    toggleExchange (arr, index, type) {
      const toExchange = type === "up" ? arr[index - 1] : arr[index + 1]; // copy要交换的对象
      this.$set(
        arr,
        type === "up" ? index - 1 : index + 1,
        arr[index]
      ); // 将当前对象交换到copy对象的位置
      this.$set(arr, index, toExchange); // 将copy的对象交换到原
    },
    // 新增
    async itemAdd (formData) {
      // console.log(formData);
      if (this.isMock) { // mock数据
        this.treeData.forEach(service => {
          /* 新增通道 */
          if (this.level === 1 && service.id === this.id) {
            formData.id = this.id + Math.random().toString(36).substr(-10); // 随机生成id
            formData.idFactory = this.idFactory; // 携带工程id
            const obj = {
              text: `${formData.pipelineName}[${formData.description}]`,
              icon: "fa fa-laptop",
              id: formData.id,
              level: 2,
              children: [],
              selected: false,
              opened: true // 父节点须设置opened为true，否则子节点首次新增时打不开
            };
            service.children.push(obj); // 新增到树
            this.passListAll.push(formData); // 新增到通道列表
            this.refreshData(); // 刷新数据
          }
          /* 新增设备 */
          this.level === 2 && service.children.forEach(pass => {
            if (pass.id === this.id) {
              formData.id = Math.random().toString(36).substr(-10); // 随机生成id
              formData.idFactory = this.idFactory; // 携带工程id
              const obj = {
                text: `${formData.equipmentName}[${formData.equipmentDescribe}]`,
                icon: "fa fa-edit",
                id: formData.id,
                level: 3,
                selected: false
              };
              pass.children.push(obj); // 新增到树
              this.equipmentListAll.push(formData); // 新增到设备列表
              this.refreshData(); // 刷新数据
            }
          });
        });
        // console.log(this.treeData);
        this.$refs.group && this.$nextTick(() => {
          this.$refs.group.getServiceData(); // 更新服务table
        });
      } else { // 接口数据
        const formInsert = {
          alert: formData.passParams.alert,
          bakChannel: {
            serial: formData.passParams.bakSerial,
            bps: formData.passParams.bakBps,
            dataBit: formData.passParams.bakDataBit,
            checkBit: formData.passParams.bakCheckBit,
            stopBit: formData.passParams.bakStopBit,
            ip: formData.passParams.bakIp,
            port: formData.passParams.bakPort
          },
          bakChannelId: formData.passParams.bakChannelId,
          channel: {
            serial: formData.serial,
            bps: formData.bps,
            dataBit: formData.dataBit,
            checkBit: formData.checkBit,
            stopBit: formData.stopBit,
            ip: formData.ip,
            port: formData.port,
            localIp: formData.localIp,
            ipList: formData.ipList
          },
          channelId: formData.channelId,
          delay: formData.passParams.delay,
          description: formData.description,
          otherParams: formData.plugin.otherParams,
          outerParams: formData.plugin.outerParams,
          pipelineName: formData.pipelineName,
          plushId: formData.plugin.id,
          projectId: this.idFactory,
          reset: formData.passParams.reset,
          type: this.serviceType
        };
        console.log(formInsert);
        await addPass(formInsert);
      }
    },
    // 复制
    itemsCopy (multipleSelection) {
      // console.log(multipleSelection);
      this.treeData.forEach(service => {
        /* 复制通道 */
        if (this.level === 1 && service.id === this.id) {
          multipleSelection.forEach(selection => {
            const selectionCopy = JSON.parse(JSON.stringify(selection)); // 深拷贝
            selectionCopy.id = this.id + Math.random().toString(36).substr(-10); // 随机生成id
            const obj = {
              text: `${selectionCopy.pipelineName}[${selectionCopy.description}]`,
              icon: "fa fa-laptop",
              id: selectionCopy.id,
              level: 2,
              children: [],
              selected: false,
              opened: true // 父节点须设置opened为true，否则子节点首次新增时打不开
            };
            service.children.push(obj); // 在树里复制
            this.passListAll.push(selectionCopy); // 在通道列表复制
          });
          this.refreshData(); // 刷新数据
        }
        /* 复制设备 */
        this.level === 2 && service.children.forEach(pass => {
          if (pass.id === this.id) {
            multipleSelection.forEach(selection => {
              const selectionCopy = JSON.parse(JSON.stringify(selection)); // 深拷贝
              selectionCopy.id = this.id + Math.random().toString(36).substr(-10); // 随机生成id
              const obj = {
                text: `${selectionCopy.equipmentName}[${selectionCopy.equipmentDescribe}]`,
                icon: "fa fa-edit",
                id: selectionCopy.id,
                level: 3,
                selected: false
              };
              pass.children.push(obj); // 在树里复制
              this.equipmentListAll.push(selectionCopy); // 在设备列表复制
            });
            this.refreshData(); // 刷新数据
          }
        });
      });
      // console.log(this.treeData);
    },
    // 点击树节点 - 选择工程
    async factorySelect (param) {
      const { level, id } = param;
      if (level === 3) {
        // console.log(param);
        this.serviceData = param;
        this.serviceId = this.serviceData.id;
        this.idFactory = id;
        if (this.isMock) { // mock数据
          this.treeData = param.treeData;
          if (this.treeData.length !== 0) { // 若树数据不为空
            this.treeData.forEach(group => { // 取消所有选中
              group.selected = false;
              group.children.forEach(pass => {
                pass.selected = false;
                pass.children.forEach(equipment => {
                  equipment.selected = false;
                });
              });
            });
            this.refreshSelect(); // 重设树，选中顶部 "采集服务"
          }
          this.refreshData();
        } else { // 接口数据
        }
      }
    },
    // 工程组发生改变（增删改）
    factoryHandle () {
      this.getFactoryData(this.idFactory, this.idTeam);
    },
    // 保存
    itemSubmit (level) {
      level === 2 && this.$refs.pass.passSubmit();
      level === 3 && this.$refs.equipment.equipmentSubmit();
    }
  },
  watch: {
    idFactory () { // 工程id发生改变
      this.getPassServiceData(this.idFactory); // 获取服务导航数据
      this.serviceType = 0; // 服务type切换回采集
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-plan.scss';
</style>
