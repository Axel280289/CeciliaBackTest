// Fonctions de validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function validatePassword(password) {
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[\d])(?=.*?[\W]).{8,}$/;
  return passwordRegex.test(password);
}
// Attente que le DOM soit entièrement chargé
document.addEventListener("DOMContentLoaded", function () {
  // Récupération des éléments du formulaire
  const emailInput = document.getElementById("email");
  const emailFeedback = document.getElementById("emailFeedback");
  const passwordInput = document.getElementById("password");
  const passwordFeedback = document.getElementById("passwordFeedback");
  const confirmPasswordInput = document.getElementById("confirm");
  const confirmPasswordFeedback = document.getElementById(
    "confirmPasswordFeedback"
  );
  const submitButton = document.getElementById("submitButton");
  // Gestionnaire d'événement pour le bouton de soumission
  submitButton.addEventListener("click", function (event) {
    event.preventDefault(); // Empêche la soumission automatique du formulaire

    // Validation de l'email
    const emailIsValid = validateEmail(emailInput.value);
    emailFeedback.textContent = emailIsValid
      ? "L'adresse e-mail est valide."
      : "L'adresse e-mail n'est pas valide.";
    emailFeedback.style.color = emailIsValid ? "green" : "red";

    // Validation du mot de passe
    const passwordIsValid = validatePassword(passwordInput.value);
    passwordFeedback.textContent = passwordIsValid
      ? "Le mot de passe est valide."
      : "Le mot de passe doit contenir au moins 8 caractères, dont au moins une majuscule, une minuscule, un chiffre et un caractère spécial.";
    passwordFeedback.style.color = passwordIsValid ? "green" : "red";

    // Vérification de la correspondance des mots de passe
    const passwordsMatch = passwordInput.value === confirmPasswordInput.value;
    confirmPasswordFeedback.textContent = passwordsMatch
      ? "Les mots de passe correspondent."
      : "Les mots de passe ne correspondent pas.";
    confirmPasswordFeedback.style.color = passwordsMatch ? "green" : "red";

    // Si toutes les validations sont réussies, permet la soumission du formulaire
    if (emailIsValid && passwordIsValid && passwordsMatch) {
      document.getElementById("formUser").submit();
    }
  });
});
