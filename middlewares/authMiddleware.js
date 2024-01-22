// Importation du module jsonwebtoken pour gérer les tokens JWT.
const jwt = require("jsonwebtoken");
// Importation du modèle User pour accéder à la base de données des utilisateurs.
const User = require("../models/User");
// Exportation du middleware d'authentification pour utilisation dans d'autres fichiers.
exports.authMiddleware = async (req, res, next) => {
  try {
    // Récupération du token JWT depuis les cookies de la requête.
    const token = req.cookies.token;
    // Si le token n'existe pas, renvoie d'une erreur 402 (Non autorisé).
    if (!token) {
      return res.status(402).json({ message: "Non autorisé" });
    }
    // Décodage et vérification du token avec la clé secrète.
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY_TOKEN);
    // Recherche de l'utilisateur dans la base de données en utilisant l'ID extrait du token.
    const user = await User.findById(decodedToken.userId);
    // Si l'utilisateur n'est pas trouvé, renvoie d'une erreur 401 (Token invalide).
    if (!user) {
      return res.status(401).json({ error: "Token invalide" });
    }
    // Stockage du token décodé dans la requête pour une utilisation ultérieure.
    req.decodedToken = decodedToken;
    // Passage au middleware suivant dans la chaîne.
    next();
  } catch (error) {
    // Gestion des erreurs liées à l'authentification et renvoie d'une erreur 401.
    res.status(401).send("Error auth " + error.message);
  }
};
