<template>
  <div>
  <div class="mb-5">
    <v-btn v-if="admin || coordinator || superUser" @click="$router.go(-1)" class="mr-2" small><v-icon>{{icons.mdiArrowLeft}}</v-icon></v-btn>
  </div>
    <div class="mb-5">
      <dateRangePicker/>
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

  <div class="mt-2 d-flex flex-wrap">

    <v-hover v-slot="{ hover }" v-for="item in filteredItems">
      <v-card
        :loading="loading"
        elevation="7"
        class=" flex-grow-2 mr-4 mb-4"
        :max-width="$vuetify.breakpoint.sm ? 233 : $vuetify.breakpoint.mobile ? '100%' : 300"
      >
        <v-img
          v-if="!loading"
          :src="imagesSrc.find(i => i.id === item.id).img"
          height="200px"
          width="100%"
        ></v-img>
        <v-skeleton-loader
          v-else
          :width="$vuetify.breakpoint.sm ? 233 : $vuetify.breakpoint.mobile ? '100%' : 300"
          type="card-avatar"
        ></v-skeleton-loader>
        <v-fab-transition v-if="!loading">
          <v-btn
            v-show="hover"
            color="pink"
            fab
            dark
            small
            absolute
            top
            right
            @click="$store.dispatch('deleteImages', item.id).then(() => listOfData())"
          >
            <v-icon>{{ icons.mdiDeleteCircle }}</v-icon>
          </v-btn>
        </v-fab-transition>
        <v-card-text class="mt-4" v-if="!loading">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex">
              <v-avatar size="40px">
                <v-img :src="require('@/assets/images/avatars/2.png')"></v-img>
              </v-avatar>
              <v-list-item>
                <v-list-item-content class=" text-sm-h5">{{item.createdBy}}</v-list-item-content>
              </v-list-item>
            </div>
            <v-chip
              class="mb-4 ml-4"
              color="secondary"
              text-color="white"
            >
              {{item.booked ? item.bookedBy : item.status}}
            </v-chip>
          </div>

          <v-card-title class="pl-0 font-weight-bold">
            {{item.name}}
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
          <div class="mt-4 mr-2 " style="min-width: 118px; max-width: 118px">{{item.createdAt | date}}</div>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-hover>
  </div>
  </div>
</template>

<script>
import { mdiArrowLeft, mdiCheckBold, mdiDeleteCircle } from '@mdi/js'
import { admin, coordinator, florist, operator, superUser, workshop } from '@/helpers/roles'
import dateRangePicker from '@/layouts/components/dateRangePicker/DateRangePicker'

export default {
  name: 'SellTable',
  components: {dateRangePicker},
  data:() => ({
    items: [],
    imagesSrc: [],
    icons: {mdiCheckBold, mdiDeleteCircle, mdiArrowLeft},
    loading: false,
    sellLoading: false,
    searchText: '',
    selectCase: '',
  }),
  mounted() {
    this.$store.state.branch.departmentIds.map(i => {
      this.listOfData(i)
    })

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
    },
    done() {
      return this.date.end
    },
    start() {
      return this.date.start
    },
    date() {
      return this.$store.state
    },
  },
  watch: {
    done() {
      this.items = []
      this.$store.state.branch.departmentIds.map(i => {
        this.listOfData(i)
      })
    },
    start() {
      this.items = []
      this.$store.state.branch.departmentIds.map(i => {
        this.listOfData(i)
      })
    },
  },
  methods: {
    listOfData(id) {
      this.loading = true
      this.$store.dispatch('getAllSoldSets', id)
        .then(r => {
          this.items.push(...r.data)
          r.data.map(i => {
            this.image(i.id)
          })
          this.loading = false
        })
    },
    image(v){
      this.$store.dispatch('getImages', v)
        .then(r => {
          if (r.data.byteLength > 4) {
            const blob = new Blob([r.data], { type: 'image/jpeg' });
            const item = {
              id: v,
              img: URL.createObjectURL(blob)
            }
            this.imagesSrc.push(item)
          } else {
            const item = {
              id: v,
              img: 'https://media.istockphoto.com/id/157643364/photo/tumble-of-strawberries.jpg?s=1024x1024&w=is&k=20&c=RLsC4rSKQ8Gfj8rHK9HqYe2SWDLzW5C1PkFM_lLwRc4='
            }
            this.imagesSrc.push(item)
          }

        })
        .catch(error => {
          const errorMessage = error.response ? error.response.data : 'Unknown error';
          this.$store.commit('setSnackbars', errorMessage);
        });
    },
  }
}
</script>

<style scoped>

</style>
