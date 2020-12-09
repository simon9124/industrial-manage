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
                   @item-click="pluginClick">
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
            <el-table-column prop="name"
                             label="插件名称"
                             width="200">
            </el-table-column>
            <el-table-column prop="platform"
                             label="平台"
                             width="120">
            </el-table-column>
            <el-table-column prop="edition"
                             label="版本"
                             width="120">
            </el-table-column>
            <el-table-column prop="lastModifiedDate"
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
      this.dialogTitle = `插件选择-${this.id.slice(0, 1) === "1" ? "采集" : "数据服务"}`;
    },
    // 回调 - 点击树节点
    pluginClick (param) {
      this.$emit("plugin-click", param);
    }
  },
  watch: {
    dialogVisible (val) {
      val === true && this.pluginList.forEach(classification => {
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
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
