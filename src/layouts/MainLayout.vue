<template>
  <q-layout view="hHh Lpr fFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="$route.meta.showDrawer"
      v-model="drawerOpen"
      side="left"
      bordered
      content-class="drawer-content"
    >
      <q-list v-if="drawerEmployeeData">
        <q-item-label>Employee Information</q-item-label>
        <q-item>
          <q-item-section
            >Nome: {{ drawerEmployeeData.firstName }}</q-item-section
          >
        </q-item>
        <q-item>
          <q-item-section>Setor: {{ drawerEmployeeData.area }}</q-item-section>
        </q-item>
        <!-- Add additional fields if necessary -->

        <q-btn
          label="Ir para Alocação"
          color="primary"
          @click="irParaAlocacao"
          class="q-mt-md"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { eventBus } from "src/mitt/eventBus";

export default {
  data() {
    return {
      drawerOpen: false,
      drawerEmployeeData: null, // Holds employee data for the drawer
    };
  },

  methods: {
    // Method to navigate to the "alocarEpi" page with the employee ID
    irParaAlocacao() {
      if (this.drawerEmployeeData && this.drawerEmployeeData.id) {
        this.$router.push({
          name: "alocarEpi",
          params: { employeeId: this.drawerEmployeeData.id },
        });
      } else {
        console.error("Erro: Employee ID não encontrado.");
      }
    },
    toggleLeftDrawer() {
      this.drawerOpen = !this.drawerOpen;
    },
  },
  created() {
    // Listen for emitted employee data
    eventBus.on("update-drawer-data", (employeeData) => {
      this.drawerEmployeeData = employeeData;
      this.drawerOpen = true; // Automatically open drawer when data is received
    });
  },
  beforeUnmount() {
    // Remove event listener to prevent memory leaks
    eventBus.off("update-drawer-data");
  },
};
</script>
