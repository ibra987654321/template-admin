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
        small
        class="mr-2 mt-2"
        @click="move = true"
      >Переместить товар</v-btn>
      <v-btn
        color="primary"
        v-bind="attrs"
        v-on="on"
        small
        @click="move = false"
      >Добавить товар</v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title class="mb-8" >{{move ? 'Перемещение' : 'Добавление'}} товара в филиал</v-card-title>
        <v-card-text class="d-flex justify-space-between">
          <div class="mr-2" v-if="move">
            <div>Выберите с какого филиала будете брать товар</div>
            <v-treeview
              style="width: 100%;"
              v-model="tree"
              :items="items"
              :active.sync="active"
              activatable
              open-on-click
            >
            </v-treeview>
          </div>
          <div style="min-width: 50%">
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
              label="Количество"
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
export default {
  name: 'moveToDepartment',
  props: {
    propItem: Object
  },
  data:() => ({
    dialog: false,
    move: null,
    item: {
      "productId": null,
      "amount": null
    },
    items: [],
    products: [],
    tree:[],
    active: [],
  }),
  mounted() {
    this.$store.dispatch('allBranchesWithDepartments')
      .then(r => {
        this.items = r.data
        this.renameKeys(this.items)
      })
      .catch(e => this.$store.commit('setSnackbars', e.message))
    // this.$store.dispatch('getProduct')
    //   .then(r => {
    //     this.products = r.data
    //   })
    //   .catch(e => this.$store.commit('setSnackbars', e.message))
  },
  computed: {
    valid() {
      if (this.move) {
        return !!(this.item.amount && this.item.productId && this.active.length);
      } else {
        return !!(this.item.amount && this.item.productId);
      }
    }
  },
  methods: {
    save() {
      if (this.move) {
        this.item.from = this.active[0]
      }
      this.item.to = this.$props.propItem.id
      this.$store.dispatch(this.move ? 'moveToDepartment' : 'saveToDepartment', this.item)
        .then(r => {
          this.$emit('success', r.data)
          this.item = {
            "productId": null,
            "amount": null
          }
          this.active = []
          this.dialog = false
        })
        .catch(e => this.$store.commit('setSnackbars', e.message))
    },
    renameKeys(obj) {
      if (Array.isArray(obj)) {
        obj.forEach(item => this.renameKeys(item));
      } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          if (key === 'departments') {
            obj['children'] = obj[key];
            delete obj[key];
          } else {
            this.renameKeys(obj[key]);
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
