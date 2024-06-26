<template>
  <v-navigation-drawer
    :value="isDrawerOpen"
    app
    floating
    width="260"
    class="app-navigation-menu"
    :right="$vuetify.rtl"
    @input="val => $emit('update:is-drawer-open', val)"
  >
    <!-- Navigation Header -->
    <div class="vertical-nav-header d-flex items-center ps-6 pe-5 pt-5 pb-2">
      <router-link
        to="/storage"
        class="d-flex align-center text-decoration-none"
      >
        <v-slide-x-transition>
          <h2 class="app-title text--primary">
            Ariana LLC
          </h2>
        </v-slide-x-transition>
      </router-link>
    </div>

    <!-- Navigation Items -->
    <v-list
      expand
      shaped
      class="vertical-nav-menu-items pr-5"
    >
      <nav-menu-link
        title="Главная"
        :to="{ name: 'storage' }"
        :icon="icons.mdiHomeOutline"
      ></nav-menu-link>
      <nav-menu-link
        v-if="admin || coordinator || superUser"
        title="Настройки"
        :to="{ name: 'settings' }"
        :icon="icons.mdiBookSettings"
      ></nav-menu-link>
      <nav-menu-link
        v-if="admin"
        title="Отчет"
        :to="{ name: 'report' }"
        :icon="icons.mdiTable"
      ></nav-menu-link>
      <nav-menu-link
        v-if="admin"
        title="Отчет по сотрудникам"
        :to="{ name: 'employee-report' }"
        :icon="icons.mdiTable"
      ></nav-menu-link>
      <nav-menu-link
        v-if="admin"
        title="Пользователи"
        :to="{ name: 'users' }"
        :icon="icons.mdiAccount"
      ></nav-menu-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {
  mdiHomeOutline,
  mdiAlphaTBoxOutline,
  mdiEyeOutline,
  mdiCreditCardOutline,
  mdiTable,
  mdiFileOutline,
  mdiFormSelect,
  mdiAccountCogOutline,
  mdiBookSettings,
  mdiAccount
} from '@mdi/js'
import NavMenuSectionTitle from './components/NavMenuSectionTitle.vue'
import NavMenuGroup from './components/NavMenuGroup.vue'
import NavMenuLink from './components/NavMenuLink.vue'
import {decodeJWT} from "@/helpers/auth";
import { getToken } from '@/helpers/helpers'
import { admin, coordinator, florist, operator, superUser } from '@/helpers/roles'

export default {
  components: {
    NavMenuSectionTitle,
    NavMenuGroup,
    NavMenuLink,
  },
  props: {
    isDrawerOpen: {
      type: Boolean,
      default: null,
    },
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
    superUser() {
      return superUser()
    },
  },
  setup() {
    return {
      icons: {
        mdiHomeOutline,
        mdiAlphaTBoxOutline,
        mdiEyeOutline,
        mdiCreditCardOutline,
        mdiTable,
        mdiFileOutline,
        mdiFormSelect,
        mdiAccountCogOutline,
        mdiBookSettings,
        mdiAccount,
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.3px;
}

// ? Adjust this `translateX` value to keep logo in center when vertical nav menu is collapsed (Value depends on your logo)
.app-logo {
  transition: all 0.18s ease-in-out;
  .v-navigation-drawer--mini-variant & {
    transform: translateX(-4px);
  }
}

@include theme(app-navigation-menu) using ($material) {
  background-color: map-deep-get($material, 'background');
}

.app-navigation-menu {
  .v-list-item {
    &.vertical-nav-menu-link {
      ::v-deep .v-list-item__icon {
        .v-icon {
          transition: none !important;
        }
      }
    }
  }
}

// You can remove below style
// Upgrade Banner
.app-navigation-menu {
  .upgrade-banner {
    position: absolute;
    bottom: 13px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
