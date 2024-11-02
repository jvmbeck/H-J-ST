<template>
  <q-page> <div>asodkaosk</div></q-page>
</template>

<script>
import { ref, get, push, update, remove } from "firebase/database";
import { database } from "src/key/configKey"; // Your Firebase configuration
import { eventBus } from "src/mitt/eventBus";

export default {
  name: "editarRetiradaEpi",
};
</script>
