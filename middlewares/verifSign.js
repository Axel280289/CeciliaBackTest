// Ce middleware vérifie si un utilisateur est connecté

// Exportation de la fonction verifSign comme middleware.
exports.verifSign = (req, res, next) => {
  // Vérification si l'utilisateur est connecté en utilisant la session.
  // Si req.session.isConnected existe, utilise sa valeur, sinon utilise false.
  const isConnected = req.session.isConnected ? req.session.isConnected : false;
  // Si l'utilisateur est connecté, il est redirigé vers la page d'accueil.
  // Cela empêche l'accès aux pages de connexion et d'inscription.
  if (isConnected) {
    // Stockage d'un message dans la session pour indiquer que l'accès est non autorisé.
    req.session.userNotAuthorised = `Vous n'êtes pas autorisé à accéder à cette page.`;
    // Redirection vers la page d'accueil.
    res.redirect("/");
    // Si l'utilisateur n'est pas connecté, il peut continuer vers le prochain middleware.
    // Cela permet l'accès aux pages de connexion ou d'inscription.
  } else {
    next();
  }
};
// Ce middleware est utile pour les routes je ne veut pas que les utilisateurs
//déjà connectés accèdent, comme les pages de connexion et d'inscription
