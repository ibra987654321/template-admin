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
      >Удалить</v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title class="mb-8" >Удаление из склада</v-card-title>
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
          <div class="d-flex flex-column">
            <v-text-field
              v-model="searchItems"
              label="Товары"
              outlined
              class="mr-2"
              hide-details
            ></v-text-field>
            <v-list style="background-color: #082a34" class="mr-2" dense v-if="filteredItems.length && searchItemsVisible">
              <v-list-item-group
                color="primary"
              >
                <v-list-item
                  v-for="(product, i) in filteredItems"
                  :key="i"
                  @click="selected(product)"
                >
                  <v-list-item-content class="d-flex flex-nowrap">
                    <v-list-item-title class="search_item" v-text="product.name" @click="clickItem(item.productId, product.id) "></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
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
            :loading="loading"
            :disabled="!valid || loading"
          >Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteProductDialog',
  data:() => ({
    dialog: false,
    loading: false,
    searchItemsVisible: false,
    categoryM: null,
    branch: null,
    searchItems: null,
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
    },
    filteredItems() {
      const regions = this.items.filter((item) => {
        if (this.searchItems) {
          return item.name.toLowerCase()
            .indexOf(this.searchItems.toLowerCase()) !== -1;
        }
      });
      if (regions.length) {
        this.searchItemsVisible = true
        return regions
      } else {
        return []
      }
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
      this.loading = true
      this.$store.dispatch('deleteItemOnStorage', this.item)
        .then(r => {
          this.$emit('success', r.data)
          this.item = {
            "productId": null,
            "amount": null
          }
          this.dialog = false
          this.loading = false
        })
        .catch(e => {
          this.$store.commit('setSnackbars', e.message)
          this.loading = false
        })
    },
    selected(event) {
      this.searchItems = this.items.find(i => i.id === event.id).name
    },
    clickItem(itemId, productId) {
      itemId = productId
      this.item.productId = productId
      setTimeout(() => this.searchItemsVisible = false, 100)
    },
    close() {
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>
