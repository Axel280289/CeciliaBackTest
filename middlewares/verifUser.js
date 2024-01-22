// Ce middleware va vérifier qu'un utilisateur est authentifié

// Exportation de la fonction verifUser comme middleware.
exports.verifUser = (req, res, next) => {
  // Récupération de l'identifiant de l'utilisateur depuis le token décodé.
  // Si req.decodedToken.userId existe, utilise sa valeur, sinon utilise null.
  const userId = req.decodedToken.userId ? req.decodedToken.userId : null;
  // Si un identifiant d'utilisateur est trouvé, l'utilisateur peut continuer.
  // Permet l'accès aux fonctionnalités comme lister, créer, modifier, et supprimer des utilisateurs, ainsi qu'accéder au tableau de bord administrateur.
  if (userId) {
    next();
    // Si aucun identifiant d'utilisateur n'est trouvé, l'utilisateur n'est pas authentifié.
    // Redirection vers la page d'accueil pour empêcher l'accès aux pages mentionnées.
  } else {
    req.session.userNotAuthorised = `Vous n'êtes pas autorisé à accéder à cette page.`;
    res.redirect("/");
  }
};
// Ce middleware est particulièrement utile pour sécuriser les routes qui nécessitent une authentification et une identification utilisateur,
// comme les sections administratives ou les fonctionnalités qui modifient les données des utilisateurs.
