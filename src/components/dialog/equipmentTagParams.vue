<template>
  <el-dialog title="其他参数"
             :visible.sync="dialogVisible">

    <!-- 取绝对值 -->
    <el-row v-if="serviceType===0"
            class="params-dialog-row">
      <el-checkbox v-model="formData.tagOtherParams.abs"
                   style="margin-right:20px">取绝对值</el-checkbox>
      &nbsp;单位&nbsp;
      <el-input v-model="formData.tagOtherParams.unit"
                style="width:100px;margin-right:20px"></el-input>
      &nbsp;设备系数计算&nbsp;
      <el-select v-model="formData.tagOtherParams.deviceRatio"
                 placeholder="请选择"
                 style="width:200px;margin-right:20px">
        <el-option v-for="item in calculationList"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
    </el-row>

    <!-- 系数计算 -->
    <el-row class="params-dialog-row">
      <el-checkbox v-model="formData.tagOtherParams.func">系数计算</el-checkbox>
      <div class="params-dialog-row-div">
        倍率（a）
        <el-input v-model="formData.tagOtherParams.a"
                  style="width:100px"
                  :disabled="!formData.tagOtherParams.func"></el-input>
        基数（b）
        <el-input v-model="formData.tagOtherParams.b"
                  style="width:100px;margin-right:20px"
                  :disabled="!formData.tagOtherParams.func"></el-input>
        形如：y = ax + b
        <el-checkbox v-model="formData.tagOtherParams.isContrary"
                     :disabled="!formData.tagOtherParams.func"
                     style="margin-left:20px">写使用反向系数</el-checkbox>
      </div>
    </el-row>

    <!-- 量程转换 -->
    <el-row v-if="serviceType===0"
            class="params-dialog-row">
      <el-checkbox v-model="formData.tagOtherParams.isInsToSam">量程转换</el-checkbox>
      <div class="params-dialog-row-div">
        量程最大&nbsp;
        <el-input v-model="formData.tagOtherParams.insMax"
                  style="width:100px;margin-right:20px"
                  :disabled="!formData.tagOtherParams.isInsToSam"></el-input>
        采集值最大&nbsp;
        <el-input v-model="formData.tagOtherParams.samMax"
                  style="width:100px"
                  :disabled="!formData.tagOtherParams.isInsToSam"></el-input>
      </div>
      <div class="params-dialog-row-div"
           style="margin-top:10px">
        量程最小&nbsp;
        <el-input v-model="formData.tagOtherParams.insMin"
                  style="width:100px;margin-right:20px"
                  :disabled="!formData.tagOtherParams.isInsToSam"></el-input>
        采集值最小&nbsp;
        <el-input v-model="formData.tagOtherParams.samMin"
                  style="width:100px"
                  :disabled="!formData.tagOtherParams.isInsToSam"></el-input>
      </div>
    </el-row>

    <!-- 数据有效范围过滤 -->
    <el-row v-if="serviceType===0"
            class="params-dialog-row">
      <el-checkbox v-model="formData.tagOtherParams.dataFilter">数据有效范围过滤</el-checkbox>
      <div class="params-dialog-row-div">
        数据最小&nbsp;
        <el-input v-model="formData.tagOtherParams.min"
                  style="width:100px;margin-right:20px"
                  :disabled="!formData.tagOtherParams.dataFilter"></el-input>
        数据最大&nbsp;
        <el-input v-model="formData.tagOtherParams.max"
                  style="width:100px"
                  :disabled="!formData.tagOtherParams.dataFilter"></el-input>
      </div>
      <!-- <div class="params-dialog-row-div"
           style="margin-top:10px">
        <el-radio v-model="formData.tagOtherParams.dataRadio"
                  label="1"
                  :disabled="!formData.tagOtherParams.dataFilter">小于最小值取最小值，大于最大值取最大值</el-radio>
        <el-radio v-model="formData.tagOtherParams.dataRadio"
                  label="2"
                  :disabled="!formData.tagOtherParams.dataFilter">小于最小值、大于最大值忽略</el-radio>
      </div> -->
    </el-row>

    <!-- 高级运算 -->
    <el-row v-if="serviceType===0"
            class="params-dialog-row">
      高级运算
      <el-select v-model="formData.tagOtherParams.calc"
                 placeholder="请选择"
                 style="width:200px;margin:0 20px">
        <el-option v-for="item in advancedOperationList"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      参数1&nbsp;
      <el-input v-model="formData.tagOtherParams.cr1"
                style="width:100px;margin-right:20px"
                :disabled="!(formData.tagOtherParams.calc==='取子字符串'||formData.tagOtherParams.calc==='按位取')"></el-input>
      参数2&nbsp;
      <el-input v-model="formData.tagOtherParams.cr2"
                style="width:100px"
                :disabled="!(formData.tagOtherParams.calc==='取子字符串'||formData.tagOtherParams.calc==='按位取')"></el-input>
    </el-row>

    <el-collapse v-if="formData.labelOtherParams&&formData.labelOtherParams.length!==0"
                 accordion
                 v-model="activeNames"
                 style="margin-top:30px">
      <el-collapse-item v-for="(param,i) in formData.labelOtherParams"
                        :key="i"
                        :title="param.typeName"
                        :name="i.toString()">
        <div class="collapse-content"
             v-for="(item,_i) in param.items"
             :key="_i">
          {{item.showName}}：
          <el-input v-if="item.valueTypeEnum==='文本输入框'"
                    style="max-width:200px"
                    v-model="item.value"
                    :disabled="item.disabled"
                    @input="forceUpdate"></el-input>
          <el-input-number v-if="item.valueTypeEnum==='数字输入框'"
                           style="max-width:200px"
                           :min="1"
                           v-model="item.value"
                           :disabled="item.disabled"
                           @input="forceUpdate"></el-input-number>
          <el-select v-if="item.valueTypeEnum==='选择框'"
                     v-model="item.value"
                     :disabled="item.disabled"
                     @change="forceUpdate">
            <el-option v-for="_item in item.selectTable"
                       :key="_item.value"
                       :label="_item.name"
                       :value="_item.value">
            </el-option>
          </el-select>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogVisible = false;formData.tagOtherParams = paramsOrg;">
        取 消</el-button>
      <el-button @click="dialogVisible = false"
                 type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { calculationList, advancedOperationList } from "@/mock/tableColumn.js";
export default {
  props: {
    // 当前标签数据
    formData: {
      type: Object
    },
    // 0/1 采集服务/数据服务
    serviceType: {
      type: Number,
      default: 0
    },
    // 标签的动态其他参数
    labelOtherParams: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogVisible: false, // 是否可见
      calculationList: calculationList, // 设备系数列表
      advancedOperationList: advancedOperationList, // 高级运算列表
      activeNames: ["0"] // 手风琴展开的标签
    };
  },
  methods: {
    // 其他参数
    setParams () {
      // console.log(this.formData);
      this.dialogVisible = true;
      this.paramsOrg = JSON.parse(JSON.stringify(this.formData.tagOtherParams)); // 深拷贝，取消时还原数据用
    },
    // 强制刷新
    forceUpdate () {
      this.$forceUpdate();
    }
  },
  watch: {
    dialogVisible (val) {
      !val && (this.activeNames = ["0"]);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
