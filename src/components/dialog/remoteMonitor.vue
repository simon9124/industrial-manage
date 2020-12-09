<template>
  <div>

    <!-- ip -->
    <el-dialog class="ip-select"
               title="IP选择"
               :visible.sync="dialogVisibleIP">

      <!-- btns -->
      <el-row style="margin-bottom:20px">
        <el-button type="warning"
                   size="small"
                   plain
                   @click="searchEquipment">搜索设备</el-button>
        <el-button type="primary"
                   size="small"
                   plain
                   @click="insertIP">添加</el-button>
        <el-button type="danger"
                   size="small"
                   plain
                   @click="deleteIPs">删除</el-button>
        <el-button type="success"
                   size="small"
                   plain
                   @click="updateStatus">更新状态</el-button>
      </el-row>

      <el-table :data="IPList"
                tooltip-effect="dark"
                :max-height="tableMaxHeight"
                @row-dblclick="remoteMonitor"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="30">
        </el-table-column>
        <el-table-column label=""
                         width="30">
          <template slot-scope="scope">
            <i :class="scope.row.operate?'el-icon-check':'el-icon-close'"></i>
          </template>
        </el-table-column>
        <el-table-column type="index"
                         label="序号"
                         width="50">
        </el-table-column>
        <el-table-column prop="address"
                         label="IP地址"
                         min-width="100">
        </el-table-column>
        <el-table-column prop="system"
                         label="系统平台"
                         min-width="100">
        </el-table-column>
        <el-table-column prop="productName"
                         label="产品名称"
                         min-width="80">
        </el-table-column>
        <el-table-column prop="factoryDescribe"
                         label="工程描述"
                         min-width="120">
        </el-table-column>
        <el-table-column prop="kernelEdition"
                         label="内核版本"
                         min-width="80">
        </el-table-column>
        <el-table-column prop="faultTimes"
                         label="故障次数"
                         min-width="80">
        </el-table-column>
        <el-table-column prop="createTime"
                         label="工程创建时间"
                         min-width="140">
        </el-table-column>
        <el-table-column prop="status"
                         label="状态"
                         min-width="60">
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- ipInsert -->
    <el-dialog class="factory-operate"
               title="IP维护"
               :visible.sync="dialogVisibleIPInsert">

      <el-form ref="IPform"
               :model="IPform"
               label-width="90px"
               label-position="right">

        <el-form-item prop="address"
                      label="IP：">
          <el-input v-model="IPform.address"></el-input>
        </el-form-item>
        <el-form-item prop="factoryDescribe"
                      label="工程描述：">
          <el-input v-model="IPform.factoryDescribe"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisibleIPInsert = false">取 消</el-button>
        <el-button @click="submitIP"
                   type="primary"
                   :loading="submitLoading">确 定</el-button>
      </div>

    </el-dialog>

    <!-- monitor -->
    <el-dialog class="monitor-dialog"
               :title="dialogTitleMonitor"
               :visible.sync="dialogVisibleMonitor"
               top="10vh">

      <el-container>

        <!--左 · 树-->
        <el-aside class="left-panel">
          <left-tree class="left-panel-tree"
                     :data="monitorTree"
                     :contextmenu="false"
                     :collapse="false"
                     @item-click="itemClick">
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
              <el-table-column prop="describe"
                               label="描述(中文)"
                               min-width="160">
              </el-table-column>
              <el-table-column prop="curValue"
                               label="当前值"
                               min-width="180">
              </el-table-column>
              <el-table-column prop="curTime"
                               label="时间"
                               min-width="160">
              </el-table-column>
              <el-table-column prop="qualityStamp"
                               label="质量戳"
                               min-width="80">
              </el-table-column>
              <el-table-column prop="changeTimes"
                               label="变化次数"
                               min-width="80">
              </el-table-column>
              <el-table-column prop="handle"
                               label="HANDLE"
                               min-width="80">
              </el-table-column>
              <el-table-column prop="dataType"
                               label="数据类型"
                               min-width="80">
              </el-table-column>
              <el-table-column prop="direction"
                               label="读写方向"
                               min-width="80">
              </el-table-column>
            </el-table>
          </el-form>
        </el-container>

      </el-container>

    </el-dialog>
  </div>
</template>

<script>
import LeftTree from "@/components/Tree"; // 组件：左侧树
import { treeTempleteData } from "@/mock/tree"; // mockData - // 服务导航模板
import { IPList, systemDic, passDic, equipmentDic } from "@/mock/dictionary"; // mockData - IP列表&监视表格数据
import { parseTime } from "@/libs/util"; // function - 格式化时间

export default {
  components: { LeftTree },
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
      operate: false, // 是否已“本地运行”
      ipOperate: false, // 当前IP地址是否已运行
      /* ip */
      dialogVisibleIP: false, // 是否可见 - ip选择
      dialogVisibleIPInsert: false, // 是否可见 - ip维护
      IPList: [], // ip列表
      multipleSelection: [], // 多选 - 选中的数据
      IPform: { // 新增ip表单
        address: "192.168.0.253",
        system: "",
        productName: "",
        factoryDescribe: "",
        kernelEdition: "",
        faultTimes: null,
        createTime: "",
        status: "离线",
        operate: false
      },
      /* monitor */
      dialogVisibleMonitor: false, // 是否可见 - 监视左数右表
      dialogTitleMonitor: "", // 弹框名称 - 监视左数右表
      monitorTree: [], // 监视数据 - 左侧树
      monitorTable: [], // 监视数据 - 右侧表格
      handle: 0, // 需要递增的handle列项
      /* 动态高度 */
      tableMaxHeight: 0, // 流体表格最大高度
      /* loading */
      submitLoading: false
    };
  },
  created () {
    const screenHeight = document.documentElement.clientHeight;
    this.tableMaxHeight = screenHeight - 54 - 10 * 2 - 10 * 2 - screenHeight * 0.20;
  },
  methods: {
    // ip选择框 - 弹出
    ipSelect () {
      this.dialogVisibleIP = true;
      this.IPList = IPList;
      this.refreshIPTable(); // ip表格数据处理
    },
    // ip选择框 - 表格数据处理
    refreshIPTable () {
      if (this.operate) {
        this.$set(this.IPList[0], "system", "windows");
        this.$set(this.IPList[0], "productName", "本地运行");
        this.$set(this.IPList[0], "kernelEdition", "5");
        this.$set(this.IPList[0], "faultTimes", 0);
        this.factoryData[0].children.forEach(group => {
          group.children.forEach(factory => {
            if (factory.id === this.idFactory) {
              this.$set(this.IPList[0], "factoryDescribe", factory.text);
              this.$set(this.IPList[0], "createTime", factory.creatTime);
            }
          });
        });
        this.$set(this.IPList[0], "status", "在线");
        this.$set(this.IPList[0], "operate", true);
      }
    },
    // ip选择框 - 获取选中的数据
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // ip选择框 - 新增
    insertIP () {
      this.dialogVisibleIPInsert = true;
      this.$nextTick(() => {
        this.$refs.IPform.resetFields();
      });
    },
    // ip选择框 - 新增确认
    submitIP () {
      const formData = JSON.parse(JSON.stringify(this.IPform));
      // console.log(formData);
      this.submitLoading = true;
      if (IPList.some(ip => ip.address === this.IPform.address)) { // 判断重复
        this.$message.error("IP地址已存在！");
        this.submitLoading = false;
      } else {
        formData.id = Math.random().toString(36).substr(-10);// 随机生成id
        IPList.push(formData);
        this.submitLoading = false;
        this.dialogVisibleIPInsert = false;
      }
    },
    // ip选择框 - 删除
    deleteIPs () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: "未选择IP",
          type: "warning",
          duration: 1000
        });
        return false;
      }
      this.$confirm("将删除IP, 是否继续?", "提示", {
        type: "warning"
      }).then(() => {
        for (let i = 0; i < this.IPList.length; i++) {
          this.multipleSelection.forEach(select => {
            this.IPList[i].id === select.id && this.IPList.splice(i, 1);
          });
        }
      }).catch(() => { });
    },
    // ip选择框 - 本地运行
    localOperate () {
      this.operate = true;
    },
    // ip选择框 - 搜索设备
    searchEquipment () {
      this.refreshIPTable(); // ip表格数据处理
    },
    // ip选择框 - 更新状态
    updateStatus () {
      this.refreshIPTable(); // ip表格数据处理
    },
    // 监视数据框 - 弹出
    remoteMonitor (row) {
      this.handle = 0;
      this.ipOperate = row.operate;
      this.dialogTitleMonitor = row.address;
      this.dialogVisibleMonitor = true;
      this.$nextTick(() => {
        this.getTreeData(); // 渲染左侧树
        this.getTableData(this.monitorTree[0].tableData); // 渲染右侧表格
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
          level: 0,
          selected: true,
          opened: true,
          children: this.operate && this.ipOperate ? treeData : treeTempleteData
        }
      ];
      this.handleRecursion(this.monitorTree); // 左侧树数据递归处理
    },
    // 监视数据框 - 渲染右侧表格
    getTableData (data) {
      this.monitorTable = this.operate && this.ipOperate ? data : []; // 渲染表格
      this.monitorTable.forEach((item, i) => { // 表格数据处理
        this.$set(item, "curTime", parseTime(new Date()));
        this.$set(item, "qualityStamp", "good");
        this.$set(item, "changeTimes", Math.floor(Math.random() * (1 - 101) + 101));
        this.$set(item, "direction", "只读");
        item.name === "_project_name" && this.factoryData[0].children.forEach(group => {
          group.children.forEach(factory => {
            factory.id === this.idFactory && this.$set(item, "curValue", factory.text);
          });
        });
        item.name === "_project_create_time" && this.factoryData[0].children.forEach(group => {
          group.children.forEach(factory => {
            factory.id === this.idFactory && this.$set(item, "curValue", factory.creatTime);
          });
        });
      });
    },
    // 监视数据框 - 点击左侧树节点
    itemClick (param) {
      console.log(param);
      this.getTableData(param.tableData); // 渲染右侧表格
    },
    // 监视数据框 - 左侧树数据处理 - 递归函数
    handleRecursion (recursionData) {
      recursionData.forEach(item => {
        const params = {
          opened: true,
          selected: item.level === 0,
          tableData:
            item.level === 0 ? JSON.parse(JSON.stringify(systemDic))
              : item.level === 1 ? []
                : item.level === 3 ? JSON.parse(JSON.stringify(equipmentDic))
                  : item.id.slice(0, 1) === "1"
                    ? JSON.parse(JSON.stringify(passDic.filter(pass => pass.type.indexOf("collect") > -1)))
                    : JSON.parse(JSON.stringify(passDic.filter(pass => pass.type.indexOf("data") > -1)))
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
    }

  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
