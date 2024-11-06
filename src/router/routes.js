// routes/index.js
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        meta: { showDrawer: false }, // Moved to the correct place
      },
      {
        path: "/funcionario",
        component: () => import("pages/FuncionarioPage.vue"),
        meta: { showDrawer: false },
      },
      {
        path: "/listaFuncionario",
        component: () => import("src/pages/listaFuncionario.vue"),
        meta: { showDrawer: true },
      },
      {
        path: "/listaLote",
        component: () => import("src/pages/listaLote.vue"),
        meta: { showDrawer: false },
      },
      {
        name: "alocarEpi",
        path: "alocarEpi/:employeeId",
        component: () => import("src/pages/alocarEpi.vue"),
        props: true,
        meta: { showDrawer: true },
      },
      {
        name: "editarRetiradaEpi",
        path: "editarRetiradaEpi/:employeeId/:retiradaId",
        component: () => import("src/pages/editarRetiradaEpi.vue"),
        props: true,
        meta: { showDrawer: false },
      },
    ],
  },
  // Always leave this as last one, but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
