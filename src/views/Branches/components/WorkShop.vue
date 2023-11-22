<template>
  <v-card>
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      height="150"
      src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
    >
    </v-img>

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
        <v-chip v-for="product in goods" :color="product.amount < 5 ? 'red' : ''">{{product.name}} : {{product.amount}}</v-chip>
      </v-chip-group>
    </v-card-text>
    <v-card-text >
      <v-btn color="primary" small @click="$router.push({path: '/department-detail/' + item.id})">Подробнее</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { getToken } from '@/helpers/helpers'

export default {
  name: 'WorkShop',
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
