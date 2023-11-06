<template>
  <v-card class="px-2 py-2">
    <v-row>
      <v-col cols="6">
        <use-table
          title="Филиалы"
          :headers="headers"
          :edited-items="editedItem"
          :show-to-edit="showToEdit"
          get-dispatch="getAllBranch"
          put-dispatch="putAllBranch"
          post-dispatch="postAllBranch"
          delete-dispatch="deleteAllBranch"
        ></use-table>
      </v-col>
      <v-col cols="6">
        <use-table
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
      <v-col cols="6">
        <use-table
          title="Продукты"
          :headers="product.headers"
          :edited-items="product.editedItem"
          :show-to-edit="product.showToEdit"
          get-dispatch="getProduct"
          put-dispatch="putProduct"
          post-dispatch="postProduct"
          delete-dispatch="deleteProduct"
        ></use-table>
      </v-col>
      <v-col cols="6">
        <createUser/>
      </v-col>
    </v-row>
  </v-card>

</template>

<script>
import useTable from '@/components/useDashboard/useTable'
import createUser from '@/views/Settings/Components/createUser'
export default {
  name: 'Settings',
  components: {
    useTable,
    createUser
  },
  data:() => ({
    headers: [
      {value: 'index', text: '#' },
      {value: 'name', text: 'Название'},
      {value: 'actions', text: 'Действие'},
    ],
    editedItem: {
      id: 0,
      name: ''
    },
    showToEdit: [
      {type: 'input', col: 12, value: 'name',label: 'Название' }
    ],
    product: {
      headers: [
        {value: 'index', text: '#' },
        {value: 'name', text: 'Название'},
        {value: 'unitOfMeasurement', text: 'Ед измерение'},
        {value: 'actions', text: 'Действие'},
      ],
      editedItem: {
        id: 0,
        name: '',
        unitOfMeasurement: ''
      },
      showToEdit: [
        {type: 'input', col: 6, value: 'name',label: 'Название' },
        {type: 'input', col: 6, value: 'unitOfMeasurement',label: 'Ед измерение' }
      ],
    }
  })
}
</script>

<style scoped>

</style>
