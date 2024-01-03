// J'importe les modules et les potentiels modèles nécessaires
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// J'utilise la méthode Schema pour définir le model de document pour la collection produit
const productSchema = mongoose.Schema({
  titre: { type: String, required: true, trim: true, unique: true },
  description: { type: String, required: true, trim: true },
  contenance: { type: String, required: true, trim: true },
  benefice: { type: String, required: true, trim: true },
  etape1: { type: String, required: true, trim: true },
  etape2: { type: String, required: true, trim: true },
  etape3: { type: String, required: true, trim: true },
  etape4: { type: String, required: true, trim: true },
  etape5: { type: String, required: true, trim: true },
  precaution: { type: String, required: true, trim: true },
  favoris: { type: String, required: true, trim: true },
  categorie: { type: String, required: true, trim: true },
});

productSchema.plugin(uniqueValidator);

// J'exporte mon model en lui donnant un nom, lui associant son schéma ainsi que la collection de la base de données
module.exports = mongoose.model("Product", productSchema, "products");
