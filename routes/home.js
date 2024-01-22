// Importation du module express pour créer et gérer le serveur.
const express = require("express");
// Importation du module path pour la gestion des chemins de fichiers.
const path = require("path");
// Création d'un nouvel objet router à l'aide d'Express pour gérer les routes.
const router = express.Router();
// Définition des routes (chemins d'accès) pour l'application.
// La route racine ("/") correspond à la page d'accueil du site.
router.get("/", (req, res) => {
  // Traitement de la réponse (res) que le serveur envoie au client.
  // Aucune requête (req) n'est traitée ici.

  // Vérification si l'utilisateur est connecté et stockage de l'état dans userConnected.
  // Si req.session.userConnected existe, utiliser sa valeur, sinon null.
  const userConnected = req.session.userConnected
    ? req.session.userConnected
    : null;
  // Vérification de l'état de connexion et stockage dans isConnected.
  // Si req.session.isConnected existe, utiliser sa valeur, sinon false.
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  // Envoi d'une réponse HTTP avec le statut 200 (OK).
  // Rendu du fichier index.ejs en passant les variables isConnected et userConnected.
  res.status(200).render(path.join(__dirname, "../index.ejs"), {
    isConnected,
    userConnected,
  });
});
// Exportation du router pour permettre son utilisation dans d'autres parties de l'application.
module.exports = router;
