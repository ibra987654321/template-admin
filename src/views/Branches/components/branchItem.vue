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
      src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
    ></v-img>

    <v-card-title>
      {{ $props.item.name }}
      <v-btn small class="ml-2" color="info" @click="$router.push({path: '/department-detail/' + item.id})">Подробнее</v-btn>
    </v-card-title>

    <v-card-text>
<!--      <v-row-->
<!--        align="center"-->
<!--        class="mx-0"-->
<!--      >-->
<!--        <v-rating-->
<!--          :value="4.5"-->
<!--          color="amber"-->
<!--          dense-->
<!--          half-increments-->
<!--          readonly-->
<!--          size="14"-->
<!--        ></v-rating>-->

<!--        <div class="grey&#45;&#45;text ms-4">-->
<!--          3000 гр Клубники-->
<!--        </div>-->
<!--      </v-row>-->

<!--      <div class="my-4 text-subtitle-1">-->
<!--        $ • {{ $props.item.id }}-->
<!--      </div>-->

<!--      <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>-->
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

<!--    <v-card-title>125 шт цветов</v-card-title>-->

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
      <moveToDepartment :prop-item="item" @success="listOfGoods()"/>
      <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="error"
            v-bind="attrs"
            v-on="on"
            small
            class="mt-2"
          >Удалить</v-btn>
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
import moveToDepartment from '@/views/Storage/components/moveToDepartment'
export default {
  name: 'branchItem',
  components: {
    updateDialog,
    moveToDepartment,
  },
  props: {
    item: Object
  },
  data:() => ({
    goods: []
  }),
  mounted() {
    this.listOfGoods()
  },
  methods: {
    deleteItem() {
      this.$store.dispatch('deleteDepartment', this.item)
        .then(() => this.$emit('successDelete'))
        .catch(e => this.$store.commit('setSnackbars', e.message))
    },
    listOfGoods() {
      this.$store.dispatch('currentAmountByGoods', this.item.id)
        .then(r => {
          this.goods = r.data
        })
        .catch(e => this.$store.commit('setSnackbars', e.message))
    }
  }
}
</script>

<style scoped>

</style>
