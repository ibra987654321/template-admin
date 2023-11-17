<template>
  <div>
    <div class="mb-5">
      <v-btn @click="$router.go(-1)" class="mr-2" small><v-icon>{{icons.mdiArrowLeft}}</v-icon></v-btn>

      <createDialog text-btn="Собрать набор" @success="listOfData"/>
    </div>
    <div class="mt-2 d-flex flex-wrap">

      <v-hover v-slot="{ hover }" v-for="item in items">
        <v-card
          class=" flex-grow-1 mr-4 mb-4"
          :max-width="$vuetify.breakpoint.sm ? 233 : 280"

        >
          <v-img
            v-if="!loading"
            :src="imagesSrc.find(i => i.id === item.id).img"
            height="200px"
          ></v-img>
          <v-fab-transition>
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

          <v-card-title>
            {{item.name}}
          </v-card-title>
          <div>
          </div>
          <v-card-subtitle>
            Количество: {{item.amount}}<br>
            Набор из {{item.goods.name}}
          </v-card-subtitle>

          <v-card-actions>

            <v-spacer></v-spacer>
            <createDialog :prop-item="item" text-btn="Изменить" @success="listOfData"/>
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
    loading: false
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
    }
  }
}
</script>

<style scoped>

</style>
