import { createRouter, createWebHashHistory } from "vue-router";

import SapperMain from "../components/SapperMain.vue";
import LeaderBoard from "../components/LeaderBoard.vue";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: SapperMain,
    },
    {
      path: "/LeaderBoard",
      component: LeaderBoard,
    },
  ],
});
