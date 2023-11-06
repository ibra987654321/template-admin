<template>
  <v-app>
    <vertical-nav-menu :is-drawer-open.sync="isDrawerOpen"></vertical-nav-menu>

    <v-app-bar
      app
      flat
      absolute
      color="transparent"
    >
      <div class="boxed-container w-full">
        <div class="d-flex align-center mx-6">
          <!-- Left Content -->
          <v-app-bar-nav-icon
            class=" ml-2"
            @click="isDrawerOpen = !isDrawerOpen"
          ></v-app-bar-nav-icon>
          <v-spacer></v-spacer>
          <theme-switcher></theme-switcher>
          <app-bar-user-menu></app-bar-user-menu>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <div class="app-content-container pa-6">
        <slot></slot>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { ref } from '@vue/composition-api'
import { mdiMagnify, mdiBellOutline, mdiGithub } from '@mdi/js'
import VerticalNavMenu from './components/vertical-nav-menu/VerticalNavMenu.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import AppBarUserMenu from './components/AppBarUserMenu.vue'

export default {
  components: {
    VerticalNavMenu,
    ThemeSwitcher,
    AppBarUserMenu,
  },
  setup() {
    const isDrawerOpen = ref(null)
    function removeData() {
      // this.$store.dispatch('deleteProfileBefore', getProfileId())
    }
    function repeat() {
      // this.$store.dispatch('repeat')
    }
    return {
      removeData,
      isDrawerOpen,
      repeat,
      icons: {
        mdiMagnify,
        mdiBellOutline,
        mdiGithub,
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.v-app-bar ::v-deep {
  .v-toolbar__content {
    padding: 0;

    .app-bar-search {
      .v-input__slot {
        padding-left: 18px;
      }
    }
  }
}
//.theme--light.v-application {
//  background-image: linear-gradient(to bottom ,#f4f5fa 3%, #fff 97%);
//
//}
//.app-content-container {
//  background-color: #fff;
//  //border: 1px solid #000;
//  border-radius: 20px;
//}
.boxed-container {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}

</style>
