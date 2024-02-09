import { baseURL } from '@/environments/environment'
import moment from 'moment'

export default {
  state: {
    messages: [],
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
  }
}
