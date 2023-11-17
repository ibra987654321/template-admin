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

      >Добавить объект</v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title class="mb-8" >Добавление </v-card-title>
        <v-card-text class="d-flex justify-space-around">
          <v-text-field
            v-model="item.name"
            outlined
            label="Название"
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
      "name": null,
      "branchId": null
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
      return !!(this.item.name);
    }
  },
  methods: {
    save() {
      this.item.branchId = this.$route.params.id
      this.$store.dispatch('postDepartment', this.item)
        .then(r => {
          this.$emit('success', r.data)
          this.item = {
            "name": null,
            "branchId": null
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
