<template>
  <el-dialog class="tag-select-dialog"
             v-if="dialogVisible"
             title="标签变量字典"
             :visible.sync="dialogVisible">

    <el-container>

      <!--左 · 树-->
      <el-aside class="left-panel">
        <left-tree v-loading="treeLoading"
                   class="left-panel-tree"
                   :data="tagTreeData"
                   :contextmenu="false"
                   :collapse="false"
                   @item-click="itemClick"
                   @item-toggle="itemToggle">
        </left-tree>
      </el-aside>

      <!--右 · 表-->
      <el-container class="right-panel is-vertical"
                    v-loading="tableLoading">
        <el-form label-position="left">

          <el-form-item v-if="isMock"
                        label-width="55px"
                        label="名称：">
            <el-input v-model="formData.IOTag"
                      disabled></el-input>
          </el-form-item>
          <el-form-item v-if="isMock"
                        label-width="55px"
                        label="描述：">
            {{tagDescribe}}
          </el-form-item>

          <el-table ref="tagListTable"
                    :data="tableData"
                    height="350"
                    tooltip-effect="dark"
                    highlight-current-row
                    @current-change="tagClick">
            <el-table-column type="index"
                             label="序号"
                             width="40">
            </el-table-column>
            <el-table-column prop="name"
                             label="名称"
                             width="110">
            </el-table-column>
            <el-table-column prop="description"
                             label="描述"
                             width="140">
            </el-table-column>
            <el-table-column prop="typeTable"
                             label="类型"
                             width="70">
            </el-table-column>
            <el-table-column prop="rwTable"
                             label="方向"
                             width="60">
            </el-table-column>
            <el-table-column prop="source"
                             label="来源"
                             width="70">
            </el-table-column>
          </el-table>

        </el-form>
      </el-container>

    </el-container>

    <div slot="footer"
         class="dialog-footer">
      <el-button v-if="isMock"
                 @click="dialogVisible = false;
                         formData.IOTag = IOTagOrg;
                         formData.IOTagParentId = IOTagParentIdOrg;
                         formData.IOTagSelectId = IOTagSelectIdOrg">取 消</el-button>
      <el-button v-else
                 @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"
                 @click="dialogVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getValueByKey } from "@/libs/dataHanding"; // 根据对象数组某个key的value，查询另一个key的value
/* components */
import LeftTree from "@/components/Tree"; // 组件：左侧树
/* api */
import { queryEqupementList } from "@/api/equipment.js"; // 获取设备列表
import { queryTagList } from "@/api/tag.js"; // 获取标签列表

export default {
  components: { LeftTree },
  props: {
    // 服务导航中被选择的id
    id: {
      type: String
    },
    // 当前标签数据
    formData: {
      type: Object,
      default: () => { }
    },
    // 左侧树 - 原始数据
    treeData: {
      type: Array,
      default: () => []
    },
    // 通道列表
    passList: {
      type: Array,
      default: () => []
    },
    // 设备列表
    equipmentList: {
      type: Array,
      default: () => []
    },
    // 描述 - 仅mock
    tagDescribe: {
      type: String
    },
    // 数据类型列表
    dataTypeList: {
      type: Array
    },
    // 读写方向列表
    directionList: {
      type: Array
    }
  },
  data () {
    return {
      tagTreeData: [], // 树数据
      dialogVisible: false, // 是否可见
      tableData: [], // 表格内容
      /* loading */
      treeLoading: false,
      tableLoading: false
    };
  },
  methods: {
    // 选择标签
    tagSelect () {
      this.dialogVisible = true;
      // console.log(this.formData);
      this.getTagTreeData();
      if (this.isMock) {
        /* 深拷贝，取消时还原数据用 */
        this.IOTagOrg = JSON.parse(JSON.stringify(this.formData.IOTag));
        this.IOTagParentIdOrg =
          this.formData.IOTagParentId ? JSON.parse(JSON.stringify(this.formData.IOTagParentId)) : "";
        this.IOTagSelectIdOrg =
          this.formData.IOTagSelectId ? JSON.parse(JSON.stringify(this.formData.IOTagSelectId)) : "";
      }
    },
    // 处理原树数据，刷新左侧树和其对应内容 - 仅接口
    getTagTreeData () {
      this.tagTreeData = JSON.parse(JSON.stringify(this.treeData));
      /* group */
      this.tagTreeData.forEach(group => {
        if (group.id === "1") {
          group.text = "IO标签";
          group.tagSelectList = [
            {
              name: "_kernal_version",
              description: "应用程序内核版本",
              typeTable: "整型",
              rwTable: "读写",
              source: "IO属性",
              parentId: group.id,
              id: "0"
            },
            {
              name: "_cpu",
              description: "CPU负荷",
              typeTable: "整型",
              rwTable: "只读",
              source: "IO属性",
              parentId: group.id,
              id: "1"
            },
            {
              name: "_mem_total",
              description: "内存总数(k)",
              typeTable: "整型",
              rwTable: "只读",
              source: "IO属性",
              parentId: group.id,
              id: "2"
            }
          ];
        } else if (group.id === "2") {
          group.text = "系统变量标签";
          group.children = [];
        };
        /* pass */
        this.isMock && group.children.forEach(pass => {
          this.passList.forEach(_pass => {
            if (pass.id === _pass.id) {
              pass.tagSelectList = [
                {
                  name: "_send_byte",
                  description: "发送字节数(BYTE)",
                  typeTable: "整型",
                  rwTable: "只读",
                  source: "IO属性",
                  passName: _pass.passName,
                  passDescribe: _pass.passDescribe,
                  parentId: pass.id,
                  id: "0"
                },
                {
                  name: "_rev_byte",
                  description: "接收字节数(BYTE)",
                  typeTable: "整型",
                  rwTable: "只读",
                  source: "IO属性",
                  passName: _pass.passName,
                  passDescribe: _pass.passDescribe,
                  parentId: pass.id,
                  id: "1"
                },
                {
                  name: "_io_status",
                  description: "通道状态",
                  typeTable: "整型",
                  rwTable: "只读",
                  source: "IO属性",
                  passName: _pass.passName,
                  passDescribe: _pass.passDescribe,
                  parentId: pass.id,
                  id: "2"
                }
              ];
              /* equipment */
              pass.children.forEach(equpiment => {
                this.equipmentList.forEach(_equipment => {
                  if (equpiment.id === _equipment.id) {
                    equpiment.tagSelectList = [
                      {
                        name: "_send_package",
                        description: "发送帧个数",
                        typeTable: "整型",
                        rwTable: "只读",
                        source: "IO属性",
                        passName: _pass.passName,
                        passDescribe: _pass.passDescribe,
                        equpimentName: _equipment.equipmentName,
                        equipmentDescribe: _equipment.equipmentDescribe,
                        parentId: equpiment.id,
                        id: "0"
                      },
                      {
                        name: "_rev_package",
                        description: "接收帧个数",
                        typeTable: "整型",
                        rwTable: "只读",
                        source: "IO属性",
                        passName: _pass.passName,
                        passDescribe: _pass.passDescribe,
                        equpimentName: _equipment.equipmentName,
                        equipmentDescribe: _equipment.equipmentDescribe,
                        parentId: equpiment.id,
                        id: "1"
                      },
                      {
                        name: "_success_rate",
                        description: "通信成功率",
                        typeTable: "浮点",
                        rwTable: "只读",
                        source: "IO属性",
                        passName: _pass.passName,
                        passDescribe: _pass.passDescribe,
                        equpimentName: _equipment.equipmentName,
                        equipmentDescribe: _equipment.equipmentDescribe,
                        parentId: equpiment.id,
                        id: "2"
                      },
                      {
                        name: "_io_status",
                        description: "设备状态",
                        typeTable: "布尔",
                        rwTable: "只读",
                        source: "IO属性",
                        passName: _pass.passName,
                        passDescribe: _pass.passDescribe,
                        equpimentName: _equipment.equipmentName,
                        equipmentDescribe: _equipment.equipmentDescribe,
                        parentId: equpiment.id,
                        id: "3"
                      }
                    ];
                    _equipment.dataTags.forEach(tag => {
                      equpiment.tagSelectList.push({
                        name: tag.name,
                        description: tag.description,
                        typeTable: tag.typeTable,
                        rwTable: tag.rwTable,
                        source: "IO采集",
                        passName: _pass.passName,
                        passDescribe: _pass.passDescribe,
                        equpimentName: _equipment.equipmentName,
                        equipmentDescribe: _equipment.equipmentDescribe,
                        parentId: equpiment.id,
                        id: tag.id
                      });
                    });
                  }
                });
              });
            }
          });
        });
      });
      // console.log(this.tagTreeData);
    },
    // 点击树节点：更新表格
    async itemClick (param) {
      if (this.isMock) { // mock数据
        this.tableData = param.tagSelectList;
      } else { // 接口数据
        this.tableLoading = true;
        let dataTags = // 标签列表
          param.level === 2
            ? (await queryTagList({ pipelineId: param.idStr })).data.data
            : param.level === 3
              ? (await queryTagList({ deviceId: param.idStr })).data.data : [];
        this.tableData = dataTags.map((tag, i) => {
          this.$set(tag, "index", i + 1); // 序号
          this.$set(tag, "typeTable", // 数据类型
            getValueByKey(this.dataTypeList, "value", tag.type, "label"));
          this.$set(tag, "rwTable", // 读写方向
            getValueByKey(this.directionList, "value", tag.rw, "label"));
          this.$set(tag, "source", "IO属性"); // IO属性
          return tag;
        });
        this.tableLoading = false;
      }
    },
    // 树节点展开/收起 - 仅接口
    itemToggle (param) {
      if (!this.isMock && param.opened) {
        if (param.level === 1) { // 展开通道
        } else { // 展开设备
          // console.log(param);
          this.getEquipmentData(param.idStr);
        }
      }
    },
    // 获取设备数据 - 仅接口
    async getEquipmentData (passId, select = false) {
      // console.log(this.passId);
      this.tagTreeData.forEach(service => { // 服务
        service.children.forEach(async pass => { // 通道
          if (pass.idStr === passId) {
            this.treeLoading = true;
            pass.opened = true;
            const equipmentList = (await queryEqupementList({ // 展开的设备数据
              page: 1,
              pipelineId: passId,
              size: 1000
            })).data.data.map(equipment => {
              this.$set(equipment, "text", `D${equipment.name}[${equipment.description}]`);
              this.$set(equipment, "description", equipment.description);
              this.$set(equipment, "icon", "fa fa-edit");
              this.$set(equipment, "id", equipment.idStr);
              this.$set(equipment, "level", 3);
              this.$set(equipment, "selected", false);
              return equipment;
            });
            // console.log(equipmentList);
            pass.children = equipmentList; // 加载真实数据
            this.treeLoading = false;
            // select && this.getSelectedItem(); // 自动选中设备
          }
        });
      });
    },
    // 点击表格：传递给父组件
    tagClick (val) {
      this.$emit("tag-click", val);
    },
    // 封装方法 - dialog显示时：1.选中左侧树 2.渲染右侧表格 3.选中表格行
    visibleSelect (item) {
      item.selected = false; // 全部取消选中
      if (item.id === this.formData.IOTagParentId) { // 若id相同
        item.selected = true; // 左侧选中
        this.tableData = item.tagSelectList; // 渲染table
        this.$nextTick(() => { // 选中table行
          this.tableData.forEach((row, i) => {
            row.id === this.formData.IOTagSelectId && this.$refs.tagListTable.setCurrentRow(this.tableData[i]);
          });
        });
      }
    }
  },
  watch: {
    dialogVisible (val) {
      // console.log(this.formData);
      val === true && this.tagTreeData.forEach(group => {
        if (this.isMock) { // mock数据
          this.visibleSelect(group);
          group.children.forEach(pass => {
            this.visibleSelect(pass);
            pass.children.forEach(equipment => {
              this.visibleSelect(equipment);
            });
          });
        } else { // 接口数据

        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
