<template>
 <div>
   <v-card>
     <v-tabs
       v-model="tabs"
       centered
       hide-slider
       class="mb-7"
     >
       <v-tab
         v-for="(n, number) in items"
         :key="number"
       >
         {{ n.title }}
<!--         <v-btn-->
<!--           depressed-->
<!--           color="primary"-->
<!--         >{{ n.title }}</v-btn>-->
       </v-tab>
     </v-tabs>
     <v-tabs-items v-model="tabs" class="mt-4 transparent" >
       <v-tab-item >
         <div class="text-h5 text-center mb-5">Склад</div>
         <products></products>
         <hr class="my-10" color="#c48eff">
         <branchs></branchs>
       </v-tab-item>
       <v-tab-item>
         <loggers></loggers>
       </v-tab-item>
     </v-tabs-items>
   </v-card>
 </div>
</template>

<script>
import loggers from '@/views/Storage/components/loggers'
import products from '@/views/Storage/components/products'
import branchs from '@/views/Storage/components/branchs'
export default {
  name: 'index',
  components: {
    products,
    loggers,
    branchs
  },
  data:() => ({
    tabs: null,
    items: [
      {
        title: 'Данные',
      },
      {
        title: 'История',
      },
    ],
  })
}
</script>

<style scoped>

</style>
