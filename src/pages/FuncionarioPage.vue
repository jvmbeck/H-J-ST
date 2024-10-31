<template>
  <q-page>
    <!-- Card to display object info -->
    <q-card v-if="objectData">
      <q-card-section>
        <div class="text-h6">Funcionario</div>
      </q-card-section>

      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>Name: {{ objectData.firstName }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Age: {{ objectData.age }}</q-item-section>
          </q-item>
          <!-- Add more fields as needed -->
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Loader while data is being fetched -->
    <q-spinner v-else color="primary" size="50px" />
  </q-page>
</template>

<script>
import { ref, get } from "firebase/database";
import { database } from "src/key/configKey"; // Your Firebase configuration

export default {
  name: "FuncionarioPage",
  data() {
    return {
      objectData: null, // Reactive variable to store the object data
    };
  },
  methods: {
    async fetchObjectData() {
      const path = "funcionario/"; // Specify the path of the object
      const objectRef = ref(database, path);

      try {
        const snapshot = await get(objectRef);
        if (snapshot.exists()) {
          this.objectData = snapshot.val(); // Assign fetched data to reactive variable
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching object data: ", error);
      }
    },
  },
  mounted() {
    this.fetchObjectData(); // Fetch data when the component is mounted
  },
};
</script>
