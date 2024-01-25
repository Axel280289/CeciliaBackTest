// J'importe tous les modèles et packages dont j'aurai besoin pour mes middlewares
const Product = require("../models/Product");
const path = require("path");
const express = require("express");
const fs = require("fs");
const sharp = require("sharp");

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

// Fonction asynchrone pour créer un nouveau produit
const newProduct = async (req, res) => {
  try {
    // Vérifier si des fichiers sont inclus dans la requête
    if (req.files && req.files.length > 0) {
      const file = req.files[0]; // Prend le premier fichier de la requête
      // Création des chemins de fichier pour la manipulation de l'image
      const tempFilePath = path.join(
        __dirname,
        "../public/images/temp",
        file.originalname
      ); // Chemin temporaire où sera stockée l'image téléchargée
      const sanitizedPseudo = req.body.titre.toLowerCase().split(" ").join("-");
      // Création d'un nom de fichier basé sur le titre du produit, converti en minuscules et les espaces remplacés par des tirets
      const tempNewFilePath = path.join(
        __dirname,
        "../public/images/temp",
        `${sanitizedPseudo}.webp`
      ); // Chemin temporaire pour l'image convertie en .webp
      const newFilePath = path.join(
        __dirname,
        "../public/images/produits",
        `${sanitizedPseudo}.webp`
      ); // Chemin définitif pour l'image convertie en .webp
      // Écriture du fichier temporaire
      fs.writeFile(tempFilePath, file.buffer, (err) => {
        if (err) {
          console.error("Erreur lors de l'écriture de tempFilePath : ", err);
        }
      });
      // Sauvegarde de l'image téléchargée dans le chemin temporaire
      // Vérification de l'existence du fichier final
      if (fs.existsSync(newFilePath)) {
        try {
          fs.writeFile(newFilePath, file.buffer, (err) => {
            if (err) {
              console.error("Erreur lors de l'écriture de newFilePath : ", err);
            }
          }); // Si le fichier existe déjà, il est réécrit avec le nouveau contenu
        } catch (error) {
          console.log("Erreur lors de l'écriture de newFilePath : ", error);
        }
      } else {
        // Conversion de l'image en format .webp et enregistrement
        await sharp(tempFilePath).webp({ quality: 80 }).toFile(tempNewFilePath);
        // Convertit l'image en format .webp avec une qualité de 80
        await sharp(tempNewFilePath).toFile(newFilePath);
        // Sauvegarde l'image .webp dans le chemin définitif
        // try {
        //   fs.unlinkSync(tempFilePath); // Supprime le fichier temporaire original
        //   fs.unlinkSync(tempNewFilePath); // Supprime le fichier temporaire converti
        // } catch (err) {
        //   console.error(
        //     "Erreur lors de la suppression des fichiers temporaires : ",
        //     err
        //   );
        // }
      }
    }
    // Création d'une nouvelle instance de produit avec les données reçues du formulaire
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
    // Sauvegarde du produit dans la base de données
    product
      .save()
      .then((result) => {
        // En cas de succès, enregistrement d'un message dans la session utilisateur
        // et redirection vers la page de création de produit
        req.session.successCreateProduct = `${req.body.titre} créé avec succès.`;
        res.status(200).redirect("/products/create");
      })
      .catch((error) => {
        // Gestion des erreurs de sauvegarde du produit
        res.status(500).json({ message: "Erreur création produit : " + error });
      });
  } catch (error) {
    // Gestion des erreurs globales de la fonction
    console.log("Erreur lors du traitement des données : " + error);
  }
};

// Fonction pour mettre à jour un produit
// Fonction asynchrone pour actualiser (mettre à jour) un produit
const refreshProduct = async (req, res) => {
  try {
    // Vérifie s'il y a des fichiers dans la requête (c'est-à-dire, une nouvelle image pour le produit)
    if (req.files && req.files.length > 0) {
      const file = req.files[0];

      // Définit les chemins pour le traitement de l'image
      const tempFilePath = path.join(
        __dirname,
        "../public/images/temp",
        file.originalname
      );
      const sanitizedTitre = req.body.titre.toLowerCase().split(" ").join("-");
      const tempNewFilePath = path.join(
        __dirname,
        "../public/images/temp",
        `${sanitizedTitre}.webp`
      );
      const newFilePath = path.join(
        __dirname,
        "../public/images/produits",
        `${sanitizedTitre}.webp`
      );

      // Écrit le fichier téléchargé dans un chemin temporaire
      fs.writeFile(tempFilePath, file.buffer, (err) => {
        if (err) {
          console.error("Erreur lors de l'écriture de tempFilePath : ", err);
        }
      });

      // Vérifie si un fichier avec le nouveau nom existe déjà
      if (fs.existsSync(newFilePath)) {
        try {
          // S'il existe, écrase le fichier existant avec le nouveau
          fs.writeFile(newFilePath, file.buffer, (err) => {
            if (err) {
              console.error("Erreur lors de l'écriture de newFilePath : ", err);
            }
          });
        } catch (error) {
          console.log("Erreur lors de l'écriture de newFilePath : ", error);
        }
      } else {
        // S'il n'existe pas, convertit l'image au format .webp et l'enregistre
        await sharp(tempFilePath).webp({ quality: 80 }).toFile(tempNewFilePath);
        await sharp(tempNewFilePath).toFile(newFilePath);
      }
    } else {
      // Si aucun nouveau fichier n'est téléchargé, recherche le produit par son ID
      await findProductById(req.params.id)
        .then((product) => {
          // Renomme le fichier si le titre du produit a été modifié
          const sanitizedTitre = req.body.titre
            .toLowerCase()
            .split(" ")
            .join("-");
          const oldTitre = product.titre.toLowerCase().split(" ").join("-");
          const oldFilePath = path.join(
            __dirname,
            "../public/images/produits",
            `${oldTitre}.webp`
          );
          const newFilePath = path.join(
            __dirname,
            "../public/images/produits",
            `${sanitizedTitre}.webp`
          );

          // Renomme le fichier
          fs.rename(oldFilePath, newFilePath, (err) => {
            if (err) {
              console.error("Erreur lors du renommage du fichier : ", err);
            } else {
              console.log("Fichier renommé avec succès !");
            }
          });
        })
        .catch((error) => console.log(error));
    }

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
  } catch (error) {
    console.log("erreur lors du traitement des données : " + error);
  }
};

// Middleware pour récupérer les informations d'un produit grâce à son id (:id)
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

// Pour récuperer les infos produits dans ma page Produit
exports.getProduits = async (req, res, next) => {
  try {
    /* Pour récupérer un paramètre d'url on utilise la propriété params de l'objet request */
    const products = await Product.find();
    /* 
            On stocke les données du produit localement avec la propriété locals de l'objet request   
            qui permet de transférer des informations d'une requête vers elle-même (get /users/:id => get /users/:id)
        */
    res.locals.detailsProducts = products;

    /* Comme le middleware se situera au milieu d'une requête on utilise next pour passer au middleware suivant */
    next();
  } catch (error) {
    console.log("Try product error", error);
    res.status(500).json({ message: "Erreur find Product id " + error });
  }
};

// Middleware pour afficher la page "Créer un produit"
exports.addProduct = async (req, res) => {
  /* On récupère, si elle existe, la variable de session successCreateProduct
     pour afficher son contenu dans la page. */
  const successCreateProduct = req.session.successCreateProduct
    ? req.session.successCreateProduct
    : null;
  // On récupère l'état de connexion de l'utilisateur pour le gérer dans la vue.
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  // Envoie une réponse HTTP avec le statut 200 et rendu de la page de création de produit.
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
        /* Si le produit existe on affiche un message d'erreur */
        if (product) {
          // Ce message est renvoyé si un produit avec le même titre existe déjà.
          // Le code de statut HTTP 409 indique un conflit, c'est-à-dire que la ressource
          // que l'utilisateur tente de créer entre en conflit avec une ressource existante.
          return res.status(409).json({ message: "product already exists" });
          /* Si le produit n'existe pas on le crée */
        } else {
          newProduct(req, res);
        }
      })
      .catch((error) => {
        // Ce message est renvoyé s'il y a une erreur lors de l'appel de la fonction findTitre.
        // Le code de statut HTTP 500 indique une erreur interne du serveur.
        console.log("Erreur findTitre", error);
        res
          .status(500)
          .json({ message: "Erreur recherche produit : " + error });
      });
  } catch (error) {
    // Ce message est renvoyé s'il y a une erreur globale dans le bloc try.
    // Il capture toutes les autres erreurs qui n'ont pas été gérées par les blocs précédents.
    console.log("try createProduct error", error);
  }
};

// Middleware pour afficher la page "Liste des produits"
exports.getProducts = async (req, res) => {
  try {
    // Récupère le message de succès pour la suppression d'un produit, s'il existe dans la session
    const successDeleteProduct = req.session.successDeleteProduct
      ? req.session.successDeleteProduct
      : null;
    // Vérifie si l'utilisateur est connecté en utilisant la session, sinon définit la valeur par défaut à false
    const isConnected = req.session.isConnected
      ? req.session.isConnected
      : false;
    /* On récupère les informations des produits depuis la base de données
       La méthode find() sans paramètres renvoie tous les produits */
    const products = await Product.find();
    // Envoie une réponse HTTP avec le code 200 (OK) et affiche la vue correspondante
    // avec les données des produits, le message de succès et l'état de la connexion
    res
      .status(200)
      .render(
        path.join(__dirname, "../views/management/products/list-products.ejs"),
        {
          products, // Envoie la liste des produits à la vue
          successDeleteProduct, // Envoie le message de succès à la vue, s'il existe
          isConnected, // Envoie l'état de connexion à la vue
        }
      );
  } catch (error) {
    // En cas d'erreur dans le bloc try, affiche l'erreur dans la console
    console.log("Try Error getProducts : " + error.message);
    // Envoie une réponse HTTP avec le code 500 (Erreur Interne du Serveur)
    // et un message d'erreur au format JSON
    res.status(500).json({ message: "Try Liste Produits : " + error.message });
  }
};

// Middleware pour afficher la page "Détails d'un produit"
exports.getProduct = async (req, res) => {
  // On récupère les informations du produit issues du middleware getProductById et on les stocke dans une variable.
  // Si res.locals.detailsProduct est défini, on l'utilise, sinon on assigne null.
  const detailsProduct = res.locals.detailsProduct
    ? res.locals.detailsProduct
    : null;

  // On vérifie si l'utilisateur est connecté en utilisant req.session.isConnected.
  // Si cela est défini, on utilise sa valeur, sinon on assigne false.
  const isConnected = req.session.isConnected ? req.session.isConnected : false;

  // Envoi d'une réponse HTTP avec le statut 200 (OK) et rendu de la page EJS pour afficher les détails du produit.
  res.status(200).render(
    // Construction du chemin vers le fichier template EJS.
    path.join(__dirname, "../views/management/products/detail-product.ejs"),
    {
      // Passage des données - état de connexion et détails du produit - au template EJS.
      isConnected,
      detailsProduct,
    }
  );
};

// Middleware pour afficher la page "Modifier un produit"
exports.modifyProduct = async (req, res) => {
  // Récupère les détails du produit à partir de res.locals.detailsProduct, ou renvoie null si non défini.
  const detailsProduct = res.locals.detailsProduct
    ? res.locals.detailsProduct
    : null;
  // Récupère le message de succès de la mise à jour du produit à partir de req.session.successUpdateProduct, ou renvoie null si non défini.
  const successUpdateProduct = req.session.successUpdateProduct
    ? req.session.successUpdateProduct
    : null;
  // Récupère l'état de connexion à partir de req.session.isConnected, ou renvoie false si non défini.
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  // Renvoie une réponse HTTP 200 et rend la page "update-product.ejs" en utilisant le moteur de rendu EJS.
  res
    .status(200)
    .render(
      path.join(__dirname, `../views/management/products/update-product.ejs`),
      {
        // Passe les données suivantes à la page comme variables locales.
        detailsProduct,
        successUpdateProduct,
        isConnected,
      }
    );
};

// Middleware de validation du formulaire de la page "Modifier un produit"
exports.updateProduct = async (req, res) => {
  try {
    // On vérifie et sécurise les données qui sont envoyées.
    verifInputsProduct(req, res);

    // On vérifie si le produit existe en utilisant l'ID fourni dans les paramètres de la requête.
    await findProductById(req.params.id)
      .then((Product) => {
        // Si le produit existe, il est mis à jour.
        // Cette fonction n'est pas définie ici, mais elle doit gérer la mise à jour du produit.
        refreshProduct(req, res);
      })
      .catch((error) => {
        // Si une erreur survient lors de la recherche du produit, une réponse 404 est envoyée avec un message d'erreur.
        res
          .status(404)
          .json({ message: "Erreur recherche produit : " + error.message });
      });
  } catch (error) {
    // Si une erreur survient dans le bloc try, elle est capturée ici.
    // Un message d'erreur est enregistré et une réponse 500 est envoyée avec le message d'erreur.
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Erreur try maj Produit : " + error.message });
  }
};

// Middleware pour afficher la page "Supprimer un produit"
// Définition d'un middleware asynchrone pour la suppression d'un produit.
exports.removeProduct = async (req, res) => {
  // Récupération des détails du produit depuis les variables locales de la réponse (res.locals).
  const detailsProduct = res.locals.detailsProduct;
  // Vérification de l'état de connexion de l'utilisateur à partir de la session.
  // Si 'isConnected' existe dans la session, utilisez sa valeur, sinon, utilisez 'false'.
  const isConnected = req.session.isConnected ? req.session.isConnected : false;

  // Envoi d'une réponse HTTP avec le statut 200 (OK).
  res
    // Rendu de la page EJS pour la suppression du produit.
    .status(200)
    .render(
      // Construction du chemin vers le fichier template EJS.
      path.join(__dirname, `../views/management/products/delete-product.ejs`),
      {
        // Passage des données - état de connexion et détails du produit - au template EJS.
        isConnected,
        detailsProduct,
      }
    );
};
// Middleware de validation du formulaire de la page "Supprimer un produit"
// Déclaration d'un middleware asynchrone pour la suppression d'un produit.
exports.deleteProduct = async (req, res) => {
  try {
    // Recherche du produit dans la base de données par son identifiant (ID).
    const product = await Product.findOne({ _id: req.params.id });
    // Si le produit n'est pas trouvé, envoie une réponse avec le statut 404 (Not Found).
    if (!product) {
      res.status(404).send("Product not found");
    } else {
      // Si le produit existe, utilise la méthode deleteOne pour le supprimer.
      product
        .deleteOne({ _id: req.params.id })
        .then(() => {
          // Stockage d'un message de succès dans la session après la suppression.
          req.session.successDeleteProduct = `${product.titre} supprimé avec succès.`;

          // Redirection vers la liste des produits pour afficher le message.
          res.redirect(`/products`);
        })
        // Gestion des erreurs lors de la suppression du produit.
        .catch((error) =>
          res.status(400).send("Error Delete Product " + error.message)
        );
    }
    // Gestion des erreurs lors de la recherche du produit.
  } catch (error) {
    res.status(404).send("Error delete" + error.message);
  }
};
