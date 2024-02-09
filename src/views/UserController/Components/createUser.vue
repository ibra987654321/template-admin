<template>
<div >
  <v-select
    v-model="selectForApi.model"
    outlined
    dense
    label="Роль"
    :items="selectForApi.items"
    item-text="name"
    item-value="id"
  ></v-select>
  <use-table
    :loading="loading"
    class="py-4 px-4"
    title="Пользователи"
    :headers="headers"
    :edited-items="editedItem"
    :show-to-edit="showToEdit"
    :put-dispatch="'updateUser'"
    :items="data"
    :post-dispatch="'createUser'"
    :delete-dispatch="'deleteUser'"
    :filters="{date: ['date']}"
  ></use-table>
</div>
</template>

<script>
import useTable from '@/components/useDashboard/useTable'

export default {
  name: 'createUser',
  components: {
    useTable
  },
  data:() => ({
    loading: false,
   data: [],
    headers: [
      {value: 'index', text: '#' },
      {value: 'fullName', text: 'Имя'},
      {value: 'username', text: 'Логин'},
      {value: 'status', text: 'Статус'},
      {value: 'date', text: 'Дата'},
      {value: 'actions', text: 'Действие'},
    ],
    editedItem: {
      "username": "",
      "fullName": "",
      "password": "",
      "roleId": 0,
      id: 0,
    },
    showToEdit: [

    ],
    selectForApi: {
      params: true,
      model: 1,
      modelEquals: 1,
      items: []
    },
  }),
  watch:{
    selectForApi: {
      handler(newVal) {
        this.listOfData(newVal)
      },
      deep: true
    }
  },
  mounted() {
    this.$store.dispatch('getAllRoles')
      .then(r => {
        this.selectForApi.items = r.data
        this.showToEdit = [
          {type: 'input', col: 6, value: 'username',label: 'Логин' },
          {type: 'input', col: 6, value: 'fullName',label: 'Имя' },
          {type: 'input', col: 6, value: 'decryptedPassword',label: 'Пароль' },
          {type: 'select-add', col: 6, value: 'roleId',label: 'Роль', data: r.data, params: {text: 'name', value: 'id'} },
        ]
      })

  },
  methods: {
    listOfData(newVal) {
      this.loading = true
      this.$store.dispatch('getAllUser', this.selectForApi.model)
        .then(r => {
          this.data = r.data.map(i => {
            return {
              ...i,
              roleId: newVal.model
            }
          })
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
