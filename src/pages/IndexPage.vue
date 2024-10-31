<template>
  <q-page class="flex flex-center">
    <div>
      <q-btn
        color="primary"
        label="Lista de Funcionarios"
        :to="'/listaFuncionario'"
      />
      <q-btn color="primary" label="Lista de EPIs" :to="'/listaLote'" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import firebaseServices from "src/services/firebaseServices";
import funcionariosServices from "src/services/funcionariosServices";

export default defineComponent({
  name: "IndexPage",

  data() {
    return {
      savedIndex: null,
    };
  },

  methods: {
    updateMyObject() {
      const funcionario = 1; // Define the path to the object
      const att = {
        name: "Marcelo", // Define the fields and values to update
        email: "marcelo@mail.com",
      };

      funcionariosServices.atualizaFuncionario(funcionario, att);
    },
    deleteMyObject() {
      const funcionario = 1;
      funcionariosServices.deletaFuncionario(funcionario);
    },
    createMyObject() {
      funcionariosServices.criaFuncionario(
        "Vendas",
        "mail@mail.com",
        "Rick",
        "Maneiro",
        77777777
      );
    },
    retiradaDeEpi() {
      firebaseServices.retiradaDeEpi(0, 1, 1);
    },
  },
});
</script>
