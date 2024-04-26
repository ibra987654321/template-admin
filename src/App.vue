<template>
  <div>
    <component :is="resolveLayout">
      <router-view></router-view>
      <TheSnackbars/>
    </component>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import { useRouter } from '@/utils'
import LayoutBlank from '@/layouts/Blank.vue'
import LayoutContent from '@/layouts/Content.vue'
import TheSnackbars from '@/components/TheSnackbars'
import { decodeJWT, logOut } from '@/helpers/auth'

export default {
  components: {
    LayoutBlank,
    LayoutContent,
    TheSnackbars,
  },
  data:() => ({
    expDate: '', // Дата окончания токена
    currentTimestamp: 0, // Текущее время
  }),
  created() {
    // Инициализируем значения переменных
    this.expDate = decodeJWT().exp;
    this.currentTimestamp = Math.floor(Date.now() / 1000);
  },
  mounted() {
    this.$vuetify.theme.dark = true
  },
  watch: {
    // Следим за изменениями переменных и проверяем истек ли токен
    expDate: function(newExpDate) {
      this.checkTokenExpiration();
    },
    currentTimestamp: function(newTimestamp) {
      this.checkTokenExpiration();
    }
  },
  methods: {
    checkTokenExpiration() {
      if (this.expDate < this.currentTimestamp) {
        // Токен истек, выполняем необходимые действия, например, выход из системы
        logOut()
      }
    },
  },
  setup() {
       const { route, router } = useRouter()

    const resolveLayout = computed(() => {

      if (route.value.meta.layout === 'blank') return 'layout-blank'

      return 'layout-content'
    })

    return {
      resolveLayout,
    }
  },
}
</script>
<style>
.date_range .v-input__slot {
  margin-bottom: 0;
}
.date_range .v-text-field__details {
  display: none;
}
</style>
