<template>
  <q-layout view="hHh Lpr fFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
          v-if="$route.meta.showDrawer"
        />

        <q-toolbar-title> H&J-ST </q-toolbar-title>
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
        <q-item-label></q-item-label>
        <q-item>
          <q-item-section
            >Nome: {{ drawerEmployeeData.firstName }}</q-item-section
          >
        </q-item>
        <q-item>
          <q-item-section>Setor: {{ drawerEmployeeData.area }}</q-item-section>
        </q-item>
        <q-item-label header>Retiradas</q-item-label>
        <q-list v-if="retiradas.length > 0">
          <q-item
            v-for="(item, index) in retiradas"
            :key="index"
            clickable
            @click="toggleItemOptions(index)"
          >
            <q-item-section>
              Nome: {{ item.name }}
              <br />
              Quantidade: {{ item.quantSubtracted }}
              <br />
              Data: {{ item.timestamp }}
              <!-- Replace with the actual attribute name you want to display -->
            </q-item-section>

            <!-- Conditionally display the buttons when the item is selected -->
            <q-item-section side v-if="selectedItemIndex === index">
              <q-btn
                label="Edit"
                color="primary"
                @click.stop="editItem(item)"
              />
              <q-btn
                label="Delete"
                color="negative"
                @click.stop="deleteItem(item)"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <q-item v-else>Nenhuma retirada encontrada</q-item>
      </q-list>
      <!-- Add additional fields if necessary -->

      <q-btn
        label="Ir para Alocação"
        color="primary"
        @click="irParaAlocacao"
        class="q-mt-md q-ml-md"
      />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { eventBus } from "src/mitt/eventBus";
import { database } from "src/key/configKey"; // Your Firebase configuration
import { ref, get, remove } from "firebase/database";

export default {
  data() {
    return {
      drawerOpen: false,
      drawerEmployeeData: null,
      employeeId: null, // Holds employee data for the drawer
      retiradas: [], // Store the retiradas data
      selectedItemIndex: null, // Track the index of the selected item
    };
  },

  methods: {
    async fetchRetiradas(employeeId) {
      const path = `funcionario/${this.employeeId}/retiradas`; // Adjust the path if necessary
      const retiradasRef = ref(database, path);

      try {
        const snapshot = await get(retiradasRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Map through data and ensure each item has an `id` property
          this.retiradas = Object.keys(data).map((key) => ({
            id: key, // This is the Firebase-generated ID
            ...data[key], // The rest of the item’s data
          }));
        }
      } catch (error) {
        console.error("Error fetching retiradas:", error);
      }
    },

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
    toggleItemOptions(index) {
      this.selectedItemIndex = this.selectedItemIndex === index ? null : index;
    },
    editItem(item) {
      this.$router.push({
        name: "editarRetiradaEpi",
        query: {
          name: selectedItem.name,
          quantity: selectedItem.quantity,
          loteId: selectedItem.loteId, // Ensure this is passed correctly
        },
      });
    },
    async deleteItem(item) {
      if (!item.id) {
        console.error("Error: Item ID is undefined.", item);
        return; // Exit if item.id is missing
      }

      const itemPath = `funcionario/${this.drawerEmployeeData.id}/retiradas/${item.id}`;
      const itemRef = ref(database, itemPath);

      try {
        console.log("Attempting to delete item:", item);
        console.log("Firebase path:", itemPath);

        await remove(itemRef);

        // Update the local retiradas list after successful deletion
        this.retiradas = this.retiradas.filter(
          (retirada) => retirada.id !== item.id
        );
        console.log(
          "Item deleted successfully from Firebase and local list updated."
        );
        this.toggleItemOptions(item);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
  },

  created() {
    // Listen for emitted employee data
    eventBus.on("update-drawer-data", (employeeData) => {
      this.drawerEmployeeData = employeeData;
      this.employeeId = employeeData.id;
      this.drawerOpen = true; // Automatically open drawer when data is received
      this.fetchRetiradas(employeeData.id); // Fetch retiradas when employee data is available
    });
  },
  beforeUnmount() {
    // Remove event listener to prevent memory leaks
    eventBus.off("update-drawer-data");
  },
};
</script>
