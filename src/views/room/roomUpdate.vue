<template>
  <div>
    <div class="nav">
      <p>{{ dialogStatus }}</p>
      <div slot="header" class="nav-header">
        <el-button @click="exit">
          返回
        </el-button>
        <el-button type="primary" @click="dialogStatus==='新增房间'?createData():updateData()">
          保存
        </el-button>
      </div>
    </div>

    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px">
      <el-row :gutter="20" style="padding: 0 4%;">
        <el-col :span="12">
          <div style="width: 80%;">
            <el-form-item label="门店" prop="storeId">
              <el-select v-model.trim="temp.storeId" class="filter-item" style="width: 100%;" placeholder="请选择门店">
                <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="房间标题" prop="tittle">
              <el-input v-model.trim="temp.tittle" placeholder="请输入房间标题" />
            </el-form-item>
            <el-form-item label="房间号" prop="roomNo">
              <el-input v-model.trim="temp.roomNo" placeholder="请输入产品名称" />
            </el-form-item>

            <el-form-item label="可居住人数" prop="canResideNum">
              <el-input v-model.trim="temp.canResideNum" placeholder="可居住人数" />
            </el-form-item>

            <el-form-item label="房间类型" prop="roomType">
              <el-select v-model.trim="temp.roomType" class="filter-item" style="width: 100%;" placeholder="请选择房间类型">
                <el-option v-for="item in roomTypeList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>

            <el-form-item label="房间状态" prop="roomState">
              <el-select v-model.trim="temp.roomState" class="filter-item" style="width: 100%;" placeholder="请选择房间状态">
                <el-option :key="0" :label="'上架可租用'" :value="0" />
                <el-option :key="1" :label="'下架不可租用'" :value="1" />
                <el-option :key="-1" :label="'已下架'" :value="-1" />
              </el-select>
            </el-form-item>

            <el-form-item label="房间面积数" prop="roomArea">
              <el-input v-model.trim="temp.roomArea" type="number" placeholder="请输入房间面积数" />
            </el-form-item>

            <el-form-item label="是否有窗" prop="hasWindows">
              <el-select v-model.trim="temp.hasWindows" class="filter-item" style="width: 100%;" placeholder="请选择房间状态">
                <el-option :key="0" :label="'无窗'" :value="0" />
                <el-option :key="1" :label="'有窗'" :value="1" />
              </el-select>
            </el-form-item>

            <el-form-item label="床铺数" prop="bedNum">
              <el-input v-model.trim="temp.bedNum" placeholder="请输入床铺数" />
            </el-form-item>

            <el-form-item label="房间原价" prop="roomPriceNow">
              <el-input v-model.trim="temp.roomPriceOld" step="0.1" placeholder="请输入房间原价" />
            </el-form-item>

            <el-form-item label="房间现价" prop="roomPriceOld">
              <el-input v-model.trim="temp.roomPriceNow" placeholder="请输入房间现价" />
            </el-form-item>

            <el-form-item label="是否特价房" prop="isSpecialOffer">
              <el-select v-model.trim="temp.isSpecialOffer" class="filter-item" style="width: 100%;"
                placeholder="请选择特价房状态">
                <el-option :key="0" :label="'非特价'" :value="0" />
                <el-option :key="1" :label="'特价'" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="房间描述" prop="roomDesc">
              <el-input v-model.trim="temp.roomDesc" placeholder="请输入房间描述" />
            </el-form-item>


            <el-form-item label="房间现价" prop="roomConfiguration">
              <el-checkbox-group v-model="roomConfiguration">
                <el-checkbox v-for="item in roomConfigurationList" :label="item.key">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

          </div>
        </el-col>

      </el-row>
      <el-row style="padding: 0 4%;">
        <el-col :span="24">
          <div style="width: 80%;">
            <el-form-item label="房间主图">
              <el-upload ref="upload" class="avatar-uploader" action="#" :show-file-list="false"
                :http-request="uploadSectionFile" :auto-upload="true" :before-upload="beforeAvatarUpload">
                <img v-if="temp.mainImage" :src="baseURL+temp.mainImage" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <span v-if="temp.mainImage" class="handleRemove" @click="handleRemove()">
                <i class="el-icon-delete" />
              </span>
            </el-form-item>
            <el-form-item label="详情图" class="avatar-uploader2">
              <span v-for="(img,index) in imgArr" v-if="imgArr" class="avatarIMG">
                <img :src="baseURL+img" class="avatar">
                <i class="el-icon-delete handleRemove2" @click="handleRemove2(index)" />
              </span>
              <el-upload v-if="imgNum < 5" ref="upload" :class="[imgNum == 0?'uploadBtnOne':'']" action="#"
                :show-file-list="false" :http-request="uploadSectionFile2" :auto-upload="true">

                <i class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import {
    roomUpdate,
    roomDetails
  } from '@/api/room'
  import {
    upload
  } from '@/api/file'
  import {
    roomTypeList
  } from '@/api/roomType'
  import {
    storeList
  } from '@/api/store'
  export default {
    components: {
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
        roomTypeList: [],
        storeList: [],
        roomConfiguration: [],
        roomConfigurationList: [{
            key: '0',
            label: '自助入住'
          },
          {
            key: '1',
            label: '电梯'
          },
          {
            key: '2',
            label: '空调'
          },
          {
            key: '15',
            label: '洗衣机'
          },
          {
            key: '3',
            label: '无线网络'
          },
          {
            key: '4',
            label: '衣架'
          },
          {
            key: '5',
            label: '洗发水'
          },
          {
            key: '6',
            label: '按摩浴缸'
          },
          {
            key:'7',
            label: '吹风机'
          },
          {
            key: '8',
            label: '热水'
          },
          {
            key: '9',
            label: '冰箱'
          },
          {
            key: '10',
            label: '热水壶'
          },
          {
            key: '11',
            label: '一氧化碳报警器'
          },
          {
            key: '12',
            label: '灭火器'
          },
          {
            key: '13',
            label: '洗手液'
          },
          {
            key: '14',
            label: '急救包'
          }
        ],
        imgNum: 0,
        imgArr: [],
        labelData: [],
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
      this.categoryData()
      this.id = this.$route.query.id
      console.log(this.id)
      if (this.id) {
        this.feachData()
        this.dialogStatus = '修改房间'
      } else {
        this.dialogStatus = '新增房间'
      }
    },
    methods: {
      handleRemove() { // 清空图片上传列表
        this.temp.mainImage = ''
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

        upload(form).then((res) => {
          if (res.code === 200) {
            this.temp.mainImage = res.data[0]
            this.$notify({
              title: '成功',
              message: '上传成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '上传失败',
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      handleRemove2(index) { // 清空图片上传列表
        this.imgArr.splice(index, 1)
        if (this.imgArr.length > 0) {
          this.imgNum = this.imgArr.length
        }
      },
      beforeAvatarUpload(file) {
        const isJPEG = file.type === 'image/jpeg'
        const isJPG = file.type === 'image/jpg'
        const isPNG = file.type === 'image/png'
        const isBMP = file.type === 'image/bmp'

        if (!isJPG && !isJPEG && !isPNG && !isBMP) {
          this.$message.error('请上传图片格式!（".jpg", ".png",".jpeg",".bmp"）')
        }
        return isJPEG || isPNG || isJPG || isBMP
      },
      uploadSectionFile2(param) { // 覆盖原有上传，实现自定义上传
        const file = param.file
        // 根据后台需求数据格式
        const form = new FormData()
        // 文件对象
        form.append('files', file)

        upload(form).then((response) => {
          this.imgArr.push(response.data)
          this.imgNum = this.imgArr.length
          this.$notify({
            title: '成功',
            message: '上传成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      feachData() {
        var setData = {}
        setData.id = this.id
        roomDetails(setData).then(res => {
          const temp = res.data
          this.imgArr = temp.roomImages.split(',')
          if (temp.roomConfiguration) {
            this.roomConfiguration = temp.roomConfiguration.split(',')
            console.log(this.roomConfiguration)
          }

          // temp.attributeValues.reverse()
          this.temp = temp
        })
      },
      categoryData() {
        var setData = {}
        setData.page = 1
        setData.pageSize = 9999
        roomTypeList(setData).then(res => {
          this.roomTypeList = res.data.records
        })
        storeList(setData).then(response => {
          this.storeList = response.data.records
        })
      },
      exit() {
        this.$router.push({
          path: this.redirect || '/room/room'
        })
      },
      createData() { // 完成创建按钮
        this.temp.roomImages = this.imgArr.toString()
        this.temp.roomConfiguration = this.roomConfiguration.toString()

        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            roomUpdate(this.temp, 'post').then((response) => {
              this.$router.push({
                path: this.redirect || '/room/room'
              })
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              sessionStorage.setItem('roomListQuery', null) // 存入Session Storage缓存
            })
          }
        })
      },
      updateData() { // 完成修改按钮
        this.temp.roomImages = this.imgArr.toString()
        this.temp.roomConfiguration = this.roomConfiguration.toString()
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            roomUpdate(this.temp, 'put').then(() => {
              this.$router.push({
                path: this.redirect || '/room/room'
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
