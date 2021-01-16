<template>
  <el-dialog class="params-dialog"
             :title="dialogTitle"
             :visible.sync="dialogVisible">

    <el-row class="params-dialog-row">
      <el-checkbox v-model="formPass.passParams.delayIs">启用扫描间延迟</el-checkbox>
      <div class="params-dialog-row-div">
        延迟时间（毫秒）
        <el-input v-model="formPass.passParams.delay"
                  style="width:100px"
                  :disabled="!formPass.passParams.delayIs"></el-input>
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

    <el-row v-if="serviceType===0"
            class="params-dialog-row">
      <el-checkbox v-model="formPass.passParams.resetIs">启用链路复位机制</el-checkbox>
      <div class="params-dialog-row-div">
        端口无接收数据时间（秒）
        <el-input v-model="formPass.passParams.reset"
                  style="width:100px"
                  :disabled="!formPass.passParams.resetIs"></el-input>
        &nbsp;超过该时间，端口将重新关闭、打开（>=60）
      </div>
    </el-row>

    <el-row class="params-dialog-row">
      <el-checkbox v-model="formPass.passParams.alertIs"
                   style="margin-bottom:10px">启用故障诊断</el-checkbox>
      <div class="params-dialog-row-div">
        端口无接收数据时间（秒）
        <el-input v-model="formPass.passParams.alert"
                  style="width:100px"
                  :disabled="!formPass.passParams.alertIs"></el-input>
        &nbsp;超过该时间，{{serviceType===0?'端口为':'进入'}}故障状态（设定值>={{serviceType===0?'5秒':'120秒'}}）
        <!-- <div v-if="serviceType===1"
             style="margin:10px 0">
          故障处理模式：
          <el-radio v-model="formPass.passParams.faultShooting"
                    label="1"
                    :disabled="!formPass.passParams.alertIs">端口将重新关闭、打开</el-radio>
          <el-radio v-model="formPass.passParams.faultShooting"
                    label="2"
                    :disabled="!formPass.passParams.alertIs">重启系统</el-radio>
        </div> -->
      </div>
    </el-row>

    <!-- <el-row v-if="serviceType===0"
            class="params-dialog-row">
      设备间数据包扫描方：
      <div class="params-dialog-row-div"
           style="margin-top:10px">
        <el-radio v-model="formPass.passParams.packetScanning"
                  label="1"
                  disabled>扫面完一个包后，立刻进入下一个设备</el-radio>
        <el-radio v-model="formPass.passParams.packetScanning"
                  label="2"
                  disabled>设备所有包扫描完后，再进入下一个设备</el-radio>
      </div>
    </el-row> -->

    <el-row v-if="serviceType===0"
            class="params-dialog-row">
      <el-checkbox v-model="formPass.passParams.bakChannelIs">启用备用通道</el-checkbox>
    </el-row>

    <div v-if="serviceType===0&&formPass.passParams.bakChannelIs">

      <!-- 通道类型 -->
      <el-row class="params-dialog-row">
        <el-col>
          通道类型：
          <el-select v-model="formPass.passParams.bakChannelId"
                     placeholder="请选择">
            <el-option v-for="item in passTypeList"
                       :key="item.id"
                       :label="item.value"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <!-- 串口 -->
      <el-row v-if="formPass.passParams.bakChannelId===0"
              class="params-dialog-row"
              :gutter="20">
        <el-col :span="8"
                class="params-dialog-row-select">
          串口：
          <el-select v-model="formPass.passParams.bakSerial"
                     placeholder="请选择">
            <el-option v-for="item in collectChannelList[0]['serialList']"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8"
                class="params-dialog-row-select">
          波特率：
          <el-select v-model="formPass.passParams.bakBps"
                     placeholder="请选择">
            <el-option v-for="item in collectChannelList[0]['baudRateList']"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8"
                class="params-dialog-row-select">
          数据位：
          <el-select v-model="formPass.passParams.bakDataBit"
                     placeholder="请选择">
            <el-option v-for="item in collectChannelList[0]['dataBitsList']"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          校验位：
          <el-select v-model="formPass.passParams.bakCheckBit"
                     placeholder="请选择">
            <el-option v-for="item in collectChannelList[0]['checkBitList']"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          停止位：
          <el-select v-model="formPass.passParams.bakStopBit"
                     placeholder="请选择">
            <el-option v-for="item in collectChannelList[0]['stopBitList']"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <!-- TCP客户端 -->
      <el-row v-if="formPass.passParams.bakChannelId===1"
              class="params-dialog-row"
              :gutter="20">
        <el-col>
          远程IP：<el-input v-model="formPass.passParams.bakIp"
                    style="width:150px;margin-right:10px"></el-input>
          远程端口：<el-input v-model="formPass.passParams.bakPort"
                    style="width:100px;margin-right:10px"></el-input>
        </el-col>
      </el-row>

      <!-- TCP服务端 & UDP -->
      <el-row v-if="formPass.passParams.bakChannelId===2 || formPass.passParams.bakChannelId===3"
              class="params-dialog-row"
              :gutter="20">
        <el-col>
          本地IP：<el-input v-model="formPass.passParams.bakIp"
                    style="width:150px;margin-right:10px"></el-input>
          本地端口：<el-input v-model="formPass.passParams.bakPort"
                    style="width:100px;margin-right:10px"></el-input>
        </el-col>
      </el-row>

    </div>

    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogVisible = false;formPass.passParams = paramsOrg">取 消</el-button>
      <el-button @click="dialogVisible = false"
                 type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    // 0/1 采集服务/数据服务
    serviceType: {
      type: Number,
      default: 0
    },
    // 当前通道数据
    formPass: {
      type: Object
    },
    // 串口总数据
    collectChannelList: {
      type: Array
    },
    // 通道类型
    passTypeList: {
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
      this.paramsOrg = JSON.parse(JSON.stringify(this.formPass.passParams)); // 深拷贝，取消时还原数据用
      this.dialogTitle = `${this.serviceType === 0 ? "采集" : "数据服务"}通道 其他参数`;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
