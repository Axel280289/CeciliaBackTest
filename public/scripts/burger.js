// Récupère l'élément DOM avec l'ID "menuIcon"
const menuIcon = document.getElementById("menuIcon");
// Récupère l'élément DOM avec l'ID "menu"
const menu = document.getElementById("menu");
// Ajoute un écouteur d'événement 'click' à l'icône du menu.
menuIcon.addEventListener("click", () => {
  // Bascule la classe 'active' pour l'élément 'menu'.
  // Si 'menu' a déjà la classe 'active', elle est retirée ; sinon, elle est ajoutée.
  // Cette opération peut être utilisée pour afficher ou masquer le menu.
  menu.classList.toggle("active");
  // Bascule également la classe 'active' pour l'icône du menu.
  // Cela est utilisé pour changer l'apparence de l'icône,
  // de menu hamburger à une icône de fermeture ou vice versa.
  menuIcon.classList.toggle("active");
});
