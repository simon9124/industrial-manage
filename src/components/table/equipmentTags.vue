<template>
  <div class="table-component">

    <!-- btns -->
    <el-row style="margin-bottom:20px">
      <el-select v-model="dataTypeSelect"
                 placeholder="请选择"
                 style="width:150px;margin-right:10px"
                 @change="refreshData">
        <el-option v-for="item in dataTypeList"
                   :key="item"
                   :label="item"
                   :value="item">
        </el-option>
      </el-select>
      <el-button type="primary"
                 size="small"
                 plain
                 @click="insertTag">新增</el-button>
      <el-button type="success"
                 size="small"
                 plain
                 @click="loadTags">加载</el-button>
      <el-button type="danger"
                 size="small"
                 plain
                 @click="deleteTags">删除</el-button>
      <el-button type="info"
                 size="small"
                 plain
                 :loading="downloadLoading"
                 @click="downloadTable">导出</el-button>
      <el-button type="info"
                 size="small"
                 plain
                 @click="uploadTable">导入</el-button>
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

      <!-- 按BCD -->
      <el-table-column label="按BCD"
                       width="60">
        <template slot-scope="scope">
          {{ scope.row.useBCD?'1':'0' }}
        </template>
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
                     @click="deleteTag(scope.row.id)"></el-button>
          <el-button type="success"
                     size="mini"
                     plain
                     icon="el-icon-top"
                     style="margin-left:3px"
                     :disabled="scope.row.index===1"
                     @click="tagToggle(scope.row.index-1,'up')"></el-button>
          <el-button type="success"
                     size="mini"
                     plain
                     icon="el-icon-bottom"
                     style="margin-left:3px"
                     :disabled="scope.row.index===dataTags.length"
                     @click="tagToggle(scope.row.index-1,'down')"></el-button>
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
                          prop="describe">
              <el-input v-model="formData.describe"></el-input>
            </el-form-item>
          </el-col>
          <el-button style="margin:0 0 20px 10px"
                     @click="setParams">其他参数</el-button>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="6">
            <el-form-item label="数据类型："
                          prop="dataType">
              <el-select v-model="formData.dataType"
                         placeholder="请选择"
                         style="width:105px">
                <el-option v-for="item in dataTypeList"
                           :key="item"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="读写方向："
                          prop="direction">
              <el-select v-model="formData.direction"
                         placeholder="请选择"
                         style="width:105px">
                <el-option v-for="item in directionList"
                           :key="item"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label-width="155px"
                          label="采集周期（毫秒）："
                          prop="cycle">
              <el-input v-model="formData.cycle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="13">
            <el-form-item label-width="100px"
                          label="寄存器类型："
                          prop="registerType">
              <el-select v-model="formData.registerType"
                         placeholder="请选择"
                         style="width:-webkit-fill-available">
                <el-option v-for="item in registerTypeList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label-width="100px"
                          label="寄存器地址："
                          prop="registerAddr">
              <el-input v-model="formData.registerAddr"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="10">
            <el-form-item label-width="85px"
                          label="解析方式："
                          prop="analyticalMethod">
              <el-select v-model="formData.analyticalMethod"
                         placeholder="请选择"
                         style="width:-webkit-fill-available">
                <el-option v-for="item in analyticalMethodList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label-width="125px"
                          label="位偏移（0-15）："
                          prop="displacementDeviation">
              <el-input v-model="formData.displacementDeviation"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="params-dialog-row">
          <el-checkbox v-model="formData.useBCD">使用BCD</el-checkbox>
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
                          :form-data="formData"></equipment-tag-params>

  </div>
</template>

<script>
import { parseTime } from "@/libs/util"; // functions
import { arraySort } from "@/libs/dataHanding";// function - 对象数组根据key排序
import XLSX from "xlsx"; // plugin - excel
import EquipmentTagParams from "@/components/dialog/equipmentTagParams"; // 组件：其他参数 - 设备数据标签
/* mockData */
import {
  equipmentTagColumn, // 表格列项 - 设备
  equipmentTagHeader, // 导出的表头 - 设备
  tagTranslation // 表头中英文对照
} from "@/mock/tableColumn";

export default {
  components: { EquipmentTagParams },
  props: {
    // 左侧树被选择的id
    id: {
      type: String
    },
    // 表格数据 - 原始数据
    dataTagsOrg: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      /* table */
      dataTags: [], // 表格数据 - 要展示的数据
      dataColumns: equipmentTagColumn, // 表格列项
      dataTypeList: ["全部", "浮点", "整型", "布尔", "字符串", "二进制"], // select - 数据类型
      dataTypeSelect: "全部", // 筛选 - 选中的数据类型
      multipleSelection: [], // 多选 - 选中的数据
      /* dialog */
      dialogVisible: false, // 是否显示
      dialogVisibleParam: false, // 是否显示 - 其他参数
      dialogType: "", // 类型：insert/edit
      dialogTitle: "", // dialog标题
      formData: { // 表单数据
        name: "",
        describe: "",
        otherParams: {
          takeAbsoluteValue: false,
          absoluteValue: "",
          calculation: "不参与计算",
          ratioCalculation: false,
          magnification: "2.0000",
          base: "0.0000",
          reverseCoefficient: false,
          rangeConversion: false,
          maxRange: 10,
          maxGather: 4096,
          minRange: 0,
          minGather: 0,
          dataFilter: false,
          maxData: 100,
          minData: 0,
          dataRadio: "1",
          advancedOperation: "无计算",
          param1: "",
          param2: "",
          code: 0,
          cache: false,
          alert: false,
          maxLimit: "100.0",
          upperLimit: "80.0",
          lowerLimit: "20.0",
          minLimit: "0.0",
          alarmDelay: "3",
          alarmLevel: "3"
        },
        dataType: "整型",
        direction: "只读",
        cycle: "1000",
        registerType: 0,
        registerAddr: "0",
        analyticalMethod: 0,
        displacementDeviation: "0",
        useBCD: false
      },
      formDataOrg: {}, // 表单数据 - 行内原始
      formRule: { // 表单验证
        name: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        describe: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ],
        cycle: [
          { required: true, message: "请输入采集周期", trigger: "blur" }
        ]
      },
      directionList: ["只读", "只写", "读写"], // select - 读写方向
      registerTypeList: [ // select列表 - 寄存器类型
        {
          label: "1号读、5号写：读、写开关量",
          value: 0
        },
        {
          label: "2号命令：读开关量状态",
          value: 1
        },
        {
          label: "3号读、6号或16号写：读写保持寄存器",
          value: 2
        },
        {
          label: "4号命令：读输入寄存器",
          value: 3
        }
      ],
      analyticalMethodList: [ // select列表 - 解析方式
        {
          label: "按位取",
          value: 0
        },
        {
          label: "2字节整型 先高后低 顺序12",
          value: 1
        },
        {
          label: "2字节整型 第1位",
          value: 2
        },
        {
          label: "2字节整型 第2位",
          value: 3
        },
        {
          label: "4字节整型 顺序4321",
          value: 4
        },
        {
          label: "8字节浮点 顺序87654321",
          value: 5
        }
      ],
      /* loading */
      submitLoading: false, // loading - 提交按钮
      downloadLoading: false, // loading - 导出
      /* 动态高度 */
      tableMaxHeight: 0 // 流体表格最大高度
    };
  },
  created () {
    const screenHeight = document.documentElement.clientHeight;
    this.tableMaxHeight = screenHeight - 73 - 20 * 2 - (40 + 15) - (40 + 20) - 40;
    this.getData();
  },
  methods: {
    // 获取数据
    getData () {
      this.refreshData();
    },
    // 数据处理
    refreshData () {
      /* 根据条件筛选 */
      if (this.dataTypeSelect !== "全部") {
        this.dataTags = this.dataTagsOrg.filter(tag =>
          tag.dataType === this.dataTypeSelect
        );
      } else {
        this.dataTags = this.dataTagsOrg;
      }
      this.dataTags.sort(arraySort("name", "asc")); // 重排序
      this.dataTags.map((tag, i) => {
        this.$set(tag, "index", i + 1); // 追加序列号，从1开始
      });
      // console.log(this.dataTags);
    },
    // 新增
    insertTag () {
      this.dialogVisible = true;
      this.dialogType = "insert";
      this.$nextTick(() => {
        this.$refs.dialogForm.resetFields();
        this.dialogTitle = `IO数据标签-${this.dialogType === "insert" ? "新建" : "修改"}`;
      });
    },
    // 加载
    loadTags () {

    },
    // 编辑
    editTag (row) {
      this.dialogVisible = true;
      this.dialogType = "edit";
      this.$nextTick(() => {
        this.$refs.dialogForm.resetFields();
        this.dialogTitle = `IO数据标签-${this.dialogType === "insert" ? "新建" : "修改"}`;
        this.formDataOrg = row;
        this.formData = JSON.parse(JSON.stringify(row)); // 深拷贝，取消时还原数据用
      });
    },
    // 其他参数 - 调用子组件事件
    setParams () {
      this.$refs.equipmentTagParams.setParams();
    },
    // 表单提交
    tagSubmit () {
      const formData = JSON.parse(JSON.stringify(this.formData));
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          switch (this.dialogType) {
            case "insert":
              if (
                this.dataTags.some(
                  tag => tag.name === this.formData.name
                )
              ) {
                // 判断重复
                this.$message.error("该标签已存在！");
                this.submitLoading = false;
              } else {
                // 随机生成id
                formData.id = Math.random()
                  .toString(36)
                  .substr(-10);
                this.dataTags.push(JSON.parse(JSON.stringify(formData)));
                this.refreshData();
                this.submitLoading = false;
                this.dialogVisible = false;
              }
              break;
            case "edit":
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
              break;
          }
        }
      });
    },
    // 删除单个标签
    deleteTag (id) {
      this.$confirm("将删除标签, 是否继续?", "提示", {
        type: "warning"
      }).then(() => {
        this.dataTags.forEach((tag, i) => {
          tag.id === id && this.dataTags.splice(i, 1);
        });
        this.refreshData();
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
      }).then(() => {
        for (let i = 0; i < this.dataTags.length; i++) {
          this.multipleSelection.forEach(select => {
            this.dataTags[i].id === select.id && this.dataTags.splice(i, 1);
          });
        }
        this.refreshData();
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
        const tHeader = equipmentTagHeader.tHeader;
        const filterVal = equipmentTagHeader.filterVal;
        const list = this.dataTags;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "数据标签-设备",
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
      console.log(results);
      /* 2.清空dataTagsOrg */
      this.dataTagsOrg.splice(0, this.dataTagsOrg.length);
      /* 3.循环results，追加到dataTagsOrg */
      results.forEach(row => {
        this.$set(row, "otherParams", {});
        this.dataTagsOrg.push(row);
      });
      this.refreshData();
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
</style>
