// Objectif : vérifier la normalisation, la règle déterministe et les décisions sémantiques.
import test from "node:test";
import assert from "node:assert/strict";
import { associationSnapshot, compareAssociationPurpose } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const casLimite = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-09-27"
  },
  "beforeText": "Objet associatif identique",
  "afterText": "Objet associatif identique"
};
const casPrincipal = {
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
const casÀRevoir = {
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
test("exige une source", () => assert.throws(() => associationSnapshot({ id: "x", text: "y" }), /source/));
test("applique le cas limite sans appel Jev", async () => {
  const provider = createFakeProvider(() => { throw new Error("appel interdit"); });
  assert.equal((await compareAssociationPurpose(casLimite, provider)).decision, "unchanged");
  assert.equal(provider.calls, 0);
});
test("classe un dossier sourcé avec une confiance suffisante", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "material_change", probabilities: {
  "material_change": 0.82,
  "administrative_change": 0.045,
  "reformulation": 0.045,
  "dissolution": 0.045,
  "unchanged": 0.045
}, confidence: 0.82 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await compareAssociationPurpose(casPrincipal, provider);
  assert.equal(résultat.decision, "material_change");
  assert.equal(résultat.review, false);
  assert.equal(provider.calls, 1);
});
test("marque une décision incertaine pour revue humaine", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "reformulation", probabilities: {
  "material_change": 0.12,
  "administrative_change": 0.12,
  "reformulation": 0.52,
  "dissolution": 0.12,
  "unchanged": 0.12
}, confidence: 0.62 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await compareAssociationPurpose(casÀRevoir, provider);
  assert.equal(résultat.decision, "reformulation");
  assert.equal(résultat.review, true);
  assert.equal(résultat.confidence, 0.62);
  assert.equal(provider.calls, 1);
});
