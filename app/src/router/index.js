import { createRouter, createWebHistory } from "vue-router";
import SearchCats from "../views/SearchCats.vue";
import testRouter from "../views/testRouter.vue";
import CatPage from "../views/CatPage.vue";

const routes = [
    {
        path: "/",
        name: "searchCats",
        component: SearchCats,
    },
    {
        path: "/testRouter",
        name: "testRouter",
        component: testRouter
    },
    //we need a dynamic route for cat id /cat_id
    {
        path: "/cat/:id",
        name: "catDetails",
        component: CatPage,
        props: true
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;