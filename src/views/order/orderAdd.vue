<template>
  <div>
    <div class="nav">
      <p>录入订单</p>
      <div slot="header" class="nav-header">
        <el-button @click="$router.back()">
          返回
        </el-button>
        <el-button type="primary" @click="createData()">
          保存
        </el-button>
      </div>
    </div>

    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px"
      style="width: 488px; margin-left:50px;margin-bottom: 100px;">
      <el-form-item label="房间" prop="orderRoomId">
        <el-select v-model.trim="temp.orderRoomId" class="filter-item" style="width: 100%;" placeholder="请选择房间">
          <el-option v-for="item in roomList" :key="item.id" :label="item.roomNo" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="预定日期" prop="orderReserveTimeStart">
        <el-date-picker v-model.trim="date" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']" :picker-options="pickerOptions" style="width: 100%;"
          range-separator="至" start-placeholder="入住日期" end-placeholder="退房日期" align="right" @change="addDate" />
      </el-form-item>

      <el-form-item label="预定到达时间">
        <el-time-select v-model="temp.estimateArriveTime" :picker-options="{
    start: '00:00',
    step: '00:30',
    end: '24:00'
  }" style="width: 100%;" placeholder="预定到达时间">
        </el-time-select>
      </el-form-item>

      <el-form-item label="居住人数" prop="numberOfResidents">
        <el-input v-model.trim="temp.numberOfResidents" placeholder="请输入居住人数" />
      </el-form-item>

      <el-form-item label="预留人" prop="reserveName">
        <el-input v-model.trim="temp.reserveName" placeholder="请输入预留人" />
      </el-form-item>
      <el-form-item label="预留人号码" prop="reservePhone">
        <el-input v-model.trim="temp.reservePhone" type="number" placeholder="请输入预留人号码" />
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import {
    roomList
  } from '@/api/room'
  import {
    orderTableAdd
  } from '@/api/order'
  export default {
    components: {
      Pagination
    },
    data() {
      return {
        temp: {},
        roomList: [],
        date: [],
        rules: {
          orderRoomId: [{
            required: true,
            message: '请输入房间',
            trigger: 'blur'
          }],
          orderReserveTimeStart: [{
            required: true,
            message: '请选择预定时间',
            trigger: 'blur'
          }],
          numberOfResidents: [{
            required: true,
            message: '请输入居住人数',
            trigger: 'blur'
          }],
          reserveName: [{
            required: true,
            message: '请输入预留人',
            trigger: 'blur'
          }],
          reservePhone: [{
            required: true,
            message: '请输入预留人号码',
            trigger: 'blur'
          }]
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
          }
        },
      }
    },
    created() {
      this.feachData()
    },
    methods: {
      feachData() {
        var setData = {}
        setData.page = 1
        setData.pageSize = 9999
        roomList(setData).then(res => {
          this.roomList = res.data.records
        })
      },
      createData() { // 完成创建按钮

        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            orderTableAdd(this.temp).then((response) => {
              this.$router.push({
                path: this.redirect || '/order/orderList'
              })
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      addDate() {
        console.log(this.date)
        if (this.date) {
          this.temp.orderReserveTimeStart = this.date[0]
          this.temp.orderReserveTimeEnd = this.date[1]
        } else {
          this.temp.orderReserveTimeStart = ''
          this.temp.orderReserveTimeEnd = ''
        }
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
