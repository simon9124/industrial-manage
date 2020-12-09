<template>
  <div class="header">
    <div class="btns">
      <el-button size="small"
                 icon="el-icon-plus"
                 type="primary"
                 :disabled="level===3"
                 @click="newBuild">新建</el-button>
      <el-button size="small"
                 icon="el-icon-close"
                 type="danger"
                 :disabled="level===1"
                 @click="itemDelete">删除</el-button>
      <el-button size="small"
                 icon="el-icon-caret-right"
                 @click="localOperate">本地运行</el-button>
      <el-button size="small"
                 icon="el-icon-suitcase"
                 @click="factoryManage">工程管理</el-button>
      <el-button size="small"
                 icon="el-icon-data-board"
                 @click="remoteMonitor">远程监视</el-button>
      <el-button size="small"
                 icon="el-icon-download"
                 type="info">上传下载</el-button>
      <el-button size="small"
                 icon="el-icon-check"
                 type="success"
                 :disabled="level===1"
                 @click="itemSubmit">保存</el-button>
      <!-- <el-button size="small"
                 icon="el-icon-refresh"
                 type="warning">更新</el-button> -->
    </div>

    <!-- dialog - 配置 -->
    <el-dialog class="dispose-dialog"
               :title="dialogDisposeTitle"
               :visible.sync="dialogDisposeVisible">

      <!-- 采集通道配置 -->
      <el-form v-if="level===1"
               :model="formPass"
               ref="formPass"
               :rules="formPassRule"
               label-position="left">

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label-width="105px"
                          label="名称(英文)："
                          prop="passName">
              <el-input v-model="formPass.passName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="65px"
                          label="描述："
                          prop="passDescribe">
              <el-input v-model="formPass.passDescribe"></el-input>
            </el-form-item>
          </el-col>
          <el-button style="margin:0 0 20px 5px"
                     @click="setParamsPass">其他参数</el-button>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label-width="55px"
                          label="厂家：">
              <el-input disabled
                        v-model="formPass.plugin.factory"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="55px"
                          label="描述：">
              <el-input disabled
                        v-model="formPass.plugin.describe"></el-input>
            </el-form-item>
          </el-col>
          <el-button style="margin:0 0 20px 5px"
                     @click="pluginSelect">选择插件</el-button>
          <el-button style="margin-bottom:20px">帮助</el-button>
        </el-row>

        <el-row>
          <el-col :span="22">
            <el-form-item label-width="55px"
                          label="路径：">
              <el-input disabled
                        v-model="formPass.plugin.path"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label-width="85px"
                          label="通道类型："
                          prop="passType">
              <el-select v-model="formPass.passType"
                         placeholder="请选择">
                <el-option v-for="item in passTypeList"
                           :key="item"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="formPass.passType==='串口'"
                :gutter="20">
          <el-col style="width:180px">
            <el-form-item label-width="55px"
                          label="串口："
                          prop="sata">
              <el-select v-model="formPass.sata"
                         placeholder="请选择">
                <el-option v-for="item in sataList"
                           :key="item"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="width:180px">
            <el-form-item label-width="75px"
                          label="波特率："
                          prop="baudRate">
              <el-select v-model="formPass.baudRate"
                         placeholder="请选择">
                <el-option v-for="item in baudList"
                           :key="item"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="width:160px">
            <el-form-item label-width="75px"
                          label="数据位："
                          prop="dataBits">
              <el-select v-model="formPass.dataBits"
                         placeholder="请选择">
                <el-option v-for="item in dataList"
                           :key="item"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="width:200px">
            <el-form-item label-width="75px"
                          label="校验位："
                          prop="checkBits">
              <el-select v-model="formPass.checkBits"
                         placeholder="请选择">
                <el-option v-for="item in checkList"
                           :key="item"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="width:180px">
            <el-form-item label-width="75px"
                          label="停止位："
                          prop="stopBits">
              <el-select v-model="formPass.stopBits"
                         placeholder="请选择">
                <el-option v-for="item in stopList"
                           :key="item"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row v-if="formPass.passType!=='串口' && formPass.passType!=='虚拟端口'"
                :gutter="20">
          <el-col style="width:300px">
            <el-form-item label-width="70px"
                          :label="formPass.passType==='TCP客户端'?'远程IP：':'本地IP：'"
                          prop="ip">
              <el-input v-model="formPass.ip"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width:300px">
            <el-form-item label-width="85px"
                          :label="formPass.passType==='TCP客户端'?'远程端口：':'本地端口：'"
                          prop="port">
              <el-input v-model="formPass.port"></el-input>
            </el-form-item>
          </el-col>
          <el-button v-if="formPass.passType==='TCP客户端'"
                     style="margin-left:20px"
                     @click="bindingIP">需要绑定本地IP</el-button>
        </el-row>

        <el-collapse v-if="id&&id.slice(0,1)==='2'"
                     v-model="disposeActiveNames">
          <el-collapse-item title="基本参数"
                            name="1">
            <div class="collapse-content">延迟回复（秒）：
              <el-input style="max-width:400px"
                        v-model="formPass.delayTime"></el-input>
            </div>
          </el-collapse-item>
        </el-collapse>

      </el-form>

      <!-- 采集设备配置 -->
      <el-form v-if="level===2"
               :model="formEquipment"
               ref="formEquipment"
               :rules="formEquipmentRule"
               label-position="left">

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label-width="105px"
                          label="名称(英文)："
                          prop="equipmentName">
              <el-input v-model="formEquipment.equipmentName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="65px"
                          label="描述："
                          prop="equipmentDescribe">
              <el-input v-model="formEquipment.equipmentDescribe"></el-input>
            </el-form-item>
          </el-col>
          <el-button style="margin:0 0 20px 5px"
                     @click="setParamsEquipment">其他参数</el-button>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label-width="125px"
                          label="用户参数(如:型)："
                          prop="userParam">
              <el-input v-model="formEquipment.userParam"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-collapse v-model="activeNames"
                     accordion>
          <el-collapse-item title="基本参数"
                            name="1">
            <div class="collapse-content">MODBUS设备地址：
              <el-input style="max-width:400px"
                        v-model="formEquipment.MODBUSAdd"></el-input>
            </div>
            <div>查询帧查询的最大字数：
              <el-input style="max-width:400px"
                        v-model="formEquipment.searchNum"></el-input>
            </div>
          </el-collapse-item>
          <el-collapse-item title="写寄存器"
                            name="2">
            <div class="collapse-content">单寄存器写是否按6号指令？
              <el-radio v-model="formEquipment.singleRegister"
                        :label="true">YES</el-radio>
              <el-radio v-model="formEquipment.singleRegister"
                        :label="false">NO</el-radio>
            </div>
            <div>多寄存器写是否按16号指令？
              <el-radio v-model="formEquipment.multiRegister"
                        :label="true">YES</el-radio>
              <el-radio v-model="formEquipment.multiRegister"
                        :label="false">NO</el-radio>
            </div>
          </el-collapse-item>
          <el-collapse-item title="高级参数"
                            name="3">
            <div class="collapse-content">合对应的值：
              <el-input style="max-width:400px"
                        v-model="formEquipment.correspondingValue"></el-input>
            </div>
            <div class="collapse-content">分对应的值：
              <el-input style="max-width:400px"
                        v-model="formEquipment.subCorrespondingValue"></el-input>
            </div>
            <div>双字节校验CRC传送顺序，先低后高？
              <el-radio v-model="formEquipment.doubleByteCheck"
                        :label="true">YES</el-radio>
              <el-radio v-model="formEquipment.doubleByteCheck"
                        :label="false">NO</el-radio>
            </div>
          </el-collapse-item>
        </el-collapse>

      </el-form>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogDisposeVisible = false">取 消</el-button>
        <el-button @click="itemAdd"
                   type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!-- dialog - 其他参数 · 通道 -->
    <pass-params ref="passParams"
                 :id="id"
                 :form-pass="formPass"
                 :pass-type-list="passTypeList"
                 :sata-list="sataList"
                 :baud-list="baudList"
                 :data-list="dataList"
                 :check-list="checkList"
                 :stop-list="stopList"></pass-params>

    <!-- dialog - 其他参数 · 设备 -->
    <equipment-params ref="equipmentParams"
                      :id="id"
                      :form-equipment="formEquipment"></equipment-params>

    <!-- dialog - 选择插件 -->
    <plugin-select ref="pluginSelect"
                   :id="id"
                   :form-pass="formPass"
                   :plugin-list="pluginList"
                   @plugin-click="pluginClick"></plugin-select>

    <!-- dialog - 复制 -->
    <el-dialog class="copy-dialog"
               :title="dialogCopyTitle"
               :visible.sync="dialogCopyVisible">
      <el-table ref="multipleTable"
                :data="dialogCopyData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         label="序号"
                         width="55">
        </el-table-column>
        <el-table-column :prop="level===1?'passName':'equipmentName'"
                         label="对象名称"
                         width="130">
        </el-table-column>
        <el-table-column :prop="level===1?'passDescribe':'equipmentDescribe'"
                         label="对象描述">
        </el-table-column>
      </el-table>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="multipleSubmit('cancel')">取 消</el-button>
        <el-button @click="multipleSubmit('submit')"
                   type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!-- dialog - 工程管理 -->
    <factory-manage ref="factoryManage"
                    :id-factory="idFactory"
                    :factory-data="factoryData"
                    :pass-list="passList"
                    :equipment-list="equipmentList"
                    @factory-select="factorySelect"></factory-manage>

    <!-- dialog - 远程监视 -->
    <remote-monitor ref="remoteMonitor"
                    :id-factory="idFactory"
                    :factory-data="factoryData"
                    :tree-data="treeData"></remote-monitor>

    <!-- dialog - 需绑定本地IP -->
    <el-dialog class="bind-dialog"
               title="IP地址框"
               :visible.sync="bindingIPVisible">
      <el-row>
        本地IP：
        <el-input v-model="formPass.bindingIp"
                  style="width:300px"></el-input>
      </el-row>
      <el-row style="margin-top:20px">
        注：本地IP，主要用来网卡绑定，以方便使用固定路由，为空的话，系统自己匹配路由。
      </el-row>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="bindingIPVisible = false;formPass.bindingIp = bindingIpOrg">取 消</el-button>
        <el-button @click="bindingIPVisible = false"
                   type="primary">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import PluginSelect from "@/components/dialog/pluginSelect"; // 组件：选择插件
import PassParams from "@/components/dialog/passParams"; // 组件：其他参数 - 通道
import EquipmentParams from "@/components/dialog/equipmentParams"; // 组件：其他参数 - 通道
import FactoryManage from "@/components/dialog/factoryManage"; // 组件：工程管理
import RemoteMonitor from "@/components/dialog/remoteMonitor"; // 组件：远程监视

export default {
  components: { PluginSelect, PassParams, EquipmentParams, FactoryManage, RemoteMonitor },
  props: {
    // 树数据
    treeData: {
      type: Array
    },
    // 工程数据
    factoryData: {
      type: Array
    },
    // 树节点的操作方式：add / delete / up / down
    handleType: {
      type: String,
      default: ""
    },
    // 被选择的树的层级 - 服务导航
    level: {
      type: Number,
      default: 3
    },
    // 被选择的id - 服务导航
    id: {
      type: String
    },
    // 被选择的id - 工程
    idFactory: {
      type: String
    },
    // 通道列表
    passList: {
      type: Array
    },
    // 插件列表
    pluginList: {
      type: Array
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
    },
    // 设备列表
    equipmentList: {
      type: Array
    }
  },
  data () {
    return {
      /* dialog */
      dialogDisposeVisible: false, // 配置 - 是否可见
      dialogDisposeTitle: "", // 配置 - 弹框名称
      dialogCopyTitle: "", // 复制 - 是否可见
      dialogCopyVisible: false, // 复制 - 弹框名称
      dialogCopyData: [], // 复制 - 表格数据
      multipleSelection: [], // 复制 - 选中的数据
      bindingIPVisible: false, // IP地址框 - 是否可见
      /* 通道 */
      formPass: { // 表单数据
        otherParams: {},
        plugin: {}
      },
      formPassRule: { // 表单验证
        passName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        passDescribe: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ]
      },
      disposeActiveNames: ["1"], // 手风琴展开的标签
      /* 设备 */
      formEquipment: { // 表单数据
        otherParams: {}
      },
      formEquipmentRule: { // 表单验证
        equipmentName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        equipmentDescribe: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ]
      },
      activeNames: ["1"] // 手风琴展开的标签
    };
  },
  watch: {
    handleType (val) {
      // console.log(val);
    }
  },
  methods: {
    // 新建 通道/设备
    newBuild (level) {
      this.dialogDisposeVisible = true;
      this.dialogDisposeTitle = `采集${this.level === 1 ? "通道" : "设备"}配置`;
      // 重置表单数据
      if (this.level === 1) {
        this.formPass = {
          passName: "C1",
          passDescribe: "通道1",
          plugin: {
            name: "IND_MODBUS_TCP",
            describe: "MODBUS TCP",
            factory: "莫迪康",
            classification: "通用标准",
            path: "C:\\Users\\43577\\Desktop\\软件\\CESTC\\PluginIo\\IND_MODBUS_RTU",
            plugins: [
              {
                name: "BA_BACNET_IP.335x",
                platform: "335x",
                edition: "5.0.0.1",
                lastModifiedDate: "2017-11-08 07:55:30"
              },
              {
                name: "BA_BACNET_IP.dll",
                platform: "dll",
                edition: "5.0.0.1",
                lastModifiedDate: "2019-02-19 03:45:30"
              },
              {
                name: "BA_BACNET_IP.xt",
                platform: "xt",
                edition: "",
                lastModifiedDate: "2020-02-22 08:47:32"
              }
            ]
          },
          passType: "串口",
          sata: "COM01",
          baudRate: "9600",
          dataBits: "8",
          checkBits: "无校验",
          stopBits: "1",
          ip: "192.168.0.253",
          port: "50001",
          bindingIp: "192.168.200.161",
          otherParams: {
            scanDelay: false,
            delayTime: 100,
            linkReset: false,
            linkNoDataTime: 60,
            faultDiagnosis: false,
            faultNoDataTime: 60,
            faultShooting: "1",
            packetScanning: "1",
            alternatePass: false,
            passType: "串口",
            sata: "COM01",
            baudRate: "9600",
            dataBits: "8",
            checkBits: "无校验",
            stopBits: "1",
            ip: "192.168.0.253",
            port: "50001"
          },
          delayTime: 10,
          dataTags: []
        };
      } else {
        this.formEquipment = {
          equipmentName: "D1",
          equipmentDescribe: "设备1",
          userParam: "",
          MODBUSAdd: "1",
          searchNum: 32,
          singleRegister: true,
          multiRegister: true,
          correspondingValue: "FF00",
          subCorrespondingValue: "0000",
          doubleByteCheck: true,
          otherParams: {
            delayTime: 3000,
            failedTryAgain: false,
            failedTryTimes: 1,
            faultDiagnosis: false,
            continuousQueryFailed: 5,
            noReceivedLongTime: 120,
            faultDataProcess: "保持之前值，质量戳为GOOD",
            faultScanProcess: "正常扫描",
            queryPeriod: 30,
            equipmentFactor: false,
            factorR1: "1.000",
            factorR2: "1.000"
          },
          dataTags: []
        };
      }
    },
    // 回调：新增 通道/设备
    itemAdd () {
      this.level === 1 && this.$refs.formPass.validate(valid => {
        valid && this.$emit("item-add", this.formPass);
      });
      this.level === 2 && this.$refs.formEquipment.validate(valid => {
        valid && this.$emit("item-add", this.formEquipment);
      });
    },
    // 复制
    copyItems () {
      this.dialogCopyVisible = true;
      this.dialogCopyTitle = `${this.level === 1 ? "通道" : "设备"}复制（采集）-创建多个${this.level === 1 ? "通道" : "设备"}`;
      /* 选出[采集服务/数据服务]下可复制的[通道/设备] */
      const passSelectList = []; // 空数组：可复制的通道
      const equipmentSelectList = []; // 空数组：可复制的设备
      this.treeData.forEach(service => {
        service.children.forEach(pass => {
          service.id === this.id && this.passList.forEach(_pass => { // 选出通道
            pass.id === _pass.id && passSelectList.push(_pass);
          });
          pass.id === this.id && pass.children.forEach(equipment => { // 选出设备
            this.equipmentList.forEach(_equipment => {
              equipment.id === _equipment.id && equipmentSelectList.push(_equipment);
            });
          });
        });
      });
      // console.log(passSelectList);
      // console.log(equipmentSelectList);
      this.dialogCopyData = this.level === 1 ? passSelectList : equipmentSelectList;
    },
    // 复制 - 获取选中的数据
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 回调：复制 通道/设备
    multipleSubmit (type) {
      if (type === "cancel") {
        this.$refs.multipleTable.clearSelection();
        this.dialogCopyVisible = false;
      } else {
        this.$emit("items-copy", this.multipleSelection);
        this.dialogCopyVisible = false;
      }
    },
    // 回调：删除 通道/设备
    itemDelete () {
      this.$emit("item-delete", this.formPass);
    },
    // 点击按钮 - 本地运行 - 调用子组件事件
    localOperate () {
      this.$confirm("执行该操作，WINDOWS系统下会运行采集程序，确定运行吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.$refs.remoteMonitor.localOperate();
      }).catch(() => { });
    },
    // 点击按钮 - 其他参数[通道] - 调用子组件事件
    setParamsPass () {
      this.$refs.passParams.setParams();
    },
    // 点击按钮 - 选择插件 - 调用子组件事件
    pluginSelect () {
      this.$refs.pluginSelect.pluginSelect();
    },
    // 点击树节点 - 选择插件
    pluginClick (param) {
      // console.log(param);
      const { level } = param;
      level === 2 && (this.formPass.plugin = param);
      console.log(this.formPass);
    },
    // 点击按钮 - 其他参数[设备] - 调用子组件事件
    setParamsEquipment () {
      this.$refs.equipmentParams.setParams();
    },
    // 点击按钮 - 工程管理 - 调用子组件事件
    factoryManage () {
      this.$refs.factoryManage.factoryManage();
    },
    // 回调：工程管理选择工程
    factorySelect (param) {
      this.$emit("factory-select", param);
    },
    // 点击按钮 - 远程监视 - 调用子组件事件
    remoteMonitor () {
      this.$refs.remoteMonitor.ipSelect();
    },
    // 点击按钮 - 需绑定本地IP
    bindingIP () {
      this.bindingIPVisible = true;
      this.bindingIpOrg = JSON.parse(JSON.stringify(this.formPass.bindingIp)); // 深拷贝，取消时还原数据用
    },
    // 回调 - 保存
    itemSubmit () {
      this.$emit("item-submit", this.level);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header /deep/ {
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-collapse {
    &-item__header {
      font-weight: bold;
    }

    &-item__content {
      padding-bottom: 10px;
    }
    .collapse-content {
      margin-bottom: 10px;
    }
  }
  // 配置dialog
  .dispose-dialog {
    .el-dialog {
      min-width: 1000px;
      .el-row:last-child {
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
  }
  // 参数dialog
  .params-dialog {
    .el-dialog {
      min-width: 1000px;
    }
    .params-dialog-row:not(:last-child) {
      margin-bottom: 10px;
      .el-checkbox {
        margin-bottom: 10px;
      }
    }
    &-row {
      &-div {
        margin-left: 24px;
      }
      &-select {
        margin-bottom: 10px;
      }
    }
  }
  // 复制dialog
  .copy-dialog {
    .el-dialog {
      max-width: 700px;
      min-width: 500px;
    }
  }
  // 插件dialog
  .plugin-dialog {
    .el-dialog {
      min-width: 1000px;

      .el-form {
        margin: 10px 20px;

        &-item {
          margin-bottom: 10px;
        }
      }
    }
  }
  // 工程管理dialog
  .factory-manage {
    .el-dialog {
      width: 320px;
      min-height: 500px;
      .btns {
        margin-bottom: 20px;
      }
    }
  }
  // 工程增/删dialog
  .factory-operate {
    .el-dialog {
      width: 400px;
    }
  }
  // ip选择dialog
  .ip-select {
    .el-dialog {
      min-width: 1000px;
      min-height: 500px;
      .el-table {
        tr {
          cursor: pointer;
          .el-icon-check {
            color: #67c23a;
            border: 1px solid #67c23a;
          }
          .el-icon-close {
            color: #f56c6c;
            border: 1px solid #f56c6c;
          }
        }
      }
    }
  }
  // 监视dialog
  .monitor-dialog {
    .el-dialog {
      width: 80%;
      min-width: 1200px;
      .el-form {
        margin: 10px 20px;

        .el-table {
          min-height: 500px;
          .cell {
            padding: 0 5px;
          }
        }
      }
    }
  }
  // dialog - 绑定本地ip
  .bind-dialog {
    .el-dialog {
      width: 450px;
    }
  }
}
</style>
