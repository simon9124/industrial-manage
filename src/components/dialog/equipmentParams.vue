<template>
  <el-dialog class="params-dialog"
             title="采集设备 其他参数"
             :visible.sync="dialogVisible">

    <el-row class="params-dialog-row">
      查询等待时间（毫秒）：
      <el-input v-model="formEquipment.equipmentParams.waitTime"
                style="width:100px"></el-input>
    </el-row>

    <el-row class="params-dialog-row">
      <el-checkbox v-model="formEquipment.equipmentParams.queryIs">启用查询失败重试机制</el-checkbox>
      <div class="params-dialog-row-div">
        查询失败后再次重试次数&nbsp;
        <el-input v-model="formEquipment.equipmentParams.queryCount"
                  style="width:100px"
                  :disabled="!formEquipment.equipmentParams.queryIs"></el-input>
      </div>
    </el-row>

    <el-row class="params-dialog-row">
      <el-checkbox v-model="formEquipment.equipmentParams.fault"
                   style="margin-bottom:10px">启用故障诊断</el-checkbox>
      <div class="params-dialog-row-div">
        引起故障的原因
        <div class="params-dialog-row-div">
          连续查询失败次数（包含第一次查询）
          <el-input v-model="formEquipment.equipmentParams.qcount"
                    style="width:100px;margin:5px 0"
                    :disabled="!formEquipment.equipmentParams.fault"></el-input>
        </div>
        <div class="params-dialog-row-div">
          设备长时间未接收完整帧时间&nbsp;
          <el-input v-model="formEquipment.equipmentParams.qtimers"
                    style="width:100px"
                    :disabled="!formEquipment.equipmentParams.fault"></el-input>
          （设定值>=30秒）
        </div>
      </div>
      <div class="params-dialog-row-div">
        故障时数据处理方式&nbsp;
        <el-select v-model="formEquipment.equipmentParams.dataMode"
                   placeholder="请选择"
                   style="margin:5px 0;width:280px"
                   :disabled="!formEquipment.equipmentParams.fault">
          <el-option v-for="item in dataProcessList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="params-dialog-row-div">
        故障时数据扫描方式&nbsp;
        <el-select v-model="formEquipment.equipmentParams.scanMode"
                   placeholder="请选择"
                   style="width:240px"
                   :disabled="!formEquipment.equipmentParams.fault">
          <el-option v-for="item in scanProcessList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <!-- &nbsp;查询周期（秒）
        <el-input v-model="formEquipment.equipmentParams.queryPeriod"
                  style="width:100px"
                  :disabled="!formEquipment.equipmentParams.fault||formEquipment.equipmentParams.scanMode===0"></el-input> -->
      </div>
    </el-row>

    <el-row class="params-dialog-row">
      <el-checkbox v-model="formEquipment.equipmentParams.isDeviceParam"
                   style="margin-right:20px">使用设备系数</el-checkbox>
      &nbsp;设备层系数R1&nbsp;
      <el-input v-model="formEquipment.equipmentParams.r1"
                style="width:100px"
                :disabled="!formEquipment.equipmentParams.isDeviceParam"></el-input>
      &nbsp;设备层系数R2&nbsp;
      <el-input v-model="formEquipment.equipmentParams.r2"
                style="width:100px"
                :disabled="!formEquipment.equipmentParams.isDeviceParam"></el-input>
    </el-row>

    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogVisible = false;formEquipment.equipmentParams = paramsOrg">取 消</el-button>
      <el-button @click="dialogVisible = false"
                 type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    // 当前通道数据
    formEquipment: {
      type: Object
    }
  },
  data () {
    return {
      dialogVisible: false, // 是否可见
      dataProcessList: [ // 列表 - 故障时数据处理方式
        {
          label: "保持之前值，质量戳为GOOD",
          value: 0
        },
        {
          label: "保持之前值，质量戳为BAD",
          value: 1
        },
        {
          label: "设备数据全部置0，质量戳为GOOD",
          value: 2
        },
        {
          label: "设备数据全部置0，质量戳为BAD",
          value: 3
        }
      ],
      scanProcessList: [ // 列表 - 故障时扫描处理方式
        {
          label: "正常扫描",
          value: 0
        },
        {
          label: "停止扫描，进入鼓掌查询周期",
          value: 1
        }
      ]
    };
  },
  methods: {
    // 其他参数
    setParams () {
      this.dialogVisible = true;
      this.paramsOrg = JSON.parse(JSON.stringify(this.formEquipment.equipmentParams)); // 深拷贝，取消时还原数据用
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
