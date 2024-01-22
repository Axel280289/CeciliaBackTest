// verification Email//
// Attends que le DOM soit entièrement chargé avant d'exécuter le code
document.addEventListener("DOMContentLoaded", function () {
  // Récupère la référence de l'élément HTML avec l'ID "email"
  const emailInput = document.getElementById("email");
  // Récupère la référence de l'élément HTML avec l'ID "emailFeedback"
  const emailFeedback = document.getElementById("emailFeedback");
  // Ajoute un écouteur d'événement à l'élément input pour détecter les changements
  emailInput.addEventListener("input", function () {
    // Appelle la fonction validateEmail pour vérifier si l'e-mail est valide
    const isValid = validateEmail(emailInput.value);
    // Si l'e-mail est valide, affiche un message vert
    if (isValid) {
      emailFeedback.textContent = "L'adresse e-mail est valide.";
      emailFeedback.style.color = "green";
    }
    // Sinon, affiche un message rouge
    else {
      emailFeedback.textContent = "L'adresse e-mail n'est pas valide.";
      emailFeedback.style.color = "red";
    }
  });
});
// Fonction qui prend une adresse e-mail en paramètre et retourne vrai si elle est valide
function validateEmail(email) {
  // Expression régulière pour vérifier la validité de l'e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Utilise la méthode test() pour vérifier si l'e-mail correspond à l'expression régulière
  return emailRegex.test(email);
}

// verification Password //
// Écoute l'événement indiquant que le DOM est complètement chargé et exécute la fonction une fois cet événement déclenché.
document.addEventListener("DOMContentLoaded", function () {
  // Obtient une référence à l'élément HTML avec l'ID "password".
  const passwordInput = document.getElementById("password");
  // Obtient une référence à l'élément HTML avec l'ID "passwordFeedback".
  const passwordFeedback = document.getElementById("passwordFeedback");
  // Ajoute un écouteur d'événement à l'élément input de type password pour réagir à chaque saisie de l'utilisateur.
  passwordInput.addEventListener("input", function () {
    // Vérifie si le mot de passe saisi est valide en utilisant la fonction validatePassword.
    const isValid = validatePassword(passwordInput.value);
    // Si le mot de passe est valide, affiche un message positif en vert.
    if (isValid) {
      passwordFeedback.textContent = "Le mot de passe est valide.";
      passwordFeedback.style.color = "green";
    }
    // Sinon, affiche un message d'erreur en rouge expliquant les critères de validité.
    else {
      passwordFeedback.textContent =
        "Le mot de passe doit contenir au moins 8 caractères, dont au moins une majuscule, une minuscule et un chiffre et un caractère spécial.";
      passwordFeedback.style.color = "red";
    }
  });
});

// Définit la fonction validatePassword qui vérifie si un mot de passe répond à certains critères.
function validatePassword(password) {
  // Utilise une expression régulière pour valider le mot de passe.
  // Cette regex vérifie qu'il contient au moins une lettre majuscule, une lettre minuscule, un chiffre,
  // un caractère spécial et qu'il est long d'au moins 8 caractères.
  const passwordRegex =
    /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
  // Teste le mot de passe avec l'expression régulière et retourne true si le mot de passe est conforme.
  return passwordRegex.test(password);
}

// Ajoute un écouteur d'événement qui se déclenche lorsque le contenu du DOM est entièrement chargé.
document.addEventListener("DOMContentLoaded", function () {
  // Récupère l'élément input pour le mot de passe à l'aide de son ID.
  const passwordInput = document.getElementById("password");
  // Récupère l'élément input pour la confirmation du mot de passe à l'aide de son ID.
  const confirmPasswordInput = document.getElementById("confirm");
  // Récupère l'élément qui affichera le feedback sur la correspondance des mots de passe à l'aide de son ID.
  const confirmPasswordFeedback = document.getElementById(
    "confirmPasswordFeedback"
  );
  // Ajoute un écouteur d'événement pour détecter toute saisie dans le champ du mot de passe.
  passwordInput.addEventListener("input", validatePasswordMatch);
  // Ajoute un écouteur d'événement pour détecter toute saisie dans le champ de confirmation du mot de passe.
  confirmPasswordInput.addEventListener("input", validatePasswordMatch);
  // Définit la fonction qui sera appelée pour valider si les mots de passe correspondent.
  function validatePasswordMatch() {
    // Compare les valeurs des deux champs de mot de passe.
    if (passwordInput.value === confirmPasswordInput.value) {
      // Si les mots de passe correspondent, affiche un message positif en vert.
      confirmPasswordFeedback.textContent = "Les mots de passe correspondent.";
      confirmPasswordFeedback.style.color = "green";
    } else {
      // Si les mots de passe ne correspondent pas, affiche un message d'erreur en rouge.
      confirmPasswordFeedback.textContent =
        "Les mots de passe ne correspondent pas.";
      confirmPasswordFeedback.style.color = "red";
    }
  }
});
