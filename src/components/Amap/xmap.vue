<template>
  <div class="container">
    <div class="search-box">
      <input id="search" v-model="searchKey" type="search" autocomplete="off">
      <div id="searchTip" class="tip-box" />
    </div>
    <!--
          amap-manager： 地图管理对象
          vid：地图容器节点的ID
          zooms： 地图显示的缩放级别范围，在PC上，默认范围[3,18]，取值范围[3-18]；在移动设备上，默认范围[3-19]，取值范围[3-19]
          center： 地图中心点坐标值
          plugin：地图使用的插件
          events： 事件
        -->
    <el-amap
      class="amap-box"
      :amap-manager="amapManager"
      :vid="'amap-vue'"
      :zoom="zoom"
      :plugin="plugin"
      :center="center"
      :events="events"
    >
      <!-- 标记 -->
      <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker" />
    </el-amap>
  </div>

</template>

<style>
  .container {
    width: 700px;
    height: 500px;
    /*    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    border: 1px solid #999; */
  }

  .search-box {
    position: absolute;
    z-index: 5;
    width: 490px;
    left: 13%;
    top: 10px;
    height: 40px;
  }

  .search-box input {
    float: left;
    width: 490px;
    height: 100%;
    border: 1px solid #30ccc1;
    padding: 0 8px;
    outline: none;
  }

  .search-box button {
    float: left;
    width: 20%;
    height: 100%;
    background: #30ccc1;
    border: 1px solid #30ccc1;
    color: #fff;
    outline: none;
  }

  .tip-box {
    width: 100%;
    max-height: 260px;
    position: absolute;
    top: 40px;
    overflow-y: auto;
    background-color: #fff;
  }
</style>

<script>
import {
  AMapManager,
  lazyAMapApiLoaderInstance
} from 'vue-amap'

const amapManager = new AMapManager()
export default {
  props: ['isEdit', 'longitude', 'latitude', 'receiveStoreDetailAddress'], // 修改的话接收父组件传过来的经纬度，地址
  data() {
    const self = this
    return {
      isEdit: this.isEdit,
      longitude: this.longitude,
      latitude: this.latitude,
      receiveStoreDetailAddress: this.receiveStoreDetailAddress,
      address: null,
      searchKey: '',
      amapManager,
      markers: [],
      searchOption: {
        city: '全国',
        citylimit: true
      },
      center: [116.397428, 39.90923],
      zoom: 17,
      lng: 0,
      lat: 0,
      loaded: false,
      events: {
        init() {
          lazyAMapApiLoaderInstance.load().then(() => {
            self.initSearch()
          })
        },
        // 点击获取地址的数据
        click(e) {
          // console.log(e)
          self.markers = []
          const {
            lng,
            lat
          } = e.lnglat
          self.lng = lng
          self.lat = lat
          self.center = [lng, lat]
          self.markers.push([lng, lat])
          // 这里通过高德 SDK 完成。
          const geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          })
          geocoder.getAddress([lng, lat], function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                console.log('sdasdasda', result)
                self.address = result.regeocode.formattedAddress
                self.searchKey = result.regeocode.formattedAddress
                console.log(self.lng, self.lat, self.address)
                const data = {
                  lng: self.lng,
                  lat: self.lat,
                  address: self.address
                }
                self.$emit('location', data)
                self.$nextTick()
              }
            }
          })
        }
      },
      // 一些工具插件
      plugin: [
        // {
        //   pName: 'Geocoder',
        //   events: {
        //     init (o) {
        //       console.log(o.getAddress())
        //     }
        //   }
        // },
        // {
        //   // 定位
        //   pName: 'Geolocation',
        //   events: {
        //     init(o) {
        //       // o是高德地图定位插件实例
        //       o.getCurrentPosition((status, result) => {
        //         if (result && result.position) {
        //           // 设置经度
        //           self.lng = result.position.lng
        //           // 设置维度
        //           self.lat = result.position.lat
        //           // 设置坐标
        //           self.center = [self.lng, self.lat]
        //           self.markers.push([self.lng, self.lat])
        //           // load
        //           self.loaded = true
        //           // 页面渲染好后
        //           self.$nextTick()
        //         }
        //       })
        //     }
        //   }
        // },
        {
          // 工具栏
          pName: 'ToolBar',
          events: {
            init(instance) {
              console.log(instance)
            }
          }
        }
      ]
    }
  },
  computed: {
    normalizedSize: function() {
      return this.isEdit.trim().toLowerCase()
    },
    normalizedSize1: function() {
      return this.longitude.trim().toLowerCase()
    },
    normalizedSize2: function() {
      return this.latitude.trim().toLowerCase()
    },
    normalizedSize3: function() {
      return this.receiveStoreDetailAddress.trim().toLowerCase()
    }
  },
  created() {
    console.log(this.isEdit)
    console.log(this.longitude)
    console.log(this.latitude)
    console.log(this.receiveStoreDetailAddress)
    if (this.isEdit) {
      this.searchKey = this.receiveStoreDetailAddress
      const arr = []
      arr.push(this.longitude)
      arr.push(this.latitude)
      this.center = arr
      this.markers = []
      this.markers.push(this.center)
    }
    console.log(this.center)
  },
  methods: {
    initSearch() {
      const vm = this
      const map = this.amapManager.getMap()
      AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {
        var poiPicker = new PoiPicker({
          input: 'search',
          placeSearchOptions: {
            map: map,
            pageSize: 10
          },
          suggestContainer: 'searchTip',
          searchResultsContainer: 'searchTip'
        })
        vm.poiPicker = poiPicker
        // 监听poi选中信息
        poiPicker.on('poiPicked', function(poiResult) {
          // console.log(poiResult)
          const source = poiResult.source
          const poi = poiResult.item
          if (source !== 'search') {
            poiPicker.searchByKeyword(poi.name)
          } else {
            poiPicker.clearSearchResults()
            vm.markers = []
            console.log('sdasdadasdas', poi)
            const lng = poi.location.lng
            const lat = poi.location.lat
            const citycode = poi.citycode
            const address = poi.name
            const province = poi.pname
            const city = poi.cityname
            const region = poi.adname
            vm.center = [lng, lat]
            vm.markers.push([lng, lat])
            vm.lng = lng
            vm.lat = lat
            vm.address = address

            const data = {
              lng: vm.lng,
              lat: vm.lat,
              province: province,
              city: city,
              region: region,
              address: vm.address,
              citycode: citycode
            }
            vm.$emit('location', data)

            vm.searchKey = address
          }
        })
      })
    }
  }
}
</script>
