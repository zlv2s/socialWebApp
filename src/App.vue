<template>
  <div id="app">
    <Navigation v-if="currentUser"></Navigation>
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Navigation from './components/Navigation'
export default {
  components: {
    Navigation
  },
  computed: {
    ...mapState(['currentUser'])
  }
}
</script>
<style lang="scss">
</style>
