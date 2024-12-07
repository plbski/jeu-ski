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
let vitesse = 0.005; // Vitesse angulaire de base
let acceleration = 0.002; // Accélération
let stamina = 100; // Stamina actuelle (en %)
let staminaMax = 100; // Stamina maximale (initialement 100 %)
let staminaDébutTour = 100; // Stamina au début du tour
let compteurTours = 0; // Compteur de tours
let dernierAngle = angleJoueur; // Pour détecter les tours complets

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
    const x = centre.x + Math.cos(angleJoueur) * (rayonInterieur + rayonExterieur) / 2;
    const y = centre.y + Math.sin(angleJoueur) * (rayonInterieur + rayonExterieur) / 2;

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
}

// Fonction pour dessiner la barre de stamina
function dessinerStamina() {
    const largeurBarre = 200;
    const hauteurBarre = 20;
    const x = canvas.width / 2 - largeurBarre / 2;
    const y = canvas.height - 50;

    // Contour de la barre
    ctx.fillStyle = "black";
    ctx.fillRect(x - 2, y - 2, largeurBarre + 4, hauteurBarre + 4);

    // Remplissage de la barre
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, (stamina / staminaMax) * largeurBarre, hauteurBarre);
}

// Fonction pour dessiner le compteur de tours
function dessinerCompteurTours() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Tours: ${compteurTours}`, 10, 30);
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

    // Dessiner les éléments
    dessinerTracé();
    dessinerJoueur();
    dessinerStamina();
    dessinerCompteurTours();

    // Gestion de la vitesse et de la stamina
    if (espaceAppuye && stamina > 0) {
        vitesse += acceleration;
        stamina -= 0.5; // Réduction de la stamina
    } else {
        vitesse = Math.max(0.005, vitesse - 0.001); // Ralentir progressivement
        stamina = Math.min(staminaMax, stamina + 0.2); // Régénérer la stamina
    }

    // Mettre à jour la position angulaire du joueur
    angleJoueur += vitesse;

    // Détecter un tour complet
    if (dernierAngle < 0 && angleJoueur >= 0) {
        compteurTours++;

        // Calculer la stamina utilisée pendant le tour
        const staminaUtilisée = staminaDébutTour - stamina;
        if (staminaUtilisée >= staminaMax * 0.5) {
            staminaMax = Math.max(10, staminaMax * 0.9); // Réduire de 10 %, minimum de 10 %
        }
        staminaDébutTour = stamina; // Réinitialiser la stamina de début de tour
    }
    dernierAngle = angleJoueur;

    // Recommencer la boucle
    requestAnimationFrame(boucleJeu);
}

// Démarrer le jeu
boucleJeu();



