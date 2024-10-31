import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Importe o router

createApp(App)
  .use(router) // Adicione o router à instância do aplicativo
  .mount("#app");
