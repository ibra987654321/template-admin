<template>
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <v-card class="auth-card">
        <v-card-title class="d-flex align-center justify-center py-7">
          <router-link
            to="/"
            class="d-flex align-center"
          >
            <v-img
              :src="require('../../../public/logo.png')"
              max-height="30px"
              max-width="30px"
              alt="logo"
              contain
              class="me-3 "
            ></v-img>

            <h2 class="text-2xl font-weight-semibold">
              Система учета Podarimne
            </h2>
          </router-link>
        </v-card-title>

        <!-- title -->
        <v-card-text>
          <p class="text-2xl font-weight-semibold text--primary mb-2">
            Добро пожаловать в систему учета Podarimne! 👋🏻
          </p>
          <p class="mb-2">
            Пожалуйста, войдите в свою учетную запись
          </p>
        </v-card-text>

        <!-- login form -->
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="email"
              :rules="[() => !!email || 'This field is required']"
              :error-messages="errorMessages"
              outlined
              :disabled="loading"
              label="Логин"
              hide-details
              @keyup.enter="loader = 'loading'"
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="password"
              outlined
              :rules="[
                () => !!password || 'This field is required',
                () => !!password && password.length <= 20 || 'Address must be less than 25 characters',
              ]"
              :type="isPasswordVisible ? 'text' : 'password'"
              label="Пароль"
              placeholder="············"
              :append-icon="isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline"
              hide-details
              required
              :disabled="loading"
              @keyup.enter="submit"
              @click:append="isPasswordVisible = !isPasswordVisible"
            ></v-text-field>
            <v-btn
              block
              color="primary"
              class="mt-6"
              :loading="loading"
              @click="submit"
            >
              Войти
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </div>

    <!-- background triangle shape  -->
    <img
      class="auth-mask-bg"
      height="173"
      :src="require(`@/assets/images/misc/mask-${$vuetify.theme.dark ? 'dark':'light'}.png`)"
    >

    <!-- tree -->
    <v-img
      class="auth-tree"
      width="247"
      height="185"
      src="@/assets/images/misc/tree.png"
    ></v-img>

    <!-- tree  -->
    <v-img
      class="auth-tree-3"
      width="377"
      height="289"
      src="@/assets/images/misc/tree-3.png"
    ></v-img>
    <div class="text-center" v-if="$store.state.snackbars.snackbar">

      <v-snackbar
        v-model="$store.state.snackbars.snackbar"
        :timeout="$store.state.snackbars.timeout"
      >
        {{ $store.state.snackbars.text }}

        <template v-slot:action="{ attrs }">
          <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="$store.state.snackbars.snackbar = false"
          >
            Закрыть
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import {
  mdiEyeOutline, mdiEyeOffOutline,
} from '@mdi/js'
import { setToken } from '@/helpers/helpers'
import router from '@/router'

export default {
  data: () => ({
    loader: null,
    loading: false,
    isPasswordVisible: false,
    email: '',
    password: '',
    errorMessages: '',
    icons: {
      mdiEyeOutline,
      mdiEyeOffOutline,
    },
    snackbar: false,
    text: 'My timeout is set to 2000.',
    timeout: 6000,
  }),
  computed: {
    textNotification() {
      this.loading = false
      return this.text = this.$store.state.error = 401 ? 'Неверный логин или пароль' : 'Серверная ошибка'
    },
  },
  watch: {
    async loader() {
      const l = this.loader
      this[l] = !this[l]
      await this.submit()

      this.loader = null
    },
  },
  methods: {
    submit() {
      this.loading = true
      this.$store.dispatch('login', {username: this.email, password:this.password})
        .then(res => {
          if (res.data.token) {
              this.loading = false
            setToken(res.data.token)
            this.$router.push({ name: 'storage' })
          }
        })
        .catch(error => {
          this.loading = false
          if (error.response) {
            this.$store.commit('setSnackbars', error.response.data)
          }
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/plugins/vuetify/default-preset/preset/pages/auth.scss';

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
