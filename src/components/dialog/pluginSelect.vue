<template>
  <el-dialog class="plugin-dialog"
             v-if="dialogVisible"
             :title="dialogTitle"
             :visible.sync="dialogVisible">

    <el-container>

      <!--左 · 树-->
      <el-aside class="left-panel">
        <left-tree class="left-panel-tree"
                   :data="pluginList"
                   :contextmenu="false"
                   :collapse="false"
                   @item-click="pluginClick"
                   @item-toggle="pluginToggle">
        </left-tree>
      </el-aside>

      <!--右 · 表-->
      <el-container class="right-panel is-vertical">
        <el-form label-position="left">

          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label-width="55px"
                            label="名称：">
                <el-input disabled
                          v-model="formPass.plugin.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label-width="55px"
                            label="描述：">
                <el-input disabled
                          v-model="formPass.plugin.describe"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label-width="55px"
                            label="分类：">
                <el-input disabled
                          v-model="formPass.plugin.classification"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label-width="55px"
                            label="厂家：">
                <el-input disabled
                          v-model="formPass.plugin.factory"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-table :data="formPass.plugin.plugins"
                    tooltip-effect="dark">
            <el-table-column type="index"
                             label="序号"
                             width="55">
            </el-table-column>
            <el-table-column :prop="this.isMock?'name':'plushName'"
                             label="插件名称"
                             width="200">
            </el-table-column>
            <el-table-column :prop="this.isMock?'platform':'systemName'"
                             label="平台"
                             width="120">
            </el-table-column>
            <el-table-column :prop="this.isMock?'edition':'version'"
                             label="版本"
                             width="120">
            </el-table-column>
            <el-table-column :prop="this.isMock?'lastModifiedDate':'updateTime'"
                             label="最后修改日期"
                             width="160">
            </el-table-column>
          </el-table>

        </el-form>
      </el-container>

    </el-container>

    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogVisible = false;formPass.plugin = pluginOrg;">取 消</el-button>
      <el-button type="primary"
                 @click="pluginSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
/* components */
import LeftTree from "@/components/Tree"; // 组件：左侧树
/* api */
import { queryPlushList } from "@/api/plugin.js"; // 获取插件列表

export default {
  components: { LeftTree },
  props: {
    // 0/1 采集服务/数据服务
    serviceType: {
      type: Number,
      default: 0
    },
    // 当前通道数据
    formPass: {
      type: Object,
      default: () => { }
    },
    // 插件列表
    pluginList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogVisible: false, // 是否可见
      dialogTitle: "" // 弹框名称
    };
  },
  methods: {
    // 选择插件
    pluginSelect () {
      this.dialogVisible = true;
      this.pluginOrg = JSON.parse(JSON.stringify(this.formPass.plugin)); // 深拷贝，取消时还原数据用
      this.dialogTitle = `插件选择-${this.serviceType === 0 ? "采集" : "数据服务"}`;
    },
    // 回调 - 点击树节点
    pluginClick (param) {
      this.$emit("plugin-click", param);
    },
    // 树节点展开/收起 - 仅接口
    pluginToggle (param) {
      if (!this.isMock && param.opened) {
        this.getPlushList(param.name);
      }
    },
    // 确认插件
    pluginSubmit () {
      !this.isMock && this.$emit("plugin-submit", "");
      this.dialogVisible = false;
    },
    // 获取插件列表，并添加到插件类型 - 仅接口
    async getPlushList (name) {
      this.pluginList.forEach(async plugin => { // 放到插件类型列表
        if (plugin.name === name) {
          const plushList = (await queryPlushList({
            plushTypeName: name,
            serviceType: this.serviceType
          })).data.data.map(plush => { // 展开的插件数据
            this.$set(plush, "text", plush.description);
            this.$set(plush, "icon", "fa fa-cog");
            this.$set(plush, "selected", localStorage.getItem("plugin-id") === plush.id.toString());
            this.$set(plush, "level", 2);
            return plush;
          });
          plugin.children = plushList; // 加载真实数据
          // select && this.getSelectedFactory(projectId); // 选中新增/修改的工程
        }
      });
    }
  },
  watch: {
    dialogVisible (val) {
      val === true && this.pluginList.forEach(classification => {
        if (this.isMock) { // mock数据
          /* 1.控制展开 */
          classification.opened = false; // 全部展开关闭
          this.formPass.plugin.classification === classification.text &&
            (classification.opened = true); // 展开与当前通道关联的
          /* 2.控制选中 */
          classification.children.forEach(plugin => {
            plugin.selected = false; // 全部取消选中
            this.formPass.plugin.name === plugin.name &&
              (plugin.selected = true); // 选中与当前通道关联
          });
        } else { // 接口数据
          classification.children.forEach(plugin => {
            // console.log(plugin.id.toString());
            if (plugin.id.toString() === localStorage.getItem("plugin-id")) { // 选中当前插件
              this.$nextTick(() => {
                this.formPass.plugin = {
                  name: plugin.name,
                  describe: plugin.description,
                  classification: plugin.typeName,
                  factory: plugin.manufacturers,
                  plugins: plugin.submodule,
                  id: plugin.id,
                  otherParams: plugin.collectionPipeOtherParam
                    ? plugin.collectionPipeOtherParam : plugin.dataPipeOtherParams,
                  outerParams: plugin.collectionPipeOuterParam
                    ? plugin.collectionPipeOuterParam : plugin.dataPipeOuterParams,
                  collectChannelList: plugin.collectChannelList
                    ? plugin.collectChannelList : plugin.dataChannelList,
                  collectChannelDefaultParam: plugin.collectChannelDefaultParam
                    ? plugin.collectChannelDefaultParam : plugin.dataChannelDefaultParams
                };
              });
            } else {
              this.$nextTick(() => {
                this.formPass.plugin = {};
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
