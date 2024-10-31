import { database, funcionariosRef } from "src/key/configKey";
import firebaseServices from "./firebaseServices";
import { ref, update, remove, get, set, onValue } from "firebase/database";

const funcionariosServices = {
  getFuncionarios() {
    onValue(funcionariosRef, (snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.val();
        console.log(data[0].firstName);
      } else {
        console.log("sem info");
      }
    });
  },

  criaFuncionario(objFuncionario) {
    firebaseServices.incrementaIndex("funcionarioIndex");
    const funcionariosIndexRef = ref(database, "/index/funcionarioIndex");
    try {
      get(funcionariosIndexRef).then((snapshot) => {
        const idLido = snapshot.val();

        set(ref(database, "funcionario/" + idLido), objFuncionario);
      });
    } catch (error) {
      console.error("Erro: ", error);
    }
  },

  deletaFuncionario(funcionario) {
    const funcRef = ref(database, "funcionario/" + funcionario);
    return remove(funcRef)
      .then(() => {
        console.log("Objeto no caminho ${funcionario} deletado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao deletar o objeto ", error);
      });
  },

  atualizaFuncionario(funcionario, att) {
    const funcRef = ref(database, "funcionario/" + funcionario);
    return update(funcRef, att)
      .then(() => {
        console.log("Objeto no caminho ${funcionario} atualizado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar o objeto ", error);
      });
  },
};

export default funcionariosServices;
