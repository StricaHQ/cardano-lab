import DashboardLayout from '@/layouts/dashboard/DashboardLayout.vue'
import AccountPage from '@/pages/AccountPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: DashboardLayout,
      children: [
        {
          path: "/",
          name: "Account",
          component: AccountPage
        }
      ]
    }
  ],
})

export default router
