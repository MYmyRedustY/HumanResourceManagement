<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 -->
    <el-form
      ref="deptForm"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="obj in peoples"
            :key="obj.id"
            :label="obj.username"
            :value="obj.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- 确定和消息 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOK">确 定</el-button>
        <el-button size="small" @click="btnCancel">取 消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartmentsApi,
  addDepartmentsApi,
  getDepartDetailApi
} from '@/api/departments'
import { getEmployeeSimpleApi } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      // 首先获取最新的组织架构数据
      const { depts } = await getDepartmentsApi()
      // depts 是所有部门的数据
      const isRepeat = depts
        .filter((item) => item.pid === this.treeNode)
        .some((item) => item.name === value)
      // 如果有重复就报错，没有就通过
      isRepeat ? callback(new Error(`同级部门已经有${value}了`)) : callback
    }
    // 检查部门编码是否重复
    const checkCodeRepeat = async (rule, value, callback) => {
      // 首先获取最新的组织架构数据
      const { depts } = await getDepartmentsApi()
      // depts 是所有部门的数据
      const isRepeat = depts.some((item) => item.code === value)
      // 如果有重复就报错，没有就通过
      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback
    }
    return {
      // 表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      showTitle: '新增子部门',
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            // 长度校验
            min: 1,
            max: 50,
            message: '部门名称长度为1-50个字符',
            trigger: 'blur'
          },
          {
            // 重复性校验：同级别部门名称不能重复
            trigger: 'blur',
            validator: checkNameRepeat
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            // 长度校验
            min: 1,
            max: 50,
            message: '部门编码长度为1-50个字符',
            trigger: 'blur'
          },
          {
            // 重复性校验：同级别部门名称不能重复
            trigger: 'blur',
            validator: checkCodeRepeat
          }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            // 长度校验
            min: 1,
            max: 300,
            message: '部门介绍长度为1-300个字符',
            trigger: 'blur'
          }
        ]
      },
      peoples: []
    }
  },
  // computed: {
  //   showTitle() {
  //     // return this.formData.id ? '编辑部门' : '新增子部门'
  //     return this.formData.name ? '编辑部门' : '新增子部门'
  //   }
  // },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimpleApi()
    },
    btnOK() {
      this.$refs.deptForm.validate(async (isOK) => {
        if (isOK) {
          // 验证通过了就说明可以提交了
          await addDepartmentsApi({ ...this.formData, pid: this.treeNode.id })
          // 请求成功后提醒父组件更新数据
          this.$emit('addDepts')
          // 关闭弹窗页面
          // 1. 传统方式
          // this.$emit('closeShowDialog')
          // 2. 用update语法糖
          this.$emit('update:showDialog', false)
          // 父组件用 :showDialog.sync="showDialog" 接收
        }
      })
    },
    btnCancel() {
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      // this.formData = {
      //   name: '',
      //   code: '',
      //   manager: '',
      //   introduce: ''
      // }
      this.showTitle = '新增子部门'
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清除之前的校验,只能重置定义在data中的数据，因此需要手动重置
      this.$refs.deptForm.resetFields()
    },
    // 获取部门详情
    async getDepartDetail(id) {
      // 获取当前节点以便于编辑
      this.showTitle = '编辑部门'
      this.formData = await getDepartDetailApi(id)
    }
  }
}
</script>

<style>
</style>
