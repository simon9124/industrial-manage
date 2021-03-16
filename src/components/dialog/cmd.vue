<template>
  <el-dialog class="cmd-dialog"
             title="常用工具"
             :visible.sync="dialogVisibleCmd"
             :fullscreen="fullScreen"
             top="10vh"
             @close="closeCmd">

    输入命令
    <el-tooltip class="item"
                effect="dark"
                content="支持命令：ls / cd"
                placement="top">
      <i class="el-icon-question"></i>
    </el-tooltip>
    ：
    <el-input v-model="command"
              @keyup.enter.native="optionCmd"
              :disabled="contentLoading"
              style="width:270px">
    </el-input>
    <el-button type="warning"
               size="medium"
               @click="resContent='';command=''"
               :disabled="contentLoading"
               style="float:right">清空</el-button>
    <el-button type="success"
               size="medium"
               @click="optionCmd"
               :disabled="contentLoading"
               style="float:right;margin-right:10px">执行</el-button>
    <el-tooltip class="item"
                effect="dark"
                content="全屏"
                placement="top">
      <Icon type="md-expand"
            style="float:right;font-size:20px;line-height:36px"
            @click="switchFullscreen" />
    </el-tooltip>

    <p v-html="resContent"
       id="sshContent"
       v-loading="contentLoading"
       element-loading-text="连接中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       :style="{margin:'20px 0 10px 0',whiteSpace:'pre-wrap',background:'#000',color:'#fff',padding:'10px',height:pHeight,overflow:'auto'}"></p>

  </el-dialog>
</template>

<script>
import { } from "@/api/cmd";

export default {
  data () {
    return {
      /* dialog */
      dialogVisibleCmd: false, // 是否可见
      fullScreen: false, // 是否全屏
      pHeight: "400px", // 内容高度
      /* shell */
      command: "", // cmd命令
      resContent: "", // cmd结果
      contentLoading: false,
      socketServe: "ws://192.168.68.100:9004/socketserver/123",
      supportCmd: ["ls", "cd"],
      websock: null
    };
  },
  methods: {
    // 打开dialog
    openCmd () {
      this.dialogVisibleCmd = true;
      this.initWebSocket();
    },
    // 切换全屏/非全屏
    switchFullscreen () {
      this.fullScreen = !this.fullScreen;
      if (this.fullScreen) {
        this.pHeight = "calc(100vh - 160px)";
        this.contentScroll();
      } else {
        this.pHeight = "400px";
        this.contentScroll();
      }
    },
    // 内容自动滚动到最末
    contentScroll () {
      this.$nextTick(() => {
        let ele = document.getElementById("sshContent");
        ele.scrollTop = ele.scrollHeight;
      });
    },
    // websocket - 初始化
    initWebSocket () {
      this.websock = new WebSocket(this.socketServe);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    // websocket - 连接成功
    websocketonopen () {
      console.log("websocket连接成功");
    },
    // websocket - 连接失败
    websocketonerror () {
      console.log("websocket连接失败");
      this.initWebSocket(); // 重连
    },
    // webSocket - 数据发送
    websocketsend (data) {
      console.log("发送websocket数据:", data);
      this.websock.send(data);
    },
    // websocket - 数据接收
    websocketonmessage (data) {
      console.log("收到websocket数据:", data);
      // this.resContent += `out: ${data.data}<br><br>`;
      this.resContent += `${data.data}<br>`;
      this.contentScroll();
    },
    // webSocket - 断开
    websocketclose () {
      console.log("websocket断开连接");
    },
    // 执行ssh
    async optionCmd () {
      // const cmdBegin = this.command.split(" ")[0];
      // if (this.supportCmd.indexOf(cmdBegin) === -1) {
      //   this.$message.error("不支持的命令！");
      //   return false;
      // } else {
      // this.resContent = "";
      // this.contentLoading = true;
      if (this.command.split(" ")[0] === "") {
        this.resContent += "<br>";
        this.contentScroll();
        this.command = "";
      } else {
        this.resContent += `<br>in$ ${this.command}<br><br>`;
        this.websocketsend(this.command);
        this.command = "";
      }
      // this.contentLoading = false;
      // }
    },
    // 关闭dialog
    closeCmd () {
      this.command = "";
      this.resContent = "";
      // this.contentLoading = false;
      this.websock.close();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
// 滚动条
#sshContent::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}

#sshContent::-webkit-scrollbar-thumb {
  background-color: rgba(102, 102, 102, 0.7); // rgba(64, 158, 255, 0.5);
  // outline: 1px solid slategrey;
  border-radius: 5px;
}

#sshContent::-webkit-scrollbar {
  width: 8px;
}
</style>
