<template>
  <v-row class="mt-2">
    <v-col
      cols="12"
      sm="7"
      md="6"
      lg="5"
      v-for="item in items"
    >
      <v-sheet
        elevation="10"
        rounded="xl"
      >
        <v-sheet
          class="pa-3 primary text-center d-flex"
          dark
          rounded="t-xl"
        >
         <div class="text-lg-h6">{{item.name}}</div>
          <v-btn
            class="ml-2"
            icon
          >
            <v-icon>{{icons.mdiCheckBold}}</v-icon>
          </v-btn>
        </v-sheet>

        <div class="pa-4">
          Колияество: {{item.amount}}<br>
          Набор из {{item.goods.name}}
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import {mdiCheckBold} from '@mdi/js'
export default {
  name: 'allSets',
  data:() => ({
    items: [],
    icons: {mdiCheckBold}
  }),
  mounted() {
    this.$store.dispatch('getAllSets', this.$route.params.id)
      .then(r => {
        this.items = r.data
      })
  }
}
</script>

<style scoped>

</style>
