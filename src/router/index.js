import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      meta: {
        title: '首页',
        icon: 'dashboard',
        affix: true
      }
    }]
  },

  {
    path: '/userManagement',
    component: Layout,
    redirect: '/userManagement/userList',
    name: 'UserManagement',
    meta: {
      title: '用户管理',
      icon: 'el-icon-s-custom',
    },
    children: [{
      path: 'userList',
      name: 'UserList',
      component: () => import('@/views/userManagement/userList'),
      meta: {
        title: '用户管理'
      }
    }]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/orderList',
    name: 'order',
    meta: {
      title: '订单管理',
      icon: 'el-icon-picture',
    },
    children: [{
        path: 'orderList',
        name: 'OrderList',
        component: () => import('@/views/order/orderList'),
        meta: {
          title: '订单列表'
        }
      },
      {
        path: 'orderAdd',
        name: 'OrderAdd',
        hidden: true,
        component: () => import('@/views/order/orderAdd'),
        meta: {
          title: '添加订单',
          activeMenu: '/order/orderList'
        }
      }
    ]
  },
  {
    path: '/roomType',
    component: Layout,
    redirect: '/roomType/roomType',
    name: 'roomType',
    meta: {
      title: '房间类型管理',
      icon: 'el-icon-picture',
    },
    children: [{
        path: 'roomType',
        name: 'roomTypeIndex',
        component: () => import('@/views/roomType/roomType'),
        meta: {
          title: '房间类型列表'
        }
      },
      {
        path: 'roomTypeUpdate',
        name: 'roomTypeUpdate',
        hidden: true,
        component: () => import('@/views/roomType/roomTypeUpdate'),
        meta: {
          title: '编辑房间类型',
          activeMenu: '/roomType/roomType'
        }
      }
    ]
  },

  {
    path: '/store',
    component: Layout,
    redirect: '/store/store',
    name: 'store',
    meta: {
      title: '门店管理',
      icon: 'el-icon-picture',
    },
    children: [{
        path: 'store',
        name: 'storeIndex',
        component: () => import('@/views/store/store'),
        meta: {
          title: '门店列表'
        }
      },
      {
        path: 'storeUpdate',
        name: 'storeUpdate',
        hidden: true,
        component: () => import('@/views/store/storeUpdate'),
        meta: {
          title: '编辑门店',
          activeMenu: '/store/store'
        }
      }
    ]
  },

  {
    path: '/room',
    component: Layout,
    redirect: '/room/room',
    name: 'room',
    meta: {
      title: '房间管理',
      icon: 'el-icon-picture',
    },
    children: [{
        path: 'room',
        name: 'roomIndex',
        component: () => import('@/views/room/room'),
        meta: {
          title: '房间列表'
        }
      },
      {
        path: 'roomUpdate',
        name: 'roomUpdate',
        hidden: true,
        component: () => import('@/views/room/roomUpdate'),
        meta: {
          title: '编辑房间',
          activeMenu: '/room/room'
        }
      }
    ]
  },

  {
    path: '/advertisement',
    component: Layout,
    redirect: '/advertisement/advertisement',
    name: 'advertisement',
    meta: {
      title: '广告管理',
      icon: 'el-icon-picture',
    },
    children: [{
        path: 'advertisement',
        name: 'advertisementIndex',
        component: () => import('@/views/advertisement/advertisement'),
        meta: {
          title: '广告列表'
        }
      },
      {
        path: 'advertisementUpdate',
        name: 'advertisementUpdate',
        hidden: true,
        component: () => import('@/views/advertisement/advertisementUpdate'),
        meta: {
          title: '编辑广告',
          activeMenu: '/advertisement/advertisement'
        }
      }
    ]
  },

  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/notice',
    name: 'notice',
    meta: {
      title: '公告管理',
      icon: 'el-icon-picture',
    },
    children: [{
        path: 'notice',
        name: 'noticeIndex',
        component: () => import('@/views/notice/notice'),
        meta: {
          title: '公告列表'
        }
      },
      {
        path: 'noticeUpdate',
        name: 'noticeUpdate',
        hidden: true,
        component: () => import('@/views/notice/noticeUpdate'),
        meta: {
          title: '编辑公告',
          activeMenu: '/notice/notice'
        }
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/admin',
    name: 'Admin',
    meta: {
      title: '管理员管理',
      icon: 'el-icon-user-solid'
    },
    children: [{
      path: 'admin',
      name: 'AdminIndex',
      component: () => import('@/views/admin/admin'),
      meta: {
        title: '人员管理',
      }
    }]
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

// 异步挂载的路由
// 动态需要根据权限加载的路由表
// roles: ['super_editor'] 设置权限
export const asyncRoutes = []

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
