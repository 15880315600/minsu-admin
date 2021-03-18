<template>
  <div>
    <div class="nav">
      <p>{{ dialogStatus }}</p>
      <div slot="header" class="nav-header">
        <el-button @click="exit">
          返回
        </el-button>
        <el-button type="primary" @click="dialogStatus==='新增广告'?createData():updateData()">
          保存
        </el-button>
      </div>
    </div>

    <!-- <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible"> -->
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" style="margin-left:50px;margin-bottom: 100px;">
      <el-form-item label="标题" prop="adName" style="width: 400px;">
        <el-input v-model.trim="temp.adName" placeholder="请输入广告标题" />
      </el-form-item>
      <el-form-item label="图片" style="width: 400px;" prop="adImage">
        <el-upload
          ref="upload"
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :http-request="uploadSectionFile"
          :auto-upload="true"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="temp.adImage" :src="baseURL+temp.adImage" width="178" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <span v-if="temp.adImage" class="handleRemove" @click="handleRemove()">
          <i class="el-icon-delete" />
        </span>
      </el-form-item>
      <el-form-item label="广告地址" prop="adLinkUrl" style="width: 400px;">
        <el-input v-model.trim="temp.adLinkUrl" placeholder="请输入广告地址" />
      </el-form-item>
      <el-form-item label="备注" style="width: 400px;">
        <el-input v-model.trim="temp.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="排序" prop="sort" style="width: 400px;">
        <el-input v-model.trim="temp.sort" placeholder="请输入排序" />
      </el-form-item>
      <el-form-item label="是否发布" prop="adStatus">
        <el-radio-group v-model="temp.adStatus">
          <el-radio v-for="item in bulk" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <!-- </el-dialog> -->
  </div>
</template>

<script>
import {
  advertisementUpdate,
  advertisementDetails
} from '@/api/advertisement'
// import {
//   dictionariesAisList
// } from '@/api/dictionary'
import {
  upload
} from '@/api/file'
export default {
  components: {

  },
  data() {
    return {
      id: '',
      dialogStatus: '',
      category: [],
      temp: {
        pictureUrl: '',
        category: '',
        adStatus: 1
      },
      rules: {
        title: [{
          required: true,
          message: '请输入广告标题',
          trigger: 'change'
        }],
        adLinkUrl: [{
          required: true,
          message: '请输入广告地址',
          trigger: 'change'
        }],
        sort: [{
          required: true,
          message: '请输入排序',
          trigger: 'change'
        }],
        adStatus: [{
          required: true,
          message: '请选择状态',
          trigger: 'change'
        }],
        adImage: [{
          required: true,
          message: '请上传广告图片',
          trigger: 'change'
        }]
      },
      imgArr: [],
      bulk: [{
        value: 1,
        label: '发布'
      }, {
        value: 0,
        label: '下架'
      }]
    }
  },
  created() {
    // this.categoryData()
    this.id = this.$route.query.id
    console.log(this.id)
    if (this.id) {
      this.feachData()
      this.dialogStatus = '修改广告'
    } else {
      this.dialogStatus = '新增广告'
    }
  },
  methods: {
    handleRemove() { // 清空图片上传列表
      this.temp.adImage = ''
    },
    beforeAvatarUpload(file) {
      const isJPEG = file.type === 'image/jpeg'
      const isJPG = file.type === 'image/jpg'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isJPEG && !isPNG && !isBMP) {
        this.$message.error('请上传图片格式!（".jpg", ".png",".jpeg",".bmp"）')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPEG || isPNG || isJPG || isBMP) && isLt2M
    },
    uploadSectionFile(param) { // 覆盖原有上传，实现自定义上传
      const file = param.file
      // 根据后台需求数据格式
      const form = new FormData()
      // 文件对象
      form.append('files', file)

      upload(form).then((response) => {
        this.temp.adImage = response.data[0]
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    exit() {
      this.$router.push({
        path: this.redirect || '/advertisement/advertisement'
      })
    },
    feachData() {
      var setData = {}
      setData.id = this.id
      advertisementDetails(setData, 'get').then(res => {
        this.temp = res.data
      })
    },
    // categoryData() { // 查
    //   var setData = {}
    //   setData.dictionariesType = 'advertisementType'
    //   dictionariesAisList(setData).then(res => {
    //     this.category = res.result.advertisementType.childDictionaries
    //   })
    // },
    createData() { // 完成创建按钮
      this.$refs['dataForm'].validate((valid) => { // 验证
        if (valid) {
          advertisementUpdate(this.temp, 'post').then((res) => {
            this.$router.push({
              path: this.redirect || '/advertisement/advertisement'
            })
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            sessionStorage.setItem('advertisementListQuery', null) // 存入Session Storage缓存
          })
        }
      })
    },
    updateData() { // 完成修改按钮
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          advertisementUpdate(this.temp, 'put').then(() => {
            this.$router.push({
              path: this.redirect || '/advertisement/advertisement'
            })
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style>
  .nav {
    width: 100%;
    height: 56px;
    border: 1px solid #E8E8E8;
    margin-bottom: 28px;
  }

  .nav p {
    float: left;
    font-weight: 700;
    margin: 18px 24px;
    color: #606266;
  }

  .nav .nav-header {
    margin-right: 20px;
    float: right;
  }

  .nav .nav-header .el-button {
    padding: 10px 20px !important;
    margin-top: 10px;
  }

  .el-input__inner {
    height: 36px !important;
    line-height: 36px !important;
  }

  label {
    font-weight: normal;
  }

  /* 上传图片 */
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .handleRemove {
    opacity: .6;
    position: absolute;
    left: 155px;
    top: 0px;
  }

  /* 上传图片 */
  .avatar-uploader2 .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader2 .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    margin-left: 10px;
    border: 1px dashed #d9d9d9;
  }

  .avatar-uploader2 .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }

  .avatar-uploader2 .avatar {
    position: relative;
    width: 178px;
    height: 178px;
    display: block;
    float: left;
    margin-left: 10px;
    border: 1px dashed #d9d9d9;
  }

  .avatar-uploader2 .avatar:hover {
    border-color: #409EFF;
  }

  .handleRemove2 {
    opacity: .6;
    position: absolute;
    right: 10px;
    top: 10px;
  }
</style>
