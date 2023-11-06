<template>
  <v-row>
    <v-col cols="12">
      <createDialog @success="listOfData"/>
    </v-col>
    <v-col cols="4" v-for="item in items">
      <branchItem :item="item" @successDelete="listOfData" @successUpdate="listOfData()"/>
    </v-col>
<!--    <v-col cols="8">-->
<!--      <workshops class="mb-6"/>-->
<!--      <stores/>-->
<!--    </v-col>-->
  </v-row>
</template>

<script>
import branchItem from '@/views/Branches/components/branchItem'
import workshops from '@/views/Workshops/index'
import stores from '@/views/Stores/index'
import createDialog from '@/views/Branches/components/createDialog'
export default {
  name: 'index',
  components: {
    branchItem,
    workshops,
    stores,
    createDialog,
  },
  data:() => ({
    items: []
  }),
  mounted() {
    this.listOfData()
  },
  methods: {
    listOfData() {
      this.$store.dispatch('getDepartment', this.$route.params.id)
        .then(r => {
         this.items = r.data
        })
        .catch(e => this.$store.commit('setSnackbars', e.message))
    }
  }
}
</script>

<style scoped>

</style>
