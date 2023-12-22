<template>
<div>
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
          small
          @click="dialog = true"
        > Переместить</v-btn>


    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title class="mb-8" >Переместить товары в цех</v-card-title>
        <v-card-text class="d-flex flex-column">
          <div class="mt-4">
            <v-select
              v-model="categoryM"
              label="Тип"
              :items="category"
              item-value="id"
              item-text="name"
              hide-details
              dense
              outlined
              class="mb-2"
            ></v-select>
            <v-text-field
              v-model="searchItems"
              hide-details
              dense
              label="Товары"
              outlined
              class="mb-2"
            ></v-text-field>
            <v-list dense v-if="filteredItems.length && searchItemsVisible">
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
            <v-text-field
              v-model="item.amount"
              outlined
              type="number"
              hide-details
              label="Кол-во"
              dense
            ></v-text-field>
          </div>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn
            text
            @click="dialog.value = false"
          >Закрыть</v-btn>
          <v-dialog
            transition="dialog-bottom-transition"
            max-width="600"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                color="primary"
                :disabled="!valid"
              >Переместить</v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-card-title>
                  Вы действительно хотите сделать переместить?
                </v-card-title>
                <v-card-actions class="justify-space-between">
                  <v-btn
                    color="primary"
                    small
                    @click="dialog.value = false"
                  >Отмена</v-btn>
                  <v-btn
                    color="primary"
                    small
                    @click="save(); dialog.value = false"
                  >Да</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</div>
</template>

<script>
import { mdiArrowRight, mdiPlus } from '@mdi/js'

export default {
  name: 'moveToDepartment',
  props: {
    from: Number,
    to: Number
  },
  data:() => ({
    searchItems: '',
    searchItemsVisible: false,
    dialog: false,
    move: null,
    unitOfMeasurement: null,
    categoryM: null,
    items: [],
    products: [],
    category: [],
    secondItem: [],
    item: {
      "productId": '',
      "amount": '',
      from: '',
      to: ''
    },
    icon: {mdiArrowRight, mdiPlus}
  }),
  watch: {
    categoryM(v) {
      this.$store.dispatch('getProduct', v)
        .then(r => {
          this.products = r.data
        })
        .catch(e => this.$store.commit('setSnackbars', e.message))
    },
    dialog(v) {
      if (v) {
          this.$store.dispatch('getCategory')
            .then(r => {
              this.category = r.data
              this.categoryM = 1
            })
            .catch(e => this.$store.commit('setSnackbars', e.message))
      }
    }
  },
  computed: {
    valid() {
        return !!(this.item.amount && this.item.productId);
    },
    filteredItems() {
      const regions = this.products.filter((item) => {
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
  methods: {
    save() {
      this.item.from = this.$props.from
      this.item.to = this.$props.to
      this.$store.dispatch('moveToDepartment', this.item)
        .then(r => {
          // this.$emit('success', r.data)
          this.categoryM = ''
          this.searchItems = ''
          this.item = {
            "productId": null,
            "amount": null,
            from: '',
            to: ''
          }
          this.active = []
          this.dialog = false
        })
        .catch(e => this.$store.commit('setSnackbars', e.message))
    },
    selected(event) {
      this.searchItems = this.products.find(i => i.id === event.id).name
    },
    clickItem(itemId, productId) {
      itemId = productId
      this.item.productId = productId
      setTimeout(() => this.searchItemsVisible = false, 100)
    }
  }
}
</script>

<style scoped>

</style>
