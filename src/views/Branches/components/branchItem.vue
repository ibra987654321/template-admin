<template>
  <v-card
    class=" "
  >
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      height="250"
      :src="$props.item.type === 'SHOP' ? 'https://images.unsplash.com/photo-1525640788966-69bdb028aa73?q=80&w=3867&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' : 'https://cdn.vuetifyjs.com/images/cards/cooking.png'"
    ></v-img>

    <v-card-title>
      {{ $props.item.name }}
    </v-card-title>

    <v-card-text>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>
    <v-card-text>
      <v-chip-group
        active-class="deep-purple accent-4 white--text"
        column
      >
        <v-chip x-large v-for="product in goods">{{product.name}} : {{product.amount}}</v-chip>
      </v-chip-group>
    </v-card-text>
    <v-card-text >
      <updateDialog  :item="item" @success="$emit('successUpdate')"/>
      <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
      >
        <template v-slot:activator="{ on, attrs }">
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-card-title>
              Вы действительно хотите удалить?
            </v-card-title>
            <v-card-actions class="justify-space-between">
              <v-btn
                color="primary"
                small
                @click="dialog.value = false"
              >Отмена</v-btn>
              <v-btn
                color="error"
                small
                @click="deleteItem()"
              >Да</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>

    </v-card-text>
  </v-card>
</template>

<script>
import updateDialog from '@/views/Branches/components/updateDialog'
import { getToken } from '@/helpers/helpers'
export default {
  name: 'branchItem',
  components: {
    updateDialog,
  },
  props: {
    item: Object
  },
  data:() => ({
    goods: []
  }),
  mounted() {
    this.initEventSource()
  },
  methods: {
    deleteItem() {
      this.$store.dispatch('deleteDepartment', this.item)
        .then(() => this.$emit('successDelete'))
        .catch(e => this.$store.commit('setSnackbars', e.message))
    },
    listOfGoods() {
      // this.$store.dispatch('currentAmountByGoods', this.item.id)
      //   .then(r => {
      //     this.goods = r.data
      //   })
      //   .catch(e => this.$store.commit('setSnackbars', e.message))

    },
    initEventSource() {
      this.eventSource = new EventSource(`http://176.126.164.208:8070/storage/api/goods/currentAmountByGoodsbyFlux/${this.item.id}?token=${getToken()}`);

      // Обработчик открытия соединения
      this.eventSource.onopen = () => {
      };

      // Обработчик получения сообщения
      this.eventSource.onmessage = (event) => {
        this.goods = JSON.parse(event.data)
      };

    },
    disconnectEventSource() {
      // Закрытие соединения
      if (this.eventSource) {
        this.eventSource.close();
      }
    },
  },
  destroyed() {
    this.disconnectEventSource()
  }
}
</script>

<style scoped>

</style>
