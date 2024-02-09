<template>
  <v-dialog
    v-model="bookDialog"
    width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-if="!item.booked"
        class="rounded ml-2" rounded small  color="primary" :disabled="item.sold"
        v-bind="attrs"
        v-on="on"
      >
        {{!item.booked && 'Бронь'}}
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Бронирование
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="bookedBy"
          label="Для кого"
          :dense="$vuetify.breakpoint.mobile"
          hide-details
          outlined
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          color="primary"
          text
          @click="bookDialog = false"
        >
          Отмена
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="bookToSell(item.id)"
          :loading="loading"
          :disabled="loading"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'bookDialog',
  props: {
    item: Object
  },
  data:() => ({
    loading: false,
    bookDialog: false,
    bookedBy: ''
  }),
  methods: {
    bookToSell(id) {
      this.loading = true
      this.$store.dispatch('bookToSell', {setId: id, bookedBy: this.bookedBy})
        .then(() => {
          this.$emit('success')
          this.bookDialog = false
          this.loading = false
        })
        .catch(error => {
          this.bookDialog = false
          this.loading = false
          const errorMessage = error.response ? error.response.data : 'Unknown error';
          this.$store.commit('setSnackbars', errorMessage);
        });
    }
  }
}
</script>

<style scoped>

</style>
