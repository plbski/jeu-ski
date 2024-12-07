// Initialisation du canvas
const canvas = document.getElementById("jeu");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

// Variables globales
const centre = { x: canvas.width / 2, y: canvas.height / 2 };
const rayonExterieur = 300; // Rayon du tracé extérieur
const rayonInterieur = 200; // Rayon du tracé intérieur
let angleJoueur = 0; // Position angulaire du joueur
let vitesse = 0.02; // Vitesse angulaire de base
let acceleration = 0.005; // Accélération

// Fonction pour dessiner le tracé (un anneau)
function dessinerTracé() {
    // Partie extérieure
    ctx.beginPath();
    ctx.arc(centre.x, centre.y, rayonExterieur, 0, Math.PI * 2);
    ctx.fillStyle = "#ddd";
    ctx.fill();

    // Partie intérieure
    ctx.beginPath();
    ctx.arc(centre.x, centre.y, rayonInterieur, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
}

// Fonction pour dessiner le joueur
function dessinerJoueur() {
    // Calculer la position du joueur sur l'anneau
    const x = centre.x + Math.cos(angleJoueur) * (rayonInterieur + rayonExterieur) / 2;
    const y = centre.y + Math.sin(angleJoueur) * (rayonInterieur + rayonExterieur) / 2;

    // Dessiner le joueur
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
}

// Gestion des touches
let espaceAppuye = false;
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        espaceAppuye = true;
    }
});
window.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
        espaceAppuye = false;
    }
});

// Boucle principale du jeu
function boucleJeu() {
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le tracé
    dessinerTracé();

    // Accélération si Espace est appuyé
    if (espaceAppuye) {
        vitesse += acceleration;
    } else {
        vitesse = Math.max(0.02, vitesse - 0.001); // Ralentir progressivement
    }

    // Mettre à jour la position angulaire du joueur
    angleJoueur += vitesse;

    // Dessiner le joueur
    dessinerJoueur();

    // Recommencer la boucle
    requestAnimationFrame(boucleJeu);
}

// Démarrer le jeu
boucleJeu();

