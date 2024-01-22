// J'importe tous les modèles et packages dont j'aurai besoin pour mes middlewares
const User = require("../models/User");
const path = require("path");
const bcrypt = require("bcrypt");

// J'importe les middlewares dont j'ai besoin
const verifInputs = require("../middlewares/verifInputs");
const findUserByMail = require("../middlewares/findUserByMail");

// Fonction asynchrone pour trouver un utilisateur par son identifiant.
const findUserById = async (id) => {
  // Utilise la méthode 'findOne' de Mongoose pour rechercher un utilisateur par son '_id'.
  // 'await' assure que la fonction attend le résultat de la requête à la base de données.
  return await User.findOne({ _id: id });
};

// Fonction asynchrone pour ajouter un nouvel utilisateur à la base de données.
const newUser = async (req, res) => {
  // Hashage du mot de passe avec bcrypt. Le '10' est le facteur de salage pour le hashage.
  const hash = await bcrypt.hash(req.body.password, 10);

  // Crée une nouvelle instance de l'utilisateur avec les données reçues de la requête.
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hash, // Utilise le mot de passe hashé.
  });

  // Sauvegarde l'utilisateur dans la base de données.
  user
    .save()
    .then((result) => {
      // En cas de succès, stocke un message dans la session et redirige vers une autre page.
      req.session.successCreateUser = `Utilisateur ${result.lastname} ${result.firstname} créé avec succès.`;
      res.status(200).redirect("/users/create");
    })
    .catch((error) => {
      // En cas d'erreur (par exemple, échec de sauvegarde dans la base de données), renvoie une erreur 500.
      res.status(500).json({ error: error });
    });
};

// Fonction pour mettre à jour un utilisateur
const refreshUser = async (req, res, user) => {
  // Crée un objet avec les nouvelles données de l'utilisateur.
  // Les données sont extraites de la requête (req) - à la fois du corps (req.body) et des paramètres (req.params).
  const updatedUser = {
    _id: req.params.id,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: user.password, // Conserve le mot de passe existant.
  };
  // Utilise la méthode updateOne de Mongoose pour mettre à jour l'utilisateur dans la base de données.
  // La mise à jour est effectuée sur l'utilisateur dont l'ID correspond à celui fourni dans req.params.id.
  await User.updateOne({ _id: req.params.id }, { ...updatedUser })
    .then((result) => {
      // Si la mise à jour réussit, un message de succès est stocké dans la session.
      req.session.successUpdateUser = `Utilisateur ${updatedUser.lastname} ${updatedUser.firstname} mis à jour avec succès.`;
      // Redirige l'utilisateur vers la page de mise à jour pour afficher le message.
      res.redirect(`/users/${req.params.id}/update`);
    })
    .catch((error) => {
      // En cas d'erreur, log l'erreur et indique que la mise à jour n'a pas réussi.
      console.log(error.message);
      console.log("utilisateur non mis à jour");
    });
};

// Middleware pour récupérer les informations d'un utilisateur grâce à son id (:id) qui se trouve dans les paramètre de l'url (/users/:id)
exports.getUserById = async (req, res, next) => {
  try {
    /* Pour récupérer un paramètre d'url on utilise la propriété params de l'objet request */
    const user = await User.findOne({ _id: req.params.id });
    /* 
            On stocke les données de l'utilisateur localement avec la propriété locals de l'objet request  
            qui permet de transférer des informations d'une requête vers elle-même (get /users/:id => get /users/:id)
        */
    res.locals.detailsUser = user;
    /* Comme le middleware se situera au milieu d'une requête on utilise next pour passer au middleware suivant */
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Middleware pour afficher la page "Créer un utilisateur"
exports.addUser = (req, res) => {
  /* On récupère si c'est le cas, la variable de session successCreateUSer pour afficher son contenu dans la page */
  const successCreateUser = req.session.successCreateUser
    ? req.session.successCreateUser
    : null;
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  res
    .status(200)
    .render(path.join(__dirname, "../views/management/users/create-user.ejs"), {
      isConnected,
      successCreateUser,
    });
};
// Middleware de validation du formulaire de la page "Créer un utilisateur"
// Définition de la fonction 'createUser'. Elle est exportée pour être utilisée ailleurs dans l'application.
exports.createUser = (req, res) => {
  try {
    // Vérifie et sécurise les données reçues dans la requête (req).
    verifInputs(req, res);
    // Vérifie si un utilisateur avec le même email existe déjà dans la base de données.
    findUserByMail(req)
      .then((user) => {
        // Si un utilisateur avec l'email fourni est déjà présent dans la base de données...
        if (user) {
          // ...renvoie un statut HTTP 409 (Conflit) avec un message indiquant que l'utilisateur existe déjà.
          return res
            .status(409)
            .json({ message: " Adresse Email déja utilisé" });
        } else {
          // Si aucun utilisateur n'est trouvé, procède à la création d'un nouvel utilisateur.
          newUser(req, res);
        }
      })
      .catch((error) => {
        // En cas d'erreur lors de la recherche de l'utilisateur (par exemple, une erreur de base de données),
        // enregistre l'erreur dans la console et renvoie une réponse d'erreur 500 (Erreur interne du serveur).
        console.log("Erreur findUserByMail", error);
        res.status(500).json({ error: error });
      });
  } catch (error) {
    // En cas d'erreur dans le bloc 'try' (par exemple, si 'verifInputs' lève une exception),
    // enregistre l'erreur dans la console.
    console.log("try error", error);
  }
};

// Déclaration du middleware pour afficher la page de liste des utilisateurs.
exports.getUsers = async (req, res, next) => {
  try {
    // Récupération de la variable de session 'successDeleteUser'. Si elle n'existe pas, assigne 'null'.
    const successDeleteUser = req.session.successDeleteUser
      ? req.session.successDeleteUser
      : null;
    // Vérification de l'état de connexion de l'utilisateur et stockage dans une variable.
    const isConnected = req.session.isConnected
      ? req.session.isConnected
      : false;
    // Récupération de tous les utilisateurs dans la base de données.
    // La méthode 'find()' sans arguments renvoie tous les documents de la collection 'User'.
    const users = await User.find();
    // Envoi d'une réponse HTTP avec le statut 200 (OK) et rendu de la vue EJS.
    // Les données des utilisateurs, le statut de connexion et le message de succès de suppression sont passés à la vue.
    res
      .status(200)
      .render(
        path.join(__dirname, "../views/management/users/list-users.ejs"),
        { users, successDeleteUser, isConnected }
      );
  } catch (error) {
    // En cas d'erreur dans le processus, enregistrement de l'erreur dans la console et envoi d'une réponse 500.
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Middleware pour afficher la page "Détails d'un utilisateur"
exports.getUser = (req, res) => {
  /* On récupère les informations issue du middleware getUserById en les stockant dans une variable */
  const detailsUser = res.locals.detailsUser ? res.locals.detailsUser : null;
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  res
    .status(200)
    .render(path.join(__dirname, "../views/management/users/detail-user.ejs"), {
      isConnected,
      detailsUser,
    });
};

// Middleware pour afficher la page "Mise à jour d'un utilisateur"
exports.modifyUser = async (req, res, next) => {
  const detailsUser = res.locals.detailsUser;

  const successUpdateUser = req.session.successUpdateUser
    ? req.session.successUpdateUser
    : null;
  const isConnected = req.session.isConnected ? req.session.isConnected : false;

  res
    .status(200)
    .render(path.join(__dirname, `../views/management/users/update-user.ejs`), {
      detailsUser,
      successUpdateUser,
      isConnected,
    });
};

// Middleware de validation du formulaire de la page "Mise à jour d'un utilisateur"
// Exporte la fonction 'updateUser' pour qu'elle puisse être utilisée ailleurs dans l'application.
exports.updateUser = async (req, res) => {
  try {
    // Vérifie et sécurise les données reçues dans la requête (req).
    verifInputs(req, res);
    // Recherche l'utilisateur par son ID (fourni dans les paramètres de la requête).
    // L'utilisation d'`await` fait attendre la résolution de la promesse retournée par `findUserById`.
    await findUserById(req.params.id)
      .then((user) => {
        // Si l'utilisateur est trouvé, appelle la fonction 'refreshUser' pour mettre à jour l'utilisateur.
        refreshUser(req, res, user);
      })
      .catch((error) => {
        // En cas d'erreur lors de la recherche de l'utilisateur (par exemple, l'utilisateur n'existe pas),
        // renvoie une réponse 404 (Non trouvé) avec le message d'erreur.
        res.status(404).send("Error Find User" + error.message);
      });
  } catch (error) {
    // En cas d'erreur dans le bloc 'try' (par exemple, si 'verifInputs' lève une exception),
    // enregistre l'erreur dans la console et renvoie une réponse 500 (Erreur interne du serveur).
    console.error(error.message);
    res.status(500).send("Server Error controller");
  }
};

// Middleware pour afficher la page "Supprimer un utilisateur"
exports.removeUser = async (req, res, next) => {
  const detailsUser = res.locals.detailsUser;
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  res
    .status(200)
    .render(path.join(__dirname, `../views/management/users/delete-user.ejs`), {
      isConnected,
      detailsUser,
    });
};

// Middleware de validation du formulaire de la page "Supprimer un utilisateur"
exports.deleteUser = async (req, res) => {
  try {
    // On vérifie si l'utilisateur existe
    await findUserById(req.params.id)
      .then((user) => {
        // S'il n'existe pas on retourne un message d'erreur
        if (!user) {
          res.status(404).send("User not found");
        } else {
          // S'il existe on utilise la méthode deleteOne pour le supprimer en fonction de son identifiant qu'on récupère depuis les paramètres de l'url (req.params)
          user
            .deleteOne({ _id: req.params.id })
            .then(() => {
              // On stocke au niveau de la session un message de succès
              req.session.successDeleteUser = `Utilisateur ${user.lastname} ${user.firstname} supprimé avec succès.`;
              // On redirige vers la liste des utilisateurs pour voir le message apparaître
              res.redirect(`/users`);
            })
            .catch((error) =>
              res.status(400).send("Error Delete User " + error.message)
            );
        }
      })
      .catch((error) =>
        res.status(400).send("Error Find User " + error.message)
      );
  } catch (error) {
    res.status(404).send("Error delete" + error.message);
  }
};

// équivaut à
// module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser }
// module.exports = { verifInputs, findUserByMail, findAddress, createAddress}

/*
 req.locals => permet de récupérer des informations afin de les stocker d'une requête http vers elle-même (get > get)
 req.session => permet de récupérer des informations afin de les stocker entre deux type de requête différent (post => get, put => get, delete => get)
*/

/*
    Méthodes mongoose
    ----------------------
    .save() => sauvegarder les nouvels données pour créer un nouvel élément dans une collection
    .find() => récupérer toutes les informations d'une collection
    .findOne({propriete: valeur}) => récupérer toutes les informations d'une collection en fonction d'une valeur spécifique
*/
