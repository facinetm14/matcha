import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/LoginPage.vue";
import Signup from "../pages/SignupPage.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
