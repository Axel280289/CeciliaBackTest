const express = require("express");
const path = require("path");
const router = express.Router();

// Dès qu'une information est précisé derrière le "/" il s'agit d'une ressource, ici on demande la ressource "Prestation"
router.get("/prestation", (req, res) => {
  // Pour cette ressource je traite la réponse adéquate
  // J'indique le status de la réponse (200)
  // J'affiche les données du fichier prestation.ejs
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  res
    .status(200)
    .render(path.join(__dirname, "../views/prestation.ejs"), { isConnected });
});
router.get("/homme", (req, res) => {
  // Pour cette ressource je traite la réponse adéquate
  // J'indique le status de la réponse (200)
  // J'affiche les données du fichier homme.ejs
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  res.status(200).render(path.join(__dirname, "../views/homme.ejs"), {
    isConnected,
  });
});
router.get("/enfant", (req, res) => {
  // Pour cette ressource je traite la réponse adéquate
  // J'indique le status de la réponse (200)
  // J'affiche les données du fichier enfant.ejs
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  res.status(200).render(path.join(__dirname, "../views/enfant.ejs"), {
    isConnected,
  });
});
router.get("/femme", (req, res) => {
  // Pour cette ressource je traite la réponse adéquate
  // J'indique le status de la réponse (200)
  // J'affiche les données du fichier femme.ejs
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  res.status(200).render(path.join(__dirname, "../views/femme.ejs"), {
    isConnected,
  });
});

module.exports = router;
