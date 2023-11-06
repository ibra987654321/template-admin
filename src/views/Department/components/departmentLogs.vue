<template>
  <v-card>
    <div class="text-h5 ml-5 my-2">История</div>
    <use-table
      title="История"
      :headers="header"
      get-dispatch="getAllGoodsInDepartment"
      :get-dispatch-id="$route.params.id"
      :filters="{date: ['createdAt']}"
    ></use-table>
  </v-card>
</template>

<script>
import useTable from '@/components/useDashboard/useTable'
export default {
  name: 'departmentLogs',
  components: { useTable },
  data:() => ({
    header: [
      {value: 'index', text: '#'},
      {text: 'Количество', value: 'amount'},
      {text: 'Дата', value: 'createdAt'},
      {text: 'Кто', value: 'createdBy'},
      {text: 'Статус', value: 'action'},
    ]
  })
}
</script>

<style scoped>

</style>
