<template>
  <v-row dense>
    <v-col v-for="item in branches" cols>
      <v-card
        elevation="5"
        style="height: 100%;"
      >
        <v-card-title class="text-h5">
          {{item.name}}
        </v-card-title>

        <v-card-subtitle v-for="good in item.goods">{{good.name}} : {{good.amount}}</v-card-subtitle>

        <v-card-actions>
          <v-btn
            class="ml-2 mt-5"
            outlined
            rounded
            small
            @click="$router.push({path: `detail/${item.id}`})"
          >
            Подробнее
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'branchs',
  data:() => ({
    branches: []
  }),
  mounted() {
    this.$store.dispatch('getAllBranch')
      .then(r => {
        this.branches = r.data
      })
      .catch(e => this.$store.commit('setSnackbars', e.message))
  }
}
</script>

<style scoped>

</style>
