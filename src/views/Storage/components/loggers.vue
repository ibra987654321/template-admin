<template>
    <use-table
      :headers="header"
      :get-dispatch="'loggerToBranch'"
      :filters="{date: ['createdAt']}"
    ></use-table>
</template>

<script>
import useTable from '@/components/useDashboard/useTable'
import products from '@/views/Storage/components/products'
export default {
  name: 'loggers',
  components: {
    useTable,
    products
  },
  data:() => ({
    header: [
      {text: 'Название', value: 'goods'},
      {text: 'Количество', value: 'amount'},
      {text: 'Дата', value: 'createdAt'},
      {text: 'Кто', value: 'createdBy'},
      {text: 'Статус', value: 'action'},
    ]
  }),
}
</script>

<style scoped>

</style>
