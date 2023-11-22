<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="700"
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        v-bind="attrs"
        v-on="on"
      >{{$props.textBtn}}</v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title class="mb-8" >Добавление </v-card-title>
        <v-card-text class="d-flex justify-space-around">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="item.name"
                outlined
                label="Название"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="item.status"
                outlined
                :items="['Свободный', 'Заказ']"
                label="Статус"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="categoryM"
                label="Товар"
                :items="category"
                item-value="id"
                item-text="name"
                hide-details
                outlined
                class="mr-2"
              ></v-select>
            </v-col>
            <v-col cols="6">
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
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="item.amount"
                outlined
                type="number"
                :label="unitOfMeasurement"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <input type="file" @change="handleFileChange" accept="image/*" />
            </v-col>

            <v-divider></v-divider>
            <div class="text-sm-h5 mx-auto">Расходные материалы</div>
            <v-col cols="12">
              <v-row v-for="(material, idx) in item.consumables">
                <v-col cols="7">
                  <v-select
                    v-model="material.materialId"
                    label="Товар"
                    :items="materials"
                    item-value="id"
                    item-text="name"
                    hide-details
                    outlined
                    class="mr-2"
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="material.amount"
                    outlined
                    label="Количество"
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-btn color="primary" @click="item.consumables.splice(idx, 1)">-</v-btn>
                </v-col>
              </v-row>
              <v-col cols="12">
              <v-btn color="primary" @click="item.consumables.push( { materialId: 0, amount: null })">+</v-btn>
            </v-col>
            </v-col>

          </v-row>

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
            :disabled="!valid"
          >Создать</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  name: 'createDialog',
  props: {
    textBtn: String,
    propItem: Object
  },
  data:() => ({
    dialog: false,
    loading: false,
    categoryM: null,
    unitOfMeasurement: null,
    item: {
      "name": "",
      "status": "",
      "productId": 0,
      "branchId": 0,
      "amount": null,
      "consumables": []
    },
    cameraNotSupported: false,
    newMessage: {
      file: null
    },
    items: [],
    category: [],
    capturedPhoto: null,
    photoFile: null,
    materials: null,
  }),
  mounted() {
    this.$store.dispatch('getCategory')
      .then(r => {
        this.category = r.data
        this.categoryM = 1
      })
      .catch(e => this.$store.commit('setSnackbars', e.message))
    this.$store.dispatch('getMaterial')
      .then(r => {
        this.materials = r.data
      })
      .catch(e => this.$store.commit('setSnackbars', e.message))
  },
  computed: {
    valid() {
      return !!(this.item.name && this.item.status && this.item.amount && this.item.productId);
    },
  },
  watch: {
    'dialog'(v) {
      if (this.propItem) {
        this.item.name = this.propItem.name
        this.item.productId = this.propItem.goods.product.id
        this.item.amount = this.propItem.amount
      }
    },
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
      this.item.branchId = this.$route.params.id
      if (this.propItem) {
        if (this.newMessage.file !== null) {
          this.$store.dispatch('uploadImg',{
            file: this.newMessage.file,
            id: this.propItem.id
          })
            .then(() => {
              this.$emit('success', '')
              this.item = {
                "name": "",
                "status": "",
                "productId": 0,
                "branchId": 0,
                "amount": null
              }
              this.dialog = false
              this.loading = false
            })
          return
        }
        this.dialog = false
        this.loading = false
      } else {
        this.$store.dispatch('createSet', this.item)
          .then(r => {
            if (this.newMessage.file !== null) {
              this.$store.dispatch('uploadImg',{
                file: this.newMessage.file,
                id: r.data.id
              })
                .then(() => {
                  this.$emit('success', r.data)
                  this.item = {
                    "name": "",
                    "status": "",
                    "productId": 0,
                    "departmentId": 0,
                    "amount": null
                  }
                  this.dialog = false
                  this.loading = false
                })
              return
            }
            this.dialog = false
            this.loading = false

          })
          .catch(error => {
            const errorMessage = error.response ? error.response.data : 'Unknown error';
            this.$store.commit('setSnackbars', errorMessage);
            this.loading = false
          });
      }

    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newMessage.file = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.capturedPhoto = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },

}
</script>

<style scoped>

</style>
