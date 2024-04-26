<template>
<div class="d-flex flex-column align-center" :class="$vuetify.breakpoint.mobile && 'flex-column'">
  <div class="d-flex justify-space-around w-full mb-5">
    <dialogs-for-add-product @success="loadData()"></dialogs-for-add-product>
    <move-to-branch @success="loadData()"></move-to-branch>
    <delete-product-dialog @success="loadData()"></delete-product-dialog>
  </div>
  <div class="d-flex flex-wrap mx-5">
    <v-card class=" elevation-9 mr-2 mb-2" max-width="400" v-for="item in listOfData">
      <v-card-title class="headline">{{ item.name }}</v-card-title>
      <v-card-subtitle>{{ item.amount }}</v-card-subtitle>
    </v-card>
  </div>
</div>
</template>

<script>
import MoveToBranch from '@/views/Storage/components/MoveToBranch'
import dialogsForAddProduct from '@/views/Storage/components/dialogsForAddProduct'
import DeleteProductDialog from '@/views/Storage/components/branchComponents/DeleteProductDialog'
export default {
  name: 'products',
  components: {dialogsForAddProduct, MoveToBranch, DeleteProductDialog},
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
