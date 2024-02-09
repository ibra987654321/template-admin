<template>
  <v-row>
    <v-col>
      <dailyReport/>
    </v-col>
  </v-row>
</template>

<script>
import dailyReport from '@/views/report/components/dailyReport'
export default {
  name: 'index',
  components: {
    dailyReport
  }
}
</script>

<style scoped>

</style>
