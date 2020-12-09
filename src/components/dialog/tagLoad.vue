<template>
  <el-dialog class="tag-load-dialog"
             v-if="dialogVisible"
             title="IO标签映射操作"
             :visible.sync="dialogVisible">

    <el-row class="params-dialog-row">
      <el-checkbox v-model="filterForm.passDescribe">保留通道描述</el-checkbox>
      <el-checkbox v-model="filterForm.equipmentDescribe">保留设备描述</el-checkbox>
      <el-checkbox v-model="filterForm.equipmentStatusTag">添加设备状态标签</el-checkbox>
    </el-row>

    <el-row class="params-dialog-row">
      <el-checkbox v-model="filterForm.floatingPoint">浮点</el-checkbox>
      <el-checkbox v-model="filterForm.parseInt">整型</el-checkbox>
      <el-checkbox v-model="filterForm.boolean">布尔</el-checkbox>
      <el-checkbox v-model="filterForm.string">字符串</el-checkbox>
      <el-checkbox v-model="filterForm.binary">二进制</el-checkbox>
    </el-row>

    <el-table :data="tableData"
              current-row-key
              empty-text="暂无标签"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       min-width="30">
      </el-table-column>
      <el-table-column type="index"
                       label="序号"
                       min-width="40">
      </el-table-column>
      <el-table-column label="名称"
                       min-width="110">
        <template slot-scope="scope">
          {{scope.row.passName+'.'+scope.row.equipmentName}}
        </template>
      </el-table-column>
      <el-table-column label="描述"
                       min-width="140">
        <template slot-scope="scope">
          {{scope.row.passDescribe+'.'+scope.row.equipmentDescribe}}
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"
                 @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { arraySort } from "@/libs/dataHanding";// 对象数组根据key排序

export default {
  props: {
    // 服务导航中被选择的id
    id: {
      type: String
    },
    // 当前标签数据
    formData: {
      type: Object,
      default: () => { }
    },
    // 左侧树 - 原始数据
    treeData: {
      type: Array,
      default: () => []
    },
    // 通道列表
    passList: {
      type: Array,
      default: () => []
    },
    // 设备列表
    equipmentList: {
      type: Array,
      default: () => []
    },
    // 当前页标签列表
    dataTags: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogVisible: false, // 是否可见
      tableData: [], // 表格数据
      multipleSelection: [], // 多选 - 选中的数据
      filterForm: {} // 筛选表单
    };
  },
  methods: {
    // 加载标签
    tagLoad () {
      this.dialogVisible = true;
      this.refreshData();
      this.filterForm = { // 重置筛选表单
        passDescribe: true,
        equipmentDescribe: true,
        equipmentStatusTag: true,
        floatingPoint: true,
        parseInt: true,
        boolean: true,
        string: true,
        binary: true
      };
    },
    // 数据处理
    refreshData () {
      /* 复制副本 */
      this.copyTreeData = JSON.parse(JSON.stringify(this.treeData));
      this.copyEquipmentList = JSON.parse(JSON.stringify(this.equipmentList));
      /* 将通道与设备的“名称”和“描述”合并 */
      this.copyTreeData.forEach(group => {
        group.id === "2" && (group.children = []);
        group.children.forEach(pass => {
          this.passList.forEach(_pass => {
            pass.id === _pass.id && pass.children.forEach(equipment => {
              this.copyEquipmentList.forEach(_equipment => {
                if (equipment.id === _equipment.id) {
                  // console.log(_equipment);
                  _equipment.passName = _pass.passName;
                  _equipment.passDescribe = _pass.passDescribe;
                }
              });
            });
          });
        });
      });
      // console.log(this.copyEquipmentList);
      this.tableData = this.copyEquipmentList;
    },
    // 获取选中的数据
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 表单提交
    submit () {
      // console.log(this.filterForm);
      console.log(this.multipleSelection);

      /* 1.新建标签列表，根据多选数据放入临时标签列表 */
      const tagListTemporary = [];
      this.multipleSelection.forEach(row => {
        this.filterForm.equipmentStatusTag && tagListTemporary.push({ // 设备状态标签 - 只添加一个：_io_status
          id: Math.random().toString(36).substr(-10),
          name: `${row.passName}.${row.equipmentName}._io_status`,
          describe: `${this.filterForm.passDescribe ? row.passDescribe + " " : ""}${this.filterForm.equipmentDescribe ? row.equipmentDescribe + " " : ""}设备状态`,
          ratioCalculation: false,
          magnification: "2.0000",
          base: "0.0000",
          dataType: "布尔",
          direction: "只读",
          acquisitionCycle: "1000",
          IOTag: `at.${row.passName}.${row.equipmentName}._io_status`,
          IOTagParentId: row.id,
          IOTagSelectId: "3",
          slaveStationID: "1",
          registerType: 0,
          registerAddr: "0",
          dataFormat: 0
        });
        row.dataTags.forEach(tag => {
          // console.log(tag);
          if (
            (this.filterForm.floatingPoint && tag.dataType === "浮点") ||
            (this.filterForm.parseInt && tag.dataType === "整型") ||
            (this.filterForm.boolean && tag.dataType === "布尔") ||
            (this.filterForm.string && tag.dataType === "字符串") ||
            (this.filterForm.binary && tag.dataType === "二进制")
          ) {
            tagListTemporary.push({ // 设备标签 - 有几个添加几个
              id: Math.random().toString(36).substr(-10),
              name: `${row.passName}.${row.equipmentName}.${tag.name}`,
              describe: `${this.filterForm.passDescribe ? row.passDescribe + " " : ""}${this.filterForm.equipmentDescribe ? row.equipmentDescribe + " " : ""}${tag.describe}`,
              ratioCalculation: false,
              magnification: "2.0000",
              base: "0.0000",
              dataType: tag.dataType,
              direction: tag.direction,
              acquisitionCycle: tag.acquisitionCycle,
              IOTag: `io.${row.passName}.${row.equipmentName}.${tag.name}`,
              IOTagParentId: row.id,
              IOTagSelectId: tag.id,
              slaveStationID: "1",
              registerType: 0,
              registerAddr: "0",
              dataFormat: 0
            });
          }
        });
      });
      // console.log(this.dataTags);

      /* 2.临时标签列表vs原标签列表，根据name筛选出需要添加的标签 */
      // console.log(tagListTemporary);
      const addTags = tagListTemporary.filter(tag => {
        return !this.dataTags.some(_tag => _tag.name === tag.name);
      });
      // console.log(addTags);

      /* 3.将需要添加的标签追加到原标签列表 */
      addTags.forEach(tag => {
        this.dataTags.push(tag);
      });
      this.dataTags.sort(arraySort("name", "asc")); // 重排序
      this.dataTags.map((tag, i) => {
        this.$set(tag, "index", i + 1); // 追加序列号，从1开始
      });

      this.dialogVisible = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
