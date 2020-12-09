<template>
  <el-dialog class="tag-select-dialog"
             v-if="dialogVisible"
             title="标签变量字典"
             :visible.sync="dialogVisible">

    <el-container>

      <!--左 · 树-->
      <el-aside class="left-panel">
        <left-tree class="left-panel-tree"
                   :data="tagTreeData"
                   :contextmenu="false"
                   :collapse="false"
                   @item-click="itemClick">
        </left-tree>
      </el-aside>

      <!--右 · 表-->
      <el-container class="right-panel is-vertical">
        <el-form label-position="left">

          <el-form-item label-width="55px"
                        label="名称：">
            <el-input v-model="formData.IOTag"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label-width="55px"
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
            <el-table-column prop="describe"
                             label="描述"
                             width="140">
            </el-table-column>
            <el-table-column prop="dataType"
                             label="类型"
                             width="70">
            </el-table-column>
            <el-table-column prop="direction"
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
      <el-button @click="dialogVisible = false;
                         formData.IOTag = IOTagOrg;
                         formData.IOTagParentId = IOTagParentIdOrg;
                         formData.IOTagSelectId = IOTagSelectIdOrg">取 消</el-button>
      <el-button type="primary"
                 @click="dialogVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import LeftTree from "@/components/Tree"; // 组件：左侧树

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
    // 描述
    tagDescribe: {
      type: String
    }
  },
  data () {
    return {
      dialogVisible: false, // 是否可见
      tableData: [] // 表格内容
    };
  },
  methods: {
    // 选择标签
    tagSelect () {
      this.dialogVisible = true;
      // console.log(this.formData);
      this.getTagTreeData();
      /* 深拷贝，取消时还原数据用 */
      this.IOTagOrg = JSON.parse(JSON.stringify(this.formData.IOTag));
      this.IOTagParentIdOrg =
        this.formData.IOTagParentId ? JSON.parse(JSON.stringify(this.formData.IOTagParentId)) : "";
      this.IOTagSelectIdOrg =
        this.formData.IOTagSelectId ? JSON.parse(JSON.stringify(this.formData.IOTagSelectId)) : "";
    },
    // 处理原树数据，刷新左侧树和其对应内容
    getTagTreeData () {
      this.tagTreeData = JSON.parse(JSON.stringify(this.treeData));
      /* group */
      this.tagTreeData.forEach(group => {
        if (group.id === "1") {
          group.text = "IO标签";
          group.tagSelectList = [
            {
              name: "_kernal_version",
              describe: "应用程序内核版本",
              dataType: "整型",
              direction: "读写",
              source: "IO属性",
              parentId: group.id,
              id: "0"
            },
            {
              name: "_cpu",
              describe: "CPU负荷",
              dataType: "整型",
              direction: "只读",
              source: "IO属性",
              parentId: group.id,
              id: "1"
            },
            {
              name: "_mem_total",
              describe: "内存总数(k)",
              dataType: "整型",
              direction: "只读",
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
        group.children.forEach(pass => {
          this.passList.forEach(_pass => {
            if (pass.id === _pass.id) {
              pass.tagSelectList = [
                {
                  name: "_send_byte",
                  describe: "发送字节数(BYTE)",
                  dataType: "整型",
                  direction: "只读",
                  source: "IO属性",
                  passName: _pass.passName,
                  passDescribe: _pass.passDescribe,
                  parentId: pass.id,
                  id: "0"
                },
                {
                  name: "_rev_byte",
                  describe: "接收字节数(BYTE)",
                  dataType: "整型",
                  direction: "只读",
                  source: "IO属性",
                  passName: _pass.passName,
                  passDescribe: _pass.passDescribe,
                  parentId: pass.id,
                  id: "1"
                },
                {
                  name: "_io_status",
                  describe: "通道状态",
                  dataType: "整型",
                  direction: "只读",
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
                        describe: "发送帧个数",
                        dataType: "整型",
                        direction: "只读",
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
                        describe: "接收帧个数",
                        dataType: "整型",
                        direction: "只读",
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
                        describe: "通信成功率",
                        dataType: "浮点",
                        direction: "只读",
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
                        describe: "设备状态",
                        dataType: "布尔",
                        direction: "只读",
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
                        describe: tag.describe,
                        dataType: tag.dataType,
                        direction: tag.direction,
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
    itemClick (param) {
      this.tableData = param.tagSelectList;
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
        this.visibleSelect(group);
        group.children.forEach(pass => {
          this.visibleSelect(pass);
          pass.children.forEach(equipment => {
            this.visibleSelect(equipment);
          });
        });
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
