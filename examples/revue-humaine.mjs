// Objectif : montrer qu’une décision incertaine est explicitement envoyée en revue humaine.
import assert from "node:assert/strict";
import { compareAssociationPurpose } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
  "id": "revue-1",
  "text": "La nouvelle annonce ajoute la transmission des savoirs à une formulation déjà centrée sur les ateliers pédagogiques.",
  "source": {
    "url": "https://example.test/dossier-ambigu",
    "date": "2026-09-26"
  },
  "details": {
    "origine": "donnée synthétique",
    "signal": "informations incomplètes"
  }
};
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "reformulation", probabilities: {
  "material_change": 0.12,
  "administrative_change": 0.12,
  "reformulation": 0.52,
  "dissolution": 0.12,
  "unchanged": 0.12
}, confidence: 0.62 } }, usage: { input_tokens: 140, output_tokens: 0 } }));
const résultat = await compareAssociationPurpose(dossier, provider);
assert.equal(résultat.decision, "reformulation");
assert.equal(résultat.review, true);
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · revue humaine : ${résultat.review} · confiance : ${résultat.confidence}`);
