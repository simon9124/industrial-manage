<template>
  <div class="content">
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
                            label="名称(英文)："
                            prop="equipmentName">
                <el-input v-model="formEquipment.equipmentName"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="width:380px">
              <el-form-item label-width="65px"
                            label="描述："
                            prop="equipmentDescribe">
                <el-input v-model="formEquipment.equipmentDescribe"></el-input>
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

        </el-form>
        <el-collapse v-model="activeNames"
                     accordion>
          <el-collapse-item title="基本参数"
                            name="1">
            <div>MODBUS设备地址：{{formEquipment.MODBUSAdd}}</div>
            <div>查询帧查询的最大字数：{{formEquipment.searchNum}}</div>
          </el-collapse-item>
          <el-collapse-item title="写寄存器"
                            name="2">
            <div>单寄存器写是否按6号指令？{{formEquipment.singleRegister?'YES':"NO"}}</div>
            <div>多寄存器写是否按16号指令？{{formEquipment.multiRegister?'YES':"NO"}}</div>
          </el-collapse-item>
          <el-collapse-item title="高级参数"
                            name="3">
            <div>合对应的值：{{formEquipment.correspondingValue}}</div>
            <div>分对应的值：{{formEquipment.subCorrespondingValue}}</div>
            <div>双字节校验CRC传送顺序，先低后高？{{formEquipment.doubleByteCheck?'YES':"NO"}}</div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>

      <!-- 数据标签 -->
      <el-tab-pane name="second">
        <span slot="label">
          <i class="el-icon-edit-outline"></i> 数据标签
        </span>

        <!-- table - 数据标签 · 通道 -->
        <equipment-tags :id="id"
                        :data-tags-org="formEquipment.dataTags"></equipment-tags>

      </el-tab-pane>

    </el-tabs>

    <!-- dialog - 其他参数 · 设备 -->
    <equipment-params ref="equipmentParams"
                      :id="id"
                      :form-equipment="formEquipment"></equipment-params>

  </div>
</template>

<script>
import EquipmentParams from "@/components/dialog/equipmentParams"; // 组件：其他参数 - 通道
import EquipmentTags from "@/components/table/equipmentTags"; // 组件：数据标签 - 设备

export default {
  components: { EquipmentParams, EquipmentTags },
  props: {
    // 树数据
    treeData: {
      type: Array,
      default: () => []
    },
    // 被选择的id
    id: {
      type: String
    },
    // 设备列表
    equipmentList: {
      type: Array
    }
  },
  data () {
    return {
      formEquipment: {}, // 表单数据
      formEquipmentRule: { // 表单验证
        equipmentName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        equipmentDescribe: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ]
      },
      activeName: "first", // tabs选中的标签
      activeNames: ["1"] // 手风琴展开的标签
    };
  },
  created () {
    this.getData();
  },
  methods: {
    // 获取数据
    getData () {
      this.equipmentList.forEach((equipment, i) => {
        equipment.id === this.id &&
          (this.formEquipment = JSON.parse(JSON.stringify(this.equipmentList[i])));
      });
      this.activeName = "first"; // tab重置
    },
    // 点击按钮 - 其他参数 - 调用子组件事件
    setParams () {
      this.$refs.equipmentParams.setParams();
    },
    // 保存设备
    equipmentSubmit () {
      this.$refs.formEquipment.validate(valid => {
        if (valid) {
          this.equipmentList.forEach((equipment, i) => { // 更新设备列表
            equipment.id === this.id &&
              this.$set(this.equipmentList, i, this.formEquipment);
          });
          this.treeData[0].children.forEach(pass => { // 更新树
            pass.children.forEach((equipment, i) => {
              equipment.id === this.id &&
                this.$set(equipment, "text",
                  `${this.formEquipment.equipmentName}[${this.formEquipment.equipmentDescribe}]`
                );
            });
          });
          this.$message({
            message: "保存成功",
            type: "success",
            duration: "1000"
          });
        }
      });
    }
  },
  watch: {
    id (val) {
      this.getData();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/content.scss';
</style>
