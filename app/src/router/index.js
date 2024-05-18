import { createRouter, createWebHistory } from "vue-router";
import SearchCats from "../views/SearchCats.vue";
import testRouter from "../views/testRouter.vue";
import CatPage from "../views/CatPage.vue";
import SearchCatsCopy from "../views/SearchCatsCopy.vue";
import ConfirmCopy from "../views/ConfirmCopy.vue";
import CatFiles from "../views/CatFiles.vue";
import CatUpload from "../views/CatUpload.vue";

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
        path: "/cat",
        name: "catDetails",
        component: CatPage,
        props: true
    },
    {
        path: "/files",
        name: "files",
        component: CatFiles
    },
    {
        path: "/upload",
        name: "uploadFiles",
        component: CatUpload
    },
    {
        path: "/copyJournal/selectCats",
        name: "selectCopyCats",
        component: SearchCatsCopy,
        props: true
    },
    {
        path: "/copyJournal/Confirm",
        name: "ConfirmCopy",
        component: ConfirmCopy
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;