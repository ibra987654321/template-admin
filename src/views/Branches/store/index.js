import { baseURL } from '@/environments/environment'
import moment from 'moment'

export default {
  state: {
    departmentIds: []
  },
  actions: {
    getAllGoodsInDepartment(_, payload) {
      return baseURL.get('/storage/api/goods/all/' + payload)
    },
    saveToBranch(_, payload) {
      return baseURL.post('/storage/api/goods/saveToBranch/' + payload.from, payload)
    },
    moveToBranch(_, payload) {
      return baseURL.post(`/storage/api/goods/moveToBranch/${payload.from}/${payload.to}`, payload)
    },
    moveToBranchFromStore(_, payload) {
      payload.item.amount = Number(payload.item.amount)
      return baseURL.post(`/storage/api/moveToBranch/${payload.to}`, payload.item)
    },
    currentAmountByGoods(_, payload) {
      return baseURL.post(`/storage/api/goods/currentAmountByGoods/${payload}`)
    },
    toDisposal(_, payload) {
      return baseURL.post(`/storage/api/goods/disposal/${payload.id}`, payload.data)
    },
    getAllSoldSets(state, payload) {
      const data = {
        start: moment(state.rootState.start).format().slice(0, 19),
        end: moment(state.rootState.end).format().slice(0, 19),
      }
      return baseURL.post('/storage/api/set/all/sold/' + payload, data)
    },
  }
}
