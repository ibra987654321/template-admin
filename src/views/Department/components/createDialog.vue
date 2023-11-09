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
      >Собрать набор</v-btn>
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
              <v-text-field
                v-model="item.status"
                outlined
                label="Статус"
              ></v-text-field>
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
                label="Количество"
              ></v-text-field>
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
  data:() => ({
    dialog: false,
    item: {
      "name": "",
      "status": "",
      "productId": 0,
      "departmentId": 0,
      "amount": null
    },
    items: []
  }),
  mounted() {
    this.$store.dispatch('getProduct')
      .then(r => {
        this.items = r.data
      })
      .catch(e => this.$store.commit('setSnackbars', e.message))
  },
  computed: {
    valid() {
      return !!(this.item.name && this.item.status && this.item.amount && this.item.productId);
    }
  },
  methods: {
    save() {
      this.item.departmentId = this.$route.params.id
      this.$store.dispatch('createSet', this.item)
        .then(r => {
          this.$emit('success', r.data)
          this.item = {
            "name": "",
            "status": "",
            "productId": 0,
            "departmentId": 0,
            "amount": 0
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
