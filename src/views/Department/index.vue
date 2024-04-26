<template>
  <v-row>
<!--    <v-col cols="12">-->
<!--      <all-sets :id="this.$route.params.id"></all-sets>-->
<!--    </v-col>-->
<!--    <v-col cols="12">-->
<!--      <departmentLogs/>-->
<!--    </v-col>-->

    <v-tabs v-model="tabs">
      <div class="w-full d-flex justify-center">
        <v-tab>
          <v-btn color="primary" >
            Наборы
          </v-btn>
        </v-tab>
        <v-tab>
          <v-btn color="primary" >
            Отчет
          </v-btn>
        </v-tab>
      </div>

      <v-tab-item>
        <v-card >
          <v-card-text>
            <all-sets :id="this.$route.params.id"></all-sets>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <v-card-text>
            <departmentLogs/>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
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
    icons: {mdiArrowLeft},
    tabs: '',
  })

}
</script>

<style scoped>

</style>
