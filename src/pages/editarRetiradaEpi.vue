<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Edit Retirada</div>
      </q-card-section>

      <q-card-section>
        <!-- Dropdown to select an item -->
        <q-select
          v-model="editData.name"
          :options="loteData"
          label="Name"
          option-label="name"
          option-value="name"
          use-input
          emit-value
          map-options
          @update:model-value="updateLoteId"
        />

        <!-- Input field for quantity -->
        <q-input
          v-model="editData.quantity"
          label="Quantity"
          type="number"
          min="0"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Save" color="primary" @click="saveChanges" />
        <q-btn label="Cancel" flat @click="goBack" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { ref, set } from "firebase/database";
import { database } from "src/key/configKey";
import { useLoteStore } from "src/stores/loteStore";

export default {
  props: ["employeeId", "retiradaId"],
  data() {
    return {
      editData: {
        name: this.$route.query.name || "",
        quantity: this.$route.query.quantity || 0,
        loteId: this.$route.query.loteId || "",
      },
      initialQuant: null,
    };
  },
  async created() {
    const loteStore = useLoteStore();
    await loteStore.fetchLoteData();
    console.log("Lote data loaded:", loteStore.loteData); // Debug: Check loteData structure
  },
  methods: {
    // This function is now triggered by the updated model value
    updateLoteId(newValue) {
      const selectedItem = this.loteData.find((item) => item.name === newValue);
      if (selectedItem) {
        this.editData.loteId = selectedItem.id;
        console.log("Lote ID set:", this.editData.loteId); // Debug: Check if loteId is set
      } else {
        console.warn("No matching item found for name:", newValue); // Debug: Log if no match
      }
    },

    async saveChanges() {
      try {
        const loteId = this.editData.loteId;
        const newQuantity = parseFloat(this.editData.quantity);

        console.log("loteId:", loteId); // Debug: Check loteId
        console.log("newQuantity:", newQuantity); // Debug: Check newQuantity

        if (!loteId || isNaN(newQuantity)) {
          throw new Error("Invalid loteId or quantity");
        }

        const loteStore = useLoteStore();
        const loteItem = loteStore.loteData.find((item) => item.id === loteId);
        if (!loteItem || typeof loteItem.quant !== "number") {
          throw new Error(
            "Lote item not found or 'quant' attribute is invalid"
          );
        }

        const difference = newQuantity - this.initialQuant;
        loteItem.quant += difference;

        const itemRef = ref(database, `lote/${loteId}/quant`);
        await set(itemRef, loteItem.quant);

        console.log("Changes saved successfully!");
      } catch (error) {
        console.error("Error saving changes:", error);
      }
    },
  },
  computed: {
    loteData() {
      const loteStore = useLoteStore();
      return loteStore.loteData;
    },
  },
};
</script>
