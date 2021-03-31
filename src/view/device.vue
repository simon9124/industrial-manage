<template>
  <div class="dooya-container">

    <!-- 表格 -->
    <Table :data="tableData"
           :loading="tableLoading"
           :columns="tableColumns"
           stripe>
    </Table>

    <!-- 分页 -->
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page show-sizer
              transfer
              placement="top"
              :total="isMock?tableDataOrg.length:total"
              :current.sync="pageNum"
              :page-size-opts="[10, 50, 100, 200]"
              :page-size="pageSize"
              @on-change="changePage"
              @on-page-size-change="changePageSize"></Page>
      </div>
    </div>

  </div>
</template>

<script>
// mockData
// function
// import {
// getValueByKey, // 根据对象数组某个key的value，查询另一个key的value
// resultCallback // 根据请求的status执行回调函数
// } from "@/libs/dataHanding";
import { parseTime } from "@/libs/util"; // function - 格式化时间
/* api */
import { queryDeviceLogList } from "@/api/log"; // 获取日志列表

export default {
  data () {
    return {
      /* table */
      tableDataOrg: [], // 原始数据
      tableData: [], // 处理后的当页数据
      tableColumns: [
        {
          title: "创建时间",
          align: "center",
          render: (h, params) => {
            return h("span", parseTime(params.row.createTime));
          },
          minWidth: 150
        },
        {
          title: "监测时间",
          align: "center",
          render: (h, params) => {
            return h("span", parseTime(params.row.monitorTime));
          },
          minWidth: 150
        },
        {
          title: "日志内容",
          key: "content",
          align: "center",
          minWidth: 360
        },
        {
          title: "日志等级",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.logType === 0 ? "DEBUG"
              : params.row.logType === 1 ? "INFO"
                : params.row.logType === 2 ? "WARN" : "ERROR"
            );
          },
          minWidth: 120
        }
      ], // 表头列项
      total: 0, // 总数
      pageNum: 1, // 页码
      pageSize: 10, // 每页显示数量
      /* loading */
      tableLoading: false // table
    };
  },
  created () {
    this.getData();
  },
  methods: {
    // 获取首页数据
    async getData () {
      if (!this.isMock) {
        /* 接口数据 */
        this.tableLoading = true;
        this.tableData = (await queryDeviceLogList({
          size: this.pageSize,
          page: this.pageNum,
          sort: "creatTime"
        })).data.data || [];
        this.tableLoading = false;
      } else {
        /* mock数据 */
        this.refreshData();
      }
    },
    // 根据条件刷新数据
    refreshData () {
      // 分页 & 每页条数
      this.tableData = this.tableDataOrg.slice(
        (this.pageNum - 1) * this.pageSize,
        this.pageNum * this.pageSize
      );
    },
    // 分页
    changePage (pageNum) {
      this.pageNum = pageNum;
      this.getData();
    },
    // 每页条数变化
    changePageSize (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.getData();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
