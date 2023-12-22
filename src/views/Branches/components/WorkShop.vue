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

    <v-card-title >
      {{ $props.item.name }}
      <div v-if="coordinator" class="ml-5">
        <toDisposal :department-id="$props.item.id"/>
      </div>

    </v-card-title>

    <v-card-text>
      <v-chip-group
        active-class="deep-purple accent-4 white--text"
        column
      >
        <v-chip  v-for="product in goods" :color="product.amount < 5 ? 'error' : ''">{{product.name}} : {{product.amount}}</v-chip>
      </v-chip-group>
    </v-card-text>
    <v-divider class="mx-4"></v-divider>
    <v-card-text>
      <v-data-table
        :headers="[  { text: 'Название', value: 'name' }, { text: 'Кол-во', value: 'amount' },]"
        :items="sets"
        hide-default-footer
      ></v-data-table>
    </v-card-text>
    <v-card-text >
      <v-btn color="primary" small @click="$router.push({path: '/department-detail/' + item.id})">Подробнее</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { getToken } from '@/helpers/helpers'
import toDisposal from '@/views/Branches/components/toDisposal'
import { coordinator } from '@/helpers/roles'

export default {
  name: 'WorkShop',
  components: {
    toDisposal
  },
  props: {
    item: Object,
  },
  data:() => ({
    sets: [],
    goods: [],
  }),
  mounted() {
    this.initEventSource()
  },
  computed: {
    coordinator() {
      return coordinator()
    }
  },
  methods: {
    deleteItem() {
      this.$store.dispatch('deleteDepartment', this.item)
        .then(() => this.$emit('successDelete'))
        .catch(e => this.$store.commit('setSnackbars', e.message))
    },
    initEventSource() {
      this.eventSource = new EventSource(`http://176.126.164.208:8070/storage/api/set/allNameAmountByDepartmentFlux/${this.item.id}?token=${getToken()}`);
      this.eventSource.onmessage = (event) => {
        this.sets = JSON.parse(event.data)
      };
      this.eventSource1 = new EventSource(`http://176.126.164.208:8070/storage/api/goods/currentAmountByGoodsbyFlux/${this.item.id}?token=${getToken()}`);
      this.eventSource1.onmessage = (event) => {
        this.goods = JSON.parse(event.data)
      };

    },
    disconnectEventSource() {
      if (this.eventSource) {
        this.eventSource.close();
      }
      if (this.eventSource1) {
        this.eventSource1.close();
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
