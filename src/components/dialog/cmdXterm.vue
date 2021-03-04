<template>
  <el-dialog class="cmd-dialog"
             title="常用工具"
             :visible.sync="dialogVisibleCmd"
             top="10vh"
             @close="closeCmd">

    <el-input v-loading="loading"
              type="text"
              id="in"
              class="input_text"
              v-model="command"
              resize="none"
              @keyup.enter.native="enter()"
              autofocus="autofocus">
      <span slot="prepend"
            style="font-size:18px">></span>
    </el-input>

    <div id="xterm"
         class="xterm"
         ref="xterm">
    </div>

  </el-dialog>
</template>

<script>
import Vue from "vue/dist/vue.esm.js";
import axios from "axios";
/* xterm */
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

export default {
  data () {
    return {
      dialogVisibleCmd: false,
      command: "",
      loading: false,
      res: "",
      term: null
    };
  },
  methods: {
    // 打开dialog
    openCmd () {
      this.dialogVisibleCmd = true;
      this.$nextTick(() => {
        this.initTerm();
      });
    },
    // xterm初始化
    initTerm () {
      const term = new Terminal({
        fontSize: 14,
        cursorBlink: true
      });
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(document.getElementById("xterm"));
      fitAddon.fit();
      this.term = term;
    },
    // 执行ssh
    async enter () {
      this.xtermDomRefresh();
      this.initTerm();
      setTimeout(() => {
        axios.get("http://localhost:3000/koa/action/OwnRestartServer").then(res => {
          console.log(res);
          this.res = res.data.data;
          this.term.writeln(this.res);
        });
      }, 1000);
    },
    // 重置xterm
    xtermDomRefresh () {
      console.log(this.$refs.xterm);
      var Profile = Vue.extend({
        template: "<div id='xterm'></div>"
      });
      new Profile().$mount("#xterm");
    },
    // 关闭dialog
    closeCmd () {
      this.xtermDomRefresh();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
