<template>
  <div>
    <div class="mb-5">
      <v-btn @click="$router.go(-1)" class="mr-2" small><v-icon>{{icons.mdiArrowLeft}}</v-icon></v-btn>

    </div>
    <div class="mt-2 d-flex flex-wrap">

      <v-hover v-slot="{ hover }" v-for="item in items">
        <v-card
          :loading="loading"
          class=" flex-grow-2 mr-4 mb-4"
          :max-width="$vuetify.breakpoint.sm ? 233 : $vuetify.breakpoint.mobile ? '100%' : 320"

        >
          <v-img
            v-if="!loading"
            :src="imagesSrc.find(i => i.id === item.id).img"
            height="200px"
          ></v-img>
          <v-skeleton-loader
            v-else
            :width="$vuetify.breakpoint.sm ? 233 : $vuetify.breakpoint.mobile ? '100%' : 320"
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
              @click="$store.dispatch('deleteImages', item.id).then(() => listOfData)"
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
                color="primary"
                text-color="white"
                v-if="item.orderedBy"
              >
                {{item.orderedBy}}
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
<!--            <createDialog :prop-item="item" text-btn="Изменить" @success="listOfData"/>-->
            <div class="mt-4 mr-2 " style="min-width: 118px; max-width: 118px">{{item.createdAt | date}}</div>
            <v-spacer></v-spacer>
            <v-btn class="rounded" rounded small color="primary" :loading="sellLoading" @click="saveToSell(item.id)">{{item.sold ? 'Продано' : 'Продать'}}</v-btn>
          </v-card-actions>

        </v-card>
      </v-hover>
    </div>
  </div>

</template>

<script>
import { mdiCheckBold, mdiDeleteCircle, mdiArrowLeft } from '@mdi/js'
import createDialog from '@/views/Department/components/createDialog'

export default {
  name: 'allSets',
  components: {
    createDialog
  },
  data:() => ({
    items: [],
    imagesSrc: [],
    icons: {mdiCheckBold, mdiDeleteCircle, mdiArrowLeft},
    loading: false,
    sellLoading: false,
  }),
  mounted() {
   this.listOfData()
  },
  methods: {
    listOfData() {
      this.loading = true
      this.$store.dispatch('getAllSets', this.$route.params.id)
        .then(r => {
          this.items = r.data
          r.data.map(i => {
            this.image(i.id)
          })
          setTimeout(() => this.loading = false, 1000)
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
    }
  }
}
</script>

<style scoped>

</style>
