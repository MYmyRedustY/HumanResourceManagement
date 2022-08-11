<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 给组件传值，传的是公司名 -->
        <TreeTool :tree-node="company" :is-root="true" />
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <TreeTool slot-scope="{ data }" :tree-node="data" />
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTool from './components/tree-tools.vue'
import { getDepartmentsApi } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
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
      departs: [],
      company: {}
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const res = await getDepartmentsApi()
      this.company = { name: res.companyName, manager: '负责人' }
      this.departs = tranListToTreeData(res.depts,'')
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
