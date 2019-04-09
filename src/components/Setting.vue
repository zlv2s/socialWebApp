<template>
  <section id="settings">
    <div class="col1">
      <h3>Settings</h3>
      <p>Update your profile</p>

      <transition name="fade">
        <p class="success" v-if="showSuccess">profile updated</p>
      </transition>

      <form @submit.prevent>
        <label for="name">Name</label>
        <input :placeholder="userProfile.name" id="name" type="text" v-model.trim="name">

        <label for="title">Job Title</label>
        <input :placeholder="userProfile.title" id="title" type="text" v-model.trim="title">

        <button @click="updateProfile" class="button">Update Profile</button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      name: '',
      title: '',
      showSuccess: false
    }
  },
  computed: {
    ...mapState(['userProfile'])
  },
  methods: {
    updateProfile() {
      this.$store.dispatch('updateProfile', {
        name: this.name !== '' ? this.name : this.userProfile.name,
        title: this.title !== '' ? this.title : this.userProfile.title
      })
      this.name = ''
      this.title = ''

      this.showSuccess = true
      setTimeout(() => {
        this.showSuccess = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>