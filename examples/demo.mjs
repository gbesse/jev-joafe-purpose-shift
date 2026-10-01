// Objectif : montrer une décision sémantique avec des données entièrement synthétiques.
import assert from "node:assert/strict";
import { compareAssociationPurpose } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
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
};
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "material_change", probabilities: {
  "material_change": 0.82,
  "administrative_change": 0.045,
  "reformulation": 0.045,
  "dissolution": 0.045,
  "unchanged": 0.045
}, confidence: 0.82 } }, usage: { input_tokens: 120, output_tokens: 0 } }));
const résultat = await compareAssociationPurpose(dossier, provider);
assert.equal(résultat.decision, "material_change");
assert.equal(résultat.review, false);
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · probabilité : ${résultat.probability}`);
