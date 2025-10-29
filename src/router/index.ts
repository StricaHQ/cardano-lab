import DashboardLayout from "@/layouts/dashboard/DashboardLayout.vue";
import CreateAccount from "@/pages/account/createAccount.vue";
import BuildTransaction from "@/pages/Transaction/BuildTransaction.vue";
import SignTransaction from "@/pages/Transaction/SignTransaction.vue";
import CborView from "@/pages/cbor/cborView.vue";

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
          component: CreateAccount,
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
        { path: "cbor/cborView", name: "cborView", component: CborView },
      ],
    },
  ],
});

export default router;
