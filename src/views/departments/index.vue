<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 给组件传值，传的是公司名 -->
        <TreeTool :treeNode="company" :isRoot="true"></TreeTool>
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <TreeTool slot-scope="{ data }" :treeNode="data"></TreeTool>
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTool from './components/tree-tools.vue'
export default {
  components: {
    TreeTool
  },
  data() {
    return {
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      departs: [
        { name: '总裁办', children: [{ name: '董事会' }] },
        { name: '行政部' },
        { name: '人事部' }
      ],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' }
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
