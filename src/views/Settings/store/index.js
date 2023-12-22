import { baseURL } from '@/environments/environment'
import { getToken } from '@/helpers/helpers'

export default {
  state: {
    categoryId: '',
    materialCategoryId: '',
    productNameCategoryId: '',
  },
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
      return baseURL.post('/storage/api/settings/branch/departments/create', payload)
      // return baseURL.post('/storage/api/settings/branch/create', payload)
    },
    putAllBranch(_, payload) {
      return baseURL.put('/storage/api/settings/branch/update', payload)
    },
    deleteAllBranch(_, payload) {
      return baseURL.delete(`/storage/api/settings/branch/delete/${payload.id}`)
    },

    // material-controller

    getMaterial({ state }, payload) {
      state.materialCategoryId = payload
      return baseURL.get('/storage/api/settings/material/all/' + payload)
    },
    postMaterial({state}, payload) {
        payload.categoryId = state.materialCategoryId
      return baseURL.post('/storage/api/settings/material/create', payload)
    },
    putMaterial({state}, payload) {
        payload.categoryId = state.materialCategoryId
      return baseURL.put('/storage/api/settings/material/update', payload)
    },
    deleteMaterial(_, payload) {
      return baseURL.delete(`/storage/api/settings/material/delete/${payload.id}`)
    },

    // product-controller

    getProduct(store, payload) {
      store.state.categoryId = payload
      return baseURL.get('/storage/api/settings/product/all/' + payload)
    },
    postProduct(store, payload) {
      payload.categoryId = store.state.categoryId
      return baseURL.post('/storage/api/settings/product/create', payload)
    },
    putProduct(store, payload) {
      payload.categoryId = store.state.categoryId
      return baseURL.put('/storage/api/settings/product/update/'+ payload.id, payload)
    },
    deleteProduct(_, payload) {
      return baseURL.delete(`/storage/api/settings/product/delete/${payload.id}`)
    },

    // component-controller

    getMaterialComponent(store, payload) {
      store.state.categoryId = payload
      return baseURL.get('/storage/api/settings/component/all/' + payload)
    },
    postMaterialComponent(store, payload) {
      delete payload.id
      payload.productionId = store.state.categoryId
      return baseURL.post('/storage/api/settings/component/create', payload)
    },
    putMaterialComponent(store, payload) {
      payload.categoryId = store.state.categoryId
      return baseURL.put('/storage/api/settings/component/update/'+ payload.id, payload)
    },
    deleteMaterialComponent(_, payload) {
      return baseURL.delete(`/storage/api/settings/component/delete/${payload.id}`)
    },

    // productName-controller

    getProductName(store, payload) {
      store.state.productNameCategoryId = payload
      return baseURL.get('/storage/api/settings/production/all/' + payload)
    },
    postProductName(store, payload) {
          payload.categoryId = store.state.productNameCategoryId
      return baseURL.post('/storage/api/settings/production/create', payload)
    },
    putProductName(store, payload) {
          payload.categoryId = store.state.productNameCategoryId
      return baseURL.put('/storage/api/settings/production/update', payload)
    },
    deleteProductName(_, payload) {
      return baseURL.delete(`/storage/api/settings/production/delete/${payload.id}`)
    },

    // user

    getAllUser(_, payload) {
      return baseURL.get('/storage/api/admin/all/users/' + payload)
    },
    getAllRoles() {
      return baseURL.get('/storage/api/role/all')
    },
    createUser(_, payload) {
      return baseURL.post('/storage/api/admin/create', payload)
    },

    // category-controller

    getCategory() {
      return baseURL.get('/storage/api/settings/category/all')
    },
    postCategory(_, payload) {
      return baseURL.post('/storage/api/settings/category/create', payload)
    },
    putCategory(_, payload) {
      return baseURL.put('/storage/api/settings/category/update', payload)
    },
    deleteCategory(_, payload) {
      return baseURL.delete(`/storage/api/settings/category/delete/${payload.id}`)
    },
  },
  mutations: {},
}
