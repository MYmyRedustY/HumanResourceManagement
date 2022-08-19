<template>
  <div>
    <el-upload
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :file-list="fileList"
      list-type="picture-card"
      action="#"
      :limit="1"
      :class="{ disabled: fileComputed }"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress
      v-if="showPercent"
      style="width: 180px"
      :percentage="percent"
    />
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云的包
// 需要实例化
const cos = new COS({
  SecretId: 'AKID8D8l7D1ZpnUt3wYuznJYWDepiKfkY5LJ',
  SecretKey: 'lFUS8WdT2KL6ankRu97uQfdMp7B1astg'
}) // 实例化的包 已经具有了上传的能力 可以上传到该账号里面的存储桶了
export default {
  name: 'ImageUpload',
  data() {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      showPercent: true,
      percent: 0,
      imgUrl: '',
      currentFileUid: null
    }
  },
  computed: {
    // 当有图片时，不显示上传按钮
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      console.log('1' + this.fileList)
      this.showDialog = true
    },
    handleRemove(file) {
      // file是点击删除的文件
      // 将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid)
    },
    changeFile(file, fileList) {
      // 修改文件时触发
      // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
      // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
      // [] => [...fileList] [] => fileList.map()
      // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
      this.fileList = fileList.map((item) => item)
    },
    beforeUpload(file) {
      console.dir(file)
      const types = [
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/bmp',
        'image/png'
      ]
      // 检查文件类型
      if (!types.includes(file.type)) {
        // 不符合格式要求直接终止
        // 提示
        this.$message.error('上传图片只能是 JPG、JPEG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小不能超过5M')
        return false
      }
      //   已经确定当前上传的就是当前的这个file了
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    upload(params) {
      //   console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject(
          {
            Bucket: 'myphoto-1313374931', // 存储桶
            Region: 'ap-chengdu', // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            onProgress: (params) => {
              this.percent = params.percent * 100
            }
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            // console.log(err || data)
            // data中有一个statusCode === 200 的时候说明上传成功
            if (!err && data.statusCode === 200) {
              // 此时说明文件上传成功  要获取成功的返回地址
              // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
              // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
              // 需要知道当前上传成功的是哪一张图片
              this.fileList = this.fileList.map((item) => {
                // 去找谁的uid等于刚刚记录下来的id
                // console.log(item.uid)
                if (item.uid === this.currentFileUid) {
                  // console.log(data.Location)
                  // 将成功的地址赋值给原来的url属性
                  return { url: 'http://' + data.Location, upload: true }
                  // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                  // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
                }
                return item
              })
              setTimeout(() => {
                this.showPercent = false // 隐藏进度条
                this.percent = 0 // 进度归0
              }, 2000)
              // console.log(this.fileList)
              // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
            }
          }
        )
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
