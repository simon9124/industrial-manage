<template>
  <div>

    <!-- ip列表框 -->
    <el-dialog class="bind-dialog"
               title="数据服务通道 IP列表"
               :visible.sync="dialogVisible">
      <el-row>
        <el-button size="mini"
                   type="primary"
                   @click="insert">增加</el-button>
        <el-button size="mini"
                   :disabled="!buttonAbled"
                   type="warning"
                   @click="edit">修改</el-button>
        <el-button size="mini"
                   :disabled="!buttonAbled"
                   type="danger"
                   @click="deleteIp">删除</el-button>
        <div style="margin-top:20px">IP客户端地址列表：{{this.ipList.length===0?'暂无':''}}</div>
        <div style="margin:5px 10px"
             v-for="(item,i) in ipList"
             :key="i">
          <el-checkbox v-model="item.checked"
                       @change="checkChange(i)">{{item.ip}}</el-checkbox>
        </div>
      </el-row>
      <el-row style="margin-top:20px">
        注：如果IP列表为空的话，允许接受仅一个任意IP地址的客户端
      </el-row>

      <div slot="footer"
           class="dialog-footer">
        <!-- formPass.localIp = bindingIpOrg -->
        <el-button @click="dialogVisible = false;">取 消</el-button>
        <el-button @click="ipListSubmit"
                   type="primary">确 定</el-button>
      </div>

    </el-dialog>

    <!-- IP地址框 -->
    <el-dialog class="bind-dialog"
               title="IP地址框"
               :visible.sync="inputVisible">
      IP地址：<el-input style="width:350px"
                v-model="inputIp"></el-input>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="inputVisible = false;">取 消</el-button>
        <el-button @click="ipSubmit"
                   type="primary">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import { validateIP } from "@/libs/validate.js";

export default {
  props: {
    // ip列表
    ipListOrg: {
      type: Array
    }
  },
  data () {
    return {
      /* ip列表框 */
      dialogVisible: false, // 是否显示 - dialog
      ipList: [], // 已绑定的ip地址列表
      index: 0, // 要修改/删除的key
      buttonAbled: false, // 是否可修改或删除
      /* ip地址框 */
      inputVisible: false, // 是否显示 - 输入框
      type: null, // insert or edit
      inputIp: "", // ip地址框数据
      inputIpOrg: "" // 原始数据
    };
  },
  methods: {
    // 允许客户端接入列表
    bindingIPList () {
      this.dialogVisible = true;
      const ipList = JSON.parse(JSON.stringify(this.ipListOrg)) || []; // 深拷贝
      this.ipList = [];
      ipList.forEach(ip => {
        this.ipList.push({ checked: false, ip: ip });
      });
    },
    // 提交IP列表
    ipListSubmit () {
      this.$emit("ip-list-submit", this.ipList);
      this.dialogVisible = false;
    },
    // 新增
    insert () {
      this.inputVisible = true;
      this.type = "insert";
      this.inputIp = "";
    },
    // 选择发生改变 - 取消选中其他选框
    checkChange (i) {
      this.ipList.forEach((item, _i) => {
        i !== _i && this.$set(item, "checked", false);
      });
      this.buttonAbled = true;
    },
    // 修改
    edit () {
      this.inputVisible = true;
      this.type = "edit";
      this.ipList.forEach((item, i) => {
        if (item.checked) {
          this.inputIp = item.ip;
          this.index = i;
          this.inputIpOrg = JSON.parse(JSON.stringify(this.inputIp));
        }
      });
    },
    // 提交IP
    ipSubmit () {
      if (!validateIP(this.inputIp)) { // ip地址格式验证
        this.$message.error("ip地址格式错误");
        return false;
      }
      switch (this.type) {
        case "insert":
          if (this.ipList.some(item => item.ip === this.inputIp)) { // 判断重复
            this.$message.error("ip地址已存在");
            return false;
          }
          this.ipList.push({ checked: false, ip: this.inputIp });
          this.inputVisible = false;
          break;
        case "edit":
          if ( // 判断重复
            this.ipList.some(item => item.ip === this.inputIp) &&
            this.inputIp !== this.inputIpOrg
          ) {
            this.$message.error("ip地址已存在");
            return false;
          }
          this.ipList.forEach((item, i) => {
            i === this.index && this.$set(this.ipList, i, { checked: false, ip: this.inputIp });
          });
          this.buttonAbled = false;
          this.inputVisible = false;
          break;
      }
    },
    // 删除
    deleteIp () {
      this.ipList.forEach((item, i) => {
        i === this.index && this.ipList.splice(i, 1);
      });
      this.buttonAbled = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
