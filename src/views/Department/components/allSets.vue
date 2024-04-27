<template>
  <div>
    <div class="mb-5">
      <v-btn v-if="admin || coordinator || superUser" @click="$router.go(-1)" class="mr-2" small><v-icon>{{icons.mdiArrowLeft}}</v-icon></v-btn>
    </div>
    <div class="d-flex " :class="$vuetify.breakpoint.mobile && 'flex-column mb-5'">
      <v-text-field
        v-model="searchText"
        label="Поиск по названию"
        :dense="$vuetify.breakpoint.mobile"
        hide-details
        outlined
        class="mb-5"
        :class="!$vuetify.breakpoint.mobile && 'mr-2'"
      ></v-text-field>
      <v-select
        v-model="selectCase"
        label="Сортировка"
        hide-details
        :dense="$vuetify.breakpoint.mobile"
        outlined
        :items="['Новые', 'Старые']"
      ></v-select>
    </div>

    <div class="">
      <v-dialog v-model='dialog' :max-width="$vuetify.breakpoint.mobile ? 400 : 600 ">
          <v-card
            :loading="loading"
            elevation="7"
          >
            <v-icon
              large
              @click='dialog = false'
              style="
              position: absolute;
              z-index: 10;
              right: 0;

            " >{{icons.mdiClose}}</v-icon>
            <v-dialog
              v-if="!imgLoading"
              transition="dialog-bottom-transition"
              max-width="700"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-img
                  :src="imagesSrc.img"
                  height="200px"
                  width="100%"
                  v-bind="attrs"
                  v-on="on"
                  style="cursor:pointer;"
                >
                </v-img>
              </template>
              <template v-slot:default="dialog">

                <v-img
                  :src="imagesSrc.img"
                  width="100%"
                  max-height="100%"
                >
                  <v-icon
                    large
                    @click='dialog.value = false'
                    style="
                  position: absolute;
                  z-index: 10;
                  right: 0;

            " >{{icons.mdiClose}}</v-icon>
                </v-img>
              </template>
            </v-dialog>
            <v-skeleton-loader
              v-else
              :width="$vuetify.breakpoint.sm ? 233 : $vuetify.breakpoint.mobile ? '100%' : 300"
              type="card-avatar"
            ></v-skeleton-loader>
            <v-card-text class="mt-4" v-if="!loading">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex">
                  <v-avatar size="40px">
                    <v-img :src="require('@/assets/images/avatars/2.png')"></v-img>
                  </v-avatar>
                  <v-list-item>
                    <v-list-item-content class="text-sm-h5">{{item.createdBy}}</v-list-item-content>
                  </v-list-item>
                </div>
              </div>

              <v-card-title class="pl-0 font-weight-bold">
                {{item.name}}
              </v-card-title>
              <v-card-title class="pl-0 font-weight-bold">
                <v-chip
                  color="primary"
                  text-color="white"
                >
                  {{item.booked ? item.bookedBy : item.status}}
                </v-chip>
              </v-card-title>
              <v-simple-table dense >
                <template v-slot:default>
                  <tbody>
                  <tr
                    v-for="ingredient in item.ingredients"
                    :key="ingredient.name"
                  >
                    <td class="pl-0" style="font-size: 18px;">{{ ingredient.product.name }}</td>
                    <td class="pr-0" style="font-size: 18px;">{{ ingredient.amount }}</td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <div v-else>
              <v-skeleton-loader
                :width="$vuetify.breakpoint.sm ? 233 : $vuetify.breakpoint.mobile ? '100%' : 320"
                type="article"
              ></v-skeleton-loader>

            </div>
            <v-skeleton-loader
              v-if="loading"
              :width="$vuetify.breakpoint.sm ? 233 : $vuetify.breakpoint.mobile ? '100%' : 320"
              type="actions"
            ></v-skeleton-loader>
            <v-card-actions v-else >
              <!--            <createDialog :prop-item="item" text-btn="Изменить" @success="listOfData"/>-->
              <div class="mt-4 mr-2 " style="min-width: 118px; max-width: 118px">{{item.createdAt | date}}</div>
              <v-spacer></v-spacer>
              <div class="flex-grow-1">
                <v-btn class="rounded"  rounded small color="primary" :loading="sellLoading" :disabled="item.sold || workshop" @click="saveToSell(item.id)">{{item.sold ? 'Продано' : 'Продать'}}</v-btn>
                <bookDialog v-if="!workshop" :item="item" @success="listOfData"/>
                <v-dialog
                  v-if="!imgLoading"
                  transition="dialog-bottom-transition"
                  max-width="700"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      color="primary"
                      small
                      :class="$vuetify.breakpoint.mobile ? 'mt-2' : 'ml-2'"
                    >Утилизировать</v-btn>
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-card-title>Уверены что хотите утилизировать?</v-card-title>
                      <v-card-actions>
                        <v-btn
                          color="error"
                          small
                          @click="dialog.value = false"
                        >Нет</v-btn>
                        <v-btn
                          color="primary"
                          small
                          @click="$store.dispatch('disposalSetById', item.id).then(() => listOfData(), dialog.value = false, close())"
                        >Да</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
                <v-dialog
                  v-if="!imgLoading && imagesSrc.id !== 'local'"
                  transition="dialog-bottom-transition"
                  max-width="700"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      color="primary"
                      small
                      :class="$vuetify.breakpoint.mobile ? 'mt-2' : 'ml-2'"
                    >Удалить картинку</v-btn>
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-card-title>Уверены что хотите удалить?</v-card-title>
                      <v-card-actions>
                        <v-btn
                          color="error"
                          small
                          @click="dialog.value = false"
                        >Нет</v-btn>
                        <v-btn
                          color="primary"
                          small
                          @click="$store.dispatch('deleteImages', item.id).then(() => listOfData(), dialog.value = false, close())"
                        >Да</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </div>

            </v-card-actions>
          </v-card>
      </v-dialog>
      <useTable
        :headers="headers"
        :loading="loading"
        :items="filteredItems"
        :filters="filters"
        :function='getTest'
      />

    </div>
  </div>

</template>

<script>
import { mdiArrowLeft, mdiCheckBold, mdiDeleteCircle, mdiClose, mdiDelete } from '@mdi/js'
import createDialog from '@/views/Department/components/createDialog'
import bookDialog from '@/views/Department/components/bookDialog'
import useTable from '@/components/useDashboard/useTable'
import { admin, coordinator, florist, operator, superUser, workshop } from '@/helpers/roles'

export default {
  name: 'allSets',
  props: {
    id: String
  },
  components: {
    createDialog,
    bookDialog,
    useTable
  },
  data:() => ({
    items: [],
    item: {},
    imagesSrc: '',
    icons: {mdiCheckBold, mdiDeleteCircle, mdiArrowLeft, mdiClose, mdiDelete},
    loading: false,
    imgLoading: false,
    dialog: false,
    sellLoading: false,
    searchText: '',
    selectCase: '',
    headers:[
      {text: '№', value: 'index'},
      {text: 'Название', value: 'name'},
      {text: 'Сделано', value: 'createdBy'},
      {text: 'Статус', value: 'status'},
      {text: 'Бронирован', value: 'orderedBy'},
      {text: 'Дата создания', value: 'createdAt'},
      { text: 'Действие', value: 'function' },
    ],
    filters: {
      date: ['createdAt']
    }
  }),
  mounted() {
      this.listOfData()
  },
  watch: {
    dialog(v) {
      if (v) {
        this.image(this.item.id)
      }
    }
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
    workshop() {
      return workshop()
    },
    superUser() {
      return superUser()
    },
    filteredItems() {
        return this.items.filter(item => {
          return item.name.toLowerCase().includes(this.searchText.toLowerCase());
        })
          .sort((a, b) => {
            if (this.selectCase === 'Новые') {
              return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (this.selectCase === 'Старые') {
              return new Date(a.createdAt) - new Date(b.createdAt);
            }
          });
    }
  },
  methods: {
    listOfData() {
      this.loading = true
      this.$store.dispatch('getAllSets', this.$props.id)
        .then(r => {
          this.items = r.data
          this.loading = false
        })
    },
   image(v){
      this.imgLoading = true
     this.$store.dispatch('getImages', v)
        .then(r => {
          if (r.data.byteLength > 4) {
            const blob = new Blob([r.data], { type: 'image/jpeg' });
            this.imagesSrc = {
              id: v,
              img: URL.createObjectURL(blob)
            }
          } else {
            this.imagesSrc = {
              id: 'local',
              img: 'https://media.istockphoto.com/id/157643364/photo/tumble-of-strawberries.jpg?s=1024x1024&w=is&k=20&c=RLsC4rSKQ8Gfj8rHK9HqYe2SWDLzW5C1PkFM_lLwRc4='
            }
          }
          this.imgLoading = false
        })
       .catch(error => {
         const errorMessage = error.response ? error.response.data : 'Unknown error';
         this.$store.commit('setSnackbars', errorMessage);
         this.imgLoading = false
       });
    },
    saveToSell(id) {
      this.sellLoading = true
      this.$store.dispatch('saveToSell',id)
        .then(() => {
          this.listOfData()
          this.sellLoading = false
        })
        .catch(error => {
          this.sellLoading =false
          const errorMessage = error.response ? error.response.data : 'Unknown error';
          this.$store.commit('setSnackbars', errorMessage);
        });
    },
    getTest(d) {
     this.item = d
      this.dialog = true
    },
    close() {
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>
