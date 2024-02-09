<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="600"
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        v-bind="attrs"
        v-on="on"
        x-large
      >Переместить</v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title class="mb-8" >Добавление товара в склад</v-card-title>
        <v-card-text class="d-flex justify-space-around">
          <v-select
            v-model="branch"
            label="Филиалы"
            :items="branches"
            item-value="id"
            item-text="name"
            hide-details
            outlined
            class="mr-2"
          ></v-select>
          <v-select
            v-model="categoryM"
            label="Тип"
            :items="category"
            item-value="id"
            item-text="name"
            hide-details
            outlined
            class="mr-2"
          ></v-select>
          <v-select
            v-model="item.productId"
            label="Товар"
            :items="items"
            item-value="id"
            item-text="name"
            hide-details
            outlined
            class="mr-2"
          ></v-select>
          <v-text-field
            v-model="item.amount"
            outlined
            type="number"
            :label="unitOfMeasurement"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn
            text
            @click="dialog = false"
          >Закрыть</v-btn>
          <v-btn
            color="primary"
            @click="save"
            :disabled="!valid"
          >Переместить</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  name: 'MoveToBranch',
  data:() => ({
    dialog: false,
    categoryM: null,
    branch: null,
    unitOfMeasurement: null,
    item: {
      "productId": null,
      "amount": null
    },
    items: [],
    category: [],
    branches: [],
  }),
  mounted() {
    this.$store.dispatch('getAllBranch')
      .then(r => {
        this.branches = r.data
        this.branch = 1
      })
      .catch(e => this.$store.commit('setSnackbars', e.message))
    this.$store.dispatch('getCategory')
      .then(r => {
        this.category = r.data
        this.categoryM = 1
      })
      .catch(e => this.$store.commit('setSnackbars', e.message))
  },
  computed: {
    valid() {
      return !!(this.item.amount && this.item.productId);
    }
  },
  watch: {
    categoryM(v) {
      this.$store.dispatch('getProduct', v)
        .then(r => {
          this.items = r.data
        })
        .catch(e => this.$store.commit('setSnackbars', e.message))
    },
    'item.productId'(v) {
      this.unitOfMeasurement = this.items.find(i => i.id === v).unitOfMeasurement
    }
  },
  methods: {
    save() {
      this.$store.dispatch('moveToBranchFromStore', {item: this.item, to: this.branch})
        .then(r => {
          this.$emit('success', r.data)
          this.item = {
            "productId": null,
            "amount": null
          }
          this.dialog = false
        })
        .catch(e => this.$store.commit('setSnackbars', e.message))
    }
  }
}
</script>

<style scoped>

</style>
