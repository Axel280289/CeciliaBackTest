// J'importe les modules dont j'aurai besoin
const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  getProductById,
  addProduct,
  createProduct,
  updateProduct,
  modifyProduct,
  removeProduct,
  deleteProduct,
} = require("../controllers/products_controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { verifUser } = require("../middlewares/verifUser");

// Créer un produit (get => afficher la page, post => validation formulaire de création)
router.get("/products/create", authMiddleware, verifUser, addProduct);
router.post("/products/create/add", authMiddleware, verifUser, createProduct);

// Liste des produits (get => afficher la page)
router.get("/products", authMiddleware, verifUser, getProducts);

// Informations d'un produit spécifique (get => afficher la page)
router.get("/products/:id", getProductById, getProduct);

// Mise à jour d'un produit (get => afficher la page, put => validation formulaire de mise à jour)
router.get(
  "/products/:id/update",
  authMiddleware,
  verifUser,
  getProductById,
  modifyProduct
);
router.put("/products/:id/update", authMiddleware, verifUser, updateProduct);

// Supprimer un produit (get => afficher la page, delete => validation formulaire suppression)
router.get(
  "/products/:id/delete",
  authMiddleware,
  verifUser,
  getProductById,
  removeProduct
);
router.delete("/products/:id/delete", authMiddleware, verifUser, deleteProduct);

// J'exporte le router pour relier mes différentes routes au projet
module.exports = router;
