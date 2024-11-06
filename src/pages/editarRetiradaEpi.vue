<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Edit Retirada</div>
      </q-card-section>

      <q-card-section>
        <q-select
          v-model="editData.name"
          :options="availableItems"
          label="Name"
          option-label="name"
          option-value="name"
          use-input
          emit-value
          map-options
        />

        <q-input v-model="editData.quantity" label="Quantity" type="number" />
        <!-- Add additional fields as needed -->
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Save" color="primary" @click="saveChanges" />
        <q-btn label="Cancel" flat @click="goBack" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { ref, get, update } from "firebase/database";
import { database } from "src/key/configKey";
import { useLoteStore } from "src/stores/loteStore";

export default {
  props: ["employeeId", "retiradaId"],
  data() {
    return {
      editData: {
        name: this.$route.query.name || "",
        quantity: this.$route.query.quantity || 0,
      },
    };
  },
  async created() {
    const loteStore = useLoteStore();
    await loteStore.fetchAvailableItems();
  },
  methods: {
    async saveChanges() {
      const itemPath = `funcionario/${this.employeeId}/retiradas/${this.retiradaId}`;
      const itemRef = ref(database, itemPath);

      try {
        await update(itemRef, this.editData);
        console.log("Item updated successfully.");
        this.goBack(); // Redirect back after saving
      } catch (error) {
        console.error("Error updating item:", error);
      }
    },
    goBack() {
      this.$router.push("/listaFuncionario"); // Redirect to the employee list page
    },
  },
  computed: {
    availableItems() {
      const loteStore = useLoteStore();
      return loteStore.availableItems;
    },
  },
};
</script>
