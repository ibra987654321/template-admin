import { baseURL } from '@/environments/environment'

export default {
  state: {},
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
    currentAmountByGoods(_, payload) {
      return baseURL.post(`/storage/api/goods/currentAmountByGoods/${payload}`)
    },
    toDisposal(_, payload) {
      return baseURL.post(`/storage/api/goods/disposal/${payload.id}`, payload.data)
    }
  }
}
