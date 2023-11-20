// J'importe tous les modèles et packages dont j'aurai besoin pour mes middlewares
const Product = require("../models/Product");
const path = require("path");
const express = require("express");

// J'importe les middlewares dont j'ai besoin
const verifInputsProduct = require("../middlewares/verifInputsProduct");

// Fonction pour trouver un produit selon son id
const findProductById = async (id) => {
  return await Product.findOne({ _id: id });
};

// Fonction pour trouver un produit selon son titre
const findTitre = async (req) => {
  return await Product.findOne({ titre: req.body.titre });
};

// Fonction pour ajouter un nouveau Produit dans la base de données
const newProduct = async (req, res) => {
  // Récupération du fichier de la photo
  const photo = req.file;
  // Vérification si la photo existe
  if (!photo) {
    return res
      .status(400)
      .json({ message: "La photo du produit est obligatoire." });
  }
  // Création d'un nouveau produit (new Product) avec les données du formulaire (req.body)
  const product = new Product({
    titre: req.body.titre,
    description: req.body.description,
    contenance: req.body.contenance,
    benefice: req.body.benefice,
    etape1: req.body.etape1,
    etape2: req.body.etape2,
    etape3: req.body.etape3,
    etape4: req.body.etape4,
    etape5: req.body.etape5,
    precaution: req.body.precaution,
    categorie: req.body.categorie,
    favoris: req.body.favoris,
  });

  /* Sauvegarde des données du nouveau Produit dans la base de données grâce à la méthode .save de mongoose */
  product
    .save()
    .then((result) => {
      /* On crée une variable de session pour pouvoir l'utiliser sur un autre type de requête http (post => get) */
      req.session.successCreateProduct = `${req.body.titre} créé avec succès.`;
      /* On redirige vers la page de création d'un produit */
      res.status(200).redirect("/products/create");
    })
    .catch((error) => {
      res.status(500).json({ message: "Erreur création produit : " + error });
    });
};

// Fonction pour mettre à jour un produit
const refreshProduct = async (req, res) => {
  // On récupère toutes les informations du Produit venant du formulaire (req.body), de l'url (req.params), ...
  const updatedProduct = {
    _id: req.params.id,
    titre: req.body.titre,
    description: req.body.description,
    contenance: req.body.contenance,
    benefice: req.body.benefice,
    etape1: req.body.etape1,
    etape2: req.body.etape2,
    etape3: req.body.etape3,
    etape4: req.body.etape4,
    etape5: req.body.etape5,
    categorie: req.body.categorie,
    precaution: req.body.precaution,
    favoris: req.body.favoris,
  };

  // On utilise la méthode updateOne de mongoose pour effectuer la mise à jour
  await Product.updateOne({ _id: req.params.id }, { ...updatedProduct })
    .then((result) => {
      // Quand la mise à jour s'effectue on enregistre un message de succès
      req.session.successUpdateProduct = `${req.body.titre} mis à jour avec succès.`;

      // Puis on redirige vers la page de mise à jour pour voir le message
      res.redirect(`/products/${req.params.id}/update`);
    })
    .catch((error) => {
      console.log(error.message);
      res
        .status(500)
        .json({ message: "Erreur mise à jour produit : " + error });
    });
};

// Middleware pour récupérer les informations d'un produit grâce à son id (:id) qui se trouve dans les paramètre de l'url (/cars/:id)
exports.getProductById = async (req, res, next) => {
  try {
    /* Pour récupérer un paramètre d'url on utilise la propriété params de l'objet request */
    const product = await Product.findOne({ _id: req.params.id });

    /* 
            On stocke les données du produit localement avec la propriété locals de l'objet request   
            qui permet de transférer des informations d'une requête vers elle-même (get /users/:id => get /users/:id)
        */
    res.locals.detailsProduct = product;

    /* Comme le middleware se situera au milieu d'une requête on utilise next pour passer au middleware suivant */
    next();
  } catch (error) {
    console.log("Try product error", error);
    res.status(500).json({ message: "Erreur find Product id " + error });
  }
};

// Middleware pour afficher la page "Créer un produit"
exports.addProduct = async (req, res) => {
  /* On récupère si c'est le cas, la variable de session successCreateCar pour afficher son contenu dans la page */
  const successCreateProduct = req.session.successCreateProduct
    ? req.session.successCreateProduct
    : null;
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  res
    .status(200)
    .render(
      path.join(__dirname, "../views/management/products/create-product.ejs"),
      {
        isConnected,
        successCreateProduct,
      }
    );
};

// Middleware de validation du formulaire de la page "Créer un produit"
exports.createProduct = async (req, res) => {
  try {
    /* On vérifie et sécurise les données qui sont envoyées */
    verifInputsProduct(req, res);

    /* On vérifie si le produit existe déjà dans la base de données */
    findTitre(req)
      .then((product) => {
        /* Si l'utilise existe */
        if (product) {
          return res.status(409).json({ message: "product already exists" });

          /* Si le produit n'existe pas */
        } else {
          newProduct(req, res);

          /* Si l'adresse n'existe pas, on crée la nouvelle adresse puis on crée ensuite le nouvel véhicule */
        }
      })
      .catch((error) => {
        console.log("Erreur findTitre", error);
        res
          .status(500)
          .json({ message: "Erreur recherche produit : " + error });
      });
  } catch (error) {
    console.log("try createProduct error", error);
  }
};

// Middleware pour afficher la page "Liste des produits"
exports.getProducts = async (req, res) => {
  try {
    const successDeleteProduct = req.session.successDeleteProduct
      ? req.session.successDeleteProduct
      : null;
    const isConnected = req.session.isConnected
      ? req.session.isConnected
      : false;

    /* On récupère les informations des produits (find) */
    const products = await Product.find();
    res
      .status(200)
      .render(
        path.join(__dirname, "../views/management/products/list-products.ejs"),
        {
          products,
          successDeleteProduct,
          isConnected,
        }
      );
  } catch (error) {
    console.log("Try Error getProducts : " + error.message);
    res.status(500).json({ message: "Try Liste Produits : " + error.message });
  }
};

// Middleware pour afficher la page "Détails d'un véhicule"
exports.getProduct = async (req, res) => {
  /* On récupère les informations issue du middleware getProductById en les stockant dans une variable */
  const detailsProduct = res.locals.detailsProduct
    ? res.locals.detailsProduct
    : null;
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  res
    .status(200)
    .render(
      path.join(__dirname, "../views/management/products/detail-product.ejs"),
      {
        isConnected,
        detailsProduct,
      }
    );
};

// Middleware pour afficher la page "Modifier un produit"
exports.modifyProduct = async (req, res) => {
  const detailsProduct = res.locals.detailsProduct
    ? res.locals.detailsProduct
    : null;

  const successUpdateProduct = req.session.successUpdateProduct
    ? req.session.successUpdateProduct
    : null;

  const isConnected = req.session.isConnected ? req.session.isConnected : false;

  res
    .status(200)
    .render(
      path.join(__dirname, `../views/management/products/update-product.ejs`),
      {
        detailsProduct,
        successUpdateProduct,
        isConnected,
      }
    );
};

// Middleware de validation du formulaire de la page "Modifier un produit"
exports.updateProduct = async (req, res) => {
  try {
    /* On vérifie et sécurise les données qui sont envoyées */
    verifInputsProduct(req, res);
    // On vérifie si le produit existe
    await findProductById(req.params.id)
      .then((Product) => {
        // S'il existe il se met a jour
        refreshProduct(req, res);
      })
      .catch((error) => {
        res
          .status(404)
          .json({ message: "Erreur recherche produit : " + error.message });
      });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Erreur try maj Produit : " + error.message });
  }
};

// Middleware pour afficher la page "Supprimer un produit"
exports.removeProduct = async (req, res) => {
  const detailsProduct = res.locals.detailsProduct;
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  res
    .status(200)
    .render(
      path.join(__dirname, `../views/management/products/delete-product.ejs`),
      {
        isConnected,
        detailsProduct,
      }
    );
};

// Middleware de validation du formulaire de la page "Supprimer un produit"
exports.deleteProduct = async (req, res) => {
  try {
    // On vérifie le produit existe
    const product = await Product.findOne({ _id: req.params.id });
    // S'il n'existe pas on retourne un message d'erreur
    if (!product) {
      res.status(404).send("Product not found");
    } else {
      // S'il existe on utilise la méthode deleteOne pour le supprimer en fonction de son identifiant qu'on récupère depuis les paramètres de l'url (req.params)
      product
        .deleteOne({ _id: req.params.id })
        .then(() => {
          // On stocke au niveau de la session un message de succès
          req.session.successDeleteProduct = `${product.titre} supprimé avec succès.`;

          // On redirige vers la liste des produit pour voir le message apparaître
          res.redirect(`/products`);
        })
        .catch((error) =>
          res.status(400).send("Error Delete Product " + error.message)
        );
    }
  } catch (error) {
    res.status(404).send("Error delete" + error.message);
  }
};
