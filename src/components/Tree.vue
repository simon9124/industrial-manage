<!--
  https://github.com/zdy1988/vue-jstree/blob/master/README-CN.md
  data  Array 设置树的数据源
  size  String  设置树节点的大小, 可选值 : 'large' or '' or ''small'
  show-checkbox Boolean false 设置是否显示选择框
  allow-transition  Boolean true  设置是否允许使用过渡效果
  whole-row Boolean false 设置是否整个树节点高亮
  no-dots Boolean false 设置是否显示树节点前的虚线
  collapse  Boolean false 设置节点全部展开或合并的初始值，不设置按节点自身的 opened 属性控制
  is-multiple Boolean false 设置是否可以多选
  allow-batch Boolean false 设置允许批量选择子节点
  treeName-field-name String  'treeName'  设置 文字 的字段名称，默认为 treeName
  value-field-name  String  'value' 设置 值 的字段名称，默认为 value
  children-field-name String  'children'  设置 子节点 的字段名称，默认为 children
  item-events Object  {}  注册任意事件到每个数节点上, 例子
  async Function  异步加载数据的回调函数 , 如果当前节点没有子项 ,设置树节点中的 'isLeaf: true' 可不现实 + 号
  loading-treeName  String  'Loading' 设置 Loading 文字
  draggable Boolean false 设置是否启用拖拽 , 默认全部节点可拖拽, 如自定义个别节点禁用拖拽或禁用拖放可设置 'dragDisabled: true' 和 'dropDisabled: true'
  drag-over-background-color  String  '#C9FDC9' 设置拖拽进入节点时的背景色
  klass String  设置追加 class
  type-field:   节点类型 根节点:root/子节点:leaf
  parent-field: 父节点替换字段
  isEdit: 是否可编辑
-->
<template>
  <div>

    <!-- 树 · 含右键菜单-->
    <div v-if="contextmenu"
         @contextmenu.prevent="$refs.ctx.open($event)">
      <v-jstree :data="data"
                :collapse="collapse"
                @item-click="itemClick"
                @item-toggle="itemClick"></v-jstree>
    </div>

    <!-- 树 · 不含右键菜单-->
    <v-jstree v-else
              :data="data"
              :collapse="collapse"
              @item-click="itemClick"></v-jstree>
    <!-- @item-toggle="itemClick" -->

    <!--右键菜单-->
    <context-menu id="ctx"
                  ref="ctx">
      <li class="ctx-header"></li>
      <li v-if="level===1||(level===2&&id&&id.slice(0,1)==='1')"
          class="ctx-item"
          @click="itemHandle('add')">新建{{level===1?'通道':"设备"}}</li>
      <li v-if="level!==1"
          class="ctx-item"
          @click="itemHandle('del')">删除{{level===2?'通道':"设备"}}</li>
      <li v-if="level===1||(level===2&&id&&id.slice(0,1)==='1')"
          class="ctx-sperator">
        <hr>
      </li>
      <li v-if="level===1||(level===2&&id&&id.slice(0,1)==='1')"
          class="ctx-item"
          @click="itemHandle('copy')">复制{{level===1?'通道':"设备"}}</li>
      <li v-if="level!==1&&id&&id.slice(0,1)==='1'"
          class="ctx-sperator">
        <hr>
      </li>
      <li v-if="level!==1&&id&&id.slice(0,1)==='1'"
          class="ctx-item"
          @click="itemHandle('up')">{{level===2?'通道':"设备"}}上移</li>
      <li v-if="level!==1&&id&&id.slice(0,1)==='1'"
          class="ctx-item"
          @click="itemHandle('down')">{{level===2?'通道':"设备"}}下移</li>
    </context-menu>

  </div>
</template>

<script>
import VJstree from "vue-jstree"; // 组件：树
import contextMenu from "vue-context-menu"; // 组件：右键功能弹窗

export default {
  name: "VueTree",
  components: { VJstree, contextMenu },
  props: {
    // 树数据
    data: {
      type: Array,
      default: () => []
    },
    // 被选择的id
    id: {
      type: String
    },
    // 是否显示右键菜单
    contextmenu: {
      type: Boolean,
      default: true
    },
    // 是否全部展开
    collapse: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      level: 1, // 被选中节点的层级
      /* dialog */
      dialogVisible: false, // 是否可见
      dialogTitle: "", // 标题
      isAdd: true // 是否为新增 true of false
    };
  },
  methods: {
    // 点击树节点 - 鼠标左键右键均有效
    itemClick (node) {
      // console.log(node.model);
      this.level = node.model.level;
      this.$emit("item-click", node.model);
    },
    // 树节点操作 - 增删改查
    itemHandle (type) {
      this.$emit("item-handle", type);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
