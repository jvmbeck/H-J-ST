import { defineStore } from "pinia";
import { ref } from "vue";
import { database } from "src/key/configKey"; // Your Firebase config
import { ref as firebaseRef, get } from "firebase/database";

export const useFuncionarioStore = defineStore("funcionarios", () => {
  const funcionarioList = ref([]);
  const loading = ref(false);

  const fetchfuncionarios = async () => {
    loading.value = true;
    const path = "funcionario";
    const funcionarioRef = firebaseRef(database, path);

    try {
      const snapshot = await get(employeeRef);
      if (snapshot.exists()) {
        const funcionarios = snapshot.val();
        employeeList.value = Object.keys(funcionarios).map((key) => ({
          id: key,
          ...funcionarios[key],
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar funcionários: ", error);
    } finally {
      loading.value = false;
    }
  };

  return { employeeList, loading, fetchfuncionarios };
});
