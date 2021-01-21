<template>
  <div class="content"
       v-if="!contentLoading">

    <!-- 采集服务 -->
    <el-form v-if="serviceType===0"
             :model="formPass"
             ref="formPass"
             :rules="formPassRule"
             label-position="left">

      <el-row>
        <el-col style="width:420px">
          <el-form-item label-width="105px"
                        label="名称(英文)："
                        prop="pipelineName">
            <el-input v-model="formPass.pipelineName"></el-input>
          </el-form-item>
        </el-col>
        <el-col style="width:380px">
          <el-form-item label-width="65px"
                        label="描述："
                        prop="description">
            <el-input v-model="formPass.description"></el-input>
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
                      v-model="formPass.pluginFactory"></el-input>
          </el-form-item>
        </el-col>
        <el-col style="width:358px">
          <el-form-item label-width="55px"
                        label="描述：">
            <el-input disabled
                      v-model="formPass.pluginDescribe"></el-input>
          </el-form-item>
        </el-col>
        <el-button style="margin:0 0 20px 20px"
                   @click="pluginSelect">选择插件</el-button>
        <el-button style="margin-bottom:20px">帮助</el-button>
      </el-row>

      <!-- <el-row>
        <el-col style="width:940px">
          <el-form-item label-width="55px"
                        label="路径：">
            <el-input disabled
                      v-model="formPass.plugin.path"></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->

      <el-row>
        <el-col>
          <el-form-item label-width="85px"
                        label="通道类型："
                        prop="channelId">
            <el-select v-model="formPass.channelId"
                       placeholder="请选择">
              <el-option v-for="item in passTypeListUse"
                         :key="item.id"
                         :label="item.value"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 串口 -->
      <el-row v-show="formPass.channelId===0">
        <el-col style="width:150px">
          <el-form-item label-width="55px"
                        label="串口："
                        prop="serial">
            <el-select v-model="formPass.serial"
                       placeholder="请选择">
              <el-option v-for="item in collectChannelList[0]['serialList']"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col style="width:180px">
          <el-form-item label-width="75px"
                        label="波特率："
                        prop="bps">
            <el-select v-model="formPass.bps"
                       placeholder="请选择">
              <el-option v-for="item in collectChannelList[0]['baudRateList']"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col style="width:160px">
          <el-form-item label-width="75px"
                        label="数据位："
                        prop="dataBit">
            <el-select v-model="formPass.dataBit"
                       placeholder="请选择">
              <el-option v-for="item in collectChannelList[0]['dataBitsList']"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col style="width:200px">
          <el-form-item label-width="75px"
                        label="校验位："
                        prop="checkBit">
            <el-select v-model="formPass.checkBit"
                       placeholder="请选择">
              <el-option v-for="item in collectChannelList[0]['checkBitList']"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col style="width:170px">
          <el-form-item label-width="75px"
                        label="停止位："
                        prop="stopBit">
            <el-select v-model="formPass.stopBit"
                       placeholder="请选择">
              <el-option v-for="item in collectChannelList[0]['stopBitList']"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- TCP客户端 -->
      <el-row v-show="formPass.channelId===1">
        <el-col style="width:300px">
          <el-form-item label-width="70px"
                        label="远程IP："
                        prop="ip">
            <el-input v-model="formPass.ip"></el-input>
          </el-form-item>
        </el-col>
        <el-col style="width:300px">
          <el-form-item label-width="85px"
                        label="远程端口："
                        prop="port">
            <el-input v-model="formPass.port"></el-input>
          </el-form-item>
        </el-col>
        <el-button style="margin-left:20px"
                   @click="bindingIP">需要绑定本地IP</el-button>
      </el-row>

      <!-- TCP服务端 -->
      <el-row v-show="formPass.channelId===2">
        <el-col style="width:300px">
          <el-form-item label-width="70px"
                        label="本地IP："
                        prop="ip">
            <el-input v-model="formPass.ip"></el-input>
          </el-form-item>
        </el-col>
        <el-col style="width:300px">
          <el-form-item label-width="85px"
                        label="本地端口："
                        prop="port">
            <el-input v-model="formPass.port"></el-input>
          </el-form-item>
        </el-col>
        <el-button v-show="serviceType===1"
                   style="margin-left:20px"
                   @click="bindingIP">允许客户端接入列表</el-button>
      </el-row>

      <!-- UPD -->
      <el-row v-show="formPass.channelId===3">
        <el-col style="width:300px">
          <el-form-item label-width="70px"
                        label="本地IP："
                        prop="ip">
            <el-input v-model="formPass.ip"></el-input>
          </el-form-item>
        </el-col>
        <el-col style="width:300px">
          <el-form-item label-width="85px"
                        label="本地端口："
                        prop="port">
            <el-input v-model="formPass.port"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- collapse -->
      <el-collapse v-if="formPass.outerParams&&formPass.outerParams.length!==0"
                   accordion
                   v-model="activeNames">
        <el-collapse-item v-for="(param,i) in formPass.outerParams"
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

    </el-form>

    <!-- 数据服务 -->
    <el-tabs v-if="serviceType===1"
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
                            prop="pipelineName">
                <el-input v-model="formPass.pipelineName"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="width:380px">
              <el-form-item label-width="65px"
                            label="描述："
                            prop="description">
                <el-input v-model="formPass.description"></el-input>
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
                          v-model="formPass.pluginFactory"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="width:358px">
              <el-form-item label-width="55px"
                            label="描述：">
                <el-input disabled
                          v-model="formPass.pluginDescribe"></el-input>
              </el-form-item>
            </el-col>
            <el-button style="margin:0 0 20px 20px"
                       @click="pluginSelect">选择插件</el-button>
            <el-button style="margin-bottom:20px">帮助</el-button>
          </el-row>

          <!-- <el-row>
            <el-col style="width:940px">
              <el-form-item label-width="55px"
                            label="路径：">
                <el-input disabled
                          v-model="formPass.plugin.path"></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->

          <el-row>
            <el-col>
              <el-form-item label-width="85px"
                            label="通道类型："
                            prop="channelId">
                <el-select v-model="formPass.channelId"
                           placeholder="请选择">
                  <el-option v-for="item in passTypeListUse"
                             :key="item.id"
                             :label="item.value"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 串口 -->
          <el-row v-show="formPass.channelId===0">
            <el-col style="width:150px">
              <el-form-item label-width="55px"
                            label="串口："
                            prop="serial">
                <el-select v-model="formPass.serial"
                           placeholder="请选择">
                  <el-option v-for="item in collectChannelList[0]['serialList']"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="width:180px">
              <el-form-item label-width="75px"
                            label="波特率："
                            prop="bps">
                <el-select v-model="formPass.bps"
                           placeholder="请选择">
                  <el-option v-for="item in collectChannelList[0]['baudRateList']"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="width:160px">
              <el-form-item label-width="75px"
                            label="数据位："
                            prop="dataBit">
                <el-select v-model="formPass.dataBit"
                           placeholder="请选择">
                  <el-option v-for="item in collectChannelList[0]['dataBitsList']"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="width:200px">
              <el-form-item label-width="75px"
                            label="校验位："
                            prop="checkBit">
                <el-select v-model="formPass.checkBit"
                           placeholder="请选择">
                  <el-option v-for="item in collectChannelList[0]['checkBitList']"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="width:170px">
              <el-form-item label-width="75px"
                            label="停止位："
                            prop="stopBit">
                <el-select v-model="formPass.stopBit"
                           placeholder="请选择">
                  <el-option v-for="item in collectChannelList[0]['stopBitList']"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- TCP客户端 -->
          <el-row v-show="formPass.channelId===1">
            <el-col style="width:300px">
              <el-form-item label-width="70px"
                            label="远程IP："
                            prop="ip">
                <el-input v-model="formPass.ip"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="width:300px">
              <el-form-item label-width="85px"
                            label="远程端口："
                            prop="port">
                <el-input v-model="formPass.port"></el-input>
              </el-form-item>
            </el-col>
            <el-button style="margin-left:20px"
                       @click="bindingIP">需要绑定本地IP</el-button>
          </el-row>

          <!-- TCP服务端 -->
          <el-row v-show="formPass.channelId===2">
            <el-col style="width:300px">
              <el-form-item label-width="70px"
                            label="本地IP："
                            prop="ip">
                <el-input v-model="formPass.ip"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="width:300px">
              <el-form-item label-width="85px"
                            label="本地端口："
                            prop="port">
                <el-input v-model="formPass.port"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-button v-show="serviceType===1"
                       style="margin-left:20px"
                       @click="bindingIP">允许客户端接入列表</el-button> -->
          </el-row>

          <!-- UPD -->
          <el-row v-show="formPass.channelId===3">
            <el-col style="width:300px">
              <el-form-item label-width="70px"
                            label="本地IP："
                            prop="ip">
                <el-input v-model="formPass.ip"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="width:300px">
              <el-form-item label-width="85px"
                            label="本地端口："
                            prop="port">
                <el-input v-model="formPass.port"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-collapse v-if="formPass.outerParams&&formPass.outerParams.length!==0"
                       accordion
                       v-model="activeNames">
            <el-collapse-item v-for="(param,i) in formPass.outerParams"
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

        </el-form>
      </el-tab-pane>

      <!-- 数据标签 -->
      <el-tab-pane name="second">
        <span slot="label">
          <i class="el-icon-edit-outline"></i> 数据标签
        </span>

        <!-- table - 数据标签 · 通道 -->
        <pass-tags :id="id"
                   :service-type="serviceType"
                   :tree-data="treeData"
                   :pass-list="passList"
                   :equipment-list="equipmentList"
                   :data-tags-org="formPass.dataTags"
                   :label-outer-params="labelOuterParams"></pass-tags>

      </el-tab-pane>

    </el-tabs>

    <!-- dialog - 其他参数 · 通道 -->
    <pass-params ref="passParams"
                 :form-pass="formPass"
                 :service-type="serviceType"
                 :pass-type-list="passTypeList"
                 :collect-channel-list="collectChannelList"></pass-params>

    <!-- dialog - 选择插件 -->
    <plugin-select ref="pluginSelect"
                   :service-type="serviceType"
                   :form-pass="formPass"
                   :plugin-list="pluginList"
                   @plugin-click="pluginClick"
                   @plugin-submit="pluginSubmit"></plugin-select>

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
/* components */
import PluginSelect from "@/components/dialog/pluginSelect"; // 组件：选择插件
import PassParams from "@/components/dialog/passParams"; // 组件：其他参数 - 通道
import PassTags from "@/components/table/passTags"; // 组件：数据标签 - 通道

export default {
  components: { PluginSelect, PassParams, PassTags },
  props: {
    // 表单数据 - 仅接口
    formPassOrg: {
      type: Object
    },
    // 0/1 采集服务/数据服务
    serviceType: {
      type: Number,
      default: 0
    },
    // 串口总数据
    collectChannelList: {
      type: Array
    },
    // 通道类型
    passTypeList: {
      type: Array
    },
    // 插件列表
    pluginList: {
      type: Array,
      default: () => []
    },
    // 标签的动态列
    labelOuterParams: {
      type: Array,
      default: () => []
    },
    // 通道/设备loading
    contentLoading: {
      type: Boolean,
      default: false
    },
    // 树数据 - 传递给tagSelect子组件选择标签用 - 仅mock
    treeData: {
      type: Array,
      default: () => []
    },
    // 设备列表 - 传递给tagSelect子组件选择标签用 - 仅mock
    equipmentList: {
      type: Array,
      default: () => []
    },
    // 左侧树被选择的id - 仅mock
    id: {
      type: String
    },
    // 通道列表 - 仅mock
    passList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      formPass: { // 表单数据
        passParams: {}
      },
      formPassRule: { // 表单验证
        pipelineName: [
          { required: true, message: "请输入名称", trigger: "change" }
        ],
        description: [
          { required: true, message: "请输入描述", trigger: "change" }
        ],
        pluginFactory: [
          { required: true, message: "请选择插件", trigger: "change" }
        ],
        pluginDescribe: [
          { required: true, message: "请选择插件", trigger: "change" }
        ]
      },
      passTypeListUse: [], // 可使用的通道类型列表
      activeName: "first", // tabs选中的标签
      activeNames: ["0"], // 手风琴展开的标签
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
      if (this.isMock) { // mock数据
        this.passList.forEach((pass, i) => {
          pass.id === this.id &&
            (this.formPass = JSON.parse(JSON.stringify(this.passList[i])));
        });
        this.activeName = "first"; // tab重置
      } else {
        if (this.formPassOrg.name) {
          // console.log(this.formPassOrg);
          this.activeName = "first"; // tab重置
          /* 1.outerParams */
          let otherParamsUse = this.outerParamsHanding(this.formPassOrg.otherParams);
          let outerParamsUse = this.outerParamsHanding(this.formPassOrg.outerParams);
          /* 2.表单数据 */
          this.formPass = {
            idStr: this.formPassOrg.idStr, // 通道id
            pipelineName: this.formPassOrg.name, // 通道名称
            description: this.formPassOrg.description, // 通道描述
            plugin: {}, // 选择的插件数据
            otherParams: otherParamsUse, // 插件其他参数 - 标签时才用
            outerParams: outerParamsUse, // 插件外层参数 - 通道collapse用
            pluginFactory: this.formPassOrg.plush.manufacturers, // 插件厂家
            pluginDescribe: this.formPassOrg.plush.description, // 插件描述
            channelId: this.formPassOrg.channelId, // 通道类型id
            serial: this.formPassOrg.channel ? (this.formPassOrg.channel.serial || 0) : 0, // 串口-串口
            bps: this.formPassOrg.channel ? (this.formPassOrg.channel.bps || 0) : 0, // 波特率-串口
            dataBit: this.formPassOrg.channel ? (this.formPassOrg.channel.dataBit || 0) : 0, // 数据位-串口
            checkBit: this.formPassOrg.channel ? (this.formPassOrg.channel.checkBit || 0) : 0, // 校验位-串口
            stopBit: this.formPassOrg.channel ? (this.formPassOrg.channel.stopBit || 0) : 0, // 停止位-串口
            ip: this.formPassOrg.channel ? (this.formPassOrg.channel.ip) : 0, // 远程IP-TCP客户端 or 本地IP-TCP服务端、UDP
            port: this.formPassOrg.channel ? this.formPassOrg.channel.port : null, // 远程端口-TCP客户端 or 本地端口服务端、UDP
            localIp: this.formPassOrg.channel ? this.formPassOrg.channel.localIp : null, // 需绑定本地IP-TCP客户端
            ipList: this.formPassOrg.channel ? this.formPassOrg.channel.ipList : null, // 允许客户端接入列表-TCP服务端
            passParams: {
              delayIs: !!this.formPassOrg.delay, // 是否diabled - 延迟时间
              delay: this.formPassOrg.delay, // 延迟时间
              resetIs: !!this.formPassOrg.reset, // 是否diabled - 链路复位机制
              reset: this.formPassOrg.reset, // 链路复位机制
              alertIs: !!this.formPassOrg.alert, // 是否diabled - 故障诊断
              alert: this.formPassOrg.alert, // 故障诊断
              bakChannelIs: !!this.formPassOrg.bakChannelId, // 是否diabled - 备用通道
              bakChannelId: this.formPassOrg.bakChannelId, // 备用通道：类型id
              bakSerial: this.formPassOrg.bakChannel ? (this.formPassOrg.bakChannel.serial || 0) : 0, // 备用通道：串口-串口
              bakBps: this.formPassOrg.bakChannel ? (this.formPassOrg.bakChannel.bps || 0) : 0, // 备用通道：波特率-串口
              bakDataBit: this.formPassOrg.bakChannel ? (this.formPassOrg.bakChannel.dataBit || 0) : 0, // 备用通道：数据位-串口
              bakCheckBit: this.formPassOrg.bakChannel ? (this.formPassOrg.bakChannel.checkBit || 0) : 0, // 备用通道：校验位-串口
              bakStopBit: this.formPassOrg.bakChannel ? (this.formPassOrg.bakChannel.stopBit || 0) : 0, // 备用通道：停止位-串口
              bakIp: this.formPassOrg.bakChannel ? this.formPassOrg.bakChannel.ip : null, // 备用通道：远程IP-TCP客户端 or 本地IP-TCP服务端、UDP
              bakPort: this.formPassOrg.bakChannel ? this.formPassOrg.bakChannel.port : null // 备用通道：远程端口-TCP客户端 or 本地端口服务端、UDP
            } // 其他参数
          };
          /* 3.通道类型select框 */
          const collectChannelList = this.formPassOrg.plush.collectChannelList
            ? this.formPassOrg.plush.collectChannelList : this.formPassOrg.plush.dataChannelList;
          this.passTypeListUse =
            collectChannelList ? JSON.parse(JSON.stringify(this.passTypeList)).filter(type =>
              collectChannelList.indexOf(type.id) > -1) : [];
          // console.log(this.formPass);
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
      if (level === 2) {
        if (this.isMock) { // mock数据
          this.formPass.plugin = param;
          console.log(this.formPass);
        } else { // 接口数据
          // console.log(param);
          localStorage.setItem("plugin-id", param.id);
          localStorage.setItem("plugin-teamName", param.typeName);
          this.formPass.plugin = {
            name: param.name,
            describe: param.description,
            classification: param.typeName,
            factory: param.manufacturers,
            plugins: param.submodule,
            id: param.id,
            otherParams: param.collectionPipeOtherParam
              ? param.collectionPipeOtherParam : param.dataPipeOtherParams,
            outerParams: param.collectionPipeOuterParam
              ? param.collectionPipeOuterParam : param.dataPipeOuterParams,
            collectChannelList: param.collectChannelList
              ? param.collectChannelList : param.dataChannelList,
            collectChannelDefaultParam: param.collectChannelDefaultParam
              ? param.collectChannelDefaultParam : param.dataChannelDefaultParams
          };
          // console.log(this.formPass);
        }
      }
    },
    // 确认插件 - 仅接口
    pluginSubmit () {
      /* 根据将插件选择的数据，更新通道配置表单 */
      this.formPass.pluginFactory = this.formPass.plugin.factory; // 厂家
      this.formPass.pluginDescribe = this.formPass.plugin.describe; // （插件）描述
      this.passTypeListUse = // 通道类型select框
        this.formPass.plugin.collectChannelList
          ? JSON.parse(JSON.stringify(this.passTypeList)).filter(type =>
            this.formPass.plugin.collectChannelList.indexOf(type.id) > -1) : [];
      // // console.log(this.passTypeListUse);
      this.formPass.channelId = this.formPass.plugin.collectChannelDefaultParam; // 通道类型默认值
      this.formPass.outerParams = this.outerParamsHanding(this.formPass.plugin.outerParams); // outerParams数据处理
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
          if (this.isMock) { // mock数据
            this.passList.forEach((pass, i) => { // 更新通道列表
              pass.id === this.id &&
                this.$set(this.passList, i, this.formPass);
            });
            this.treeData.forEach(service => { // 更新树
              service.children.forEach((pass, i) => {
                pass.id === this.id &&
                  this.$set(pass, "text",
                    `${this.formPass.pipelineName}[${this.formPass.description}]`
                  );
              });
            });
            this.$message({
              message: "保存成功",
              type: "success",
              duration: "1000"
            });
          } else { // 接口数据
            this.$emit("item-update", this.formPass);
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
      // console.log(val);
      this.isMock && this.getData();
      // console.log(this.formPass);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/content.scss';
</style>
