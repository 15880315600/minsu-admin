<template>
  <div>
    <div class="nav">
      <p>{{ dialogStatus }}</p>
      <div slot="header" class="nav-header">
        <el-button @click="exit">
          返回
        </el-button>
        <el-button type="primary" @click="dialogStatus==='新增房间类型'?createData():updateData()">
          保存
        </el-button>
      </div>
    </div>

    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px">
      <el-row :gutter="20" style="padding: 0 4%;">
        <el-col :span="12">
          <div style="width: 80%;">

            <el-form-item label="房间类型id" prop="id">
              <el-test v-model.trim="temp.id" placeholder="房间类型id" />
            </el-form-item>

            <el-form-item label="房间类型名" prop="name">
              <el-input v-model.trim="temp.name" placeholder="房间类型名" />
            </el-form-item>

          </div>
        </el-col>

      </el-row>
    </el-form>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import {
    roomTypeUpdate,
    roomTypeDetails
  } from '@/api/roomType'
  import {
    upload
  } from '@/api/file'

  export default {
    components: {
      VueUeditorWrap,
      Pagination
    },
    data() {
      return {
        dialogStatus: '',
        dialogStatusDialog: '',
        input: '',
        tableData: [],
        listLength: 0,
        temp: {
          mainImage: ''
        },
        list: [],
        templates: [],
        mdlistQuery: {
          page: 1,
          pageSize: 10
        },
        mdlistQuerygg: {
          page: 1,
          pageSize: 10
        },
        rules: {}
      }
    },
    created() {
      // this.categoryData()
      this.id = this.$route.query.id
      console.log(this.id)
      if (this.id) {
        this.feachData()
        this.dialogStatus = '修改房间类型'
      } else {
        this.dialogStatus = '新增房间类型'
      }
    },
    methods: {
      handleRemove() { // 清空图片上传列表
        this.temp.mainImage = ''
      },
      feachData() {
        var setData = {}
        setData.id = this.id
        roomDetails(setData).then(res => {
          const temp = res.data
          this.imgArr = temp.roomImages.split(',')
          // temp.attributeValues.reverse()
          this.temp = temp
        })
      },
      exit() {
        this.$router.push({
          path: this.redirect || '/roomType/roomType'
        })
      },
      createData() { // 完成创建按钮
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            roomTypeUpdate(this.temp, 'post').then((response) => {
              this.$router.push({
                path: this.redirect || '/roomType/roomType'
              })
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              sessionStorage.setItem('roomTypeListQuery', null) // 存入Session Storage缓存
            })
          }
        })
      },
      updateData() { // 完成修改按钮
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            roomTypeUpdate(this.temp, 'put').then(() => {
              this.$router.push({
                path: this.redirect || '/roomType/roomType'
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
      },
      checkSpecifications() {
        if (this.dialogStatus == '修改产品') {
          this.categoryData2()
        }
        this.dialogFormVisible = true
      },
      addValue(item) {
        item.inputListArr.push(item.input)
        item.input = ''
      },
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

  /* 上传多图 */
  .avatar-uploader2 .el-upload {
    border-radius: 6px;
    margin-left: 10px;
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
    border: 1px dashed #d9d9d9;
  }

  .avatar-uploader2 .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }

  .avatar-uploader2 .avatarIMG {
    position: relative;
    width: 178px;
    height: 178px;
    display: block;
    float: left;
    margin-left: 10px;
    border: 1px dashed #d9d9d9;
  }

  .avatar-uploader2 .avatarIMG:first-child {
    margin-left: 0px;
  }

  .avatar-uploader2 .avatar:first-child {
    margin-left: 0;
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

  .uploadBtnOne .el-upload {
    margin-left: 0px;
  }

  .el-form-item {
    margin-bottom: 12px;
  }

  .productDialog .el-dialog__body {
    padding: 0px 20px;
  }
</style>
