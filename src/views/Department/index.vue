<template>
  <v-row>
    <v-col cols="6">
      <departmentLogs/>
    </v-col>
  </v-row>
</template>

<script>
import departmentLogs from '@/views/Department/components/departmentLogs'
export default {
  name: 'index',
  components: {departmentLogs}
}
</script>

<style scoped>

</style>
