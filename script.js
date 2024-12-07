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
let acceleration = 0.001; // Accélération
let stamina = 100; // Stamina actuelle (en %)
let staminaMax = 100; // Stamina maximale (initialement 100 %)
let staminaDébutTour = 100; // Stamina au début du tour
let compteurTours = 0; // Compteur de tours
let chemin = []; // Tableau pour stocker les segments du parcours

// Fonction pour dessiner le tracé (parcours avec virages et lignes droites)
function dessinerParcours() {
    // Définir le parcours avec des segments de lignes droites et des virages (courbes)
    chemin = [
        // Segment 1 : Ligne droite
        { type: 'ligne', x1: centre.x, y1: centre.y, angle: 0, longueur: 150 },
        
        // Segment 2 : Virage à droite
        { type: 'courbe', x1: centre.x + 150, y1: centre.y, angle: Math.PI / 2, rayon: 100, arc: Math.PI / 2 },

        // Segment 3 : Ligne droite
        { type: 'ligne', x1: centre.x + 150 + 100, y1: centre.y, angle: Math.PI, longueur: 150 },
        
        // Segment 4 : Virage à gauche
        { type: 'courbe', x1: centre.x + 150 + 100 + 150, y1: centre.y, angle: Math.PI / 2, rayon: 100, arc: Math.PI / 2 },

        // Segment 5 : Ligne droite
        { type: 'ligne', x1: centre.x + 150 + 100 + 150 + 100, y1: centre.y, angle: 0, longueur: 150 },

        // Segment 6 : Virage à gauche
        { type: 'courbe', x1: centre.x + 150 + 100 + 150 + 100 + 150, y1: centre.y, angle: 0, rayon: 100, arc: Math.PI / 2 },

        // Segment 7 : Ligne droite
        { type: 'ligne', x1: centre.x + 150 + 100 + 150 + 100 + 150 + 100, y1: centre.y, angle: Math.PI, longueur: 150 },

        // Segment 8 : Virage à droite
        { type: 'courbe', x1: centre.x + 150 + 100 + 150 + 100 + 150 + 100 + 150, y1: centre.y, angle: -Math.PI / 2, rayon: 100, arc: Math.PI / 2 },
    ];

    // Dessiner chaque segment du parcours
    chemin.forEach(segment => {
        if (segment.type === 'ligne') {
            dessinerLigne(segment);
        } else if (segment.type === 'courbe') {
            dessinerCourbe(segment);
        }
    });
}

// Fonction pour dessiner un segment de ligne droite
function dessinerLigne(segment) {
    const x2 = segment.x1 + Math.cos(segment.angle) * segment.longueur;
    const y2 = segment.y1 + Math.sin(segment.angle) * segment.longueur;

    ctx.beginPath();
    ctx.moveTo(segment.x1, segment.y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "black"; // Couleur de la ligne du parcours
    ctx.lineWidth = 3;
    ctx.stroke();

    // Mise à jour des coordonnées pour le prochain segment
    segment.x1 = x2;
    segment.y1 = y2;
}

// Fonction pour dessiner un segment de courbe
function dessinerCourbe(segment) {
    const x1 = segment.x1;
    const y1 = segment.y1;
    const rayon = segment.rayon;
    const angle1 = segment.angle;
    const angle2 = angle1 + segment.arc;

    ctx.beginPath();
    ctx.arc(x1, y1, rayon, angle1, angle2);
    ctx.strokeStyle = "black"; // Couleur de la courbe
    ctx.lineWidth = 3;
    ctx.stroke();

    // Mise à jour des coordonnées pour le prochain segment (coordonnées du dernier point sur la courbe)
    const x2 = x1 + Math.cos(angle2) * rayon;
    const y2 = y1 + Math.sin(angle2) * rayon;

    segment.x1 = x2;
    segment.y1 = y2;
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

// Fonction pour dessiner le repère de tour
function dessinerRepereTour() {
    // La ligne de repère se trouve à l'angle 0 (c'est-à-dire sur la droite du cercle)
    const x = centre.x + Math.cos(0) * rayonExterieur;
    const y = centre.y + Math.sin(0) * rayonExterieur;

    // Dessiner la ligne de repère (ici une ligne verticale pour signaler le début du tour)
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, centre.y); // Ligne partant du point sur le cercle jusqu'au centre
    ctx.strokeStyle = "red"; // Couleur de la ligne
    ctx.lineWidth = 2;
    ctx.stroke();
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
    dessinerParcours(); // Dessiner le parcours avec virages et lignes droites
    dessinerRepereTour(); // Ajouter le repère de tour
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

    // Détection d'un tour complet : Si l'angle a fait un tour complet (autour de 2π)
    if (angleJoueur >= Math.PI * 2) {
        angleJoueur -= Math.PI * 2; // Réinitialiser l'angle après un tour complet
        compteurTours++; // Incrémenter le compteur de tours

        // Calculer la stamina utilisée pendant le tour
        const staminaUtilisée = staminaDébutTour - stamina;
        if (staminaUtilisée >= staminaMax * 0.5) {
            staminaMax = Math.max




