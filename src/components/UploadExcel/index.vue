<template>
  <div class="upload-excel">
    <div class="btn-upload">
      <el-button
        :loading="loading"
        size="mini"
        type="primary"
        @click="handleUpload"
      >
        点击上传
      </el-button>
    </div>

    <input
      ref="excel-upload-input"
      class="excel-upload-input"
      type="file"
      accept=".xlsx, .xls"
      @change="handleClick"
    />
    <div
      class="drop"
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragenter="handleDragover"
    >
      <i class="el-icon-upload" />
      <span>将文件拖到此处</span>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function // eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      // 把读取的数据向外传递给Onsuccess方法
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]
      if (!this.isExcel(rawFile)) {
        this.$message.error(
          'Only supports upload .xlsx, .xls, .csv suffix files'
        )
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    // 点击按钮
    handleUpload() {
      // 触发 input输入框的点击事件
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      // files就是存储选择到的那个文件的变量 数据类型 数组
      const files = e.target.files
      // rawFile得到的就是第一个文件
      const rawFile = files[0] // only use files[0]、
      // 如果没有选择文件 该代码后面的代码就停止执行
      if (!rawFile) return
      // 如果我选择到了文件，那就上传文件
      this.upload(rawFile)
    },
    // 上传文件
    upload(rawFile) {
      // 清空文件框
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      // 什么操作都不做
      if (!this.beforeUpload) {
        // 调用readerData方法来读取 rawFile中的数据
        this.readerData(rawFile)
        return
      }
      // 在上传之前 要做什么操作

      // 把rawFile传给 beforeUpload方法做一些处理
      const before = this.beforeUpload(rawFile)
      // 如果before是有值的
      if (before) {
        // 使用rederData去读去rawFile
        this.readerData(rawFile)
      }
    },
    // 读取数据
    readerData(rawFile) {
      // 开始读取
      this.loading = true
      // 返回了一个promise对象
      return new Promise((resolve, reject) => {
        // reader 是FileReader实例对象
        // FileReader 文件读取器
        const reader = new FileReader()
        // 读取完成之后 触发onload
        reader.onload = (e) => {
          // 文件的内容
          const data = e.target.result
          // 插件 XLSX读取文件的 方法read 读取 reader.result的结果返回一个数组
          const workbook = XLSX.read(data, { type: 'array' })
          // 一个一个的styleSheet的名字
          const firstSheetName = workbook.SheetNames[0]
          // 获取一个个的工作表
          const worksheet = workbook.Sheets[firstSheetName]
          // 表格的表头
          const header = this.getHeaderRow(worksheet)
          // 表格内容
          const results = XLSX.utils.sheet_to_json(worksheet)
          // 创建数据
          this.generateData({ header, results })
          // 读取结束
          this.loading = false
          // 读取成功 改变状态为成功
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin-top: 100px;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .btn-upload,
  .drop {
    border: 1px dashed #bbb;
    width: 350px;
    height: 160px;
    text-align: center;
    line-height: 160px;
  }
  .drop {
    line-height: 80px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
    }
  }
}
</style>
