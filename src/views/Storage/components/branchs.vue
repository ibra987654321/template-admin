<template>
  <v-row dense class="px-5">
    <v-col cols="3" v-for="item in branches"  :class="$vuetify.breakpoint.mobile ? 'mb-4 px-2' : ''">
      <v-card
        class="mx-auto d-flex flex-column justify-space-between elevation-10"

        max-width="344"
        style="height: 100%;"
        outlined
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="d-flex justify-space-between align-center">
              <div class="text-overline mb-4">
                {{item.name}}
              </div>
              <moveEachBranch v-if="admin || coordinator || superUser || florist" :id="item.id"/>
            </div>

            <div v-if="admin || coordinator || superUser" >Товары</div>
            <v-simple-table dense v-if="admin || coordinator || superUser"   >
              <template v-slot:default>
                <tbody>
                <tr
                  v-for="item in item.goods"
                  :key="item.name"
                >
                  <td>{{ item.name }}</td>
                  <td>{{ item.amount }}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div v-if="admin || coordinator || superUser" >Наборы</div>
          <get-all-sets-for-branch v-if="admin || coordinator || superUser"  :id="item.id"></get-all-sets-for-branch>
          </v-list-item-content>

        </v-list-item>

        <v-card-actions>
          <v-btn
            rounded
            color="primary"
            @click="$router.push({path: `detail/${item.id}`})"
          >
            Подробнее
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { getToken } from '@/helpers/helpers'
import { environment, SETTING, STORAGE } from '@/environments/endPoint'
import getAllSetsForBranch from '@/views/Storage/components/branchComponents/getAllSetsForBranch'
import moveEachBranch from '@/views/Storage/components/moveEachBranch'
import { admin, coordinator, florist, operator, superUser } from '@/helpers/roles'
export default {
  name: 'branchs',
  components: {getAllSetsForBranch, moveEachBranch},
  data:() => ({
    branches: [],
  }),
  mounted() {
    this.initEventSource()
  },
  computed: {
    florist() {
      return florist()
    },
    coordinator() {
      return coordinator()
    },
    admin() {
      return admin()
    },
    operator() {
      return operator()
    },
    superUser() {
      return superUser()
    },
  },
  methods: {
    initEventSource() {
      this.eventSource = new EventSource(`${environment.main }${SETTING}/branch/all/goods/byFlux?token=${getToken()}`);
      this.eventSource.onmessage = (event) => {
        this.branches = JSON.parse(event.data)
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
