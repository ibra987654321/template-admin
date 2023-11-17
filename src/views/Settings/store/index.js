import { baseURL } from '@/environments/environment'
import { getToken } from '@/helpers/helpers'

export default {
  state: {},
  actions: {
    // branch-controller
    allBranchesWithDepartments() {
      return baseURL.get('/storage/api/settings/branch/all')
    },
    getAllBranch() {
      return baseURL.get('/storage/api/settings/branch/all/goods')
    },
    postAllBranch(_, payload) {
      delete payload.id
      return baseURL.post('/storage/api/settings/branch/create', payload)
    },
    putAllBranch(_, payload) {
      return baseURL.put('/storage/api/settings/branch/update', payload)
    },
    deleteAllBranch(_, payload) {
      return baseURL.delete(`/storage/api/settings/branch/delete/${payload.id}`)
    },

    // material-controller

    getMaterial() {
      return baseURL.get('/storage/api/settings/material/all')
    },
    postMaterial(_, payload) {
      return baseURL.post('/storage/api/settings/material/create', payload)
    },
    putMaterial(_, payload) {
      return baseURL.put('/storage/api/settings/material/update', payload)
    },
    deleteMaterial(_, payload) {
      return baseURL.delete(`/storage/api/settings/material/delete/${payload.id}`)
    },

    // product-controller

    getProduct() {
      return baseURL.get('/storage/api/settings/product/all')
    },
    postProduct(_, payload) {
      return baseURL.post('/storage/api/settings/product/create', payload)
    },
    putProduct(_, payload) {
      return baseURL.put('/storage/api/settings/product/update', payload)
    },
    deleteProduct(_, payload) {
      return baseURL.delete(`/storage/api/settings/product/delete/${payload.id}`)
    },

    // user

    getAllUser() {
      return baseURL.get('/storage/api/admin/all/users')
    },
    getAllRoles() {
      return baseURL.get('/storage/api/role/all')
    },
    createUser(_, payload) {
      return baseURL.post('/storage/api/admin/create', payload)
    },
  },
  mutations: {},
}
