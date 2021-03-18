<template>
  <div>
    <div class="nav">
      <p>{{ dialogStatus }}</p>
      <div slot="header" class="nav-header">
        <el-button @click="exit">
          返回
        </el-button>
        <el-button type="primary" @click="dialogStatus==='新增公告'?createData():updateData()">
          保存
        </el-button>
      </div>
    </div>
    
    <!-- <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible"> -->
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" style="margin-left:50px;margin-bottom: 100px;">
        <el-form-item label="公告标题" prop="name" style="width: 400px;">
          <el-input v-model.trim="temp.name" placeholder="请输入广告标题" />
        </el-form-item>
        
        <el-form-item label="公告内容" prop="desc" style="width: 400px;">
          <el-input v-model.trim="temp.desc" placeholder="请输入广告标题" />
        </el-form-item>
        
        <el-form-item label="是否展示" prop="state">
          <el-radio-group v-model="temp.state">
            <el-radio v-for="item in bulk" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="备注" style="width: 400px;">
          <el-input v-model.trim="temp.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
        
      </el-form>
    
      <!-- </el-dialog> -->
    </div>
</template>

<script>
import {
  noticeUpdate,
  noticeDetails
} from '@/api/notice'


export default {
  components: {

  },
  data() {
    return {
      id: '',
      dialogStatus: '',
      category: [],
      temp: {
        state: 1
      },
      rules: {
        name: [{
          required: true,
          message: '请输入公告标题',
          trigger: 'change'
        }],
        desc: [{
          required: true,
          message: '请输入公告内容',
          trigger: 'change'
        }]
      },
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
      this.dialogStatus = '修改公告'
    } else {
      this.dialogStatus = '新增公告'
    }
  },
  methods: {
    exit() {
      this.$router.push({
        path: this.redirect || '/notice/notice'
      })
    },
    feachData() {
      var setData = {}
      setData.id = this.id
      noticeDetails(setData, 'get').then(res => {
        this.temp = res.data
      })
    },
    // categoryData() { // 查
    //   var setData = {}
    //   setData.dictionariesType = 'noticeType'
    //   dictionariesAisList(setData).then(res => {
    //     this.category = res.result.noticeType.childDictionaries
    //   })
    // },
    createData() { // 完成创建按钮
      this.$refs['dataForm'].validate((valid) => { // 验证
        if (valid) {
          noticeUpdate(this.temp, 'post').then((res) => {
            this.$router.push({
              path: this.redirect || '/notice/notice'
            })
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            sessionStorage.setItem('noticeListQuery', null) // 存入Session Storage缓存
          })
        }
      })
    },
    updateData() { // 完成修改按钮
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          noticeUpdate(this.temp, 'put').then(() => {
            this.$router.push({
              path: this.redirect || '/notice/notice'
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
