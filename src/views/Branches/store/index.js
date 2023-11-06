import { baseURL } from '@/environments/environment'

export default {
  state: {},
  actions: {
    getAllGoodsInDepartment(_, payload) {
      return baseURL.get('/storage/api/goods/all/' + payload)
    },
    saveToDepartment(_, payload) {
      return baseURL.post('/storage/api/goods/saveToDepartment/' + payload.to, payload)
    },
    moveToDepartment(_, payload) {
      return baseURL.post(`/storage/api/goods/moveToDepartment/${payload.from}/${payload.to}`, payload)
    },
    currentAmountByGoods(_, payload) {
      return baseURL.post(`/storage/api/goods/currentAmountByGoods/${payload}`)
    }
  }
}
