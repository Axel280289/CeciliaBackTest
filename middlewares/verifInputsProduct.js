// Appel des méthodes liées à express-validator
const { body, validationResult } = require("express-validator");
// verifInputsProduct va vérifier la conformité des données et les sécuriser
const verifInputsProduct = (req, res) => {
  // Vérifie si les champs ne sont pas une chaîne non vide
  body("titre", "La dénomination est obligatoire")
    .isString()
    .notEmpty()
    .escape();
  body("description", "La description est obligatoire")
    .isString()
    .notEmpty()
    .escape();
  body("contenance", "La contenance est obligatoire")
    .isString()
    .notEmpty()
    .escape();
  body("benefice", "Le bénéfice du produit est obligatoire")
    .isString()
    .notEmpty()
    .escape();
  body("etape1", "Le conseil d'utilisation du produit est obligatoire")
    .isString()
    .notEmpty()
    .escape();
  body("etape2", "Le conseil d'utilisation du produit est obligatoire")
    .isString()
    .notEmpty()
    .escape();
  body("etape3", "Le conseil d'utilisation du produit est obligatoire")
    .isString()
    .notEmpty()
    .escape();
  body("etape4", "Le conseil d'utilisation du produit est obligatoire")
    .isString()
    .notEmpty()
    .escape();
  body("precaution", "La précaution d'utilisation du produit est obligatoire")
    .isString()
    .notEmpty()
    .escape();
  // Vérification des erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // S'il y a des erreurs, renvoie une réponse avec le statut 422 et les détails des erreurs
    return res.status(422).json({ errors: errors.array() });
  }
};
module.exports = verifInputsProduct;
