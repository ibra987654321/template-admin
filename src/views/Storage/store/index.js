import { baseURL } from '@/environments/environment'
import moment from 'moment'

export default {
  state: {},
  actions: {
    getCurrentAmountByGoods() {
      return baseURL.get('/storage/api/currentAmountByGoods')
    },
    arrivalOfGoods(_, payload) {
      return baseURL.post('/storage/api/saveToStorage', payload)
    },
    moveToBranch(_, payload) {
      return baseURL.post(`/storage/api/moveToBranch/${payload.id}`, payload)
    },
    loggerToBranch(state) {
      state.commit('setStartDay', 30)
      const data = {
        start: moment(state.rootState.start).format().slice(0, 19),
        end: moment(state.rootState.end).format().slice(0, 19),
      }
      return baseURL.post(`/storage/api/findAllByCreatedAtBetween`, data)
    }
  },
  mutations: {},
}
