<template>
  <v-row>
    <v-col cols="12">

      <all-sets></all-sets>
    </v-col>
    <v-col cols="12">
      <departmentLogs/>
    </v-col>
  </v-row>
</template>

<script>
import departmentLogs from '@/views/Department/components/departmentLogs'
import createDialog from '@/views/Department/components/createDialog'
import allSets from '@/views/Department/components/allSets'
import { mdiArrowLeft } from '@mdi/js'
export default {
  name: 'index',
  components: {departmentLogs, createDialog, allSets},
  data:() => ({
    icons: {mdiArrowLeft}
  })

}
</script>

<style scoped>

</style>
