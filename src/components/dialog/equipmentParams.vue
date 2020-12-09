<template>
  <el-dialog class="params-dialog"
             title="采集设备 其他参数"
             :visible.sync="dialogVisible">

    <el-row class="params-dialog-row">
      查询等待时间（毫秒）：
      <el-input v-model="formEquipment.otherParams.delayTime"
                style="width:100px"></el-input>
    </el-row>

    <el-row class="params-dialog-row">
      <el-checkbox v-model="formEquipment.otherParams.failedTryAgain">启用查询失败重试机制</el-checkbox>
      <div class="params-dialog-row-div">
        查询失败后再次重试次数&nbsp;
        <el-input v-model="formEquipment.otherParams.failedTryTimes"
                  style="width:100px"
                  :disabled="!formEquipment.otherParams.failedTryAgain"></el-input>
      </div>
    </el-row>

    <el-row class="params-dialog-row">
      <el-checkbox v-model="formEquipment.otherParams.faultDiagnosis"
                   style="margin-bottom:10px">启用故障诊断</el-checkbox>
      <div class="params-dialog-row-div">
        引起故障的原因
        <div class="params-dialog-row-div">
          连续查询失败次数（包含第一次查询）
          <el-input v-model="formEquipment.otherParams.continuousQueryFailed"
                    style="width:100px;margin:5px 0"
                    :disabled="!formEquipment.otherParams.faultDiagnosis"></el-input>
        </div>
        <div class="params-dialog-row-div">
          设备长时间未接收完整帧时间&nbsp;
          <el-input v-model="formEquipment.otherParams.noReceivedLongTime"
                    style="width:100px"
                    :disabled="!formEquipment.otherParams.faultDiagnosis"></el-input>
          （设定值>=30秒）
        </div>
      </div>
      <div class="params-dialog-row-div">
        故障时数据处理方&nbsp;
        <el-select v-model="formEquipment.otherParams.faultDataProcess"
                   placeholder="请选择"
                   style="margin:5px 0;width:280px"
                   :disabled="!formEquipment.otherParams.faultDiagnosis">
          <el-option v-for="item in dataProcessList"
                     :key="item"
                     :label="item"
                     :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="params-dialog-row-div">
        故障时数据扫描方&nbsp;
        <el-select v-model="formEquipment.otherParams.faultScanProcess"
                   placeholder="请选择"
                   style="width:240px"
                   :disabled="!formEquipment.otherParams.faultDiagnosis">
          <el-option v-for="item in scanProcessList"
                     :key="item"
                     :label="item"
                     :value="item">
          </el-option>
        </el-select>
        &nbsp;查询周期（秒）
        <el-input v-model="formEquipment.otherParams.queryPeriod"
                  style="width:100px"
                  :disabled="!formEquipment.otherParams.faultDiagnosis||formEquipment.otherParams.faultScanProcess==='正常扫描'"></el-input>
      </div>
    </el-row>

    <el-row class="params-dialog-row">
      <el-checkbox v-model="formEquipment.otherParams.equipmentFactor"
                   style="margin-right:20px">使用设备系数</el-checkbox>
      &nbsp;设备层系数R1&nbsp;
      <el-input v-model="formEquipment.otherParams.factorR1"
                style="width:100px"
                :disabled="!formEquipment.otherParams.equipmentFactor"></el-input>
      &nbsp;设备层系数R2&nbsp;
      <el-input v-model="formEquipment.otherParams.factorR2"
                style="width:100px"
                :disabled="!formEquipment.otherParams.equipmentFactor"></el-input>
    </el-row>

    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogVisible = false;formEquipment.otherParams = paramsOrg">取 消</el-button>
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
    formEquipment: {
      type: Object
    }
  },
  data () {
    return {
      dialogVisible: false, // 是否可见
      dataProcessList:
        [
          "保持之前值，质量戳为GOOD",
          "保持之前值，质量戳为BAD",
          "设备数据全部置0，质量戳为GOOD",
          "设备数据全部置0，质量戳为BAD"
        ],
      scanProcessList: ["正常扫描", "停止扫描，进入鼓掌查询周期"]
    };
  },
  methods: {
    // 其他参数
    setParams () {
      this.dialogVisible = true;
      this.paramsOrg = JSON.parse(JSON.stringify(this.formEquipment.otherParams)); // 深拷贝，取消时还原数据用
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
