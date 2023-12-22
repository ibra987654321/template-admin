<template>
<div class="d-flex justify-space-around align-center" :class="$vuetify.breakpoint.mobile && 'flex-column'">
  <dialogs-for-add-product @success="loadData()"></dialogs-for-add-product>

  <v-card class=" elevation-9" max-width="400" v-for="item in listOfData">
    <v-card-title class="headline">{{ item.name }}</v-card-title>
    <v-card-subtitle>{{ item.amount }}</v-card-subtitle>

    <v-divider></v-divider>

<!--    <v-card-actions>-->
<!--      <v-btn text color="primary">Action 1</v-btn>-->
<!--      <v-btn text color="primary">Action 2</v-btn>-->
<!--    </v-card-actions>-->
  </v-card>
</div>
</template>

<script>
import dialogsForAddProduct from '@/views/Storage/components/dialogsForAddProduct'
export default {
  name: 'products',
  components: {dialogsForAddProduct},
  data:() => ({
    listOfData: []
  }),
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$store.dispatch('getCurrentAmountByGoods')
        .then(r => {
          this.listOfData = r.data
        })
        .catch(e => this.$store.commit('setSnackbars', e.message))
    }
  }
}
</script>

<style scoped>

</style>
