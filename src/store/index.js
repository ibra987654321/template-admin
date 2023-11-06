import Vue from 'vue'
import Vuex from 'vuex'

import { authURL, baseURL } from '@/environments/environment'

// stores
import settings from '@/views/Settings/store/index'
import storage from '@/views/Storage/store/index'
import branch from '@/views/Branches/store/index'
import moment from 'moment'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    start: new Date(),
    end: new Date(Date.now()),
    error: '',
    snackbars: {
      snackbar: false,
      text: '',
      timeout: 10,
    },
  },
  mutations: {
    setError(state, error) {
      state.error = error
      state.snackbars.snackbar = true
      state.snackbars.text = error
      state.snackbars.timeout = 1000
    },
    setSnackbars(state, text) {
      state.snackbars.snackbar = true
      state.snackbars.text = text
      state.snackbars.timeout = 3000
    },
    setStartDay(state, val) {
      state.start = new Date(moment().subtract(val, 'days').format().slice(0, 19))
    },
  },
  actions: {
    login({ commit }, payload) {
      return authURL.post('/storage/api/user/login', payload)
    },
    getDepartment(_, payload) {
      return baseURL.get('/storage/api/settings/department/all/' + payload)
    },
    postDepartment(_, payload) {
      return baseURL.post('/storage/api/settings/department/create', payload)
    },
    putDepartment(_, payload) {
      return baseURL.put('/storage/api/settings/department/update', payload)
    },
    deleteDepartment(_, payload) {
      return baseURL.delete(`/storage/api/settings/department/delete/${payload.id}`)
    },
  },
  getters: {
    error: state => state.error,
    createdDate(state) {
      return state.start.setHours(state.start.getHours() - 72)
    },
  },
  modules: {
    settings,
    storage,
    branch,
  },
})
