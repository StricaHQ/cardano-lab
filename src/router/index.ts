import DashboardLayout from "@/layouts/dashboard/DashboardLayout.vue";
import AccountPage from "@/pages/AccountPage.vue";
import BuildTransaction from "@/pages/Transaction/BuildTransaction.vue";
import SignTransaction from "@/pages/Transaction/SignTransaction.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: DashboardLayout,
      children: [
        {
          path: "",
          redirect: "account/createAccount",
        },
        {
          path: "account/createAccount",
          name: "Account",
          component: AccountPage,
        },
        {
          path: "transaction/buildTransaction",
          name: "BuildTransaction",
          component: BuildTransaction,
        },
        {
          path: "transaction/signTransaction",
          name: "SignTransaction",
          component: SignTransaction,
        },
      ],
    },
  ],
});

export default router;
