import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import Vue from 'vue'
import DatetimePicker from 'vuetify-datetime-picker'
import statusFilter from '@/filters/status.filter'
import dateFilter from '@/filters/date.filter'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import datePickerFormat from '@/filters/datePickerFormat'
import { VueQueryPlugin } from "vue-query";

Vue.config.productionTip = false
Vue.use(DatetimePicker)
Vue.use(VueQueryPlugin)
Vue.filter('datePicker', datePickerFormat)
Vue.filter('status', statusFilter)
Vue.filter('date', dateFilter)
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
