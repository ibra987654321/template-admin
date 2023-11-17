import { baseURL, imageURL } from '@/environments/environment'
import axios from 'axios'
import { getToken } from '@/helpers/helpers'

export default {
  state: {
    messages: [],
  },
  mutations: {
    addMessage(state, message) {
      state.messages = message;
    },
  },
  actions: {
    getAllSets(_, payload) {
      return baseURL.post('/storage/api/set/all/' + payload)
    },
    createSet(_, payload) {
      return baseURL.post('/storage/api/set/create', payload)
    },
    getImages(_, payload) {
      return imageURL.get(`/storage/api/media/photo/${payload}`)
    },
    deleteImages({ commit }, payload) {
      imageURL.delete(`/storage/api/set/delete/photo/${payload}`)
        .then(() => commit('setSnackbars', 'Успешно удалено'))
        .catch(()=> commit('setSnackbars', 'Что то пошло не так!'))
    },
    uploadImg(_, payload) {
      const formData = new FormData()
      formData.append('multipartFile', payload.file )
      return axios.post(`http://176.126.164.208:8070/storage/api/set/upload/${payload.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${getToken()}`,
          },
        })
    },
    saveToDepartment(_, payload) {
      return baseURL.post('/storage/api/goods/saveToDepartment/' + payload.to, payload)
    },
    moveToDepartment(_, payload) {
      return baseURL.post(`/storage/api/goods/moveToDepartment/${payload.from}/${payload.to}`, payload)
    },
  }
}
