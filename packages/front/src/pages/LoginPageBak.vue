<template>
  	<v-container fill-height fluid class="d-flex flex-column justify-center align-center" >
        <!-- Menu -->
        <div v-if="mode === 'menu'">
          <button @click="mode = 'login'"> Log in </button>
          <button @click="mode = 'register'"> Register </button>
        </div>

        <!-- Connexion form -->
        <form v-else-if="mode === 'login'" @submit.prevent="handleLogin">
          <h2>Log in</h2>
          <input v-model="loginForm.username" type="text" placeholder="Username" required>
          <input v-model="loginForm.password" type="password" placeholder="Password" required>

          <button type="submit"> Connect </button>
          <button type="button" @click="mode = 'menu'"> Back </button>
          <p>
            <a href="#" @click.prevent="mode = 'forgot'">Password forgotten?</a>
          </p>
        </form>

        <!-- Register form -->
        <form v-else-if="mode === 'register'" @submit.prevent="handleRegister" class="flex flex-col gap-4">
          <h2>Register</h2>
          <input v-model="registerForm.username" type="text" placeholder="Username" required>
          <input v-model="registerForm.email" type="email" placeholder="Email" required>
          <input v-model="registerForm.password" type="password" placeholder="Password" required>
          <input v-model="registerForm.firstname" type="text" placeholder="First name" required>
          <input v-model="registerForm.lastname" type="text" placeholder="Last name" required>

          <button type="submit"> Register </button>
          <button type="button" @click="mode = 'menu'"> Back </button>
        </form>

          <!-- Forgot password form -->
        <form v-else-if="mode === 'forgot'" @submit.prevent="handleForgot">
          <h2>Reset password</h2>
          <input v-model="forgotForm.email" type="email" placeholder="Your email" required>

          <button type="submit">Send reset link</button>
          <button type="button" @click="mode = 'login'">Back to login</button>
        </form>
      </v-container>
</template>

<script setup lang="ts">

import { ref } from "vue"

// import LoginForm from "../components/login/LoginForm.vue"

const mode = ref("menu") // "menu" | "login" | "register"

const loginForm = ref({
  username: "",
  password: ""
})

const registerForm = ref({
  username: "",
  email: "",
  password: "",
  firstname: "",
  lastname: ""
})

const forgotForm = ref({
  email: ""
})

function handleLogin() {
  console.log("Login :", loginForm.value)
  // Call back
}

function handleRegister() {
  console.log("Register :", registerForm.value)
  // Call back
}

function handleForgot() {
  console.log("Forgot password :", forgotForm.value)
  // Call back
}
</script>
