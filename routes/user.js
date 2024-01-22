// Importation du framework Express et création d'un router.
const express = require("express");
const router = express.Router();
// Importation des contrôleurs pour gérer les actions spécifiques liées aux utilisateurs.
const {
  getUsers,
  getUser,
  getUserById,
  addUser,
  createUser,
  updateUser,
  modifyUser,
  removeUser,
  deleteUser,
} = require("../controllers/users_controller");
// Importation des middlewares d'authentification et de vérification des utilisateurs.
const { authMiddleware } = require("../middlewares/authMiddleware");
const { verifUser } = require("../middlewares/verifUser");
// Route GET pour afficher la page de création d'un utilisateur.
// Utilise les middlewares pour authentification et vérification des droits d'utilisateur.
router.get("/users/create", authMiddleware, verifUser, addUser);
// Route POST pour le traitement du formulaire de création d'un utilisateur.
router.post("/users/create/add", authMiddleware, verifUser, createUser);
// Route GET pour afficher la liste des utilisateurs.
router.get("/users", authMiddleware, verifUser, getUsers);
// Route GET pour afficher les informations d'un utilisateur spécifique.
// Utilise l'ID de l'utilisateur dans l'URL pour identifier quel utilisateur afficher.
router.get("/users/:id", authMiddleware, verifUser, getUserById, getUser);
// Route GET pour afficher la page de mise à jour d'un utilisateur.
router.get(
  "/users/:id/update",
  authMiddleware,
  verifUser,
  getUserById,
  modifyUser
);
// Route PUT pour le traitement du formulaire de mise à jour d'un utilisateur.
router.put("/users/:id/update", authMiddleware, verifUser, updateUser);
// Route GET pour afficher la page de suppression d'un utilisateur.
router.get(
  "/users/:id/delete",
  authMiddleware,
  verifUser,
  getUserById,
  removeUser
);
// Route DELETE pour le traitement de la suppression d'un utilisateur.
router.delete("/users/:id/delete", authMiddleware, verifUser, deleteUser);
// Exportation du router pour son utilisation dans d'autres parties de l'application.
module.exports = router;

// les middlewares assurent que seuls les utilisateurs autorisés peuvent accéder à ces fonctionnalités.
