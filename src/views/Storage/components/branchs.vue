<template>
  <v-row dense>
    <v-col v-for="item in branches">
      <v-card
        class="mx-auto d-flex flex-column justify-space-between elevation-2"
        max-width="344"
        style="height: 100%;"
        outlined
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="text-overline mb-4">
              Филиал
            </div>
            <v-list-item-title class="text-h5 mb-1">
              {{item.name}}
            </v-list-item-title>
            <v-list-item-subtitle style="min-width: 130px" v-for="good in item.goods">
              {{good.name}} : {{good.amount}}
            </v-list-item-subtitle>
<!--            {{getSets(item.id)}}-->
<!--            <v-list-item-subtitle v-if="sets.length" style="min-width: 130px" v-for="good in sets">-->
<!--              {{good.name}} : {{good.amount}}-->
<!--            </v-list-item-subtitle>-->
          </v-list-item-content>

          <v-list-item-avatar
            tile
            size="80"
            color="grey"
          ></v-list-item-avatar>
        </v-list-item>

        <v-card-actions>
          <v-btn
            outlined
            rounded
            text
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
export default {
  name: 'branchs',
  data:() => ({
    branches: [],
    sets: [],
    // eventSource: {
    //   goods: '',
    //   sets: ''
    // }
  }),
  mounted() {
    this.initEventSource()
  },
  methods: {
    getSets(v) {
      this.eventSource1 = new EventSource(`${environment.main }${STORAGE}/set/allnameAmount/${v}?token=${getToken()}`);
      this.eventSource1.onmessage = (event) => {
        this.sets = JSON.parse(event.data)
      };
    },
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
