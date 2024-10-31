import { database, loteRef } from "src/key/configKey";
import { ref, update, remove, get, set } from "firebase/database";

const loteServices = {
  getLote() {
    onValue(loteRef, (snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.val();
        console.log(data);
      } else {
        console.log("Sem info");
      }
    });
  },

  criaEpi(nome, quant, tipo) {
    firebaseServices.incrementaIndex("epiIndex");
    const epiIndexRef = ref(database, "/index/epiIndex");
    get(epiIndexRef).then((snapshot) => {
      const idLido = snapshot.val();

      set(ref(database, "lote/" + idLido), {
        id: idLido,
        name: nome,
        quant: quant,
        tipo: tipo,
      });
    });
  },
  deletaEpi(epi) {
    const loteRef = ref(database, "lote/" + epi);
    return remove(loteRef)
      .then(() => {
        console.log("Objeto no caminho ${funcionario} deletado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao deletar o objeto ", error);
      });
  },

  atualizaEpi(epi, att) {
    const loteRef = ref(database, "lote/" + epi);
    return update(loteRef, att)
      .then(() => {
        console.log("Objeto no caminho ${funcionario} atualizado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar o objeto ", error);
      });
  },
};

export default loteServices;
