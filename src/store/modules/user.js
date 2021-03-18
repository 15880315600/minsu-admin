import {
  login,
  logout,
  getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    // const { username, password } = userInfo
    // { username: username.trim(), password: password }
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const {
          data
        } = response
        console.log(222)
        console.log(data)
        const access_token = data.tokenHead + ' ' + data.token
        commit('SET_TOKEN', access_token)
        setToken(access_token)
        resolve()
      })['catch'](error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const {
          data
        } = response

        if (!data) {
          return reject('验证失败，请重新登录')
        }
        const {
          name,roles
        } = data
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)

        commit('SET_NAME', name)
        resolve(data)
      })['catch'](error => {
        reject(error)
      })
    })
  },
  // remove role
  // removeRole({
  //   commit
  // }) {
  //   return new Promise(resolve => {
  //     commit('SET_ROLES', [])
  //     resolve()
  //   })
  // },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      resolve()
    })
  },

  removeRole({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_ROLES', [])
      resolve()
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
