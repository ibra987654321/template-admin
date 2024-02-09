<template>
  <div>
    <create-user></create-user>
  </div>
</template>

<script>
import createUser from '@/views/UserController/Components/createUser'
export default {
  name: 'index',
  components: {
    createUser
  }
}
</script>

<style scoped>

</style>
