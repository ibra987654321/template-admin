import { baseURL } from '@/environments/environment'
import moment from 'moment'
import axios from 'axios'
import { environment, STORAGE } from '@/environments/endPoint'
import { getToken } from '@/helpers/helpers'

export default {
  state: {
    messages: [],
    loading: false
  },
  mutations: {
    load(state, data) {
      state.loading = data
    }
  },
  actions: {
    getDailyReports(state, payload) {
      const data = {
        start: moment(state.rootState.start).format().slice(0, 19),
        end: moment(state.rootState.end).format().slice(0, 19),
      }
      return baseURL.post(`/storage/api/goods/report/${payload.branchId}/${payload.productId}`, data)
    },
    getProductReports(state, payload) {
      const data = {
        start: moment(state.rootState.start).format().slice(0, 19),
        end: moment(state.rootState.end).format().slice(0, 19),
      }
      return baseURL.post(`/storage/api/set/sold/report/${payload.branchId}/${payload.categoryId}`, data)
    },
    downloadExcel(state, payload) {
      state.commit('load', true)
      axios(`${environment.main}${STORAGE}/goods/download_excel/${payload}`, {
        method: 'POST',
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        data: {
          start: moment(state.rootState.start).format().slice(0, 19),
          end: moment(state.rootState.end).format().slice(0, 19),
        }
      })
        .then(r => {
          const fileURL = window.URL.createObjectURL(new Blob([r.data]))
          const fileLink = document.createElement('a')

          fileLink.href = fileURL
          fileLink.setAttribute('download', `Отчет.xlsx`)
          document.body.appendChild(fileLink)

          fileLink.click()
                state.commit('load', false)
        })
        .catch(() => {
                state.commit('load', false)
        })
    },
  }
}
