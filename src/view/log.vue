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
import { queryLogList } from "@/api/log"; // 获取日志列表

export default {
  data () {
    return {
      /* table */
      tableDataOrg: [], // 原始数据
      tableData: [], // 处理后的当页数据
      tableColumns: [
        {
          type: "expand",
          width: 50,
          render: (h, params) => {
            return h("div",
              Object.keys(JSON.parse(params.row.content)[0]).map(key => {
                return h("div",
                  {
                    style: {
                      marginBottom: "3px"
                    }
                  },
                  `${key}:${JSON.parse(params.row.content)[0][key]}`);
              })
            );
          }
        },
        {
          title: "操作账号",
          key: "userName",
          align: "center",
          minWidth: 120
        },
        {
          title: "操作人",
          key: "nickName",
          align: "center",
          minWidth: 120
        },
        {
          title: "操作路径",
          key: "url",
          align: "center",
          minWidth: 360
        },
        {
          title: "创建时间",
          align: "center",
          render: (h, params) => {
            return h("span", parseTime(params.row.createTime));
          },
          minWidth: 150
        },
        {
          title: "日志类型",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.logType === 0 ? "新增"
              : params.row.logType === 1 ? "删除"
                : params.row.logType === 2 ? "修改"
                  : params.row.logType === 3 ? "修改" : ""
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
        this.tableData = (await queryLogList({
          size: this.pageSize,
          page: this.pageNum
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
