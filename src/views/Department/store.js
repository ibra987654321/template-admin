import { baseURL } from '@/environments/environment'

export default {
  state: {},
  actions: {
    getAllSets(_, payload) {
      return baseURL.post('/storage/api/set/all/' + payload)
    },
    createSet(_, payload) {
      return baseURL.post('/storage/api/set/create', payload)
    }
  }
}
