<template>
  <el-dialog :title="dialogTitle"
             :visible.sync="dialogVisible">

    <el-row class="params-dialog-row">
      <el-checkbox v-model="formData.otherParams.takeAbsoluteValue"
                   style="margin-right:20px">取绝对值</el-checkbox>
      &nbsp;单位&nbsp;
      <el-input v-model="formData.otherParams.absoluteValue"
                style="width:100px;margin-right:20px"></el-input>
      &nbsp;设备系数计算&nbsp;
      <el-select v-model="formData.otherParams.calculation"
                 placeholder="请选择"
                 style="width:200px;margin-right:20px">
        <el-option v-for="item in calculationList"
                   :key="item"
                   :label="item"
                   :value="item">
        </el-option>
      </el-select>
    </el-row>

    <el-row class="params-dialog-row">
      <el-checkbox v-model="formData.otherParams.ratioCalculation">系数计算</el-checkbox>
      <div class="params-dialog-row-div">
        倍率（a）
        <el-input v-model="formData.otherParams.magnification"
                  style="width:100px"
                  :disabled="!formData.otherParams.ratioCalculation"></el-input>
        基数（b）
        <el-input v-model="formData.otherParams.base"
                  style="width:100px;margin-right:20px"
                  :disabled="!formData.otherParams.ratioCalculation"></el-input>
        形如：y = ax + b
        <el-checkbox v-model="formData.otherParams.reverseCoefficient"
                     :disabled="!formData.otherParams.ratioCalculation"
                     style="margin-left:20px">写使用反向系数</el-checkbox>
      </div>
    </el-row>

    <el-row class="params-dialog-row">
      <el-checkbox v-model="formData.otherParams.rangeConversion">量程转换</el-checkbox>
      <div class="params-dialog-row-div">
        量程最大&nbsp;
        <el-input v-model="formData.otherParams.maxRange"
                  style="width:100px;margin-right:20px"
                  :disabled="!formData.otherParams.rangeConversion"></el-input>
        采集值最大&nbsp;
        <el-input v-model="formData.otherParams.maxGather"
                  style="width:100px"
                  :disabled="!formData.otherParams.rangeConversion"></el-input>
      </div>
      <div class="params-dialog-row-div"
           style="margin-top:10px">
        量程最小&nbsp;
        <el-input v-model="formData.otherParams.minRange"
                  style="width:100px;margin-right:20px"
                  :disabled="!formData.otherParams.rangeConversion"></el-input>
        采集值最小&nbsp;
        <el-input v-model="formData.otherParams.minGather"
                  style="width:100px"
                  :disabled="!formData.otherParams.rangeConversion"></el-input>
      </div>
    </el-row>

    <el-row class="params-dialog-row">
      <el-checkbox v-model="formData.otherParams.dataFilter">数据有效范围过滤</el-checkbox>
      <div class="params-dialog-row-div">
        数据最小&nbsp;
        <el-input v-model="formData.otherParams.minData"
                  style="width:100px;margin-right:20px"
                  :disabled="!formData.otherParams.dataFilter"></el-input>
        数据最大&nbsp;
        <el-input v-model="formData.otherParams.maxData"
                  style="width:100px"
                  :disabled="!formData.otherParams.dataFilter"></el-input>
      </div>
      <div class="params-dialog-row-div"
           style="margin-top:10px">
        <el-radio v-model="formData.otherParams.dataRadio"
                  label="1"
                  :disabled="!formData.otherParams.dataFilter">小于最小值取最小值，大于最大值取最大值</el-radio>
        <el-radio v-model="formData.otherParams.dataRadio"
                  label="2"
                  :disabled="!formData.otherParams.dataFilter">小于最小值、大于最大值忽略</el-radio>
      </div>
    </el-row>

    <el-row class="params-dialog-row">
      高级运算
      <el-select v-model="formData.otherParams.advancedOperation"
                 placeholder="请选择"
                 style="width:200px;margin:0 20px">
        <el-option v-for="item in advancedOperationList"
                   :key="item"
                   :label="item"
                   :value="item">
        </el-option>
      </el-select>
      参数1&nbsp;
      <el-input v-model="formData.otherParams.param1"
                style="width:100px;margin-right:20px"
                :disabled="!(formData.otherParams.advancedOperation==='取子字符串'||formData.otherParams.advancedOperation==='按位取')"></el-input>
      参数2&nbsp;
      <el-input v-model="formData.otherParams.param2"
                style="width:100px"
                :disabled="!(formData.otherParams.advancedOperation==='取子字符串'||formData.otherParams.advancedOperation==='按位取')"></el-input>
    </el-row>

    <el-collapse v-model="activeNames"
                 accordion
                 style="margin-top:20px">
      <el-collapse-item title="用户参数"
                        name="1">
        <div class="collapse-content">类型编码：
          <el-input style="max-width:400px"
                    v-model="formData.otherParams.code"></el-input>
        </div>
        <div class="collapse-content">是否缓存：
          <el-radio v-model="formData.otherParams.cache"
                    :label="true">缓存</el-radio>
          <el-radio v-model="formData.otherParams.cache"
                    :label="false">不缓存</el-radio>
        </div>
      </el-collapse-item>
      <el-collapse-item title="报警配置"
                        name="2">
        <div class="collapse-content">报警开关：
          <el-radio v-model="formData.otherParams.alert"
                    :label="true">打开</el-radio>
          <el-radio v-model="formData.otherParams.alert"
                    :label="false">关闭</el-radio>
        </div>
        <div class="collapse-content">高高限：
          <el-input style="max-width:400px"
                    v-model="formData.otherParams.maxLimit"></el-input>
        </div>
        <div class="collapse-content">高限：
          <el-input style="max-width:400px"
                    v-model="formData.otherParams.upperLimit"></el-input>
        </div>
        <div class="collapse-content">低限：
          <el-input style="max-width:400px"
                    v-model="formData.otherParams.lowerLimit"></el-input>
        </div>
        <div class="collapse-content">低低限：
          <el-input style="max-width:400px"
                    v-model="formData.otherParams.minLimit"></el-input>
        </div>
        <div class="collapse-content">报警延迟（秒，0：不延时）：
          <el-input style="max-width:400px"
                    v-model="formData.otherParams.alarmDelay"></el-input>
        </div>
        <div class="collapse-content">报警级别：
          <el-input style="max-width:400px"
                    v-model="formData.otherParams.alarmLevel"></el-input>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogVisible = false;formData.otherParams = paramsOrg;">
        取 消</el-button>
      <el-button @click="dialogVisible = false"
                 type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 当前标签数据
    formData: {
      type: Object
    }
  },
  data () {
    return {
      dialogVisible: false, // 是否可见
      dialogTitle: "", // 弹框名称
      calculationList: ["不参与计算", "乘设备系数R1", "乘设备系数R2", "乘设备系数R1*R2"], // 设备系数列表
      advancedOperationList: ["无计算", "2字节无符号 先高后低", "8字节浮点数 顺序87654321", "取子字符串", "按位取"], // 高级运算列表
      activeNames: ["1"] // 手风琴展开的标签
    };
  },
  methods: {
    // 其他参数
    setParams () {
      // console.log(this.formData);
      this.dialogVisible = true;
      this.dialogTitle = `数据标签其他参数 ${this.formData.dataType}`;
      this.paramsOrg = JSON.parse(JSON.stringify(this.formData.otherParams)); // 深拷贝，取消时还原数据用
    }
  },
  watch: {
    dialogVisible (val) {
      !val && (this.activeNames = ["1"]);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
