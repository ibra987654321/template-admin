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
      ></v-select>
    </v-col>
    <v-col cols="12" sm="4">
      <v-select
        v-model="postData.productId"
        outlined
        label="Продукт"
        :items="products"
        item-value="id"
        item-text="name"
        hide-details
      ></v-select>
    </v-col>
    <v-col cols="12">
      <v-tabs centered hide-slider>
        <v-tab>
          <v-btn color="primary" >
            По дням
          </v-btn>
        </v-tab>
        <v-tab>
          <v-btn color="primary" >
            По продуктам
          </v-btn>
        </v-tab>
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
          <v-card flat>
            <v-card-text>
              <useTable
                :headers="productHeader"
                :items="productsItem"
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
    items: [],
    productsItem: [],
    branches: [],
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
    ]
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
      this.valid && this.loadInData()
    },
    start() {
      this.valid && this.loadInData()
    },
    // category(v) {
    //   this.$store.dispatch('getProduct', v)
    //     .then(r => {
    //       this.products = r.data
    //     })
    // },
    'postData.productId'() {
      this.loadInData()
    },
    'postData.categoryId'(v) {
      this.$store.dispatch('getProduct', v)
        .then(r => {
          this.products = r.data
          this.loadInDataProduct()
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
    }
  }
}
</script>

<style scoped>

</style>
