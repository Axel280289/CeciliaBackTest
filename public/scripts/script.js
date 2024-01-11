document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".table-responsavie").forEach(function (table) {
    let labels = [];
    table.querySelectorAll(/* Ajoutez ici le sélecteur pour les éléments que vous souhaitez sélectionner dans la table */);
    // Continuez le reste de votre logique ici
  });
});

// verification Email

document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const emailFeedback = document.getElementById("emailFeedback");

  emailInput.addEventListener("input", function () {
    const isValid = validateEmail(emailInput.value);
    if (isValid) {
      emailFeedback.textContent = "L'adresse e-mail est valide.";
      emailFeedback.style.color = "green";
    } else {
      emailFeedback.textContent = "L'adresse e-mail n'est pas valide.";
      emailFeedback.style.color = "red";
    }
  });
});
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// verification Password //

document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const passwordFeedback = document.getElementById("passwordFeedback");

  passwordInput.addEventListener("input", function () {
    const isValid = validatePassword(passwordInput.value);
    if (isValid) {
      passwordFeedback.textContent = "Le mot de passe est valide.";
      passwordFeedback.style.color = "green";
    } else {
      passwordFeedback.textContent =
        "Le mot de passe doit contenir au moins 8 caractères, dont au moins une majuscule, une minuscule et un chiffre et un caractère spécial.";
      passwordFeedback.style.color = "red";
    }
  });
});

function validatePassword(password) {
  // Au moins 8 caractères, au moins une majuscule, une minuscule et un chiffre et un caractere special
  const passwordRegex =
    /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
  return passwordRegex.test(password);
}

document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm");
  const confirmPasswordFeedback = document.getElementById(
    "confirmPasswordFeedback"
  );

  passwordInput.addEventListener("input", validatePasswordMatch);
  confirmPasswordInput.addEventListener("input", validatePasswordMatch);

  function validatePasswordMatch() {
    if (passwordInput.value === confirmPasswordInput.value) {
      confirmPasswordFeedback.textContent = "Les mots de passe correspondent.";
      confirmPasswordFeedback.style.color = "green";
    } else {
      confirmPasswordFeedback.textContent =
        "Les mots de passe ne correspondent pas.";
      confirmPasswordFeedback.style.color = "red";
    }
  }
});
