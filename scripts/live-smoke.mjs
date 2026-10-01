// Objectif : effectuer un appel Jev synthétique uniquement sur demande explicite.
import { createJevClient } from "../src/jev.mjs";
import { compareAssociationPurpose } from "../src/index.mjs";
const client = createJevClient();
const résultat = await compareAssociationPurpose({
  "id": "exemple-1",
  "text": "L’objet passe de l’organisation d’ateliers culturels locaux à la gestion d’établissements médico-sociaux.",
  "source": {
    "url": "https://example.test/source-publique",
    "date": "2026-09-25"
  },
  "details": {
    "territoire": "Commune Exemple",
    "origine": "donnée synthétique"
  }
}, client);
console.log(JSON.stringify({ décision: résultat.decision, confiance: résultat.confidence, usage: résultat.usage }, null, 2));
