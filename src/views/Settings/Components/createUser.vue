<template>
<div>
  <use-table
    title="Пользователи"
    :select-for-api="selectForApi"
    :headers="headers"
    :edited-items="editedItem"
    :show-to-edit="showToEdit"
    :put-dispatch="'updateUser'"
    get-dispatch="getAllUser"
    post-dispatch="createUser"
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
    headers: [
      {value: 'index', text: '#' },
      {value: 'username', text: 'Имя'},
      {value: 'status', text: 'Статус'},
      {value: 'date', text: 'Дата'},
      {value: 'actions', text: 'Действие'},
    ],
    editedItem: {
      "username": "",
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
  mounted() {
    this.$store.dispatch('getAllRoles')
      .then(r => {
        this.selectForApi.items = r.data
        this.showToEdit = [
          {type: 'input', col: 6, value: 'username',label: 'Имя' },
          {type: 'input', col: 6, value: 'password',label: 'Пароль' },
          {type: 'select-add', col: 12, value: 'roleId',label: 'Роль', data: r.data, params: {text: 'name', value: 'id'} },
        ]
      })
  }
}
</script>

<style scoped>

</style>
