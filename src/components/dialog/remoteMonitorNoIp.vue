<template>
  <div>

    <!-- monitor -->
    <el-dialog class="monitor-dialog"
               title="远程监视"
               :visible.sync="dialogVisibleMonitor"
               top="10vh">

      <el-button size="small"
                 type="primary"
                 @click="cmd">常用工具</el-button>
      <el-button size="small"
                 type="warning">系统日志</el-button>

      <el-container style="margin-top:20px"
                    v-loading="contentLoading">

        <!--左 · 树-->
        <el-aside class="left-panel">
          <left-tree v-loading="treeLoading"
                     class="left-panel-tree"
                     :data="monitorTree"
                     :contextmenu="false"
                     :collapse="false"
                     @item-click="itemClick"
                     @item-toggle="itemToggle">
          </left-tree>
        </el-aside>

        <!--右 · 表-->
        <el-container class="right-panel is-vertical">
          <el-form label-position="left">
            <el-table :data="monitorTable"
                      tooltip-effect="dark"
                      empty-text=" "
                      :max-height="tableMaxHeight">
              <el-table-column type="index"
                               label="序号"
                               width="40">
              </el-table-column>
              <el-table-column prop="name"
                               label="名称(英文)"
                               min-width="150">
              </el-table-column>
              <el-table-column prop="description"
                               label="描述(中文)"
                               min-width="160">
              </el-table-column>
              <el-table-column prop="value"
                               label="当前值"
                               min-width="180">
              </el-table-column>
              <el-table-column prop="curTime"
                               label="时间"
                               min-width="160">
              </el-table-column>
              <el-table-column prop="quality"
                               label="质量戳"
                               min-width="80">
              </el-table-column>
              <el-table-column prop="changes"
                               label="变化次数"
                               min-width="80">
              </el-table-column>
              <el-table-column prop="handle"
                               label="HANDLE"
                               min-width="160">
              </el-table-column>
              <el-table-column prop="dataType"
                               label="数据类型"
                               min-width="80">
              </el-table-column>
              <el-table-column prop="rwType"
                               label="读写方向"
                               min-width="80">
              </el-table-column>
            </el-table>
          </el-form>
        </el-container>

      </el-container>

    </el-dialog>

    <!-- cmd -->
    <cmd ref="cmd"></cmd>

  </div>
</template>

<script>
import LeftTree from "@/components/Tree"; // 组件：左侧树
import Cmd from "@/components/dialog/cmd.vue";
import { systemDic, passDic, equipmentDic } from "@/mock/dictionary"; // mockData - IP列表&监视表格数据
import { parseTime } from "@/libs/util"; // function - 格式化时间
/* api */
import { queryEqupementList } from "@/api/equipment.js"; // 设备列表
import { queryRemoteMonitorList } from "@/api/remote.js"; // 远程监视列表

export default {
  components: { LeftTree, Cmd },
  props: {
    // 工程数据
    factoryData: {
      type: Array,
      default: () => []
    },
    // 被选择的id - 工程
    idFactory: {
      type: String
    },
    // 树数据
    treeData: {
      type: Array
    }
  },
  data () {
    return {
      /* monitor */
      dialogVisibleMonitor: false, // 是否可见 - 监视左数右表
      monitorTree: [], // 监视数据 - 左侧树
      monitorTable: [], // 监视数据 - 右侧表格
      handle: 0, // 需要递增的handle列项
      /* 动态高度 */
      tableMaxHeight: 0, // 流体表格最大高度
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
      }], // 懒加数据 - 左侧树展开
      treeLoading: false, // 左侧树loading
      contentLoading: false // 右侧表loading
    };
  },
  created () {
    const screenHeight = document.documentElement.clientHeight;
    this.tableMaxHeight = screenHeight - 54 - 10 * 2 - 10 * 2 - screenHeight * 0.25;
  },
  methods: {
    // 监视数据框 - 弹出
    remoteMonitor (row) {
      this.handle = 0;
      this.dialogVisibleMonitor = true;
      this.$nextTick(() => {
        this.getTreeData(); // 渲染左侧树
        this.isMock && this.getTableData(this.monitorTree[0].tableData); // 渲染右侧表格
        !this.isMock && this.itemClick({
          idStr: null,
          level: 0,
          type: 0
        });
      });
    },
    // 监视数据框 - 渲染左侧树
    getTreeData () {
      const treeData = JSON.parse(JSON.stringify(this.treeData)); // 深拷贝
      this.monitorTree = [
        {
          text: "系统",
          icon: "fa fa-folder",
          id: "root",
          idStr: null,
          level: 0,
          type: 0,
          selected: true,
          opened: true,
          children: treeData
        }
      ];
      this.handleRecursion(this.monitorTree); // 左侧树数据递归处理
    },
    // 监视数据框 - 渲染右侧表格
    getTableData (data) {
      this.monitorTable = data; // 渲染表格
      this.monitorTable.forEach((item, i) => { // 表格数据处理
        this.$set(item, "curTime", parseTime(new Date()));
        this.$set(item, "quality", "good");
        this.$set(item, "changes", Math.floor(Math.random() * (1 - 101) + 101));
        this.$set(item, "rwType", "只读");
        item.name === "_project_name" && this.factoryData[0].children.forEach(group => {
          group.children.forEach(factory => {
            factory.id === this.idFactory && this.$set(item, "value", factory.text);
          });
        });
        item.name === "_project_create_time" && this.factoryData[0].children.forEach(group => {
          group.children.forEach(factory => {
            factory.id === this.idFactory && this.$set(item, "value", factory.creatTime);
          });
        });
      });
    },
    // 监视数据框 - 点击左侧树节点
    async itemClick (param) {
      console.log(param);
      if (!this.isMock) {
        /* 接口数据 */
        if (param.level !== 1) { // 非“采集服务”或“数据服务”
          this.contentLoading = true;
          this.monitorTable = (await queryRemoteMonitorList({
            size: "1000",
            parentId: param.idStr,
            type: param.dataType
          })).data.data.map(item => {
            this.$set(item, "quality", item.quality ? "good" : "bad");
            this.$set(item, "curTime", parseTime(new Date(item.updateTime)));
            this.$set(item, "handle", item.idStr);
            return item;
          });
          // console.log(this.monitorTable);
          this.contentLoading = false;
        } else { // “采集服务”或“数据服务”
          this.monitorTable = [];
        }
      } else {
        /* mock数据 */
        this.getTableData(param.tableData);
      }
    },
    // 监视数据框 - 树节点展开/收起 - 仅接口
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
    // 获取设备数据 - 仅接口
    async getEquipmentData (passId) {
      // console.log(this.passId);
      this.monitorTree[0].children.forEach(service => { // 服务
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
              this.$set(equipment, "dataType", 3);
              return equipment;
            });
            // console.log(equipmentList);
            pass.children = equipmentList; // 加载真实数据
            this.treeLoading = false;
          }
        });
      });
    },
    // 监视数据框 - 左侧树数据处理 - 递归函数
    handleRecursion (recursionData) {
      recursionData.forEach(item => {
        const params = {
          opened: this.isMock ? true : (item.level === 0 || item.level === 1),
          selected: item.level === 0,
          tableData:
            item.level === 0 ? JSON.parse(JSON.stringify(systemDic))
              : item.level === 1 ? []
                : item.level === 3 ? JSON.parse(JSON.stringify(equipmentDic))
                  : item.id.slice(0, 1) === "1"
                    ? JSON.parse(JSON.stringify(passDic.filter(pass => pass.type.indexOf("collect") > -1)))
                    : JSON.parse(JSON.stringify(passDic.filter(pass => pass.type.indexOf("data") > -1))),
          dataType: item.level === 0 ? item.type
            : (item.level === 2 && item.type === 0) ? 1
              : (item.level === 2 && item.type === 1) ? 2
                : item.level === 3 ? 3 : null
        };
        this.dataPackage(item, params);
        item.children && this.handleRecursion(item.children);
      });
    },
    // 监视数据框 - 封装：左侧树每层数据处理
    dataPackage (item, params) {
      Object.keys(params).forEach(key => {
        this.$set(item, key, params[key]); // 遍历对象：①选中与否 ②展开 ③设置tableData
      });
      item.tableData.forEach(_item => { // handle列项
        this.$set(_item, "handle", this.handle);
        this.handle++;
      });
    },
    // 常用工具 - 调用子组件事件
    cmd () {
      this.$refs.cmd.openCmd();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
