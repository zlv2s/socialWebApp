<template>
  <div id="login">
    <transition name="fade">
      <div class="loading" v-if="performingRequest">
        <p>Loading...</p>
      </div>
    </transition>
    <section>
      <div class="col1">
        <h1>Hi, There</h1>
        <p>code changes world</p>
      </div>
      <div :class="{'signup-form':!showLoginForm && !showForgotPassword}" class="col2">
        <form @submit.prevent v-if="showLoginForm">
          <h1>Welcome Back</h1>

          <label for="email1">Email</label>
          <input id="email1" placeholder="you@email.com" type="text" v-model.trim="loginForm.email">

          <label for="password1">Password</label>
          <input
            id="password1"
            placeholder="******"
            type="password"
            v-model.trim="loginForm.password"
          >

          <button @click="login" class="button">Log In</button>

          <div class="extras">
            <a @click="togglePasswordReset">Forgot Password</a>
            <a @click="toggleForm">Create an Account</a>
          </div>
        </form>
        <form @submit.prevent v-if="!showLoginForm && !showForgotPassword">
          <h1>Get Started</h1>

          <label for="name">Name</label>
          <input id="name" placeholder="Savvy Apps" type="text" v-model.trim="signupForm.name">

          <label for="title">Title</label>
          <input id="title" placeholder="Company" type="text" v-model.trim="signupForm.title">

          <label for="email2">Email</label>
          <input
            id="email2"
            placeholder="you@email.com"
            type="text"
            v-model.trim="signupForm.email"
          >

          <label for="password2">Password</label>
          <input
            id="password2"
            placeholder="min 6 characters"
            type="password"
            v-model.trim="signupForm.password"
          >

          <button @click="signup" class="button">Sign Up</button>

          <div class="extras">
            <a @click="toggleForm">Back to Log In</a>
          </div>
        </form>
        <form @submit.prevent class="password-reset" v-if="showForgotPassword">
          <div v-if="!passwordResetSuccess">
            <h1>Reset Password</h1>
            <p>We will send you an email to reset your password</p>

            <label for="email3">Email</label>
            <input
              id="email3"
              placeholder="you@email.com"
              type="text"
              v-model.trim="passwordForm.email"
            >

            <button @click="resetPassword" class="button">Submit</button>

            <div class="extras">
              <a @click="togglePasswordReset">Back to Log In</a>
            </div>
          </div>
          <div v-else>
            <h1>Email Sent</h1>
            <p>check your email for a link to reset your password</p>
            <button @click="togglePasswordReset" class="button">Back to login</button>
          </div>
        </form>
        <transition name="fade">
          <div class="error-msg" v-if="errorMsg !== ''">
            <p>{{errorMsg}}</p>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
const fb = require('../firebaseConfig.js')
export default {
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      signupForm: {
        name: '',
        title: '',
        email: '',
        password: ''
      },
      passwordForm: {
        email: ''
      },
      showLoginForm: true,
      performingRequest: false,
      errorMsg: '',
      showForgotPassword: false,
      passwordResetSuccess: false
    }
  },
  methods: {
    login() {
      this.performingRequest = true
      fb.auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        )
        .then(user => {
          this.$store.commit('setCurrentUser', user.user)
          this.$store.dispatch('fetchUserProfile')
          this.$router.push('/dashboard')
        })
        .catch(err => {
          console.log(err)
          this.performingRequest = false
          this.errorMsg = err.message
        })
    },
    signup() {
      this.performingRequest = true
      fb.auth
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .then(user => {
          this.$store.commit('setCurrentUser', user.user)
          // create user obj
          fb.usersCollection
            .doc(user.user.uid)
            .set({
              name: this.signupForm.name,
              title: this.signupForm.title
            })
            .then(() => {
              this.$store.dispatch('fetchUserProfile')
              this.$router.push('/dashboard')
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
          this.performingRequest = false
          this.errorMsg = err.message
        })
    },
    resetPassword() {
      this.performingRequest = false
      fb.auth
        .sendPasswordResetEmail(this.passwordForm.email)
        .then(() => {
          this.performingRequest = false
          this.passwordResetSuccess = true
          this.passwordForm.email = ''
        })
        .catch(err => {
          console.log(err)
          this.performingRequest = false
          this.errorMsg = err.message
        })
    },
    togglePasswordReset() {
      if (this.showForgotPassword) {
        this.showLoginForm = true
        this.showForgotPassword = false
        this.passwordResetSuccess = false
      } else {
        this.showLoginForm = false
        this.showForgotPassword = true
      }
    },
    toggleForm() {
      this.errorMsg = ''
      this.showLoginForm = !this.showLoginForm
    }
  }
}
</script>