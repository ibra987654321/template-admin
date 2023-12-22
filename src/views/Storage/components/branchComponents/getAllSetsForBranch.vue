<template>
<div>
  <v-simple-table dense >
    <template v-slot:default>
      <tbody>
      <tr
        v-for="item in sets"
        :key="item.name"
      >
        <td>{{ item.name }}</td>
        <td>{{ item.amount }}</td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
</div>
</template>

<script>
import { environment, STORAGE } from '@/environments/endPoint'
import { getToken } from '@/helpers/helpers'

export default {
  name: 'getAllSetsForBranch',
  props: {
    id: Number
  },
  data:() => ({
    sets: [],
  }),
  mounted() {
    this.getSets()
  },
  methods: {
    getSets() {
      this.eventSource1 = new EventSource(`${environment.main }${STORAGE}/set/allNameAmountByBranchFlux/${this.$props.id}?token=${getToken()}`);
      this.eventSource1.onmessage = (event) => {
        this.sets = JSON.parse(event.data)
      };
    },
    disconnectEventSource() {
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
