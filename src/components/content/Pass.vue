<template>
  <div class="content">

    <!-- 采集服务 -->
    <el-form v-if="id.slice(0,1)==='1'"
             :model="formPass"
             ref="formPass"
             :rules="formPassRule"
             label-position="left">

      <el-row>
        <el-col style="width:420px">
          <el-form-item label-width="105px"
                        label="名称(英文)："
                        prop="passName">
            <el-input v-model="formPass.passName"></el-input>
          </el-form-item>
        </el-col>
        <el-col style="width:380px">
          <el-form-item label-width="65px"
                        label="描述："
                        prop="passDescribe">
            <el-input v-model="formPass.passDescribe"></el-input>
          </el-form-item>
        </el-col>
        <el-button style="margin:0 0 20px 20px"
                   @click="setParams">其他参数</el-button>
      </el-row>

      <el-row>
        <el-col style="width:358px">
          <el-form-item label-width="55px"
                        label="厂家：">
            <el-input disabled
                      v-model="formPass.plugin.factory"></el-input>
          </el-form-item>
        </el-col>
        <el-col style="width:358px">
          <el-form-item label-width="55px"
                        label="描述：">
            <el-input disabled
                      v-model="formPass.plugin.describe"></el-input>
          </el-form-item>
        </el-col>
        <el-button style="margin:0 0 20px 20px"
                   @click="pluginSelect">选择插件</el-button>
        <el-button style="margin-bottom:20px">帮助</el-button>
      </el-row>

      <el-row>
        <el-col style="width:940px">
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

      <el-row v-if="formPass.passType==='串口'">
        <el-col style="width:160px">
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
        <el-col style="width:180px">
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

      <el-row v-if="formPass.passType!=='串口' && formPass.passType!=='虚拟端口'">
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

    </el-form>

    <!-- 数据服务 -->
    <el-tabs v-else
             v-model="activeName">

      <!-- 配置参数 -->
      <el-tab-pane name="first">
        <span slot="label">
          <i class="el-icon-setting"></i> 配置参数
        </span>
        <el-form :model="formPass"
                 ref="formPass"
                 :rules="formPassRule"
                 label-position="left">

          <el-row>
            <el-col style="width:420px">
              <el-form-item label-width="105px"
                            label="名称(英文)："
                            prop="passName">
                <el-input v-model="formPass.passName"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="width:380px">
              <el-form-item label-width="65px"
                            label="描述："
                            prop="passDescribe">
                <el-input v-model="formPass.passDescribe"></el-input>
              </el-form-item>
            </el-col>
            <el-button style="margin:0 0 20px 20px"
                       @click="setParams">其他参数</el-button>
          </el-row>

          <el-row>
            <el-col style="width:358px">
              <el-form-item label-width="55px"
                            label="厂家：">
                <el-input disabled
                          v-model="formPass.plugin.factory"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="width:358px">
              <el-form-item label-width="55px"
                            label="描述：">
                <el-input disabled
                          v-model="formPass.plugin.describe"></el-input>
              </el-form-item>
            </el-col>
            <el-button style="margin:0 0 20px 20px"
                       @click="pluginSelect">选择插件</el-button>
            <el-button style="margin-bottom:20px">帮助</el-button>
          </el-row>

          <el-row>
            <el-col style="width:940px">
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

          <el-row v-if="formPass.passType==='串口'">
            <el-col style="width:160px">
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
            <el-col style="width:180px">
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

          <el-row v-if="formPass.passType!=='串口' && formPass.passType!=='虚拟端口'">
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
            <el-button v-if="formPass.passType==='TCP服务端'"
                       style="margin-left:20px">允许客户端接入列表</el-button>
          </el-row>

          <el-collapse v-model="activeNames">
            <el-collapse-item title="基本参数"
                              name="1">
              <div>延迟回复：{{formPass.delayTime}}</div>
            </el-collapse-item>
          </el-collapse>

        </el-form>
      </el-tab-pane>

      <!-- 数据标签 -->
      <el-tab-pane name="second">
        <span slot="label">
          <i class="el-icon-edit-outline"></i> 数据标签
        </span>

        <!-- table - 数据标签 · 通道 -->
        <pass-tags :id="id"
                   :tree-data="treeData"
                   :pass-list="passList"
                   :equipment-list="equipmentList"
                   :data-tags-org="formPass.dataTags"></pass-tags>

      </el-tab-pane>

    </el-tabs>

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

    <!-- dialog - 选择插件 -->
    <plugin-select ref="pluginSelect"
                   :id="id"
                   :form-pass="formPass"
                   :plugin-list="pluginList"
                   @plugin-click="pluginClick"></plugin-select>

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
import PassTags from "@/components/table/passTags"; // 组件：数据标签 - 通道

export default {
  components: { PluginSelect, PassParams, PassTags },
  props: {
    // 树数据 - 传递给tagSelect子组件选择标签用
    treeData: {
      type: Array,
      default: () => []
    },
    // 设备列表 - 传递给tagSelect子组件选择标签用
    equipmentList: {
      type: Array,
      default: () => []
    },
    // 左侧树被选择的id
    id: {
      type: String
    },
    // 通道列表
    passList: {
      type: Array,
      default: () => []
    },
    // 插件列表
    pluginList: {
      type: Array,
      default: () => []
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
      formPass: {}, // 表单数据
      formPassRule: { // 表单验证
        passName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        passDescribe: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ]
      },
      activeName: "first", // tabs选中的标签
      activeNames: ["1"], // 手风琴展开的标签
      /* dialog */
      bindingIPVisible: false // IP地址框 - 显示与否
    };
  },
  created () {
    this.getData();
  },
  methods: {
    // 获取数据
    getData () {
      this.passList.forEach((pass, i) => {
        pass.id === this.id &&
          (this.formPass = JSON.parse(JSON.stringify(this.passList[i])));
      });
      this.activeName = "first"; // tab重置
    },
    // 点击按钮 - 其他参数 - 调用子组件事件
    setParams () {
      this.$refs.passParams.setParams();
    },
    // 点击按钮 - 选择插件 - 调用子组件事件
    pluginSelect () {
      this.$refs.pluginSelect.pluginSelect();
    },
    // 点击树节点 - 插件
    pluginClick (param) {
      // console.log(param);
      const { level } = param;
      level === 2 && (this.formPass.plugin = param);
      // console.log(this.formPass);
    },
    // 点击按钮 - 需绑定本地IP
    bindingIP () {
      this.bindingIPVisible = true;
      this.bindingIpOrg = JSON.parse(JSON.stringify(this.formPass.bindingIp)); // 深拷贝，取消时还原数据用
    },
    // 保存通道
    passSubmit () {
      this.$refs.formPass.validate(valid => {
        if (valid) {
          this.passList.forEach((pass, i) => { // 更新通道列表
            pass.id === this.id &&
              this.$set(this.passList, i, this.formPass);
          });
          this.treeData.forEach(service => { // 更新树
            service.children.forEach((pass, i) => {
              pass.id === this.id &&
                this.$set(pass, "text",
                  `${this.formPass.passName}[${this.formPass.passDescribe}]`
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
      // console.log(this.formPass);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/content.scss';
</style>
