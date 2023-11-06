<template>
  <v-card
    class="mx-auto"
  >
    <v-card-text>
      <div>Советская Киевская</div>
      <p class="text-h4 text--primary">
        Цех {{item.id}}
      </p>
      <p>товары</p>
      <div class="text--primary">
        2500 гр клубник
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'index',
  data:() => ({
    item: {}
  }),
  mounted() {
    this.listOfData()
  },
  methods: {
    listOfData() {
      this.$store.dispatch('getAllBranch')
        .then(r => {
          r.data.filter(i => {
            if (i.id === Number(this.$route.params.id)) {
              this.item = i
            }
          })
        })
        .catch(e => this.$store.commit('setSnackbars', e.message))
    }
  }
}
</script>

<style scoped>

</style>
