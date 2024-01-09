// appel des méthodes liées à express-validator
const { body, validationResult } = require("express-validator");

// verifInputs va verifier la conformité des données et les sécuriser
const verifInputs = (req, res) => {
  body("lastname", "Le nom est obligatoire").isString().notEmpty();
  body("firstname", "Le prénom est obligatoire").isString().notEmpty();
  body("email", "L'email est obligatoire").isEmail().notEmpty();
  body("password", "Le mot de passe est obligatoire").isString().notEmpty();
  body("confirm", "La confirmation du mot de passe est obligatoire")
    .isString()
    .notEmpty();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
};

// Export du middleware
module.exports = verifInputs;
