// appel des méthodes liées à express-validator
const { body, validationResult } = require("express-validator");

// verifInputs va verifier la conformité des données et les sécuriser
const verifInputsProduct = (req, res) => {
  body("titre", "La dénonmination est obligatoire").isString().notEmpty();
  body("description", "La description est obligatoire").isString().notEmpty();
  body("contenance", "La contenance est obligatoire").isString().notEmpty();
  body("photo", "la photo du produit est obligatoire").isString().notEmpty();
  body("benefice", "bénéfice du produit est obligatoire").isString().notEmpty();
  body("etape1", "conseil d'utilisation du produit est obligatoire")
    .isString()
    .notEmpty();
  body("etape2", "conseil d'utilisation du produit est obligatoire")
    .isString()
    .notEmpty();
  body("etape3", "conseil d'utilisation du produit est obligatoire")
    .isString()
    .notEmpty();
  body("etape4", "conseil d'utilisation du produit est obligatoire")
    .isString()
    .notEmpty();
  body("etape5", "conseil d'utilisation du produit est obligatoire")
    .isString()
    .notEmpty();
  body("precaution", "precaution d'utilisation du produit est obligatoire")
    .isString()
    .notEmpty();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Si les données sont valides, passez à la suite du traitement
};

// Export du middleware
module.exports = verifInputsProduct;
