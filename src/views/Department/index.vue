<template>
  <v-row>
    <v-col cols="6">
      <createDialog />
      <all-sets></all-sets>
    </v-col>
    <v-col cols="6">
      <departmentLogs/>
    </v-col>
  </v-row>
</template>

<script>
import departmentLogs from '@/views/Department/components/departmentLogs'
import createDialog from '@/views/Department/components/createDialog'
import allSets from '@/views/Department/components/allSets'
export default {
  name: 'index',
  components: {departmentLogs, createDialog, allSets},

}
</script>

<style scoped>

</style>
