<template>
  <v-row>
    <v-col cols="12">
      <dateRangePicker/>
    </v-col>
    <v-col cols="6" sm="4">
      <v-select
        v-model="postData.branchId"
        outlined
        label="Филиал"
        :items="branches"
        item-value="id"
        item-text="name"
        hide-details
        clearable
      ></v-select>
    </v-col>
    <v-col cols="6" sm="4">
      <v-select
        v-model="postData.categoryId"
        outlined
        label="Тип"
        :items="categories"
        item-value="id"
        item-text="name"
        hide-details
        clearable
      ></v-select>
    </v-col>
    <v-col cols="12" sm="4" v-if="tabs !== 1">
      <v-select
        v-model="postData.productId"
        outlined
        label="Продукт"
        :items="products"
        item-value="id"
        item-text="name"
        hide-details
        clearable
      ></v-select>
    </v-col>
    <v-col cols="12">
      <v-btn
        color="info"
        small
        :disabled="!postData.branchId"
        :loading="$store.state.report.loading"
        @click="$store.dispatch('downloadExcel', postData.branchId)"
      >Скачать Excel</v-btn>
    </v-col>
    <v-col cols="12">
      <v-tabs v-model="tabs">
        <div class="w-full d-flex justify-center">
          <v-tab>
            <v-btn color="primary" >
              По дням
            </v-btn>
          </v-tab>
          <v-tab>
            <v-btn color="primary" >
              По наборам
            </v-btn>
          </v-tab>

          <v-tab>
            <v-btn color="primary" >
              По продуктам
            </v-btn>
          </v-tab>
        </div>

        <v-tab-item>
          <v-card >
            <v-card-text>
              <useTable
                :headers="headers"
                :items="items"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-card-text>
              <useTable
                :headers="productHeader"
                :items="productsItem"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-card-text>
              <useTable
                :headers="usageHeader"
                :items="usageItem"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-col>
  </v-row>
</template>

<script>
import dateRangePicker from '@/layouts/components/dateRangePicker/DateRangePicker'
import useTable from '@/components/useDashboard/useTable'
export default {
  name: 'index',
  components: {
    dateRangePicker,
    useTable,
  },
  data:() => ({
    tabs: '',
    items: [],
    productsItem: [],
    branches: [],
    usageItem: [],
    categories: [],
    category: '',
    products: [],
    postData: {
      branchId: '',
      productId: '',
      categoryId: ''
    },
    headers:[
      {text: '№', value: 'index'},
      {text: 'Остаток на начало дня', value: 'balanceAtTheBeginningOfTheDay'},
      {text: 'Поступило', value: 'received'},
      {text: 'Израсходовано', value: 'used'},
      {text: 'Утилизировано ', value: 'disposed'},
      {text: 'Процент Утила', value: 'disposedPercentage'},
      {text: 'День', value: 'period'},
      {text: 'Остаток на конец дня', value: 'balanceAtTheEndOfTheDay'},
    ],
    productHeader: [
      {text: 'Название', value: 'name'},
      {text: 'Количество', value: 'amount'},
    ],
    usageHeader: [
      {text: 'Дата', value: 'name'},
      {text: 'Количество', value: 'amount'},
    ],
  }),
  computed: {
    done() {
      return this.date.end
    },
    start() {
      return this.date.start
    },
    date() {
      return this.$store.state
    },
    valid() {
      return !!(this.postData.productId && this.postData.branchId );
    }
  },
  watch: {
    done() {
      if (this.valid) {
        this.loadInData()
        this.loadInDataProduct()
        this.dailyGoodsUsageForSets()
      }
    },
    start() {
      if (this.valid) {
        this.loadInData()
        this.loadInDataProduct()
        this.dailyGoodsUsageForSets()
      }
    },
    'postData.branchId'() {
      if (this.tabs !== 1 && this.postData.productId && this.postData.categoryId) {
        this.loadInData()
        this.dailyGoodsUsageForSets()
      } else if (this.tabs === 1 && this.postData.categoryId) {
        this.loadInDataProduct()
      }
    },
    'postData.productId'() {
      if (!this.postData.branchId) {
        this.$store.commit('setSnackbars', 'Выберите филиал!')
        return
      }
      this.loadInData()
      this.dailyGoodsUsageForSets()
    },
    'postData.categoryId'(v) {
      this.$store.dispatch('getProduct', v)
        .then(r => {
          this.products = r.data
          this.loadInDataProduct()
          this.loadInData()
        })

    }
  },
  mounted() {
    this.listOfData()
  },
  methods: {
    listOfData() {
      this.$store.dispatch('getAllBranch')
        .then(r => {
          this.branches = r.data
        })
      this.$store.dispatch('getCategory')
        .then(r => {
          this.categories = r.data
        })
    },
    loadInData() {
      this.$store.dispatch('getDailyReports', this.postData)
        .then(r => {
          this.items = r.data
        })
    },
    loadInDataProduct() {
      this.$store.dispatch('getProductReports', this.postData)
        .then(r => {
          this.productsItem = r.data
        })
    },
    dailyGoodsUsageForSets() {
      this.$store.dispatch('dailyGoodsUsageForSets', this.postData)
        .then(r => {
          this.usageItem = r.data
        })
    },
  }
}
</script>

<style scoped>

</style>
