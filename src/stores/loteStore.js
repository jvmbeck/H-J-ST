// src/stores/loteStore.js
import { defineStore } from "pinia";
import { ref, get } from "firebase/database";
import { database } from "src/key/configKey";

export const useLoteStore = defineStore("lote", {
  state: () => ({
    availableItems: [],
  }),
  actions: {
    async fetchAvailableItems() {
      if (this.availableItems.length) return; // Avoid refetching if already loaded

      const loteRef = ref(database, "lote");

      try {
        const snapshot = await get(loteRef);
        if (snapshot.exists()) {
          const loteData = snapshot.val();
          this.availableItems = Object.keys(loteData).map((id) => ({
            name: loteData[id].name,
            id,
          }));
        } else {
          console.log("No items found in lote.");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },
  },
});
