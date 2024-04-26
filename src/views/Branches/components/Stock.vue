<template>
  <v-card
    class="mx-auto"
    outlined
  >
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-overline mb-4 " :class="(coordinator || florist) && 'd-flex justify-space-between'">
          Склад
          <moveEachBranch v-if="coordinator || florist || superUser" :id="Number($route.params.id)"/>
          <moveToDepartment v-if="coordinator || superUser" :to="$props.workShop.id" :from="$props.item.id"/>
        </div>
        <v-list-item-title class="text-h5 mb-1">
          {{ item.name }}
        </v-list-item-title>
      </v-list-item-content>

    </v-list-item>
    <v-divider class="mx-4"></v-divider>
    <v-card-text>
      <v-text-field
        v-model="search"
        outlined
        dense
        class="mb-1"
        label="Поиск"
      ></v-text-field>
      <v-data-table
        :headers="[  { text: 'Название', value: 'name' }, { text: 'Кол-во', value: 'amount' },]"
        :items="filteredGoods"
      ></v-data-table>
    </v-card-text>
    <v-card-text class="d-flex">
      <v-btn color="primary" small @click="$router.push({path: '/department-detail/' + item.id})">Подробнее</v-btn>
     <div v-if="admin || florist || superUser || coordinator" class="ml-5">
       <to-disposal  :department-id="$props.item.id"></to-disposal>
     </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { getToken } from '@/helpers/helpers'
import moveEachBranch from '@/views/Storage/components/moveEachBranch'
import { admin, coordinator, florist, superUser } from '@/helpers/roles'
import moveToDepartment from '@/views/Branches/components/moveToDepartment'
import toDisposal from '@/views/Branches/components/toDisposal'

export default {
  name: 'Stock',
  props: {
    item: Object,
    workShop: Object
  },
  components: {
    moveEachBranch,
    moveToDepartment,
    toDisposal
  },
  data:() => ({
    goods: [],
    search: ''
  }),
  mounted() {
    this.initEventSource()
  },
  computed: {
    coordinator() {
      return coordinator()
    },
    florist() {
      return florist()
    },
    admin() {
      return admin()
    },
    superUser() {
      return superUser()
    },
    filteredGoods() {
      return this.goods.filter(item =>
        item.name.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  watch: {
    search(v) {
      if (!v) {
        this.initEventSource()
      }
    }
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
