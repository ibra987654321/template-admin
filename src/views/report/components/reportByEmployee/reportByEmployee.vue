<template>
  <v-row>
    <v-col cols="12">
      <dateRangePicker/>
    </v-col>
    <v-col cols="6" sm="4">
      <v-text-field
        v-model="searchText"
        label="Поиск по имени"
        :dense="$vuetify.breakpoint.mobile"
        hide-details
        outlined
        class="mb-5"
        :class="!$vuetify.breakpoint.mobile && 'mr-2'"
      ></v-text-field>
    </v-col>

    <v-col cols="12">
     <use-table
      :loading="loading"
      :headers="headers"
      :items="filteredItems"
      :function='change'
     ></use-table>
    </v-col>
    <v-dialog
      v-model="dialog"
      max-width="600"
    >
      <v-card>
      <v-card-title>Отчет по {{ item.name}}</v-card-title>
        <v-card-text>
          <use-table
            :loading="loadingBy"
            :headers="headersBy"
            :items="itemsBy"
            :items-per-page-options="[5,10,15]"
          ></use-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import dateRangePicker from '@/layouts/components/dateRangePicker/DateRangePicker'
import useTable from '@/components/useDashboard/useTable'

export default {
  name: 'reportByEmployee',
  components: {
    dateRangePicker,
    useTable,
  },
  data:() => ({
    searchText: '',
    item: {},
    items: [],
    itemsBy: [],
    dialog: false,
    loading: false,
    loadingBy: false,
    headers:[
      {text: '№', value: 'index'},
      {text: 'Имя', value: 'name'},
      {text: 'Количество', value: 'amount'},
      { text: 'Действие', value: 'function' },
    ],
    headersBy:[
      {text: '№', value: 'index'},
      {text: 'Имя', value: 'name'},
      {text: 'Количество', value: 'amount'},
    ],
  }),
  mounted() {
    this.listOfData()
  },
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
    filteredItems() {
      return this.items.filter(item => {
        return item.name.toLowerCase()
          .includes(this.searchText.toLowerCase());
      })
    }
  },
  watch: {
    done() {
        this.listOfData()
    },
    start() {
        this.listOfData()
    },
  },
  methods: {
    listOfData() {
      this.loading = true
      this.$store.dispatch('getAmountByCreatedBy')
        .then(r => {
          this.items = r.data
          this.loading = false
        })
    },
    change(event) {
      this.dialog = true
      this.loadingBy = true
      this.item =event
      this.$store.dispatch('getAmountBySetNameAndCreatedBy', event.name)
        .then(r => {
          this.itemsBy = r.data
          this.loadingBy = false
        })
    }
  }
}
</script>

<style scoped>

</style>
