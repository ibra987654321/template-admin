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

export default {
  name: 'branchs',
  data:() => ({
    branches: []
  }),
  mounted() {
    this.initEventSource()
  },
  methods: {
    initEventSource() {
      this.eventSource = new EventSource(`http://176.126.164.208:8070/storage/api/settings/branch/all/goods/byFlux?token=${getToken()}`);

      // Обработчик открытия соединения
      this.eventSource.onopen = () => {
      };

      // Обработчик получения сообщения
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
