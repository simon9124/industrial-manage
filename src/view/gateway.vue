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
                :id-factory="idFactory"
                :service-type="serviceType"
                :factory-data="factoryData"
                :tree-data="treeData"
                :lazy-tree-data="lazyTreeData"
                :plugin-list="pluginList"
                :collect-channel-list="collectChannelList"
                :pass-type-list="passTypeList"
                :other-params-equ="otherParamsEqu"
                :outer-params-equ="outerParamsEqu"
                :pass-list="passList"
                :equipment-list="equipmentList"
                :content-loading="contentLoading"
                :dialog-dispose-loading="dialogDisposeLoading"
                @item-add="itemAdd"
                @items-copy="itemsCopy"
                @item-delete="itemHandle('del')"
                @item-submit="itemSubmit"
                @factory-select="factorySelect"
                @factory-handle="factoryHandle"
                @save-project-xml="saveProjectXml"></Header>
      </el-header>

      <!-- 中 · 内容 -->
      <el-container>

        <!--左 · 树-->
        <el-aside class="left-panel"
                  :style="{height:contentHeight}">
          <div class="left-panel-title">服务导航</div>
          <left-tree v-if="treeData.length!==0"
                     v-loading="treeLoading"
                     class="left-panel-tree"
                     :data="treeData"
                     :contextmenu="false"
                     :id="id"
                     @item-click="itemClick"
                     @item-toggle="itemToggle"
                     @item-handle="itemHandle">
          </left-tree>
          <div v-else
               class="left-panel-tree">未选中工程</div>
        </el-aside>

        <!--右 · 表-->
        <el-container class="right-panel is-vertical"
                      v-loading="contentLoading">
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
          <Pass v-if="level===2"
                ref="pass"
                :id="id"
                :service-type="serviceType"
                :tree-data="treeData"
                :pass-list="passList"
                :equipment-list="equipmentList"
                :plugin-list="pluginList"
                :collect-channel-list="collectChannelList"
                :pass-type-list="passTypeList"
                :form-pass-org="formPassOrg"
                :label-outer-params="labelOuterParams"
                :content-loading="contentLoading"
                @item-update="itemUpdate"></Pass>
          <Equipment v-if="level===3"
                     ref="equipment"
                     :id="id"
                     :tree-data="treeData"
                     :equipment-list="equipmentList"
                     :form-equipment-org="formEquipmentOrg"
                     :label-outer-params="labelOuterParams"
                     :label-other-params="labelOtherParams"
                     :content-loading="contentLoading"
                     @item-update="itemUpdate"></Equipment>
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
import {
  getValueByKey, // 根据对象数组某个key的value，查询另一个key的value
  resultCallback // 根据请求的status执行回调函数
} from "@/libs/dataHanding";
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
import { queryProjectList, saveProjectXml } from "@/api/project.js"; // 工程
import { queryPlushTypeList, queryPlushList } from "@/api/plugin.js"; // 插件
import { queryPassList, addPass, queryPassMessage, updatePass, deletePass } from "@/api/pass.js"; // 通道
import { queryEqupementList, addEqupement, queryEqupementMessage, updateEqupement, deleteEqupement } from "@/api/equipment.js"; // 设备

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
      /* tree */
      level: 1, // 被选择的树的层级 - 服务导航
      id: "1", // 被选择内容的id - 服务导航
      serviceType: 0, // 0/1 采集服务/数据服务
      handleType: "", // 树节点的操作方式
      idFactory: null, // 被选择内容的id - 工程管理
      idTeam: null, // 被选择内容的id - 工程组
      idSelect: null, // 通道id or 设备id
      otherParamsEqu: null, // 通道传给设备的outerParams
      outerParamsEqu: null, // 通道传给设备outerParams
      passId: null, // 设备的上层通道id - 新增删除设备时用
      formPassOrg: {}, // 通道表单 - 修改通道时用
      formEquipmentOrg: {}, // 通道表单 - 修改设备时用
      labelOuterParams: [], // 标签列表的动态列 - 标签用
      labelOtherParams: [], // 标签列表的动态其他参数 - 标签用
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
      pageLoading: false, // 页面整体loading
      treeLoading: false, // 服务导航loading
      contentLoading: false, // 通道/设备loading
      dialogDisposeLoading: false, // 配置表单loading
      /* 动态高度 */
      contentHeight: "0px" // 中部内容
    };
  },
  created () {
    const screenHeight = document.documentElement.clientHeight;
    // console.log(screenHeight);
    this.contentHeight = (screenHeight - 8 * 2 - 74) + "px";
    this.idFactory = localStorage.getItem("project-id"); // 工程id
    this.idTeam = localStorage.getItem("team-id"); // 工程组id
    this.idPlugin = localStorage.getItem("plugin-id"); // 插件id
    this.pluginTeamName = localStorage.getItem("plugin-teamName"); // 插件类型name
    this.idSelect = localStorage.getItem("select-id"); // 通道id or 设备id
    this.treeData = JSON.parse(JSON.stringify(treeTempleteData));
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
    // 获取通道数据 - 仅接口
    async getPassServiceData (projectId) {
      /* 1.通道数据 */
      const passCollectList = // 采集服务通道
        ((await queryPassList({ projectId: projectId, type: 0 })).data.data).map(pass => {
          this.$set(pass, "text", `C${pass.pipelineName}[${pass.description}]`);
          this.$set(pass, "describe", pass.description);
          this.$set(pass, "icon", "fa fa-laptop");
          this.$set(pass, "id", pass.idStr);
          this.$set(pass, "level", 2);
          this.$set(pass, "children", this.lazyTreeData);
          this.$set(pass, "selected", false);
          this.$set(pass, "opened", false);
          return pass;
        });
      const passDataList = // 数据服务通道
        ((await queryPassList({ projectId: projectId, type: 1 })).data.data).map(pass => {
          this.$set(pass, "text", `C${pass.pipelineName}[${pass.description}]`);
          this.$set(pass, "describe", pass.description);
          this.$set(pass, "icon", "fa fa-laptop");
          this.$set(pass, "id", pass.idStr);
          this.$set(pass, "level", 2);
          this.$set(pass, "selected", false);
          this.$set(pass, "opened", false);
          return pass;
        });
      /* 2.放到服务导航列表中 */
      this.treeData.forEach(service => {
        this.$set(service, "children", service.type === 0 ? passCollectList : passDataList);
        this.$set(service, "opened", true);
        this.$set(service, "selected", false); // 临时
      });
      /* 3.获取被选中的通道数据 */
    },
    // 获取设备数据 - 仅接口
    async getEquipmentData (passId, select = false) {
      // console.log(this.passId);
      this.treeData.forEach(service => { // 服务
        service.children.forEach(async pass => { // 通道
          if (pass.idStr === passId) {
            this.treeLoading = true;
            pass.opened = true;
            pass.children = this.lazyTreeData; // 懒加载数据
            const equipmentList = (await queryEqupementList({ // 展开的设备数据
              page: 1,
              pipelineId: passId,
              size: 1000
            })).data.data.map(equipment => {
              this.$set(equipment, "text", `D${equipment.name}[${equipment.description}]`);
              this.$set(equipment, "describe", equipment.description);
              this.$set(equipment, "icon", "fa fa-edit");
              this.$set(equipment, "id", equipment.idStr);
              this.$set(equipment, "level", 3);
              this.$set(equipment, "selected", false);
              return equipment;
            });
            // console.log(equipmentList);
            pass.children = equipmentList; // 加载真实数据
            this.treeLoading = false;
            select && this.getSelectedItem(); // 自动选中设备
          }
        });
      });
    },
    // 获取插件类型数据 - 仅接口
    async getPluginList (type, pluginId, teamName) {
      /* 1.插件数据 */
      var plushList;
      // console.log(pluginId);
      teamName && (plushList = (await queryPlushList({ // 展开的插件数据
        plushTypeName: teamName,
        serviceType: this.serviceType
      })).data.data).map(plush => {
        this.$set(plush, "text", plush.description);
        this.$set(plush, "icon", "fa fa-cog");
        this.$set(plush, "selected", pluginId.toString() === plush.id.toString());
        this.$set(plush, "level", 2);
        return plush;
      });
      // console.log(plushList);
      /* 2.插件类型数据 */
      const pluginList = (await queryPlushTypeList({ type: this.serviceType })).data.data;
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
    // 自动选中通道/设备
    getSelectedItem () {
      // console.log(this.treeData);
      const selectId = localStorage.getItem("select-id");
      this.treeData.forEach(service => {
        service.selected = false; // 取消选中所有服务
        service.children.forEach(pass => {
          pass.selected = false; // 取消选中所有通道
          if (pass.id === selectId) {
            this.id = pass.id; // 更新全局id
            this.level = 2; // 更新全局level
            pass.selected = true; // 选中该通道
            pass.opened = pass.id === this.passId;
          }
          pass.children && pass.children.forEach(equipment => {
            equipment.selected = false; // 取消选中所有设备
            if (equipment.id === selectId) {
              this.id = equipment.id; // 更新全局id
              this.level = 3; // 更新全局level
              equipment.selected = true; // 选中该设备
            }
          });
        });
      });
    },
    // 获取详情 - 通道/设备 - 仅接口
    async getMessage (selectId) {
      if (this.level === 2) {
        const result = (await queryPassMessage({ id: selectId })).data.data;
        // console.log(result);
        await (this.formPassOrg = result);
        this.idPlugin = this.formPassOrg.plush.id;
        this.pluginTeamName = this.formPassOrg.plush.typeName;
        localStorage.setItem("plugin-id", this.idPlugin);
        localStorage.setItem("plugin-teamName", this.pluginTeamName);
        this.outerParamsEqu = this.formPassOrg.plush.deviceOuterParams; // 设备外层参数
        this.otherParamsEqu = this.formPassOrg.plush.deviceOtherParams; // 设备其他参数
        this.labelOuterParams = this.formPassOrg.plush.dataLabelOuterParams || []; // 通道标签列
        this.labelOtherParams = this.formPassOrg.plush.dataLabelOtherParams || []; // 通道标签其他参数
        this.$nextTick(() => {
          this.$refs.pass.getData();
        });
      } else if (this.level === 3) {
        const result = (await queryEqupementMessage({ id: selectId })).data.data;
        // console.log(result);
        await (this.formEquipmentOrg = result);
        this.passId = result.pipelineIdStr; // 当前设备的上层通道id
        /* 查询该设备上层的通道的插件相关信息：collectLabelOtherParams & collectLabelOuterParams */
        const passResult = (await queryPassMessage({ id: this.passId })).data.data;
        this.labelOuterParams = passResult.plush.collectLabelOuterParams || []; // 设备标签列
        this.labelOtherParams = passResult.plush.collectLabelOtherParams || []; // 设备标签其他参数
        // 设备标签用
        this.$nextTick(() => {
          this.$refs.equipment.getData();
        });
      }
    },
    // 点击树节点
    async itemClick (param) {
      // console.log(param);
      const { level, id, idStr, type } = param;
      this.level = level;
      this.id = this.isMock ? id : idStr;
      this.serviceType = type || 0;
      if (this.level === 2) { // 点击通道
        localStorage.setItem("select-id", this.id);
      } else if (this.level === 3) { // 点击设备
        localStorage.setItem("select-id", this.id);
      }
    },
    // 树节点展开/收起 - 仅接口
    async itemToggle (param) {
      if (!this.isMock && param.opened) {
        // console.log(param);
        // this.serviceType = param.type;
        if (param.level === 1) { // 展开通道
        } else { // 展开设备
          await this.getEquipmentData(param.idStr);
        }
      }
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
        }).then(async () => {
          if (this.isMock) { // mock数据
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
          } else { // 接口数据
            if (this.level === 2) { // 删除通道
              this.treeLoading = true;
              const result = (await deletePass({ ids: [this.id] })).data.success;
              resultCallback(result, "删除成功！", async () => {
                await this.getPassServiceData(this.idFactory);
                this.refreshSelect(); // 重设树，选中顶部 "采集服务"
                this.treeLoading = false;
              }, () => {
                this.treeLoading = false;
              });
            } else { // 删除设备
              this.treeLoading = true;
              const result = (await deleteEqupement({ ids: [this.id] })).data.success;
              resultCallback(result, "删除成功！", async () => {
                await localStorage.setItem("select-id", this.passId);
                await this.getSelectedItem(); // 选中设备上层通道
                await this.getEquipmentData(this.passId); // 刷新本层的设备
                this.treeLoading = false;
              }, () => {
                this.treeLoading = false;
              });
            }
          }
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
        this.serviceType = 0; // 服务type切换回采集
        this.id = this.treeData[0].id;
        this.$set(this.treeData[0], "selected", true); // 选中“采集服务”
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
        if (this.level === 1) { // 新增通道
          let otherParams = this.outerParamsHanding(formData.otherParams); // otherParams数据处理
          let outerParams = this.outerParamsHanding(formData.outerParams); // outerParams数据处理
          const formInsert = {
            alert: formData.passParams.alert,
            bakChannel: this.serviceType === 0 ? {
              serial: formData.passParams.bakSerial,
              bps: formData.passParams.bakBps,
              dataBit: formData.passParams.bakDataBit,
              checkBit: formData.passParams.bakCheckBit,
              stopBit: formData.passParams.bakStopBit,
              ip: formData.passParams.bakIp,
              port: formData.passParams.bakPort
            } : null,
            bakChannelId: !formData.passParams.bakChannelIs ? null : formData.passParams.bakChannelId,
            channel: {
              serial: formData.serial,
              bps: formData.bps,
              dataBit: formData.dataBit,
              checkBit: formData.checkBit,
              stopBit: formData.stopBit,
              ip: formData.ip,
              port: formData.port,
              localIp: formData.localIp,
              ipList: formData.ipList.length !== 0 ? formData.ipList : null
            },
            channelId: formData.channelId,
            delay: formData.passParams.delay,
            description: formData.description,
            otherParams: otherParams.length !== 0 ? otherParams : null,
            outerParams: outerParams.length !== 0 ? outerParams : null,
            pipelineName: formData.pipelineName,
            plushId: formData.plugin.id,
            projectId: this.idFactory,
            reset: formData.passParams.reset,
            type: this.serviceType
          };
          // console.log(formInsert);
          this.dialogDisposeLoading = true;
          const result = (await addPass(formInsert));
          resultCallback(
            result.data.success,
            "添加成功！",
            async () => {
              this.dialogDisposeLoading = false;
              this.treeLoading = true;
              this.$refs.header.addHandle(true); // 关闭dialog
              await localStorage.setItem("select-id", result.data.data.idStr);
              await this.getPassServiceData(this.idFactory); // 重新获取通道列表
              await this.getSelectedItem(); // 选中新增的通道
              this.treeLoading = false;
            },
            () => {
              this.dialogDisposeLoading = false;
            }
          );
        } else { // 新增设备
          let otherParams = this.outerParamsHanding(formData.otherParamsEqu); // otherParams数据处理
          let outerParams = this.outerParamsHanding(formData.outerParamsEqu); // outerParams数据处理
          const formInsert = {
            pipelineId: this.id,
            deviceIp: "string",
            devicePort: 0,
            otherParams: otherParams.length !== 0 ? otherParams : null,
            outerParams: outerParams.length !== 0 ? outerParams : null,
            name: parseInt(formData.name),
            description: formData.description,
            userParam: formData.userParam,
            waitTime: formData.equipmentParams.waitTime,
            queryCount: formData.equipmentParams.queryCount,
            fault: formData.equipmentParams.fault ? 1 : 0,
            qcount: formData.equipmentParams.qcount,
            qtimers: formData.equipmentParams.qtimers,
            dataMode: formData.equipmentParams.dataMode,
            scanMode: formData.equipmentParams.scanMode,
            isDeviceParam: formData.equipmentParams.isDeviceParam ? 1 : 0,
            r1: formData.equipmentParams.r1.toString(),
            r2: formData.equipmentParams.r2.toString()
          };
          // console.log(formInsert);
          this.dialogDisposeLoading = true;
          const result = (await addEqupement(formInsert));
          resultCallback(
            result.data.success,
            "添加成功！",
            async () => {
              this.dialogDisposeLoading = false;
              this.treeLoading = true;
              this.$refs.header.addHandle(true); // 关闭dialog
              this.passId = result.data.data.pipelineIdStr; // 新增设备的通道id
              await localStorage.setItem("select-id", result.data.data.idStr);
              await this.getEquipmentData(this.id, true); // 获取当前通道下的设备列表，并选中新增的设备
              this.treeLoading = false;
            },
            () => {
              this.dialogDisposeLoading = false;
            }
          );
        }
      }
    },
    // 更新 - 仅接口
    async itemUpdate (formData) {
      if (this.level === 2) { // 更新通道
        // console.log(formData);
        let otherParams = this.outerParamsHanding(formData.otherParams); // otherParams数据处理
        let outerParams = this.outerParamsHanding(formData.outerParams); // outerParams数据处理
        const formUpdate = {
          id: formData.idStr,
          alert: formData.passParams.alert,
          bakChannel: this.serviceType === 0 ? {
            serial: formData.passParams.bakSerial,
            bps: formData.passParams.bakBps,
            dataBit: formData.passParams.bakDataBit,
            checkBit: formData.passParams.bakCheckBit,
            stopBit: formData.passParams.bakStopBit,
            ip: formData.passParams.bakIp,
            port: formData.passParams.bakPort
          } : null,
          bakChannelId: !formData.passParams.bakChannelIs ? null : formData.passParams.bakChannelId,
          channel: {
            serial: formData.serial,
            bps: formData.bps,
            dataBit: formData.dataBit,
            checkBit: formData.checkBit,
            stopBit: formData.stopBit,
            ip: formData.ip,
            port: formData.port,
            localIp: formData.localIp,
            ipList: formData.ipList.length !== 0 ? formData.ipList : null
          },
          channelId: formData.channelId,
          delay: formData.passParams.delay,
          description: formData.description,
          otherParams: otherParams.length !== 0 ? otherParams : null,
          outerParams: outerParams.length !== 0 ? outerParams : null,
          pipelineName: formData.pipelineName,
          plushId: formData.plugin.id,
          projectId: this.idFactory,
          reset: formData.passParams.reset,
          type: this.serviceType
        };
        // console.log(formUpdate);
        this.contentLoading = true;
        const result = (await updatePass(formUpdate));
        resultCallback(
          result.data.success,
          "更新成功！",
          async () => {
            this.treeLoading = true;
            await this.getPassServiceData(this.idFactory); // 重新获取通道列表
            await this.getEquipmentData(formData.idStr); // 重新获取当前通道下的设备
            await this.getSelectedItem(); // 选中修改的通道
            this.treeLoading = false;
            this.contentLoading = false;
          },
          () => {
            this.contentLoading = false;
          }
        );
      } else { // 更新设备
        // console.log(formData);
        let otherParams = this.outerParamsHanding(formData.otherParamsEqu); // otherParams数据处理
        let outerParams = this.outerParamsHanding(formData.outerParamsEqu); // outerParams数据处理
        const formUpdate = {
          id: formData.idStr,
          pipelineId: formData.pipelineIdStr,
          deviceIp: "string",
          devicePort: 0,
          otherParams: otherParams.length !== 0 ? otherParams : null,
          outerParams: outerParams.length !== 0 ? outerParams : null,
          name: parseInt(formData.name),
          description: formData.description,
          userParam: formData.userParam,
          waitTime: formData.equipmentParams.waitTime,
          queryCount: formData.equipmentParams.queryCount,
          fault: formData.equipmentParams.fault ? 1 : 0,
          qcount: formData.equipmentParams.qcount,
          qtimers: formData.equipmentParams.qtimers,
          dataMode: formData.equipmentParams.dataMode,
          scanMode: formData.equipmentParams.scanMode,
          isDeviceParam: formData.equipmentParams.isDeviceParam ? 1 : 0,
          r1: formData.equipmentParams.r1.toString(),
          r2: formData.equipmentParams.r2.toString()
        };
        // console.log(formUpdate);
        this.contentLoading = true;
        const result = (await updateEqupement(formUpdate));
        resultCallback(
          result.data.success,
          "更新成功！",
          async () => {
            this.treeLoading = true;
            await this.getEquipmentData(this.passId, true); // 重新获取当前通道下的设备，并选中修改的设备
            this.treeLoading = false;
            this.contentLoading = false;
          },
          () => {
            this.contentLoading = false;
          }
        );
      }
    },
    // outerParams数据处理成接口格式
    outerParamsHanding (paramsArr) {
      // console.log(paramsArr);
      let outerParams = [];
      paramsArr &&
        JSON.parse(JSON.stringify(paramsArr)).forEach(param => {
          param.items.forEach(item => {
            outerParams.push({ paramName: item.paramName, value: item.value });
          });
        });
      // console.log(outerParams);
      return outerParams;
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
    },
    // 生成配置文件
    async saveProjectXml () {
      this.contentLoading = true;
      const result = (await saveProjectXml({ id: this.idFactory })).data.success;
      resultCallback(
        result,
        "保存成功！",
        () => { this.contentLoading = false; },
        () => { this.contentLoading = false; }
      );
    }
  },
  watch: {
    async idFactory () { // 工程id发生改变
      if (!this.isMock) {
        this.treeLoading = true;
        await this.getPassServiceData(this.idFactory); // 获取服务导航数据
        await this.refreshSelect(); // 选中顶部“采集服务”
        this.treeLoading = false;
      }
    },
    async serviceType () { // 服务导航id发生改变
      if (!this.isMock) {
        // this.contentLoading = true;
        localStorage.setItem("plugin-id", ""); // 清空缓存中的插件id
        localStorage.setItem("plugin-teamName", ""); // 清空缓存中的插件类型id
        this.idPlugin = null;
        this.pluginTeamName = null;
        await this.getPluginList(this.serviceType, this.idPlugin, this.pluginTeamName);
      }
    },
    async id () { // id发生改变
      if (!this.isMock) {
        // console.log(this.id);
        this.contentLoading = true;
        this.treeLoading = true;
        await this.getMessage(this.id);
        /* id发生改变但serviceType未变：获取插件列表并渲染到插件类型 */
        let plushList = getValueByKey(this.pluginList, "name", localStorage.getItem("plugin-teamName"), "children"); // 获取当前的插件列表
        // console.log(plushList);
        if (plushList && plushList[0].text === "Loading...") { // 将懒加载数据转换为真实数据
          const teamName = localStorage.getItem("plugin-teamName");
          const pluginId = localStorage.getItem("plugin-id");
          plushList = (await queryPlushList({ // 展开的插件数据
            plushTypeName: teamName,
            serviceType: this.serviceType
          })).data.data.map(plush => {
            this.$set(plush, "text", plush.description);
            this.$set(plush, "icon", "fa fa-cog");
            this.$set(plush, "selected", pluginId === plush.id.toString());
            this.$set(plush, "level", 2);
            return plush;
          });
          this.pluginList.forEach(async plugin => {
            plugin.opened = false; // 关闭全部类型
            plugin.children = this.lazyTreeData; // 全部插件数据重置为懒加载
            if (plugin.name === teamName) {
              await this.$set(plugin, "children", plushList);
              plugin.opened = true;
              this.contentLoading = false;
              this.treeLoading = false;
            }
          });
        } else {
          this.contentLoading = false;
          this.treeLoading = false;
        }
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-plan.scss';
</style>
