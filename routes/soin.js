// Importation des modules et dépendances nécessaires
const express = require("express");
const path = require("path");
const router = express.Router();

// Importation des fonctions du module products_controller
const { getProduits } = require("../controllers/products_controller");

// Dès qu'une information est précisé derrière le "/" il s'agit d'une ressource, ici on demande la ressource "produit"
// Définition d'une route pour l'endpoint "/produit"
router.get("/soin", getProduits, (req, res) => {
  // Gestion de la requête GET pour l'endpoint "/produit"

  // Vérification si l'utilisateur est connecté en examinant les données de session
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  const detailsProducts = res.locals.detailsProducts
    ? res.locals.detailsProducts
    : [];
  console.log(detailsProducts);
  // Envoi d'une réponse avec le code d'état 200 et rendu de la vue "produit.ejs"
  res.status(200).render(path.join(__dirname, "../views/soin.ejs"), {
    isConnected,
    detailsProducts,
  });
});

// Exportation du routeur pour une utilisation dans d'autres parties de l'application
module.exports = router;
