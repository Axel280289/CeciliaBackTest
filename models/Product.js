// J'importe les modules
const mongoose = require("mongoose"); // Importe le module Mongoose pour interagir avec MongoDB
const uniqueValidator = require("mongoose-unique-validator"); // Importe le plugin pour valider l'unicité des champs dans Mongoose
// J'utilise la méthode Schema pour définir le modèle de document pour la collection produit
const productSchema = mongoose.Schema({
  // Définition des champs du schéma avec leurs types, contraintes et options
  titre: { type: String, required: true, trim: true, unique: true }, // ' le titre' doit être unique, obligatoire et sans espaces superflus
  description: { type: String, required: true, trim: true }, // 'description' est obligatoire et sans espaces superflus
  contenance: { type: String, required: true, trim: true }, // 'contenance' est obligatoire et sans espaces superflus
  benefice: { type: String, required: true, trim: true }, // 'benefice' est obligatoire et sans espaces superflus
  etape1: { type: String, required: true, trim: true }, // 'etape1' est obligatoire et sans espaces superflus
  etape2: { type: String, required: true, trim: true }, // 'etape2' est obligatoire et sans espaces superflus
  etape3: { type: String, required: true, trim: true }, // 'etape3' est obligatoire et sans espaces superflus
  etape4: { type: String, required: true, trim: true }, // 'etape4' est obligatoire et sans espaces superflus
  etape5: { type: String, required: false, trim: true }, // // 'etape5' est optionnel et sans espaces superflus
  precaution: { type: String, required: true, trim: true }, // 'precaution' est obligatoire et sans espaces superflus
  favoris: { type: String, required: true, trim: true }, // 'favoris' est obligatoire et sans espaces superflus, peut-être utilisé pour marquer des produits comme favoris
  categorie: { type: String, required: true, trim: true }, // 'categorie' est obligatoire et sans espaces superflus, pour classifier le produit dans une catégorie spécifique
});
// Appliquer le plugin uniqueValidator au schéma pour garantir l'unicité des champs marqués comme 'unique'
productSchema.plugin(uniqueValidator);
// J'exporte mon modèle, lui donnant le nom 'Product', associé à son schéma 'productSchema' et à la collection 'products' dans MongoDB
module.exports = mongoose.model("Product", productSchema, "products");
//Ce schéma définit la structure des documents dans la collection "products" de ma base de données MongoDB.
//Chaque champ est défini avec des contraintes spécifiques comme l'obligation d'être rempli (`required: true`),
//l'élimination des espaces superflus au début et à la fin des chaînes (`trim: true`), et l'unicité de certains champs
//(par exemple, `unique: true` pour le titre). Le plugin `uniqueValidator` est utilisé pour
//s'assurer que les champs marqués comme uniques le sont effectivement dans la base de données.
