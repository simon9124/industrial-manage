<template>
  <el-dialog class="cmd-dialog"
             title="常用工具"
             :visible.sync="dialogVisibleCmd"
             top="10vh"
             @close="closeCmd">

    输入命令：
    <el-input v-model="command"
              @keyup.enter.native="optionCmd"
              :disabled="contentLoading"
              style="width:300px">
    </el-input>
    <el-button type="warning"
               size="medium"
               @click="resContent=''"
               :disabled="contentLoading"
               style="float:right">清空</el-button>
    <el-button type="success"
               size="medium"
               @click="optionCmd"
               :disabled="contentLoading"
               style="float:right;margin-right:10px">执行</el-button>

    <p v-html="resContent"
       v-loading="contentLoading"
       element-loading-text="连接中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       style="margin:20px 0 10px 0;white-space:pre-wrap;background:#000;color:#fff;padding:10px;max-height:400px;min-height:300px;overflow:auto"></p>

  </el-dialog>
</template>

<script>
import axios from "axios";

export default {
  data () {
    return {
      dialogVisibleCmd: false, // dialog是否可见
      command: "", // cmd命令
      resContent: "", // cmd结果
      contentLoading: false
    };
  },
  methods: {
    // 打开dialog
    openCmd () {
      this.dialogVisibleCmd = true;
    },
    // 执行ssh
    async optionCmd () {
      this.resContent = "";
      this.contentLoading = true;
      setTimeout(() => {
        axios.get("http://localhost:3000/koa/action/OwnRestartServer").then(res => {
          // console.log(res);
          this.resContent = res.data.data;
          this.contentLoading = false;
        });
      }, 1000);
    },
    // 关闭dialog
    closeCmd () {
      this.resContent = "";
      this.contentLoading = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
