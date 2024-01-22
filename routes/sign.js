// Importation du module express pour créer et gérer les serveur et le router.
const express = require("express");
const router = express.Router();

// Importation des middlewares d'authentification et de vérification de la connexion.
const { authMiddleware } = require("../middlewares/authMiddleware");
const { verifSign } = require("../middlewares/verifSign");
// Importation des contrôleurs pour gérer la logique spécifique à chaque route.
const {
  signup,
  createUser,
  signin,
  login,
  logout,
  disconnect,
} = require("../controllers/sign_controller");
// Définition de la route GET pour la page de connexion.
// Utilise le middleware verifSign pour vérifier si l'utilisateur est déjà connecté.
router.get("/signin", verifSign, signin);
// Définition de la route POST pour le traitement du formulaire de connexion.
// Utilise également verifSign pour la même raison.
router.post("/signin/login", verifSign, login);
// Définition de la route GET pour la page d'inscription.
// Utilise verifSign pour empêcher l'accès des utilisateurs déjà connectés.
router.get("/signup", verifSign, signup);
// Définition de la route POST pour le traitement du formulaire d'inscription.
// Utilise aussi verifSign.
router.post("/signup/create", verifSign, createUser);
// Définition de la route GET pour initier une déconnexion.
// Utilise authMiddleware pour s'assurer que l'utilisateur est connecté.
router.get("/logout", authMiddleware, logout);
// Définition de la route POST pour traiter la déconnexion.
// AuthMiddleware vérifie encore si l'utilisateur est authentifié.
router.post("/logout/disconnect", authMiddleware, disconnect);
// Exportation du router pour permettre son utilisation dans d'autres parties de l'application.
module.exports = router;

// Chaque route est associée à un contrôleur spécifique qui gère la logique d'affichage de la page ou de
// traitement des données de formulaire. Les middlewares verifSign et authMiddleware sont utilisés pour
// s'assurer que les utilisateurs accèdent aux routes appropriées selon leur statut de connexion.
