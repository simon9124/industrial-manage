<template>
  <el-dialog class="params-dialog"
             :title="dialogTitle"
             :visible.sync="dialogVisible">

    <el-row class="params-dialog-row">
      <el-checkbox v-model="formPass.otherParams.scanDelay">启用扫描间延迟</el-checkbox>
      <div class="params-dialog-row-div">
        延迟时间（毫秒）
        <el-input v-model="formPass.otherParams.delayTime"
                  style="width:100px"
                  :disabled="!formPass.otherParams.scanDelay"></el-input>
        <el-popover placement="top-start"
                    title="提示"
                    width="200"
                    trigger="hover"
                    content="该参数使用一些比较慢的设备，帧与帧之间需要有一定的间隔，否则设备不能正常工作"
                    style="margin-left:5px">
          <el-button slot="reference"
                     type="primary"
                     plain>?</el-button>
        </el-popover>
      </div>
    </el-row>

    <el-row v-if="id&&id.slice(0,1)==='1'"
            class="params-dialog-row">
      <el-checkbox v-model="formPass.otherParams.linkReset">启用链路复位机制</el-checkbox>
      <div class="params-dialog-row-div">
        端口无接收数据时间（秒）
        <el-input v-model="formPass.otherParams.linkNoDataTime"
                  style="width:100px"
                  :disabled="!formPass.otherParams.linkReset"></el-input>
        &nbsp;超过该时间，端口将重新关闭、打开（>=60）
      </div>
    </el-row>

    <el-row class="params-dialog-row">
      <el-checkbox v-model="formPass.otherParams.faultDiagnosis"
                   style="margin-bottom:10px">启用故障诊断</el-checkbox>
      <div class="params-dialog-row-div">
        端口无接收数据时间（秒）
        <el-input v-model="formPass.otherParams.faultNoDataTime"
                  style="width:100px"
                  :disabled="!formPass.otherParams.faultDiagnosis"></el-input>
        &nbsp;超过该时间，{{id&&id.slice(0,1)==='1'?'端口为':'进入'}}故障状态（设定值>={{id&&id.slice(0,1)==='1'?'5秒':'120秒'}}）
        <div v-if="id&&id.slice(0,1)==='2'"
             style="margin:10px 0">
          故障处理模式：
          <el-radio v-model="formPass.otherParams.faultShooting"
                    label="1"
                    :disabled="!formPass.otherParams.faultDiagnosis">端口将重新关闭、打开</el-radio>
          <el-radio v-model="formPass.otherParams.faultShooting"
                    label="2"
                    :disabled="!formPass.otherParams.faultDiagnosis">重启系统</el-radio>
        </div>
      </div>
    </el-row>

    <el-row v-if="id&&id.slice(0,1)==='1'"
            class="params-dialog-row">
      设备间数据包扫描方：
      <div class="params-dialog-row-div"
           style="margin-top:10px">
        <el-radio v-model="formPass.otherParams.packetScanning"
                  label="1"
                  disabled>扫面完一个包后，立刻进入下一个设备</el-radio>
        <el-radio v-model="formPass.otherParams.packetScanning"
                  label="2"
                  disabled>设备所有包扫描完后，再进入下一个设备</el-radio>
      </div>
    </el-row>

    <el-row v-if="id&&id.slice(0,1)==='1'"
            class="params-dialog-row">
      <el-checkbox v-model="formPass.otherParams.alternatePass">启用备用通道</el-checkbox>
    </el-row>

    <div v-if="id&&id.slice(0,1)==='1'&&formPass.otherParams.alternatePass">
      <el-row class="params-dialog-row">
        <el-col>
          通道类型：
          <el-select v-model="formPass.otherParams.passType"
                     placeholder="请选择">
            <el-option v-for="item in passTypeList"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row class="params-dialog-row"
              v-if="formPass.otherParams.passType==='串口'"
              :gutter="20">
        <el-col :span="8"
                class="params-dialog-row-select">
          串口：
          <el-select v-model="formPass.otherParams.sata"
                     placeholder="请选择">
            <el-option v-for="item in sataList"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8"
                class="params-dialog-row-select">
          波特率：
          <el-select v-model="formPass.otherParams.baudRate"
                     placeholder="请选择">
            <el-option v-for="item in baudList"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8"
                class="params-dialog-row-select">
          数据位：
          <el-select v-model="formPass.otherParams.dataBits"
                     placeholder="请选择">
            <el-option v-for="item in dataList"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          校验位：
          <el-select v-model="formPass.otherParams.checkBits"
                     placeholder="请选择">
            <el-option v-for="item in checkList"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          停止位：
          <el-select v-model="formPass.otherParams.stopBits"
                     placeholder="请选择">
            <el-option v-for="item in stopList"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </el-col>

      </el-row>

      <el-row class="params-dialog-row"
              v-if="formPass.otherParams.passType!=='串口' && formPass.otherParams.passType!=='虚拟端口'"
              :gutter="20">
        <el-col>
          {{formPass.otherParams.passType==='TCP客户端'?'远程IP：':'本地IP：'}}
          <el-input v-model="formPass.otherParams.ip"
                    style="width:150px;margin-right:10px"></el-input>
          {{formPass.otherParams.passType==='TCP客户端'?'远程端口：':'本地端口：'}}
          <el-input v-model="formPass.otherParams.port"
                    style="width:100px;margin-right:10px"></el-input>
        </el-col>
      </el-row>
    </div>

    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogVisible = false;formPass.otherParams = paramsOrg">取 消</el-button>
      <el-button @click="dialogVisible = false"
                 type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    // 服务导航中被选择的id
    id: {
      type: String
    },
    // 当前通道数据
    formPass: {
      type: Object
    },
    // 通道类型
    passTypeList: {
      type: Array
    },
    // 串口
    sataList: {
      type: Array
    },
    // 波特率
    baudList: {
      type: Array
    },
    // 数据位
    dataList: {
      type: Array
    },
    // 校验位
    checkList: {
      type: Array
    },
    // 停止位
    stopList: {
      type: Array
    }
  },
  data () {
    return {
      dialogVisible: false, // 是否可见
      dialogTitle: "" // 弹框名称
    };
  },
  methods: {
    // 其他参数
    setParams () {
      this.dialogVisible = true;
      this.paramsOrg = JSON.parse(JSON.stringify(this.formPass.otherParams)); // 深拷贝，取消时还原数据用
      this.dialogTitle = `${this.id.slice(0, 1) === "1" ? "采集" : "数据服务"}通道 其他参数`;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
