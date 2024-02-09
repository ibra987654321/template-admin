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

export default {
  components: {
    LayoutBlank,
    LayoutContent,
    TheSnackbars,
  },
  mounted() {
    this.$vuetify.theme.dark = true
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
