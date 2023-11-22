<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="600"
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <div style="width: 100%;" class="d-flex mb-5 px-5" :class="$vuetify.breakpoint.mobile ? 'flex-column' : 'justify-space-around'">
        <v-btn
          color="primary"
          v-bind="attrs"
          v-on="on"
          :large="!$vuetify.breakpoint.mobile"
          :small="$vuetify.breakpoint.mobile"
          :class="$vuetify.breakpoint.mobile ? 'mb-2' : 'mr-2'"
          @click="move = true"
        >Переместить товар</v-btn>
        <v-btn
          color="primary"
          v-bind="attrs"
          v-on="on"
          :large="!$vuetify.breakpoint.mobile"
          :small="$vuetify.breakpoint.mobile"
          @click="move = false"
        >Добавить товар</v-btn>
      </div>

    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title class="mb-8" >{{move ? 'Перемещение' : 'Добавление'}} товара в филиал</v-card-title>
        <v-card-text class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-select
              v-model="item.from"
              label="Филиалы"
              :items="items"
              item-value="id"
              item-text="name"
              hide-details
              dense
              outlined
              class="mb-2"
            ></v-select>
            <v-icon v-if="move" class="mx-4">{{icon.mdiArrowRight}}</v-icon>
            <v-select v-if="move"
              v-model="item.to"
              label="Филиалы"
              :items="secondItem"
              item-value="id"
              item-text="name"
              hide-details
              dense
              outlined
              class="mb-2"
            ></v-select>
          </div>
          <div class="mt-4">
            <v-select
              v-model="categoryM"
              label="Товар"
              :items="category"
              item-value="id"
              item-text="name"
              hide-details
              dense
              outlined
              class="mb-2"
            ></v-select>
            <v-select
              v-model="item.productId"
              label="Товар"
              :items="products"
              item-value="id"
              item-text="name"
              hide-details
              dense
              outlined
              class="mb-2"
            ></v-select>
            <v-text-field
              v-model="item.amount"
              outlined
              type="number"
              hide-details
              :label="unitOfMeasurement"
              dense
            ></v-text-field>
          </div>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn
            text
            @click="dialog = false"
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
              >{{move ? 'Переместить' : 'Добваить'}}</v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-card-title>
                  Вы действительно хотите сделать {{move ? 'перемещение' : 'добавление'}}?
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
</template>

<script>
import {mdiArrowRight} from '@mdi/js'

export default {
  name: 'moveEachBranch',
  data:() => ({
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
    icon: {mdiArrowRight}
  }),
  mounted() {
    this.$store.dispatch('allBranchesWithDepartments')
      .then(r => {
        this.items = r.data
      })
      .catch(e => this.$store.commit('setSnackbars', e.message))
    this.$store.dispatch('getCategory')
      .then(r => {
        this.category = r.data
        this.categoryM = 1
      })
      .catch(e => this.$store.commit('setSnackbars', e.message))
  },
  watch: {
    'item.from'(v) {
      this.secondItem = this.items.filter(function(item) {
        return item.id !== v;
      });
    },
    categoryM(v) {
      this.$store.dispatch('getProduct', v)
        .then(r => {
          this.products = r.data
        })
        .catch(e => this.$store.commit('setSnackbars', e.message))
    },
    'item.productId'(v) {
      this.unitOfMeasurement = this.products.find(i => i.id === v).unitOfMeasurement
    }
  },
  computed: {
    valid() {
      if (this.move) {
        return !!(this.item.amount && this.item.productId && this.item.to && this.item.from);
      } else {
        return !!(this.item.amount && this.item.productId);
      }
    }
  },
  methods: {
    save() {
      this.$store.dispatch(this.move ? 'moveToBranch' : 'saveToBranch', this.item)
        .then(r => {
          this.$emit('success', r.data)
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
  }
}
</script>

<style scoped>

</style>
