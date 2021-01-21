<template>
  <div class="table-component"
       v-if="!contentLoading">

    <!-- btns -->
    <el-row style="margin-bottom:20px">
      <el-select v-model="dataTypeSelect"
                 placeholder="请选择"
                 style="width:150px;margin-right:10px"
                 @change="isMock?refreshData():getData()">
        <el-option v-for="item in dataTypeList"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary"
                 size="small"
                 plain
                 @click="insertTag">新增</el-button>
      <!-- <el-button type="success"
                 size="small"
                 plain
                 @click="loadTags">加载</el-button> -->
      <el-button type="danger"
                 size="small"
                 plain
                 @click="deleteTags">删除</el-button>
      <!-- <el-button type="info"
                 size="small"
                 plain
                 :loading="downloadLoading"
                 @click="downloadTable">导出</el-button> -->
      <!-- <el-button type="info"
                 size="small"
                 plain
                 @click="uploadTable">导入</el-button> -->
      <input ref="excel-upload-input"
             class="excel-upload-input"
             type="file"
             accept=".xlsx, .xls"
             @change="handleClick">
    </el-row>

    <!-- table -->
    <el-table :data="dataTags"
              border
              current-row-key
              empty-text="暂无标签"
              :max-height="tableMaxHeight"
              @selection-change="handleSelectionChange">

      <el-table-column type="selection"
                       width="30">
      </el-table-column>
      <el-table-column prop="index"
                       label="序号"
                       width="40">
      </el-table-column>

      <!-- 循环列 -->
      <el-table-column v-for="(column, index) in dataColumns"
                       :key="index"
                       :prop="column.prop"
                       :label="column.label"
                       :width="column.width?column.width:''"
                       :min-width="column.minWidth?column.minWidth:''">
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作"
                       min-width="160">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="mini"
                     plain
                     icon="el-icon-edit"
                     @click="editTag(scope.row)"></el-button>
          <el-button type="danger"
                     size="mini"
                     plain
                     icon="el-icon-delete"
                     style="margin-left:3px"
                     @click="deleteTag(scope.row)"></el-button>
          <!-- <el-button type="success"
                     size="mini"
                     plain
                     icon="el-icon-top"
                     style="margin-left:3px"
                     :disabled="scope.row.index===1"
                     @click="tagToggle(scope.row.index-1,'up')"></el-button> -->
          <!-- <el-button type="success"
                     size="mini"
                     plain
                     icon="el-icon-bottom"
                     style="margin-left:3px"
                     :disabled="scope.row.index===dataTags.length"
                     @click="tagToggle(scope.row.index-1,'down')"></el-button> -->
        </template>
      </el-table-column>

    </el-table>

    <!-- dialog · 新增/修改 -->
    <el-dialog class="tag-dialog"
               :title="dialogTitle"
               :visible.sync="dialogVisible">

      <el-form ref="dialogForm"
               :model="formData"
               :rules="formRule"
               label-position="left">

        <el-row :gutter="0">
          <el-col :span="9">
            <el-form-item label-width="65px"
                          label="名称："
                          prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label-width="65px"
                          label="描述："
                          prop="description">
              <el-input v-model="formData.description"></el-input>
            </el-form-item>
          </el-col>
          <el-button style="margin:0 0 20px 10px"
                     @click="setParams">其他参数</el-button>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="7">
            <el-form-item label="数据类型："
                          prop="type">
              <el-select v-model="formData.type"
                         placeholder="请选择"
                         style="width:130px">
                <el-option v-for="item in dataTypeList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"
                           :disabled="item.value===null">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="读写方向："
                          prop="rw">
              <el-select v-model="formData.rw"
                         placeholder="请选择"
                         style="width:130px">
                <el-option v-for="item in directionList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label-width="95px"
                          label="采集周期："
                          prop="cycle">
              <el-input v-model="formData.cycle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- IO标签id -->
        <el-row v-if="serviceType===1"
                :gutter="0">
          <el-col :span="15">
            <el-form-item label-width="100px"
                          label="IO标签ID："
                          prop="ioLabelId">
              <el-input v-model="formData.ioLabelId"
                        disabled></el-input>
              <!-- style="width:fit-content" -->
            </el-form-item>
          </el-col>
          <el-button style="margin:0 0 20px 10px"
                     @click="tagSelect">选择标签</el-button>
        </el-row>

        <el-row>
          <el-col :span="11"
                  style="margin-bottom:20px;margin-left:0"
                  v-for="(item,_i) in formData.labelOuterParams"
                  :key="_i">
            {{item.showName}}：
            <el-input v-if="item.valueTypeEnum==='文本输入框'"
                      style="width:auto"
                      v-model="item.value"
                      :disabled="paramDisabled(item.disabled)"
                      @input="forceUpdate"></el-input>
            <el-input-number v-if="item.valueTypeEnum==='数字输入框'"
                             style="width:auto"
                             :min="1"
                             v-model="item.value"
                             :disabled="paramDisabled(item.disabled)"
                             @input="forceUpdate"></el-input-number>
            <el-select v-if="item.valueTypeEnum==='选择框'"
                       style="width:auto"
                       v-model="item.value"
                       :disabled="paramDisabled(item.disabled)"
                       @change="forceUpdate">
              <el-option v-for="_item in item.selectTable"
                         :key="_item.value"
                         :label="_item.name"
                         :value="_item.value">
              </el-option>
            </el-select>
            <el-checkbox v-if="item.valueTypeEnum==='单选框'"
                         v-model="item.value"
                         :true-label="1"
                         :false-label="0"
                         :disabled="paramDisabled(item.disabled)"></el-checkbox>
          </el-col>
        </el-row>

      </el-form>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="tagSubmit"
                   type="primary"
                   :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- dialog · 其他参数 -->
    <equipment-tag-params ref="equipmentTagParams"
                          :form-data="formData"
                          :service-type="serviceType"
                          :label-other-params="labelOtherParams"></equipment-tag-params>

    <!-- dialog - 选择标签 -->
    <tag-select ref="tagSelect"
                :id="id"
                :tag-description="tagDescribe"
                :tree-data="treeData"
                :form-data="formData"
                :pass-list="passList"
                :equipment-list="equipmentList"
                :data-type-list="dataTypeList"
                :direction-list="directionList"
                @tag-click="tagClick"></tag-select>

    <!-- dialog - 加载标签 -->
    <!-- <tag-load ref="tagLoad"
              :tree-data="treeData"
              :data-tags="dataTags"
              :pass-list="passList"
              :equipment-list="equipmentList"></tag-load> -->

  </div>
</template>

<script>
/* function */
import { parseTime } from "@/libs/util"; // functions
import {
  getValueByKey, // 根据对象数组某个key的value，查询另一个key的value
  arraySort, // 对象数组根据key排序
  resultCallback // 根据请求的status执行回调函数
} from "@/libs/dataHanding";
import XLSX from "xlsx"; // plugin - excel
/* mockData */
import { passTagColumn, passTagHeader, tagTranslation } from "@/mock/tableColumn";
/* components */
import TagSelect from "@/components/dialog/tagSelect"; // 组件：选择标签
import TagLoad from "@/components/dialog/tagLoad"; // 组件：选择标签
import EquipmentTagParams from "@/components/dialog/equipmentTagParams"; // 组件：标签其他参数
/* api */
import { queryTagList, addTag, updateTag, deleteTag } from "@/api/tag.js"; // 标签

export default {
  components: { TagSelect, TagLoad, EquipmentTagParams },
  props: {
    // 左侧树被选择的id
    id: {
      type: String
    },
    // 0/1 采集服务/数据服务
    serviceType: {
      type: Number,
      default: 0
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
    // 树数据 - 传递给tagSelect子组件选择标签用
    treeData: {
      type: Array,
      default: () => []
    },
    // 通道列表 - 传递给tagSelect子组件选择标签用
    passList: {
      type: Array,
      default: () => []
    },
    // 设备列表 - 传递给tagSelect子组件选择标签用
    equipmentList: {
      type: Array,
      default: () => []
    },
    // 表格数据 - 原始数据 - 仅mock
    dataTagsOrg: {
      type: Array,
      default: () => []
    },
    // 通道/设备loading
    contentLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      /* table */
      dataTags: [], // 表格数据 - 要展示的数据
      dataColumns: [], // 表格列项
      dataTypeList: [ // select - 数据类型
        { label: "全部", value: null },
        { label: "浮点", value: 0 },
        { label: "整型", value: 1 },
        { label: "布尔", value: 2 },
        { label: "字符串", value: 3 },
        { label: "二进制", value: 4 }
      ],
      directionList: [ // select - 读写方向
        { label: "只读", value: 0 },
        { label: "只写", value: 1 },
        { label: "读写", value: 2 }
      ],
      dataTypeSelect: null, // 筛选 - 选中的数据类型
      multipleSelection: [], // 多选 - 选中的数据
      /* dialog */
      dialogVisible: false, // 是否显示
      dialogType: "", // 类型：insert/edit
      dialogTitle: "", // dialog标题
      formData: { // 表单数据
        name: "", // 名称
        description: "", // 描述
        type: 0, // 数据类型
        rw: 0, // 读写方向
        cycle: "1000", // 采集周期
        tagOtherParams: {}, // 其他参数 - 固定
        labelOtherParams: [], // 其他参数 - 动态
        labelOuterParams: [], // 外层参数 - 动态
        ioLabelId: null // io标签id
      },
      formDataOrg: {}, // 表单数据 - 行内原始
      formRule: { // 表单验证
        name: [
          { required: true, message: "请输入名称", trigger: "change" }
        ],
        description: [
          { required: true, message: "请输入描述", trigger: "change" }
        ],
        cycle: [
          { required: true, message: "请输入采集周期", trigger: "change" }
        ],
        ioLabelId: [
          { required: true, message: "请选择IO标签", trigger: "change" }
        ]
      },
      /* loading */
      submitLoading: false, // loading - 提交按钮
      downloadLoading: false, // loading - 导出
      /* props */
      tagDescribe: "",
      /* 动态高度 */
      tableMaxHeight: 0 // 流体表格最大高度
    };
  },
  computed: {
    // 根据动态表单某个key的值，判断另一个key是否disabled
    paramDisabled () {
      return function (obj) {
        if (obj) {
          // console.log(obj);
          const val = getValueByKey(this.formData.labelOuterParams, "paramName", obj.key, "value");
          // console.log(val);
          return obj.values.some(_val => _val === val);
        }
      };
    }
  },
  created () {
    const screenHeight = document.documentElement.clientHeight;
    this.tableMaxHeight = screenHeight - 73 - 20 * 2 - (40 + 15) - (40 + 20) - 40;
    this.getData(); // 表格数据
    this.getColumnData();// 表头列项
  },
  methods: {
    // 获取表格数据
    async getData () {
      if (this.isMock) { // mock数据
        this.dataColumns = JSON.parse(JSON.stringify(passTagColumn));
        this.refreshData();
      } else { // 接口数据
        let dataTags = // 标签列表
          this.serviceType === 0
            ? (await queryTagList({ deviceId: this.id, type: this.dataTypeSelect })).data.data
            : (await queryTagList({ pipelineId: this.id, type: this.dataTypeSelect })).data.data;
        this.dataTags = dataTags.map((tag, i) => {
          this.$set(tag, "index", i + 1); // 序号
          this.$set(tag, "typeTable", // 数据类型
            getValueByKey(this.dataTypeList, "value", tag.type, "label"));
          this.$set(tag, "rwTable", // 读写方向
            getValueByKey(this.directionList, "value", tag.rw, "label"));
          tag.outerParams.forEach(param => { // 动态列
            this.$set(tag, param.paramName, param.value);
          });
          return tag;
        });
        // console.log(this.dataTags);
      }
    },
    // 获取表头数据
    getColumnData () {
      const labelOuterParams = this.dataColumnsHandle(this.labelOuterParams); // 外层参数
      this.dataColumns = JSON.parse(JSON.stringify(passTagColumn)).concat(labelOuterParams); // 表头列项
      // console.log(this.dataColumns);
    },
    // 表头列项数据处理
    dataColumnsHandle (params) {
      params.forEach(param => {
        this.$set(param, "prop", param.paramName);
        this.$set(param, "label",
          param.showName.substr(param.showName.length - 1, 1) === ":"
            ? param.showName.slice(0, param.showName.length - 1) : param.showName
        );
        this.$set(param, "minWidth", 100);
      });
      // console.log(params);
      return params;
    },
    // params数据处理 - 手风琴
    labelParamsHanding (otherParams) {
      let otherParamsUse = [];
      if (otherParams) {
        let outerParamsCopy = JSON.parse(JSON.stringify(otherParams));
        outerParamsCopy.forEach((param, i) => {
          if (i === 0) { // 第一项
            otherParamsUse.push({
              typeName: param.typeName,
              items: [param]
            });
          } else { // 不是第一项
            if (!otherParamsUse.some(
              _param => _param.typeName === param.typeName
            )) { // 数组中没有该类型
              otherParamsUse.push({
                typeName: param.typeName,
                items: [param]
              });
            } else { // 数组中已有该类型
              otherParamsUse.forEach(_param => {
                _param.typeName === param.typeName && (_param.items = _param.items.concat(param));
              });
            }
          }
        });
      }
      // console.log(otherParamsUse);
      return otherParamsUse;
    },
    // params数据处理 - 接口格式
    labelParamsAPI (paramsArr) {
      // console.log(paramsArr);
      let otherParams = [];
      paramsArr &&
        JSON.parse(JSON.stringify(paramsArr)).forEach(param => {
          param.items.forEach(item => {
            otherParams.push({
              paramName: item.paramName,
              value: item.value === true ? 1 : item.value === false ? 0 : item.value
            });
          });
        });
      // console.log(otherParams);
      return otherParams;
    },
    // 数据处理 - 仅mock
    refreshData () {
      if (this.isMock) { // mock数据
        if (this.dataTypeSelect !== "全部") { // 根据条件筛选
          this.dataTags = this.dataTagsOrg.filter(tag =>
            tag.type === this.dataTypeSelect
          );
        } else {
          this.dataTags = this.dataTagsOrg;
        }
        this.dataTags.sort(arraySort("name", "asc")); // 重排序
      }
      this.dataTags.map((tag, i) => { // 追加序列号，从1开始
        this.$set(tag, "index", i + 1);
      });
      console.log(this.dataTags);
    },
    // 新增
    insertTag () {
      this.dialogVisible = true;
      this.dialogType = "insert";
      this.dialogTitle = `${this.serviceType === 0 ? "IO数据标签" : "数据服务标签"}-${this.dialogType === "insert" ? "新建" : "修改"}`;
      this.$nextTick(() => {
        this.$refs.dialogForm.resetFields();
        this.formData = {
          name: "", // 名称
          description: "", // 描述
          type: 0, // 数据类型
          rw: 0, // 读写方向
          cycle: "1000", // 采集周期
          tagOtherParams: { // 其他参数 - 固定
            abs: false, // 取绝对值
            unit: "", // 单位
            deviceRatio: 0, // 设备系数计算
            func: false, // 系数计算
            a: "2.0000", // 倍率
            b: "0.0000", // 基数
            isContrary: false, // 写使用反向系数
            isInsToSam: false, // 量程转换
            insMax: 10, // 量程最大
            insMin: 0, // 量程最小
            samMax: 4096, // 采集值最大
            samMin: 0, // 采集值最小
            dataFilter: false, // 数据有效范围过滤
            max: 100, // 数据最大
            min: 0, // 数据最小
            calc: 0, // 高级运算
            cr1: "", // 参数1
            cr2: "" // 参数2
          },
          labelOtherParams: this.labelParamsHanding(this.labelOtherParams), // 其他参数 - 动态
          labelOuterParams: JSON.parse(JSON.stringify(this.labelOuterParams)), // 外层参数 - 动态
          ioLabelId: null // io标签id
        };
        console.log(this.formData);
      });
    },
    // 点击按钮 - 加载标签 - 调用子组件事件
    loadTags () {
      this.$refs.tagLoad.tagLoad();
    },
    // 编辑
    editTag (row) {
      this.dialogVisible = true;
      this.dialogType = "edit";
      // console.log(row);
      this.dialogTitle = `${this.serviceType === 0 ? "IO数据标签" : "数据服务标签"}-${this.dialogType === "insert" ? "新建" : "修改"}`;
      this.$nextTick(() => {
        this.$refs.dialogForm.resetFields();
        this.formDataOrg = row;
        const rowCopy = JSON.parse(JSON.stringify(row)); // 深拷贝，取消时还原数据用
        this.formData = {
          idStr: rowCopy.idStr, // id
          ioLabelId: rowCopy.ioLabelId, // IO标签id
          name: rowCopy.name, // 名称
          description: rowCopy.description, // 描述
          type: rowCopy.type, // 数据类型
          rw: rowCopy.rw, // 读写方向
          cycle: rowCopy.cycle, // 采集周期
          labelOtherParams: this.labelParamsHanding(rowCopy.otherParams), // 其他参数 - 动态
          labelOuterParams: rowCopy.outerParams, // 外层参数 - 动态
          tagOtherParams: { // 其他参数 - 固定
            abs: rowCopy.abs, // 取绝对值
            unit: rowCopy.unit, // 单位
            deviceRatio: rowCopy.deviceRatio, // 设备系数计算
            func: rowCopy.func, // 系数计算
            a: rowCopy.a, // 倍率
            b: rowCopy.b, // 基数
            isContrary: rowCopy.isContrary, // 写使用反向系数
            isInsToSam: rowCopy.isInsToSam, // 量程转换
            insMax: rowCopy.insMax, // 量程最大
            insMin: rowCopy.insMin, // 量程最小
            samMax: rowCopy.samMax, // 采集值最大
            samMin: rowCopy.samMin, // 采集值最小
            dataFilter: rowCopy.dataFilter, // 数据有效范围过滤
            max: rowCopy.max, // 数据最大
            min: rowCopy.min, // 数据最小
            calc: rowCopy.calc, // 高级运算
            cr1: rowCopy.cr1, // 参数1
            cr2: rowCopy.cr2 // 参数2
          }
        };
        // console.log(this.formData);
      });
    },
    // 点击按钮 - 其他参数 - 调用子组件事件
    setParams () {
      this.$refs.equipmentTagParams.setParams();
    },
    // 点击按钮 - 选择标签 - 调用子组件事件
    tagSelect () {
      this.$refs.tagSelect.tagSelect();
    },
    // 点击树节点 - 插件
    tagClick (param) {
      console.log(param);
      if (param) {
        if (this.isMock) { // mock数据
          this.formData.ioLabelId =
            `${param.name === "IO属性" ? "at." : "io."}${param.passName ? param.passName + "." : ""}${param.equpimentName ? param.equpimentName + "." : ""}${param.name}`;
          this.formData.IOTagParentId = param.parentId;
          this.formData.IOTagSelectId = param.id;
          this.tagDescribe =
            `${param.passDescribe ? param.passDescribe + " " : ""}${param.equipmentDescribe ? param.equipmentDescribe + " " : ""}${param.description}`;
        } else { // 接口数据
          this.formData.ioLabelId = param.idStr;
        }
      }
    },
    // 表单提交
    tagSubmit () {
      const formData = JSON.parse(JSON.stringify(this.formData));
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true;
          switch (this.dialogType) {
            case "insert":
              if (this.isMock) { // mock数据
                if (
                  this.dataTags.some(
                    tag => tag.name === this.formData.name
                  )
                ) { // 判断重复
                  this.$message.error("该标签已存在！");
                  this.submitLoading = false;
                } else {
                  formData.id = Math.random() // 随机生成id
                    .toString(36)
                    .substr(-10);
                  this.dataTags.push(JSON.parse(JSON.stringify(formData)));
                  this.refreshData();
                  this.submitLoading = false;
                  this.dialogVisible = false;
                }
              } else { // 接口数据
                // console.log(this.formData);
                let labelOtherParams = this.labelParamsAPI(this.formData.labelOtherParams);
                let labelOuterParams = this.formData.labelOuterParams.map(param => {
                  param.value = param.value === true ? 1 : param.value === false ? 0 : param.value;
                  return param;
                });
                const formInsert = {
                  a: this.formData.tagOtherParams.a, // both
                  abs: this.serviceType === 1 ? null : this.formData.tagOtherParams.abs,
                  b: this.formData.tagOtherParams.b, // both
                  calc: this.serviceType === 1 ? null : this.formData.tagOtherParams.calc,
                  cr1: this.serviceType === 1 ? null : this.formData.tagOtherParams.cr1,
                  cr2: this.serviceType === 1 ? null : this.formData.tagOtherParams.cr2,
                  cycle: this.formData.cycle,
                  dataFilter: this.serviceType === 1 ? null : this.formData.tagOtherParams.dataFilter,
                  description: this.formData.description,
                  deviceRatio: this.serviceType === 1 ? null : this.formData.tagOtherParams.deviceRatio,
                  func: this.formData.tagOtherParams.func, // both
                  insMax: this.serviceType === 1 ? null : this.formData.tagOtherParams.insMax,
                  insMin: this.serviceType === 1 ? null : this.formData.tagOtherParams.insMin,
                  isContrary: this.serviceType === 1 ? null : this.formData.tagOtherParams.isContrary,
                  isInsToSam: this.serviceType === 1 ? null : this.formData.tagOtherParams.isInsToSam,
                  len: this.formData.len,
                  max: this.serviceType === 1 ? null : this.formData.tagOtherParams.max,
                  min: this.serviceType === 1 ? null : this.formData.tagOtherParams.min,
                  name: this.formData.name,
                  otherParams: labelOtherParams.length !== 0 ? labelOtherParams : null,
                  outerParams: labelOuterParams.length !== 0 ? labelOuterParams : null,
                  rw: this.formData.rw,
                  samMax: this.serviceType === 1 ? null : this.formData.tagOtherParams.samMax,
                  samMin: this.serviceType === 1 ? null : this.formData.tagOtherParams.samMin,
                  type: this.formData.type,
                  unit: this.serviceType === 1 ? null : this.formData.tagOtherParams.unit,
                  deviceId: this.serviceType === 1 ? null : localStorage.getItem("select-id"),
                  pipelineId: this.serviceType === 0 ? null : this.id,
                  ioLabelId: this.serviceType === 0 ? null : this.formData.ioLabelId
                };
                console.log(formInsert);
                const result = (await addTag(formInsert));
                resultCallback(result.data.success, "新增成功！", () => {
                  this.getData();
                  this.submitLoading = false;
                  this.dialogVisible = false;
                }, () => {
                  this.submitLoading = false;
                });
              }
              break;
            case "edit":
              if (this.isMock) { // mock数据
                if (
                  this.dataTags.some(
                    tag => tag.name === this.formData.name
                  ) &&
                  this.formData.name !== this.formDataOrg.name
                ) {
                  // 判断重复
                  this.$message.error("该标签已存在！");
                  this.submitLoading = false;
                } else {
                  this.$set(
                    this.dataTags,
                    this.formData.index - 1,
                    JSON.parse(JSON.stringify(formData))
                  );
                  this.submitLoading = false;
                  this.dialogVisible = false;
                }
              } else { // 接口数据
                // console.log(formData);
                let labelOtherParams = this.labelParamsAPI(this.formData.labelOtherParams);
                let labelOuterParams = this.formData.labelOuterParams.map(param => {
                  param.value = param.value === true ? 1 : param.value === false ? 0 : param.value;
                  return param;
                });
                const formUpdate = {
                  id: this.formData.idStr,
                  a: this.formData.tagOtherParams.a, // a
                  abs: this.serviceType === 1 ? null : this.formData.tagOtherParams.abs,
                  b: this.formData.tagOtherParams.b, // b
                  calc: this.serviceType === 1 ? null : this.formData.tagOtherParams.calc,
                  cr1: this.serviceType === 1 ? null : this.formData.tagOtherParams.cr1,
                  cr2: this.serviceType === 1 ? null : this.formData.tagOtherParams.cr2,
                  cycle: this.formData.cycle,
                  dataFilter: this.serviceType === 1 ? null : this.formData.tagOtherParams.dataFilter,
                  description: this.formData.description,
                  deviceRatio: this.serviceType === 1 ? null : this.formData.tagOtherParams.deviceRatio,
                  func: this.formData.tagOtherParams.func, // func
                  insMax: this.serviceType === 1 ? null : this.formData.tagOtherParams.insMax,
                  insMin: this.serviceType === 1 ? null : this.formData.tagOtherParams.insMin,
                  isContrary: this.serviceType === 1 ? null : this.formData.tagOtherParams.isContrary,
                  isInsToSam: this.serviceType === 1 ? null : this.formData.tagOtherParams.isInsToSam,
                  len: this.formData.len,
                  max: this.serviceType === 1 ? null : this.formData.tagOtherParams.max,
                  min: this.serviceType === 1 ? null : this.formData.tagOtherParams.min,
                  name: this.formData.name,
                  otherParams: labelOtherParams.length !== 0 ? labelOtherParams : null,
                  outerParams: labelOuterParams.length !== 0 ? labelOuterParams : null,
                  rw: this.formData.rw,
                  samMax: this.serviceType === 1 ? null : this.formData.tagOtherParams.samMax,
                  samMin: this.serviceType === 1 ? null : this.formData.tagOtherParams.samMin,
                  type: this.formData.type,
                  unit: this.serviceType === 1 ? null : this.formData.tagOtherParams.unit,
                  ioLabelId: this.serviceType === 0 ? null : this.formData.ioLabelId
                };
                // console.log(formUpdate);
                const result = (await updateTag(formUpdate));
                resultCallback(result.data.success, "修改成功！", () => {
                  this.getData();
                  this.submitLoading = false;
                  this.dialogVisible = false;
                }, () => {
                  this.submitLoading = false;
                });
              }
              break;
          }
        }
      });
    },
    // 删除单个标签
    deleteTag (row) {
      this.$confirm("将删除标签, 是否继续?", "提示", {
        type: "warning"
      }).then(async () => {
        if (this.isMock) { // mock数据
          this.dataTags.forEach((tag, i) => {
            tag.id === row.id && this.dataTags.splice(i, 1);
          });
          this.refreshData();
        } else { // 接口数据
          const result = await deleteTag({ ids: [row.idStr] });
          resultCallback(result.data.success, "删除成功！", () => {
            this.getData();
          }, () => { });
        }
      }).catch(() => { });
    },
    // 获取选中的数据
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 删除多个标签
    deleteTags () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: "未选择标签",
          type: "warning",
          duration: 1000
        });
        return false;
      }
      this.$confirm("将删除标签, 是否继续?", "提示", {
        type: "warning"
      }).then(async () => {
        if (this.isMock) { // mock数据
          for (let i = 0; i < this.dataTags.length; i++) {
            this.multipleSelection.forEach(select => {
              this.dataTags[i].id === select.id && this.dataTags.splice(i, 1);
            });
          }
          this.refreshData();
        } else { // 接口数据
          const ids = [];
          this.multipleSelection.forEach(select => {
            ids.push(select.idStr);
          });
          // console.log(ids);
          const result = await deleteTag({ ids });
          resultCallback(result.data.success, "删除成功！", () => {
            this.getData();
          }, () => { });
        }
      }).catch(() => { });
    },
    // 工序重新排序
    tagToggle (index, handle) {
      if (handle === "up") {
        // 上移
        if (index !== 0) {
          const toExchange = this.dataTags[index - 1];
          this.$set(
            this.dataTags,
            index - 1,
            this.dataTags[index]
          );
          this.$set(this.dataTags, index, toExchange);
          this.refreshData();
        }
      } else {
        // 下移
        if (index !== this.dataTags.length - 1) {
          const toExchange = this.dataTags[index + 1];
          this.$set(
            this.dataTags,
            index + 1,
            this.dataTags[index]
          );
          this.$set(this.dataTags, index, toExchange);
          this.refreshData();
        }
      }
    },
    // 导出
    downloadTable () {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = passTagHeader.tHeader;
        const filterVal = passTagHeader.filterVal;
        const list = this.dataTags;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "数据标签-通道",
          autoWidth: true,
          bookType: "xlsx"
        });
        this.downloadLoading = false;
      });
    },
    // 导出数据处理
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === "timestamp") {
          return parseTime(v[j]);
        } else {
          return v[j];
        }
      }));
    },
    // 导入
    uploadTable () {
      this.$refs["excel-upload-input"].click();
    },
    // 导入 - 打开按钮
    handleClick (e) {
      const files = e.target.files;
      const rawFile = files[0];
      if (!rawFile) return;
      this.upload(rawFile);
    },
    // 导入 - 事件
    upload (rawFile) {
      this.$refs["excel-upload-input"].value = null; // fix can't select the same excel
      const before = this.beforeUpload(rawFile);
      if (before) this.readerData(rawFile);
    },
    // 导入前的判断
    beforeUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "文件大小需小于1MB",
        type: "warning"
      });
      return false;
    },
    // 读取文件数据
    readerData (rawFile) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const header = this.getHeaderRow(worksheet);
          const results = XLSX.utils.sheet_to_json(worksheet);
          // console.log(header);
          // console.log(results);
          this.generateData({ header, results });
          this.loading = false;
          resolve();
        };
        reader.readAsArrayBuffer(rawFile);
      });
    },
    // 获取表头
    getHeaderRow (sheet) {
      const headers = [];
      const range = XLSX.utils.decode_range(sheet["!ref"]);
      let C;
      const R = range.s.r;
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
        /* find the cell in the first row */
        let hdr = "UNKNOWN " + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
    },
    // 数据处理
    generateData ({ header, results }) {
      /* 1.将results的键替换成与原dataTags相同的英文 */
      results.forEach(row => {
        Object.keys(row).forEach(key => {
          // console.log(key);
          Object.keys(tagTranslation).forEach(_key => {
            if (key === tagTranslation[_key]) {
              this.$set(row, _key, row[key]);
              this.$delete(row, key);
            }
          });
        });
      });
      // console.log(results);
      /* 2.清空dataTagsOrg */
      this.dataTagsOrg.splice(0, this.dataTagsOrg.length);
      /* 3.循环results，追加到dataTagsOrg */
      results.forEach(row => {
        this.dataTagsOrg.push(row);
      });
      this.refreshData();
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
</style>
