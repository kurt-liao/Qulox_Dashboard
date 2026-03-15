import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth.js";

import LoginPage from "../pages/LoginPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import DocumentPage from "../pages/DocumentPage.vue";
import ClientsPage from "../pages/ClientsPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard/documents/:id",
    name: "Document",
    component: DocumentPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard/clients",
    name: "Clients",
    component: ClientsPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { user, loading } = useAuth();

  if (to.meta.requiresAuth === false) {
    // Public route — if already logged in, redirect to dashboard
    if (!loading.value && user.value) {
      return next("/dashboard");
    }
    return next();
  }

  if (to.meta.requiresAuth) {
    // Wait for auth to initialize
    if (loading.value) {
      const unwatch = setInterval(() => {
        if (!loading.value) {
          clearInterval(unwatch);
          if (user.value) {
            next();
          } else {
            next("/login");
          }
        }
      }, 50);
      return;
    }

    if (!user.value) {
      return next("/login");
    }
  }

  next();
});

export default router;
