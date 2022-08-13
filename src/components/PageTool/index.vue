<template>
  <el-card>
    <el-row type="flex" justify="space-between" align="middle">
      <el-col>
        <!-- 前插槽 -->
        <div v-if="showBefore" class="before">
          <i class="el-icon-info"></i>
          <slot name="before" />
        </div>
      </el-col>
      <el-col>
        <!-- 后插槽 -->
        <el-row type="flex" justify="end">
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
// 组件可以显示左侧内容，也可以展示右侧内容
// 如果左侧内容不传，图标就不应该显示
export default {
  props: {
    showBefore: {
      default: false,
      type: Boolean
    }
  }
}
</script>

<style>
</style>