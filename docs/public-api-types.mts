// Objectif : vérifier que les types publics sont importables.
import { associationSnapshot, compareAssociationPurpose } from "../src/index.mjs";
const dossier = associationSnapshot({
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
});
void compareAssociationPurpose(dossier, { decide: async () => ({}) });
