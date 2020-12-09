<template>
  <div class="dooya-container">
    <Card>
      <!-- 操作 -->
      <div style="margin: 10px 0">
        <Button type="success"
                icon="md-add"
                @click="insert">新增用户</Button>
      </div>

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
                :total="tableDataOrg.length"
                :current.sync="pageNum"
                :page-size-opts="[10, 50, 100, 200]"
                :page-size="pageSize"
                @on-change="changePage"
                @on-page-size-change="changePageSize"></Page>
        </div>
      </div>
    </Card>

    <!-- Modal -->
    <Modal v-model="modalShow"
           :mask-closable="false"
           :closable="false"
           footer-hide
           title="账号详情"
           @on-ok="handleSubmit">
      <Form ref="formModalData"
            :model="modalData"
            :rules="formModalRule"
            :label-width="100"
            @submit.native.prevent>
        <FormItem label="账号："
                  prop="userName">
          <Input type="text"
                 v-model.trim="modalData.userName"></Input>
        </FormItem>
        <FormItem label="昵称："
                  prop="nickName">
          <Input type="text"
                 v-model.trim="modalData.nickName"></Input>
        </FormItem>
        <FormItem label="手机号："
                  prop="mobile">
          <Input type="text"
                 v-model.trim="modalData.mobile"></Input>
        </FormItem>
        <FormItem label="邮箱："
                  prop="email">
          <Input type="text"
                 v-model.trim="modalData.email"></Input>
        </FormItem>
        <FormItem label="角色："
                  prop="access">
          <Select v-model="modalData.roleId">
            <Option v-for="(role,i) in roleList"
                    :value="role.id"
                    :key="i">
              {{ role.roleName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  :loading="buttonLoading"
                  @click="handleSubmit('formModalData')">确定</Button>
          <Button @click="modalShow=false"
                  style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
// mockData
import {
  userList, // 用户列表 - 原始数据
  roleList // 角色列表
} from "@/mock/role";
// function
import { validateTel, validateEmail } from "@/libs/validate"; // 验证：手机号&邮箱
import {
  arraySort, // 对象数组根据key排序
  getValueByKey, // 根据对象数组某个key的value，查询另一个key的value
  resultCallback // 根据请求的status执行回调函数
} from "@/libs/dataHanding";
/* api */
import {
  queryUserList, // 获取用户列表
  userAdd, // 新增用户
  userUpdate, // 修改用户
  userDelete // 删除用户
} from "@/api/user";
import {
  queryRoleList
} from "@/api/role"; // 获取角色列表

export default {
  data () {
    return {
      /* 全局 */
      roleList: [], // 角色列表 - select用
      /* table */
      tableDataOrg: [], // 原始数据
      tableData: [], // 处理后的当页数据
      tableColumns: [
        {
          title: "账号",
          key: "userName",
          align: "center",
          minWidth: 120
        },
        {
          title: "昵称",
          key: "nickName",
          align: "center",
          minWidth: 120
        },
        {
          title: "电话",
          key: "mobile",
          align: "center",
          minWidth: 120
        },
        {
          title: "角色",
          align: "center",
          render: (h, params) => {
            return h("Tag", {
              props: {
                color: "blue"
              }
            }, getValueByKey(this.roleList, "id", params.row.roleId, "roleName"));
          },
          minWidth: 120
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          minWidth: 180,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Tooltip",
                {
                  props: {
                    trigger: "hover",
                    content: "修改",
                    placement: "top",
                    transfer: true
                  }
                },
                [
                  h("Button", {
                    props: {
                      type: "primary",
                      size: "small",
                      icon: "ios-create-outline"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.edit(params.row);
                      }
                    }
                  })
                ]
              ),
              h(
                "Tooltip",
                {
                  props: {
                    trigger: "hover",
                    content: "删除",
                    placement: "top",
                    transfer: true
                  }
                },
                [
                  h("Button", {
                    props: {
                      type: "error",
                      size: "small",
                      icon: "md-close"
                    },
                    on: {
                      click: () => {
                        this.delete(params.row);
                      }
                    }
                  })
                ]
              )
            ]);
          }
        }
      ], // 表头列项
      total: 0, // 总数
      pageNum: 1, // 页码
      pageSize: 10, // 每页显示数量
      sort: "user_name",
      /* loading */
      tableLoading: false, // table
      buttonLoading: false, // button
      /* modal */
      modalShow: false, // 是否显示
      modalDataType: "", // 类型 - insert or edit
      modalData: {
        email: "",
        mobile: "",
        nickName: "",
        password: this.$md5("123456"),
        realName: "",
        roleId: 0,
        status: 1,
        userName: ""
      }, // 数据
      modalDataOrg: {}, // 数据 - 行内原始
      formModalRule: {
        userName: [
          {
            required: true,
            message: "请输入账号",
            trigger: "change"
          },
          { type: "string", max: 20, message: "账号过长", trigger: "change" }
        ],
        nickName: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "change"
          },
          { type: "string", max: 10, message: "昵称过长", trigger: "change" }
        ],
        mobile: [
          {
            required: true,
            trigger: "change",
            validator: function (rule, value, callback) {
              if (value && !validateTel(value)) {
                callback(new Error("手机号格式不正确"));
              } else {
                callback();
              }
            }
          }
        ],
        email: [
          {
            required: true,
            trigger: "change",
            validator: function (rule, value, callback) {
              if (value && !validateEmail(value)) {
                callback(new Error("邮箱格式不正确"));
              } else {
                callback();
              }
            }
          }
        ]
      } // form规则
    };
  },
  async created () {
    this.getData();
    // 角色列表下拉select框
    this.roleList = this.isMock ? roleList : (await queryRoleList(this)).data.data || [];
  },
  methods: {
    // 获取首页数据
    async getData () {
      if (!this.isMock) {
        /* 接口数据 */
        this.tableLoading = true;
        const dataResult = (
          await queryUserList(this)
        ).data;
        if (dataResult) {
          // 如果是在删除之后获取的数据 -> 若删掉的是某一页的最后项且还有数据，则自动获取前一页的数据
          if (dataResult.data.length === 0 && dataResult.count !== 0) {
            this.pageNum--;
            this.getData();
          }
          this.tableData = dataResult.data;
          this.total = dataResult.count;
        } else {
          this.tableData = [];
          this.total = 0;
        }
        this.buttonLoading = false;
        this.tableLoading = false;
      } else {
        /* mock数据 */
        this.tableDataOrg = userList;
        this.refreshData();
      }
    },
    // 根据条件刷新数据
    refreshData () {
      // 按"userName"升序
      this.tableDataOrg.sort(arraySort("userName", "asc"));
      // 总数
      this.total = this.tableDataOrg.length;
      // 分页 & 每页条数
      this.tableData = this.tableDataOrg.slice(
        (this.pageNum - 1) * this.pageSize,
        this.pageNum * this.pageSize
      );
      // 如果是在删除之后获取的数据 -> 若删掉的是某一页的最后项且页码不是1，则自动获取前一页的数据
      if (this.tableData.length === 0 && this.tableDataOrg.length !== 0) {
        this.pageNum--;
        this.refreshData();
      }
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
    },
    // 点击按钮 - 新增
    insert () {
      this.modalDataType = "insert";
      this.$refs.formModalData.resetFields();
      this.modalShow = true;
    },
    // 点击按钮 - 编辑
    edit (row) {
      this.modalDataType = "edit";
      this.modalDataOrg = row;
      this.modalData = JSON.parse(JSON.stringify(row));
      this.modalShow = true;
    },
    // // 点击表单按钮 - 确定
    handleSubmit () {
      // console.log(this.modalData);
      this.$refs.formModalData.validate(async valid => {
        if (valid) {
          this.buttonLoading = true;
          switch (this.modalDataType) {
            case "insert":
              if (!this.isMock) {
                /* 接口数据 */
                const result = (await userAdd(this.modalData)).data.success;
                resultCallback(
                  result,
                  "添加成功！",
                  () => {
                    this.modalShow = false;
                    this.getData();
                  },
                  () => {
                    this.buttonLoading = false;
                  }
                );
              } else {
                /* mock数据 */
                if (
                  this.tableDataOrg.some(
                    item => item.userName === this.modalData.userName
                  )
                ) {
                  // 判断重复
                  this.$Message.error("该账号已存在！");
                  this.buttonLoading = false;
                } else {
                  // 随机生成id
                  this.modalData.id = Math.random()
                    .toString(36)
                    .substr(-10);
                  userList.push(JSON.parse(JSON.stringify(this.modalData)));
                  resultCallback(200, "添加成功！", () => {
                    this.refreshData();
                    this.modalShow = false;
                    this.buttonLoading = false;
                  });
                }
              }
              break;
            case "edit":
              if (!this.isMock) {
                /* 接口数据 */
                this.$delete(this.modalData, "password");
                this.$set(this.modalData, "id", this.modalData.idStr);
                const result = (await userUpdate(this.modalData)).data.success;
                resultCallback(
                  result,
                  "修改成功！",
                  () => {
                    this.modalShow = false;
                    this.getData();
                  },
                  () => {
                    this.buttonLoading = false;
                  }
                );
              } else {
                /* mock数据 */
                if (
                  this.tableDataOrg.some(
                    item => item.userName === this.modalData.userName
                  ) &&
                  this.modalData.userName !== this.modalDataOrg.userName
                ) {
                  // 判断重复
                  this.$Message.error("该账号已存在！");
                  this.buttonLoading = false;
                } else {
                  this.$set(
                    userList,
                    (this.pageNum - 1) * this.pageSize + this.modalData._index,
                    JSON.parse(JSON.stringify(this.modalData))
                  );
                  resultCallback(200, "修改成功！", () => {
                    this.refreshData();
                    this.buttonLoading = false;
                    this.modalShow = false;
                  });
                }
              }
              break;
          }
        }
      });
    },
    // 点击按钮 - 删除
    delete (row) {
      this.$Modal.confirm({
        title: "确定删除该用户？",
        onOk: async () => {
          if (!this.isMock) {
            /* 接口数据 */
            const result = await userDelete({ id: row.idStr });
            resultCallback(result.data.success, "删除成功！", () => {
              this.getData();
            });
          } else {
            /* mock数据 */
            userList
              .slice(
                (this.pageNum - 1) * this.pageSize,
                this.pageNum * this.pageSize
              )
              .forEach((item, i) => {
                row.idStr === item.idStr &&
                  this.tableDataOrg.splice((this.pageNum - 1) * this.pageSize + i, 1);
              });
            resultCallback(200, "删除成功！", () => {
              this.refreshData();
            });
          }
        },
        closable: true
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
