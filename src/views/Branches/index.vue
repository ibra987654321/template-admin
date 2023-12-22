<template>
  <v-row>
    <v-col cols="12">
      <v-btn @click="$router.go(-1)" class="mr-2" small><v-icon>{{icons.mdiArrowLeft}}</v-icon></v-btn>
      <createDialog v-if="admin || florist" text-btn="Собрать набор" @success="listOfData"/>
    </v-col>
    <v-col cols="12" sm="4" v-if="admin">
      <branchItem  v-if="!loading" :item="items.shop" @successDelete="listOfData" @successUpdate="listOfData()"/>
    </v-col>
    <v-col :cols="florist ? 12 : 6" v-if="coordinator || florist">
      <stock  v-if="!loading " :item="items.stock" :work-shop="items.workshops" @successDelete="listOfData" @successUpdate="listOfData()"/>
    </v-col>
    <v-col cols="6" v-if="coordinator">
      <workShop  v-if="!loading" :item="items.workshops" @successDelete="listOfData" @successUpdate="listOfData()"/>
    </v-col>
    <v-col cols="12" sm="8" v-if="admin">
      <v-row>
        <v-col cols="12" sm="6">
          <flowers  v-if="!loading" :item="items.flowers" @successDelete="listOfData" @successUpdate="listOfData()"/>
        </v-col>
        <v-col cols="12" sm="6">
          <workShop  v-if="!loading" :item="items.workshops" @successDelete="listOfData" @successUpdate="listOfData()"/>
        </v-col>
        <v-col cols="12">
          <stock  v-if="!loading" :item="items.stock" @successDelete="listOfData" @successUpdate="listOfData()"/>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import branchItem from '@/views/Branches/components/branchItem'
import flowers from '@/views/Branches/components/Flowers'
import workShop from '@/views/Branches/components/WorkShop'
import stock from '@/views/Branches/components/Stock'
import createDialog from '@/views/Department/components/createDialog'
import {mdiArrowLeft} from '@mdi/js'
import { coordinator, admin, florist } from '@/helpers/roles'
export default {
  name: 'index',
  components: {
    branchItem,
    flowers,
    workShop,
    stock,
    createDialog,
  },
  data:() => ({
    loading: false,
    items: {
      shop: {},
      flowers: {},
      stock: {},
      workshops: {},
    },
    icons: {mdiArrowLeft}
  }),
  mounted() {
    this.listOfData()
  },
  computed: {
    florist() {
      return florist()
    },
    coordinator() {
      return coordinator()
    },
    admin() {
      return admin()
    },
  },
  methods: {
    listOfData() {
      this.loading = true
      this.$store.dispatch('getDepartment', this.$route.params.id)
        .then(r => {
         r.data.forEach(i => {
           if (i.type === 'SHOP') {
             this.items.shop = i
           } else if (i.type === 'FLORISTRY') {
             this.items.flowers = i
           } else if (i.type === 'STOCK') {
             this.items.stock = i
           } else {
             this.items.workshops = i
           }
         })
          this.loading = false
        })
        .catch(e => {
          this.$store.commit('setSnackbars', e.message)
          this.loading = false
        })
    },

  },

}
</script>

<style scoped>

</style>
