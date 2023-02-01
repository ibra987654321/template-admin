import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'


import { environment } from '@/environments/environment'
import { setToken } from '@/helpers/helpers'
import router from '@/router'

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
  },
  actions: {
    login({ commit }, payload) {
      // return axios(`${environment.authAPI}/login/auth`, {
      //   method: 'POST',
      //   data: {
      //     ...payload,
      //   },
      // })
      //   .then(res => {
      //     if (res.data.token) {
      //       setToken(res.data.token)
      //       router.push({ name: 'dashboard' })
      //     }
      //   })
      //   .catch(error => {
      //     commit('setError', error.response.status)
      //   })
      router.push({ name: 'dashboard' })
    },
  },
  getters: {
    error: state => state.error,
    createdDate(state) {
      return state.start.setHours(state.start.getHours() - 72)
    },
  },
  modules: {
  },
})
