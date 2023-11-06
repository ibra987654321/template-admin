<template>
  <v-card
    max-width="400"
  >
    <v-img
      class="white--text align-end"
      height="200px"
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
    >
      <v-card-title>Магазин {{item.id}}</v-card-title>
    </v-img>

    <v-card-subtitle class="pb-0">
      описание
    </v-card-subtitle>

    <v-card-text class="text--primary">
      <div>Готовые продукты 12 шт (Клубника)</div>
      <div>Готовые продукты 15 шт (Цветы)</div>

    </v-card-text>

    <v-card-actions>

      <v-btn
        color="orange"
        text
      >
        Подробнее
      </v-btn>
    </v-card-actions>
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
