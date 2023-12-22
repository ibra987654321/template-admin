<template>
  <v-card style="height: 100%">
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      height="250"
      src="https://images.unsplash.com/photo-1525640788966-69bdb028aa73?q=80&w=3867&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ></v-img>

    <v-card-title>
      {{ $props.item.name }}
    </v-card-title>

    <v-card-text>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>
    <v-card-text >
      <v-data-table
        :headers="[  { text: 'Название', value: 'name' }, { text: 'Кол-во', value: 'amount' },]"
        :items="sets"
        hide-default-footer
      ></v-data-table>
<!--      <updateDialog  :item="item" @success="$emit('successUpdate')"/>-->
      <v-btn color="primary" small @click="$router.push({path: '/department-detail/' + item.id})">Подробнее</v-btn>
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
    goods: [],
    sets: [],
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
      this.eventSource2 = new EventSource(`http://176.126.164.208:8070/storage/api/set/allNameAmountByDepartmentFlux/${this.item.id}?token=${getToken()}`);

      this.eventSource2.onmessage = (event) => {
        this.sets = JSON.parse(event.data)
      };

    },
    disconnectEventSource() {
      if (this.eventSource2) {
        this.eventSource2.close();
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
