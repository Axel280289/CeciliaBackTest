// Importation du module Mongoose pour interagir avec MongoDB
const mongoose = require("mongoose");
// Importation du plugin uniqueValidator pour assurer l'unicité des valeurs dans certains champs
const uniqueValidator = require("mongoose-unique-validator");
// Définition du schéma pour la collection "users" dans MongoDB
const userSchema = mongoose.Schema({
  // Définition du champ "lastname" de type String, requis et avec suppression des espaces superflus
  lastname: { type: String, required: true, trim: true },
  // Définition du champ "firstname" de type String, requis et avec suppression des espaces superflus
  firstname: { type: String, required: true, trim: true },
  // Définition du champ "email" de type String, requis, unique et avec suppression des espaces superflus
  email: { type: String, required: true, trim: true, unique: true },
  // Définition du champ "password" de type String, requis et avec suppression des espaces superflus
  password: { type: String, required: true, trim: true },
});
// Ajout du plugin uniqueValidator au schéma pour garantir l'unicité de l'email
userSchema.plugin(uniqueValidator);
// Exportation du modèle "User" basé sur le schéma "userSchema" et associé à la collection "users" dans MongoDB
module.exports = mongoose.model("User", userSchema, "users");

/*


*/
