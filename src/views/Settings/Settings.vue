<template>
  <v-card class="px-2 py-2">
    <v-row>
      <v-col cols="12" sm="6">
        <use-table
          title="Филиалы"
          :headers="headers"
          :edited-items="editedItem"
          :show-to-edit="showToEdit"
          get-dispatch="allBranchesWithDepartments"
          put-dispatch="putAllBranch"
          post-dispatch="postAllBranch"
          delete-dispatch="deleteAllBranch"
        ></use-table>
      </v-col>
      <v-col cols="12" sm="6">
        <use-table
          :select-for-api="selectForApi"
          title="Материалы"
          :headers="headers"
          :edited-items="editedItem"
          :show-to-edit="showToEdit"
          get-dispatch="getMaterial"
          put-dispatch="putMaterial"
          post-dispatch="postMaterial"
          delete-dispatch="deleteMaterial"
        ></use-table>
      </v-col>
      <v-col cols="12" sm="6">
        <use-table
          title="Категории продуктов"
          :headers="category.headers"
          :edited-items="category.editedItem"
          :show-to-edit="category.showToEdit"
          :child-table="product"
          get-dispatch="getCategory"
          put-dispatch="putCategory"
          post-dispatch="postCategory"
          delete-dispatch="deleteCategory"
        ></use-table>
      </v-col>
      <v-col cols="12" sm="6">
        <use-table
          :select-for-api="productName.selectForApi"
          title="Название наборов"
          :headers="productName.headers"
          :edited-items="productName.editedItem"
          :show-to-edit="productName.showToEdit"
          :child-table="productName.childMaterialComponent"
          :get-dispatch="'getProductName'"
          :put-dispatch="'putProductName'"
          :post-dispatch="'postProductName'"
          :delete-dispatch="'deleteProductName'"
          @newItem="handleChange"
        ></use-table>
      </v-col>
    </v-row>
  </v-card>

</template>

<script>
import useTable from '@/components/useDashboard/useTable'
import { admin } from '@/helpers/roles'
export default {
  name: 'Settings',
  components: {
    useTable,
  },
  data:() => ({
    headers: [
      {value: 'index', text: '#' },
      {value: 'name', text: 'Название'},
      {value: 'actions', text: 'Действие'},
    ],
    editedItem: {
      id: 0,
      name: '',
      unitOfMeasurement: ''
    },
    showToEdit: [
      {type: 'input', col: 12, value: 'name',label: 'Название' }
    ],
    selectForApi: {
      params: true,
      model: 1,
      modelEquals: 1,
      items: []
    },
    product: {
      title: 'Продукты',
      nameObject: 'categoryId',
      header: [
        {value: 'index', text: '#' },
        {value: 'name', text: 'Название'},
        {value: 'actions', text: 'Действие'},
      ],
      editedItem: {
        id: 0,
        name: '',
        unitOfMeasurement: '',
        categoryId: ''
      },
      showToEdit: [
        {type: 'input', col: 12, value: 'name',label: 'Название' },
      ],
      actions: {
        getDispatch: "getProduct",
        putDispatch: "putProduct",
        postDispatch: "postProduct",
        deleteDispatch: "deleteProduct",
      }
    },
    category: {
      headers: [
        {value: 'index', text: '#' },
        {value: 'name', text: 'Название'},
        {value: 'type', text: 'Тип'},
        {value: 'unitOfMeasurement', text: 'Ед измерение'},
        {value: 'actions', text: 'Действие'},
      ],
      editedItem: {
        id: 0,
        name: '',
        type: ''
      },
      showToEdit: [
        {type: 'input', col: 6, value: 'name',label: 'Название' },
        {type: 'input', col: 3, value: 'type',label: 'Тип' },
        {type: 'input', col: 3, value: 'unitOfMeasurement',label: 'Ед измерение' }
      ],
    },
    productName: {
      headers: [
        {value: 'index', text: '#' },
        {value: 'name', text: 'Название'},
        {value: 'actions', text: 'Действие'},
      ],
      editedItem: {
        id: 0,
        name: '',
      },
      showToEdit: [
        {type: 'input', col: 12, value: 'name',label: 'Название' },
      ],
      actions: {
        getDispatch: "getProductName",
        putDispatch: "putProductName",
        postDispatch: "postProductName",
        deleteDispatch: "deleteProductName",
      },
      selectForApi: {
        params: true,
        model: 1,
        modelEquals: 1,
        items: [1,2,3]
      },
      childMaterialComponent: {
        title: 'Материалы к продукту',
        nameObject: 'id',
        header: [
          {value: 'index', text: '#' },
          {value: 'name', text: 'Название'},
          {value: 'actions', text: 'Действие'},
        ],
        editedItem: {
          id: 0,
          "materialId": 0,
          "productionId": 0
        },
        showToEdit: [
          {type: 'select-add', col: 12, value: 'materialId',label: 'Название', data: [], params: {text: 'name', value: 'id'} },
        ],
        actions: {
          getDispatch: "getMaterialComponent",
          putDispatch: "putMaterialComponent",
          postDispatch: "postMaterialComponent",
          deleteDispatch: "deleteMaterialComponent",
        }
      },
    }
  }),
  computed: {
    admin() {
      return admin()
    }
  },
  mounted() {
    this.$store.dispatch('getCategory')
      .then(r => {
        this.selectForApi.items = r.data
        this.productName.selectForApi.items = r.data
      })
  },
  methods: {
    handleChange(event) {
      this.$store.dispatch('getMaterial', event)
        .then(r => {
          this.productName.childMaterialComponent.showToEdit[0].data = r.data

        })
    }
  }
}
</script>

<style scoped>

</style>
