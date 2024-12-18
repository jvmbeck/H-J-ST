<template>
  <q-page>
    <!-- Button to open dialog for creating a new object -->
    <q-btn
      label="Add New Object"
      color="primary"
      @click="isAddDialogOpen = true"
    />

    <!-- List of existing objects -->
    <q-list v-if="objectList.length > 0" bordered padding>
      <q-item-label header class="text-h6">List of Objects</q-item-label>

      <q-item
        v-for="(object, index) in objectList"
        :key="index"
        clickable
        @click="selectObject(object, index)"
      >
        <q-item-section>
          <q-item-label>Nome: {{ object.name }}</q-item-label>
          <q-item-label>Quantidade: {{ object.quant }}</q-item-label>
          <!-- Add more fields if necessary -->
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Show this message if no objects are found -->
    <div v-else>
      <p>No objects found.</p>
    </div>

    <!-- Loader while fetching data -->
    <q-spinner v-if="loading" color="primary" size="50px" />

    <!-- Dialog for adding a new object -->
    <q-dialog v-model="isAddDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Add New Object</div>
        </q-card-section>

        <q-card-section>
          <!-- Input fields for the new object -->
          <q-input v-model="newObject.name" label="Nome" />
          <q-input v-model="newObject.quant" label="Quantidade" type="number" />
        </q-card-section>

        <!-- Dialog action buttons -->
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="isAddDialogOpen = false"
          />
          <q-btn flat label="Save" color="primary" @click="addNewObject" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Existing dialog for editing and deleting an object -->
    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Selected Object</div>
        </q-card-section>

        <q-card-section>
          <div>Item: {{ selectedObject.name }}</div>
          <div>Quantidade: {{ selectedObject.quant }}</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="updatedData.name" label="Atualizar Nome" />
          <q-input
            v-model="updatedData.quant"
            label="Atualizar quant"
            type="number"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Update" color="primary" @click="updateObject" />
          <q-btn flat label="Delete" color="negative" @click="deleteObject" />
          <q-btn
            flat
            label="Close"
            color="primary"
            @click="isDialogOpen = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, get, push, update, remove } from "firebase/database";
import { database } from "src/key/configKey"; // Your Firebase configuration

export default {
  name: "listaLote",
  data() {
    return {
      objectList: [], // Array to hold the list of objects
      loading: false, // Variable to show the loader while fetching data
      selectedObject: null, // Holds the currently selected object
      selectedIndex: null, // Holds the index of the selected object
      isDialogOpen: false, // Controls the dialog visibility for updating
      isAddDialogOpen: false, // Controls the dialog visibility for adding new object
      updatedData: {
        name: "",
        quant: 0,
      },
      newObject: {
        // Holds the data for the new object to be added
        name: "",
        quant: 0,
      },
    };
  },
  methods: {
    async fetchObjects() {
      const path = "lote";
      const funcionarioRef = ref(database, path);

      try {
        const snapshot = await get(funcionarioRef);
        if (snapshot.exists()) {
          const objects = snapshot.val();
          this.objectList = Object.keys(objects).map((key) => {
            return {
              id: key, // Firebase ID
              ...objects[key], // Restante dos dados do objeto
            };
          });
        }
      } catch (error) {
        console.error("Erro ao buscar objetos: ", error);
      }
    },

    // Method to handle object selection
    selectObject(object, index) {
      this.selectedObject = { ...object }; // Set the selected object (copy to avoid binding issues)
      this.selectedIndex = index; // Set the selected object's index
      this.isDialogOpen = true; // Open the dialog
    },

    // Method to update the selected object

    async updateObject() {
      if (this.selectedObject && this.selectedObject.id) {
        const path = `lote/${this.selectedObject.id}`;
        const objectRef = ref(database, path);

        try {
          // Atualiza os dados no Firebase
          await update(objectRef, {
            name: this.updatedData.name, // Nome atualizado
            quant: this.updatedData.quant, // Idade atualizada
          });

          // Atualiza a lista local para refletir as alterações
          this.objectList = this.objectList.map((obj) =>
            obj.id === this.selectedObject.id
              ? { ...obj, ...this.updatedData }
              : obj
          );

          console.log("Objeto atualizado com sucesso.");
          this.isDialogOpen = false; // Fecha o diálogo de atualização
        } catch (error) {
          console.error("Erro ao atualizar objeto: ", error);
        }
      }
    },

    // Method to delete the selected object
    async deleteObject() {
      if (this.selectedObject && this.selectedObject.id) {
        const path = `lote/${this.selectedObject.id}`;
        const objectRef = ref(database, path);

        try {
          await remove(objectRef); // Remove o objeto do Firebase
          this.objectList = this.objectList.filter(
            (obj) => obj.id !== this.selectedObject.id
          ); // Remove o objeto da lista local
          this.isDialogOpen = false; // Fecha o diálogo
          console.log("Objeto excluído com sucesso.");
        } catch (error) {
          console.error("Erro ao excluir objeto: ", error);
        }
      }
    },

    // Method to add a new object
    async addNewObject() {
      const path = "lote/"; // Path where the new object will be added
      const objectsRef = ref(database, path);

      try {
        await push(objectsRef, this.newObject); // Push the new object to Firebase
        this.objectList.push({ ...this.newObject }); // Add the new object to the local list
        this.newObject = { name: "", quant: null }; // Clear the form
        this.isAddDialogOpen = false; // Close the dialog
        console.log("New object added successfully.");
      } catch (error) {
        console.error("Error adding new object: ", error);
      }
    },
  },
  mounted() {
    this.fetchObjects(); // Fetch objects when the component is mounted
  },
};
</script>
