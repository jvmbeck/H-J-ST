import { database } from "src/key/configKey";
import { get, set, ref, update } from "firebase/database";

var index;

const firebaseServices = {
  incrementaIndex(caminho) {
    const IndexRef = ref(database, "/index/" + caminho);

    get(IndexRef).then((snapshot) => {
      const valAtual = snapshot.val();
      const valNovo = valAtual + 1;

      const updates = {};
      updates[caminho] = valNovo;

      update(ref(database, "index"), updates);
    });
  },

  createData(caminho, dados) {
    set(ref(database, caminho), dados)
      .then(() => {
        console.log(`New object created successfully at '${caminho}'`);
      })
      .catch((error) => {
        console.error("Error creating new object: ", error);
      });
  },

  retiradaDeEpi(idEpi, idFunc, quantRetirada) {
    const loteRef = ref(database, "lote/" + idEpi);

    // Step 1: Read the current value at the withdraw path
    get(loteRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const epi = snapshot.val();

          // Ensure the current value is a number and greater than or equal to the withdraw amount
          if (typeof epi.quant === "number" && epi.quant >= quantRetirada) {
            const novoValor = epi.quant - quantRetirada;

            // Step 2: Update the original object by subtracting the withdraw amount
            const updates = {};
            updates["quant"] = novoValor;

            update(ref(database, "lote/" + idEpi), updates)
              .then(() => {
                console.log(
                  `Successfully withdrew ${quantRetirada} from '${idEpi}'`
                );

                const IndexRef = ref(database, "/index/retiradaIndex");

                get(IndexRef).then((snapshot) => {
                  const index = snapshot.val();
                  this.createData("retiradas/" + index, {
                    funcionario: idFunc,
                    epi: epi.name,
                  });
                });

                // Step 3: Create a new object at the new path

                this.incrementaIndex("retiradaIndex");
              })
              .catch((error) => {
                console.error("Error updating the original value: ", error);
              });
          } else {
            console.error(
              "Error: Not enough value to withdraw or invalid value."
            );
          }
        } else {
          console.error("Error: No data exists at this path.");
        }
      })
      .catch((error) => {
        console.error("Error reading the value: ", error);
      });
  },
};

export default firebaseServices;
