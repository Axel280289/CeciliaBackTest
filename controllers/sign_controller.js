// Importation des modèles, modules et middlewares nécessaires.
const User = require("../models/User");
const bcrypt = require("bcrypt");
const verifInputs = require("../middlewares/verifInputs");
const findUserByMail = require("../middlewares/findUserByMail");
const path = require("path");
const jwt = require("jsonwebtoken");

// Fonction asynchrone pour inscrire un nouvel utilisateur.
const signUser = async (req, res) => {
  // Hashage du mot de passe avec bcrypt.
  const hash = await bcrypt.hash(req.body.password, 10);

  // Création d'une instance du modèle User avec les données reçues.
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hash,
  });

  // Sauvegarde de l'utilisateur dans la base de données.
  user
    .save()
    .then((result) => {
      // Création de variables de session après l'inscription réussie.
      req.session.userConnected = `Bienvenue ${result.lastname} ${result.firstname}.`;
      req.session.isConnected = true;

      // Création d'un token JWT pour l'authentification.
      const token = jwt.sign(
        { userId: result._id },
        process.env.SECRET_KEY_TOKEN,
        { expiresIn: "7d" }
      );

      // Création d'un cookie contenant le token JWT.
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 604800000, // 7 jours en millisecondes.
      });

      // Redirection vers la page d'accueil après l'inscription.
      res.status(200).redirect("/");
    })
    .catch((error) => {
      // Gestion des erreurs et envoi d'une réponse en cas d'échec.
      res.status(500).json({ error: error });
    });
};

// Middleware d'affichage de la page d'inscription
exports.signup = async (req, res) => {
  // Vérification de l'état de connexion de l'utilisateur
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  // Si l'utilisateur est déjà connecté, redirection vers la page d'accueil
  if (isConnected) {
    res.status(300).redirect(`/`);
  } else {
    // Si l'utilisateur n'est pas connecté, affichage de la page d'inscription
    res.status(200).render(path.join(__dirname, `../views/sign/signup.ejs`), {
      isConnected,
    });
  }
};

// Middleware de validation de formulaire d'inscription
exports.createUser = async (req, res) => {
  try {
    // Vérification de la correspondance entre le mot de passe et sa confirmation
    if (req.body.password === req.body.confirm) {
      // Sécurisation des données envoyées
      verifInputs(req, res);
      // Vérification de l'existence de l'utilisateur par son email
      await findUserByMail(req)
        .then((user) => {
          // Si l'utilisateur existe déjà, envoi d'un message d'erreur
          if (user) {
            res.status(400).send("L'utilisateur existe déjà");
          } else {
            // Si l'utilisateur n'existe pas création de celui ci
            signUser(id, req, res);
          }
        })
        .catch((error) =>
          // Gestion des erreurs lors de la recherche de l'utilisateur
          res.status(404).send("L'utilisateur existe déjà : " + error.message)
        );
    } else {
      // Envoi d'un message d'erreur si les mots de passe ne correspondent pas
      res.status(500).send("Les mots de passe ne sont pas identique");
    }
  } catch (error) {
    // Gestion globale des erreurs dans le bloc try-catch
    res.status(500).send("Erreur Sign CreateUser Try " + error.message);
  }
};

// Middleware d'affichage de la page de connexion
exports.signin = async (req, res) => {
  // Récupération de l'état de connexion de l'utilisateur (connecté ou non)
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  // Récupération d'un éventuel message d'erreur passé dans les paramètres de requête (query)
  const error = req.query.error;
  // Si l'utilisateur est déjà connecté, redirection vers la page d'accueil
  if (isConnected) {
    res.status(300).redirect(`/`);
  } else {
    // Si l'utilisateur n'est pas connecté, rendu de la page de connexion avec les variables nécessaires
    res.status(200).render(path.join(__dirname, `../views/sign/signin.ejs`), {
      isConnected,
      error,
    });
  }
};

// Middleware de validation de formulaire de connexion
exports.login = async (req, res) => {
  console.log(req.body.email);
  try {
    // Recherche de l'utilisateur par son adresse e-mail
    await findUserByMail(req).then((user) => {
      if (user) {
        // Si un utilisateur correspondant est trouvé, comparer le mot de passe fourni avec celui enregistré
        bcrypt
          .compare(req.body.password, user.password)
          .then((compared) => {
            if (compared) {
              // Si la comparaison est réussie (mot de passe correct), initialiser les sessions utilisateur
              req.session.userConnected = `Bienvenue ${user.lastname} ${user.firstname}`;
              req.session.isConnected = true;
              // Créer un token JWT pour l'authentification
              const token = jwt.sign(
                { userId: user._id },
                process.env.SECRET_KEY_TOKEN,
                { expiresIn: "7d" }
              );
              // Création et envoi d'un cookie contenant le token JWT
              res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                maxAge: 604800000, // Durée de vie du cookie en millisecondes (7 jours)
              });
              // Redirection de l'utilisateur vers la page d'accueil après une connexion réussie
              res.status(200).redirect("/admin");
            } else {
              // Si le mot de passe ne correspond pas, rediriger vers la page de connexion avec un message d'erreur
              res.status(200).redirect("/signin?error=0");
            }
          })
          .catch((error) => {
            // Gestion des erreurs lors de la comparaison des mots de passe
            console.log("Erreur lors de la comparaison :", error);
            res.status(500).send("Erreur interne du serveur");
          });
      } else {
        // Si aucun utilisateur correspondant n'est pas trouvé, rediriger vers la page de connexion
        res.status(200).redirect("/signin?error=1 ");
      }
    });
  } catch (error) {
    // Gestion des erreurs globales du bloc try-catch
    console.log("Erreur du bloc try-catch :", error);
    res.status(500).send("Erreur interne du serveur");
  }
};

// Middleware pour afficher la page "Déconnexion"
exports.logout = (req, res) => {
  // Récupération de l'ID de l'utilisateur à partir du token JWT décodé
  const userId = req.decodedToken.userId ? req.decodedToken.userId : null;
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  // Vérification si l'utilisateur est connecté
  if (userId) {
    // Si l'utilisateur est connecté, rendre la page de déconnexion
    res.status(200).render(path.join(__dirname, `../views/sign/logout.ejs`), {
      isConnected,
    });
    // Si l'utilisateur n'est pas connecté
  } else {
    // Redirection vers la page d'accueil
    res.status(302).redirect(`/`);
  }
};

// Middleware de validation de formulaire de déconnexion
exports.disconnect = async (req, res, next) => {
  try {
    // Suppression du cookie contenant le token JWT
    res.clearCookie("token");
    // Suppression de la session utilisateur
    req.session.destroy();
    // Redirection vers la page d'accueil après la déconnexion
    res.redirect("/signin");
  } catch (error) {
    // Gestion des erreurs en cas d'échec de la déconnexion
    res.status(500).send("Erreur Inscription Try " + error.message);
  }
};
