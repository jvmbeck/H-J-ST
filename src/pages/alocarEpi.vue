<template>
  <q-page>
    <div v-if="isLoading">
      <q-spinner size="50px" color="primary" />
    </div>
    <div v-else>
      <q-card v-if="employeeData">
        <q-card-section>
          <div>{{ employeeData.firstName }}</div>
          <div>{{ employeeData.area }}</div>
          <!-- Additional employee data -->
        </q-card-section>
      </q-card>

      <!-- Display lote cards -->
      <div class="q-mt-md">
        <h3>EPIs</h3>
        <q-card v-for="item in loteData" :key="item.id" class="q-mb-sm">
          <q-card-section>
            <div>{{ item.name }}</div>
            <div>Available Quantity: {{ item.quant }}</div>
            <!-- Display current available quantity -->
            <q-input
              v-model.number="item.inputQuant"
              type="number"
              label="Quantity to Subtract"
              min="0"
            />
            <q-btn
              label="Submit"
              color="primary"
              @click="updateLoteQuantity(item.id, item.inputQuant)"
            />
          </q-card-section>
        </q-card>
        <q-dialog v-model="showSuccessDialog" persistent>
          <q-card>
            <q-card-section class="text-h6">Emissão concluída</q-card-section>
            <q-card-section>
              O item foi alocado no estoque e está aguardando entrega!
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                flat
                label="OK"
                color="primary"
                @click="showSuccessDialog = false"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, get, set, push } from "firebase/database";
import { database } from "src/key/configKey"; // Adjust as needed

export default {
  props: ["employeeId"],
  data() {
    return {
      quant: 0,
      employeeData: null,
      loteData: [],
      isLoading: true,
      showSuccessDialog: false, // Controls dialog visibility
    };
  },
  watch: {
    employeeId: {
      immediate: true, // Run the watcher initially
      handler(newId) {
        if (newId) {
          this.fetchEmployeeData(newId);
        }
      },
    },
    loteData: {
      deep: true, // This allows the watcher to observe changes in nested properties
      handler(newVal) {
        newVal.forEach((item) => {
          // Assuming each `loteData` item has an ID and quantity
          if (typeof item.quantity === "number") {
            this.updateLoteQuantity(item.id, item.quant);
          }
        });
      },
    },
  },
  methods: {
    async updateLoteQuantity(id, inputQuant) {
      try {
        const itemRef = ref(database, `lote/${id}`);
        const snapshot = await get(itemRef);

        if (snapshot.exists()) {
          const itemData = snapshot.val();
          const currentQuant = itemData.quant;
          const newQuant = currentQuant - inputQuant;

          if (newQuant < 0) {
            console.warn("Cannot subtract more than the available quantity.");
            return;
          }

          await set(ref(database, `lote/${id}/quant`), newQuant);

          const logEntry = {
            name: itemData.name,
            quantSubtracted: inputQuant,
            timestamp: new Date().toISOString(),
          };
          const logRef = ref(
            database,
            `funcionario/${this.employeeId}/retiradas`
          );
          await push(logRef, logEntry);

          console.log(`Subtraction logged for item ${id}:`, logEntry);
          await this.fetchLoteData();
          this.showSuccessDialog = true;
        } else {
          console.error(`Item with ID ${id} not found.`);
        }
      } catch (error) {
        console.error(`Error updating quantity for item ${id}:`, error);
      }
    },
    async fetchEmployeeData(employeeId) {
      console.log("Fetching data for employee ID:", employeeId); // Check that the method is called
      this.isLoading = true; // Reset loading state
      try {
        const snapshot = await get(ref(database, `funcionario/${employeeId}`));
        if (snapshot.exists()) {
          this.employeeData = snapshot.val();
          console.log("Fetched employee data:", this.employeeData); // Log the data fetched
        } else {
          console.log("No data available for this employee.");
          this.employeeData = null; // Ensure it's cleared if no data is found
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        this.employeeData = null; // Clear in case of error
      } finally {
        this.isLoading = false;
      }
    },
    async fetchLoteData() {
      try {
        const snapshot = await get(ref(database, "lote"));
        if (snapshot.exists()) {
          this.loteData = Object.entries(snapshot.val()).map(([id, item]) => ({
            ...item,
            id, // Item's unique ID
            inputQuant: 0, // Initialize inputQuant for each item
          }));
        } else {
          console.log("No lote data available.");
        }
      } catch (error) {
        console.error("Error fetching lote data:", error);
      }
    },
  },

  async created() {
    await this.fetchEmployeeData(this.employeeId);
    await this.fetchLoteData(); // Fetch lote data as well
  },
};
</script>
