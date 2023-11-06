<template>
<div class="d-flex justify-space-around align-center">
  <dialogs-for-add-product @success="loadData()"></dialogs-for-add-product>
  <v-card elevation="5" v-for="item in listOfData" class="d-flex justify-center flex-column align-center">
    <v-card-title>{{item.name}}</v-card-title>
    <v-card-title>{{item.amount}}</v-card-title>
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
