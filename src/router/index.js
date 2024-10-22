import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from "@/views/AppLayout.vue";
import Home from "@/views/Home.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: "login",
      meta: {
        middleware: "guest",
        title: `Permits, License and Welfare Fund Request Management System`,
      },
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/password/reset/:token',
      name: 'SetPassword',
      component: () => import('../views/SetPassword.vue')
    },
    {
      path: '/',
      component: AppLayout,
      children:[
        {
          path: '/exercise',  // root path ('/') now directly loads the 'exercise' component
          name: "exercise",
          meta: { title: `Exercise` },
          component: () => import(`../components/Exercise.vue`),
        },
        {
          path: "/footInsole",
          name: "footInsole",
          meta: { title: `FootInsole` },
          component: () => import(`../components/FootInsole.vue`),
        },
        {
          path: "/fallDetection",
          name: "fallDetection",
          meta: { title: `FallDetection` },
          component: () => import(`../components/FallDetection.vue`),
        },
      ]
    },

  ]
})

export default router