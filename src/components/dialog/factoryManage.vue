<template>
  <div>
    <!-- dialog - 工程管理 -->
    <el-dialog class="factory-manage"
               title="工程管理"
               :visible.sync="dialogVisible">

      <div class="btns">
        <el-button size="small"
                   type="primary"
                   :disabled="level===3"
                   @click="newBuild">新建</el-button>
        <el-button size="small"
                   type="success"
                   :disabled="level===1"
                   @click="editFactory">修改</el-button>
        <el-button size="small"
                   type="danger"
                   :disabled="level===1"
                   @click="itemDelete">删除</el-button>
        <el-button size="small"
                   type="info">加载</el-button>
      </div>

      <left-tree class="left-panel-tree"
                 :data="factoryData"
                 :id="id"
                 :contextmenu="false"
                 @item-click="itemClick"
                 @item-toggle="itemToggle">
      </left-tree>

    </el-dialog>

    <!-- dialog - 增/改 -->
    <el-dialog class="factory-operate"
               :title="dialogManageTitle"
               :visible.sync="dialogManageVisible">

      <!-- 工程组 -->
      <el-form v-if="level===1||(level===2&&handleType==='edit')"
               ref="formGroup"
               :model="formGroup"
               label-width="100px"
               label-position="right">
        <el-form-item prop="text"
                      label="项目组名：">
          <el-input v-model="formGroup.text"></el-input>
        </el-form-item>
        <el-form-item prop="describe"
                      label="项目组描述：">
          <el-input v-model="formGroup.describe"></el-input>
        </el-form-item>
        <el-form-item prop="creatTime"
                      label="创建时间：">
          <el-input v-model="formGroup.creatTime"
                    disabled></el-input>
        </el-form-item>
      </el-form>

      <!-- 采集工程 -->
      <el-form v-if="level===3||(level===2&&handleType==='insert')"
               ref="formFactory"
               :model="formFactory"
               label-width="90px"
               label-position="right">
        <el-form-item prop="text"
                      label="工程名：">
          <el-input v-model="formFactory.text"></el-input>
        </el-form-item>
        <el-form-item prop="describe"
                      label="工程描述：">
          <el-input v-model="formFactory.describe"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogManageVisible = false">取 消</el-button>
        <el-button @click="submit"
                   type="primary"
                   :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* functon */
import { parseTime } from "@/libs/util"; // function - 格式化时间
import {
  // arraySort, // 对象数组根据key排序
  // getValueByKey, // 根据对象数组某个key的value，查询另一个key的value
  resultCallback // 根据请求的status执行回调函数
} from "@/libs/dataHanding";
/* mockData */
import { treeTempleteData } from "@/mock/tree";
/* components */
import LeftTree from "@/components/Tree"; // 组件：左侧树
/* api */
import { addProjectTeam, updateProjectTeam, deleteProjectTeam } from "@/api/projectTeam.js";
import { queryProjectList, addProject, updateProject, deleteProject } from "@/api/project.js";

export default {
  components: { LeftTree },
  props: {
    // 工程数据
    factoryData: {
      type: Array,
      default: () => []
    },
    // 被选择的id - 工程
    // idFactory: {
    //   type: String
    // },
    // 工程懒加载数据
    lazyTreeData: {
      type: Array
    },
    // 通道列表
    passList: {
      type: Array
    },
    // 设备列表
    equipmentList: {
      type: Array
    }
  },
  data () {
    return {
      dialogVisible: false, // 是否可见 - 工程管理
      dialogManageVisible: false, // 是否可见 - 新增/修改
      dialogManageTitle: "", // 新增/修改 - 弹框名称
      /* tree */
      level: 3, // 被选择的树的层级
      id: null, // 被选择的树的id
      dialogType: "", // dialog的种类 group/factory
      handleType: "", // dialog的提交方式 insert/edit
      idFactory: "factory-1", // 被选择内容的id
      /* 工程组 */
      formGroup: {
        text: "",
        describe: "",
        creatTime: parseTime(new Date())
      }, // 表单数据
      formGroupOrg: {}, // 表单数据 - 原始
      /* 工程 */
      formFactory: { // 表单数据
        text: "",
        describe: "",
        creatTime: parseTime(new Date())
      },
      formFactoryOrg: {}, // 表单数据 - 原始

      /* loading */
      submitLoading: false
    };
  },
  methods: {
    // 工程管理
    factoryManage () {
      this.dialogVisible = true;
      this.idFactory = localStorage.getItem("project-id") || "root"; // 被选择内容的id - 工程管理
      this.getSelectedFactory(this.idFactory);
    },
    // 获取被选择的工程
    getSelectedFactory (idOperate) {
      // console.log(idOperate);
      this.factoryData[0].selected = false; // 取消顶部选择
      idOperate === "root" && this.refreshSelect(); // 无工程时选中顶部“工程组列表”
      this.factoryData[0].children.forEach(group => {
        group.selected = false; // 取消选中全部工程组
        group.opened = // 展开被选中的工作组
          this.isMock ? group.children.length !== 0
            : group.id === localStorage.getItem("team-id");
        group.children.length !== 0 && group.children.forEach(factory => { // 有工程时，选中当前工程
          factory.selected = factory.id === idOperate; // 选中被选中的工程
          if (factory.id === idOperate) {
            this.level = 3;
            this.id = idOperate;
            this.formFactoryOrg = factory;
          }
        });
      });
    },
    // 点击树节点
    itemClick (param) {
      // console.log(param);
      const { id, idStr, level, teamId } = param;
      this.id = this.isMock ? id : idStr;
      this.teamId = teamId;
      this.level = level;
      this.level === 2 && (this.formGroupOrg = param);
      if (this.level === 3) {
        this.formFactoryOrg = param;
        localStorage.setItem("project-id", this.id);
        localStorage.setItem("team-id", this.teamId);
      }
      this.$emit("factory-select", param);
    },
    // 树节点展开/收起 - 仅接口
    itemToggle (param) {
      if (!this.isMock && param.level === 2 && param.opened) {
        this.getProjectList(param.idStr, localStorage.getItem("project-id"));
      }
    },
    // 获取工程列表，并添加到工程组 - 仅接口
    async getProjectList (teamId, projectId, select = false) {
      this.factoryData[0].children.forEach(async group => { // 放到工程组列表
        if (group.idStr === teamId) {
          group.children = this.lazyTreeData; // 懒加载数据
          const projectList = (await queryProjectList(teamId)).data.data.map(project => { // 展开的工程数据
            this.$set(project, "text", project.projectName);
            this.$set(project, "describe", project.remark);
            this.$set(project, "creatTime", parseTime(project.createTime));
            this.$set(project, "icon", "fa fa-edit");
            this.$set(project, "id", project.idStr);
            this.$set(project, "level", 3);
            this.$set(project, "selected", projectId === project.idStr);
            this.$set(project, "teamId", teamId);
            return project;
          });
          group.children = projectList; // 加载真实数据
          select && this.getSelectedFactory(projectId); // 选中新增/修改的工程
        }
      });
    },
    // 新建
    newBuild () {
      this.dialogManageVisible = true;
      this.handleType = "insert";
      this.dialogManageTitle = `新建${this.level === 1 ? "项目组" : "采集工程"}`;
      this.dialogType = this.level === 1 ? "group" : "factory";
      this.$nextTick(() => {
        this.level === 1 && this.$refs.formGroup.resetFields();
        this.level === 2 && this.$refs.formFactory.resetFields();
      });
    },
    // 修改
    editFactory () {
      this.dialogManageVisible = true;
      this.handleType = "edit";
      this.dialogManageTitle = `修改${this.level === 2 ? "项目组" : "采集工程"}`;
      this.dialogType = this.level === 2 ? "group" : "factory";
      this.$nextTick(() => {
        this.level === 2 && (this.formGroup = JSON.parse(JSON.stringify(this.formGroupOrg)));
        this.level === 3 && (this.formFactory = JSON.parse(JSON.stringify(this.formFactoryOrg)));
      });
    },
    // 表单提交：增/改
    async submit () {
      const formData = this.dialogType === "group"
        ? JSON.parse(JSON.stringify(this.formGroup)) : JSON.parse(JSON.stringify(this.formFactory));
      // console.log(formData);
      this.submitLoading = true;
      switch (this.handleType) {
        case "insert":
          /* 1.数据处理 - mock */
          if (this.isMock) {
            formData.id = Math.random().toString(36).substr(-10);// 随机生成id
            formData.icon = this.dialogType === "group" ? "fa fa-laptop" : "fa fa-edit";
            formData.level = this.dialogType === "group" ? 2 : 3;
            formData.selected = false; // 未被选中的父节点需设置selected为false，否则该节点切换时会有bug
            formData.opened = true; // 父节点须设置opened为true，否则子节点首次新增时打不开
          }
          /* 2.塞入数据 */
          if (this.dialogType === "group") { // 新增工程组
            if (this.isMock) { // mock数据
              formData.children = [];
              this.factoryData[0].children.push(formData);
              this.getSelectedFactory(localStorage.getItem("project-id"));
              this.submitLoading = false;
              this.dialogManageVisible = false;
            } else { // 接口数据
              const result = (await addProjectTeam({
                description: formData.describe,
                teamName: formData.text
              })).data.success;
              resultCallback(
                result,
                "添加成功！",
                () => {
                  this.$emit("factory-handle", "");
                  this.submitLoading = false;
                  this.dialogManageVisible = false;
                },
                () => {
                  this.submitLoading = false;
                }
              );
            }
          } else { // 新增工程
            if (this.isMock) { // mock数据
              formData.treeData = JSON.parse(JSON.stringify(treeTempleteData));
              formData.parentId = this.id;
              this.factoryData[0].children.forEach((group, i) => {
                if (this.id === group.id) {
                  group.children.push(formData);
                  this.getSelectedFactory(formData.id);
                }
              });
              this.submitLoading = false;
              this.dialogManageVisible = false;
            } else { // 接口数据
              const result = (await addProject({
                remark: formData.describe,
                projectName: formData.text,
                teamId: this.id
              }));
              resultCallback(
                result.data.success,
                "添加成功！",
                () => {
                  this.factoryData[0].children.forEach(group => {
                    this.$set(group, "opened", group.idStr === this.id); // 只展开新增工程的工作组
                    this.$set(group, "selected", false); // 取消选择工作组
                    if (group.idStr === this.id) {
                      this.getProjectList(this.id, result.data.data.idStr, true); // 获取工程列表，并添加到工程组
                      localStorage.setItem("project-id", result.data.data.idStr);
                      localStorage.setItem("team-id", this.id);
                    }
                  });
                  this.submitLoading = false;
                  this.dialogManageVisible = false;
                },
                () => {
                  this.submitLoading = false;
                }
              );
            }
          }
          break;
        case "edit":
          if (this.dialogType === "group") { // 修改工程组
            if (this.isMock) { // mock数据
              this.factoryData[0].children.forEach(async (group, i) => {
                if (formData.id === group.id) {
                  this.$set(this.factoryData[0].children, i, JSON.parse(JSON.stringify(formData)));
                  this.getSelectedFactory(localStorage.getItem("project-id"));
                }
                this.submitLoading = false;
                this.dialogManageVisible = false;
              });
            } else { // 接口数据
              let result = (await updateProjectTeam({
                description: formData.describe,
                teamName: formData.text,
                id: formData.idStr
              })).data.success;
              resultCallback(
                result,
                "修改成功！",
                () => {
                  this.$emit("factory-handle", "");
                  this.submitLoading = false;
                  this.dialogManageVisible = false;
                },
                () => {
                  this.submitLoading = false;
                }
              );
            }
          } else { // 修改工程
            if (this.isMock) { // mock数据
              this.factoryData[0].children.forEach((group, i) => {
                group.children.forEach((factory, _i) => {
                  if (formData.id === factory.id) {
                    this.$set(group.children, _i, JSON.parse(JSON.stringify(formData)));
                    this.getSelectedFactory(formData.id);
                  }
                });
                this.submitLoading = false;
                this.dialogManageVisible = false;
              });
            } else { // 接口数据
              let result = (await updateProject({
                remark: formData.describe,
                projectName: formData.text,
                id: formData.idStr,
                teamId: formData.teamId
              })).data.success;
              resultCallback(
                result,
                "修改成功！",
                () => {
                  this.getProjectList(formData.teamId, formData.idStr, true); // 获取工程列表，并添加到工程组
                  this.submitLoading = false;
                  this.dialogManageVisible = false;
                },
                () => {
                  this.submitLoading = false;
                }
              );
            }
          }
          break;
      }
    },
    // 封装：重新选中顶部 "工程组列表"
    refreshSelect () {
      this.$nextTick(() => {
        this.level = 1;
        this.id = "root";
        this.$set(this.factoryData[0], "selected", true);
      });
    },
    // 删除
    itemDelete () {
      this.$confirm(`将删除该${this.level === 2 ? "工程组" : "工程"}, 是否继续?`, "提示", {
        type: "warning"
      }).then(async () => {
        if (this.isMock) { // mock数据
          /* 删除数据 */
          this.factoryData[0].children.forEach((group, i) => {
            this.level === 2 && this.id === group.id && this.factoryData[0].children.splice(i, 1);// 删除工程组
            this.level === 3 && group.children.forEach((factory, _i) => { // 删除工程
              this.id === factory.id && group.children.splice(_i, 1);
            });
            /* 删除(工程组下的)工程对应的通道和设备 */
          });
          /* 重定向被选中的树 */
          if (
            this.factoryData[0].children.length === 0 || // 没有一个工程组
            this.factoryData[0].children.every(group => // 有工程组，但所有工程组都没有工程
              (group && group.children.length === 0)
            )
          ) { // 没有工程 -> treeData为空
            this.$emit("factory-select", { // 向父组件传递事件及参数，id设置为null，树数据为空
              level: 3,
              id: "root",
              treeData: []
            });
            this.refreshSelect(); // 重设树，选中顶部 "工程组列表"
          } else if (
            this.factoryData[0].children.some(group => // 有工程组，且至少有1个工程组下面有工程
              group && group.children.length !== 0
            )
          ) { // 还有工程 -> 选中首个工程
            var bool = true;
            this.factoryData[0].children.forEach((group, i) => {
              if (bool && group && group.children.length !== 0) {
                this.level = 3;
                this.id = group.children[0].id;
                this.$set(group.children[0], "selected", true); // 选中第一个工程
                this.$emit("factory-select", { // 向父组件传递事件及参数，id设置为null，树数据为空
                  level: 3,
                  id: group.children[0].id,
                  parentId: group.children[0].parentId,
                  treeData: group.children[0].treeData
                });
                bool = false;
              }
            });
          }
        } else { // 接口数据
          if (this.level === 2) { // 删除工程组
            const result = await deleteProjectTeam({ ids: [this.id] });
            resultCallback(result.data.success, "删除成功！", () => {
              this.$emit("factory-handle", "");
            });
          } else { // 删除工程
            const result = await deleteProject({ ids: [this.id] });
            resultCallback(result.data.success, "删除成功！", async () => {
              await localStorage.setItem("project-id", result.data.data.idStr);
              await localStorage.setItem("team-id", result.data.data.teamId);
              this.$emit("factory-handle", "");
            });
          }
        }
      }).catch(() => { });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
