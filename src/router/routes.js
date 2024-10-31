const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/funcionario",
        component: () => import("pages/FuncionarioPage.vue"),
      },
      {
        path: "/listaFuncionario",
        component: () => import("src/pages/listaFuncionario.vue"),
      },
      {
        path: "/listaLote",
        component: () => import("src/pages/listaLote.vue"),
      },
      {
        name: "alocarEpi",
        path: "alocarEpi/:employeeId",
        component: () => import("src/pages/alocarEpi.vue"),
        props: true,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
