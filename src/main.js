import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import VueAMap from 'vue-amap'

import '@/styles/index.scss' // global css
import '@/styles/init.css' // 自定义全局样式

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(VueAMap)
// 图片拼接地址
// Vue.prototype.baseURL = 'http://192.168.56.1/img/'
Vue.prototype.baseURL = 'http://101.37.253.98/img/'
// Vue.prototype.baseURL = 'http://192.168.2.168/img/'
Vue.config.productionTip = false
VueAMap.initAMapApiLoader({
  key: '7fa33c0b36219b7daa62332b3dba32b8',
  plugin: [
    'AMap.Autocomplete', // 输入提示插件
    'AMap.PlaceSearch', // POI搜索插件
    'AMap.Scale', // 右下角缩略图插件 比例尺
    'AMap.OverView', // 地图鹰眼插件
    'AMap.ToolBar', // 地图工具条
    'AMap.MapType', // 类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
    'AMap.PolyEditor', // 编辑 折线多，边形
    'AMap.CircleEditor', // 圆形编辑器插件
    'AMap.Geolocation' // 定位控件，用来获取和展示用户主机所在的经纬度位置
  ],
  v: '1.4.15',
  uiVersion: '1.0'
})



new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
