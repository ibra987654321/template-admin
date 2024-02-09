<template>
  <v-row>
    <v-col cols="12">
      <v-btn @click="$router.go(-1)" class="mr-2" small><v-icon>{{icons.mdiArrowLeft}}</v-icon></v-btn>
      <createDialog v-if="admin || florist || superUser || workshop" text-btn="Собрать набор" :prop-item1="items" @success="listOfData"/>
      <v-btn
        v-if=" florist || operator || workshop"
        color="primary"
        class="ml-2"
        :small="$vuetify.breakpoint.mobile"
        @click="listOfData"
      >Обновить</v-btn>
    </v-col>
    <v-col cols="12" sm="4" v-if="admin || superUser">
      <branchItem  v-if="!loading" :item="items.shop" @successDelete="listOfData" @successUpdate="listOfData()"/>
    </v-col>
    <v-col cols="12" v-if="operator || florist || workshop">
      <v-tabs centered >
        <v-tab>
          Свободные
        </v-tab>
        <v-tab>
          Заказ
        </v-tab>
        <v-tab>
          Продано
        </v-tab>
        <v-tab-item>
          <v-card >
            <v-card-text>
              <v-tabs centered hide-slider>
                <v-tab>
                  <v-btn color="primary" :small="$vuetify.breakpoint.mobile" >
                    Цветы
                  </v-btn>
                </v-tab>
                <v-tab>
                  <v-btn color="primary" :small="$vuetify.breakpoint.mobile" >
                    Ягоды
                  </v-btn>
                </v-tab>
                <v-tab-item>
                  <v-card >
                    <v-card-text>
                      <allSets v-if="!loading " :id="String(items.flowers.id)"/>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>
                      <allSets v-if="!loading " :id="String(items.shop.id)"/>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <allSets v-if="!loading" :id="String(items.workshops.id)"/>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <SellTable  v-if="!loading"/>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>

    </v-col>
    <v-col :cols="12" sm="6" v-if="coordinator || florist">
      <stock  v-if="!loading " :item="items.stock" :work-shop="items.workshops" @successDelete="listOfData" @successUpdate="listOfData()"/>
    </v-col>
    <v-col cols="12" sm="6" v-if="coordinator">
      <workShop  v-if="!loading" :item="items.workshops" @successDelete="listOfData" @successUpdate="listOfData()"/>
    </v-col>
    <v-col cols="12" sm="8" v-if="admin || superUser">
      <v-row>
        <v-col cols="12" sm="6">
          <flowers  v-if="!loading" :item="items.flowers" @successDelete="listOfData" @successUpdate="listOfData()"/>
        </v-col>
        <v-col cols="12" sm="6">
          <workShop  v-if="!loading" :item="items.workshops" @successDelete="listOfData" @successUpdate="listOfData()"/>
        </v-col>
        <v-col cols="12">
          <stock  v-if="!loading" :item="items.stock" :work-shop="items.workshops" @successDelete="listOfData" @successUpdate="listOfData()"/>
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
import { coordinator, admin, florist, operator, superUser, workshop } from '@/helpers/roles'
import allSets from '@/views/Department/components/allSets'
import SellTable from '@/views/Branches/components/sellesComponents/SellTable'
export default {
  name: 'index',
  components: {
    branchItem,
    flowers,
    workShop,
    stock,
    createDialog,
    allSets,
    SellTable
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
    operator() {
      return operator()
    },
    superUser() {
      return superUser()
    },
    workshop() {
      return workshop()
    },
  },
  methods: {
    listOfData() {
      this.loading = true
      this.$store.dispatch('getDepartment', this.$route.params.id)
        .then(r => {
          this.$store.state.branch.departmentIds = r.data.map(i => i.id)
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
