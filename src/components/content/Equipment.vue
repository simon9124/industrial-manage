<template>
  <div class="content"
       v-if="!contentLoading">
    <el-tabs v-model="activeName">

      <!-- 配置参数 -->
      <el-tab-pane name="first">
        <span slot="label">
          <i class="el-icon-setting"></i> 配置参数
        </span>
        <el-form :model="formEquipment"
                 ref="formEquipment"
                 :rules="formEquipmentRule"
                 label-position="left">

          <el-row>
            <el-col style="width:420px">
              <el-form-item label-width="105px"
                            label="名称(数字)："
                            prop="name">
                <el-input-number v-model="formEquipment.name"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col style="width:380px">
              <el-form-item label-width="65px"
                            label="描述："
                            prop="description">
                <el-input v-model="formEquipment.description"></el-input>
              </el-form-item>
            </el-col>
            <el-button style="margin:0 0 20px 20px"
                       @click="setParams">其他参数</el-button>
          </el-row>

          <el-row>
            <el-col style="width:450px">
              <el-form-item label-width="125px"
                            label="用户参数(如:型)："
                            prop="userParam">
                <el-input v-model="formEquipment.userParam"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-collapse v-if="formEquipment.outerParams&&formEquipment.outerParams.length!==0"
                       accordion
                       v-model="activeNames">
            <el-collapse-item v-for="(param,i) in formEquipment.outerParams"
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

        </el-form>
      </el-tab-pane>

      <!-- 数据标签 -->
      <el-tab-pane name="second">
        <span slot="label">
          <i class="el-icon-edit-outline"></i> 数据标签
        </span>

        <!-- table - 数据标签 -->
        <pass-tags :id="id"
                   :service-type="serviceType"
                   :tree-data="treeData"
                   :equipment-list="equipmentList"
                   :data-tags-org="formEquipment.dataTags"
                   :label-outer-params="labelOuterParams"
                   :label-other-params="labelOtherParams"></pass-tags>

      </el-tab-pane>

    </el-tabs>

    <!-- dialog - 其他参数 · 设备 -->
    <equipment-params ref="equipmentParams"
                      :form-equipment="formEquipment"></equipment-params>

  </div>
</template>

<script>
import EquipmentParams from "@/components/dialog/equipmentParams"; // 组件：其他参数 - 通道
import EquipmentTags from "@/components/table/equipmentTags"; // 组件：数据标签 - 设备
import PassTags from "@/components/table/passTags"; // 组件：数据标签 - 设备

export default {
  components: { EquipmentParams, PassTags, EquipmentTags },
  props: {
    // 被选择的id - 仅mock
    id: {
      type: String
    },
    // 0/1 采集服务/数据服务
    serviceType: {
      type: Number,
      default: 0
    },
    // 表单数据 - 仅接口
    formEquipmentOrg: {
      type: Object
    },
    // 标签的动态列
    labelOuterParams: {
      type: Array,
      default: () => []
    },
    // 标签的动态其他参数
    labelOtherParams: {
      type: Array,
      default: () => []
    },
    // 通道/设备loading
    contentLoading: {
      type: Boolean,
      default: false
    },
    // 树数据 - 仅mock
    treeData: {
      type: Array,
      default: () => []
    },
    // 设备列表 - 仅mock
    equipmentList: {
      type: Array
    }
  },
  data () {
    return {
      formEquipment: { // 表单数据
        equipmentParams: {}
      },
      formEquipmentRule: { // 表单验证
        name: [
          { required: true, message: "请输入名称", trigger: "change" }
        ],
        description: [
          { required: true, message: "请输入描述", trigger: "change" }
        ]
      },
      activeName: "first", // tabs选中的标签
      activeNames: ["0"] // 手风琴展开的标签
    };
  },
  created () {
    this.getData();
  },
  methods: {
    // 获取数据
    getData () {
      if (this.isMock) { // mock数据
        this.equipmentList.forEach((equipment, i) => {
          equipment.id === this.id &&
            (this.formEquipment = JSON.parse(JSON.stringify(this.equipmentList[i])));
        });
        this.activeName = "first"; // tab重置
      } else { // 接口数据
        if (this.formEquipmentOrg.name) {
          // console.log(this.formEquipmentOrg);
          this.activeName = "first"; // tab重置
          /* 1.outerParams */
          let otherParamsEqu = this.outerParamsHanding(this.formEquipmentOrg.otherParams);
          let outerParamsEqu = this.outerParamsHanding(this.formEquipmentOrg.outerParams);
          /* 2.表单数据 */
          this.formEquipment = {
            otherParams: otherParamsEqu, // 插件相关
            outerParams: outerParamsEqu, // 插件相关
            idStr: this.formEquipmentOrg.idStr, // 设备id
            pipelineIdStr: this.formEquipmentOrg.pipelineIdStr, // 通道id
            name: this.formEquipmentOrg.name, // 设备名称
            description: this.formEquipmentOrg.description, // 设备描述
            userParam: this.formEquipmentOrg.userParam, // 用户参数
            equipmentParams: {
              waitTime: this.formEquipmentOrg.userParam, // 查询等待时间
              queryIs: this.formEquipmentOrg.queryCount !== null, // 启用查询失败重试机制
              queryCount: this.formEquipmentOrg.queryCount, // 查询失败后重试次数
              fault: this.formEquipmentOrg.fault !== null, // 启用故障诊断
              qcount: this.formEquipmentOrg.qcount, // 连续查询失败次数
              qtimers: this.formEquipmentOrg.qtimers, // 设备长时间未接收完整帧时间
              dataMode: this.formEquipmentOrg.dataMode, // 故障时数据处理方式
              scanMode: this.formEquipmentOrg.scanMode, // 故障时扫描处理方式
              isDeviceParam: this.formEquipmentOrg.isDeviceParam, // 使用设备系数
              r1: this.formEquipmentOrg.r1, // 设备层系数R1
              r2: this.formEquipmentOrg.r2 // 设备层系数R2
            } // 其他参数
          };
          // console.log(this.formEquipment);
        }
      }
    },
    // outerParams数据处理
    outerParamsHanding (outerParams) {
      let outerParamsUse = [];
      if (outerParams) {
        let outerParamsCopy = JSON.parse(JSON.stringify(outerParams));
        outerParamsCopy.forEach((param, i) => {
          if (i === 0) { // 第一项
            outerParamsUse.push({
              typeName: param.typeName,
              items: [param]
            });
          } else { // 不是第一项
            if (!outerParamsUse.some(
              _param => _param.typeName === param.typeName
            )) { // 数组中没有该类型
              outerParamsUse.push({
                typeName: param.typeName,
                items: [param]
              });
            } else { // 数组中已有该类型
              outerParamsUse.forEach(_param => {
                _param.typeName === param.typeName && (_param.items = _param.items.concat(param));
              });
            }
          }
        });
      }
      // console.log(outerParamsUse);
      return outerParamsUse;
    },
    // 点击按钮 - 其他参数 - 调用子组件事件
    setParams () {
      this.$refs.equipmentParams.setParams();
    },
    // 保存设备
    equipmentSubmit () {
      this.$refs.formEquipment.validate(valid => {
        if (valid) {
          if (this.isMock) { // mock数据
            this.equipmentList.forEach((equipment, i) => { // 更新设备列表
              equipment.id === this.id &&
                this.$set(this.equipmentList, i, this.formEquipment);
            });
            this.treeData[0].children.forEach(pass => { // 更新树
              pass.children.forEach((equipment, i) => {
                equipment.id === this.id &&
                  this.$set(equipment, "text",
                    `${this.formEquipment.name}[${this.formEquipment.description}]`
                  );
              });
            });
            this.$message({
              message: "保存成功",
              type: "success",
              duration: "1000"
            });
          } else { // 接口数据
            this.$emit("item-update", this.formEquipment);
          }
        }
      });
    },
    // 强制刷新
    forceUpdate () {
      this.$forceUpdate();
    }
  },
  watch: {
    id (val) {
      this.isMock && this.getData();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/content.scss';
</style>
