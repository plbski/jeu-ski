const canvas = document.getElementById("jeu");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

const centre = { x: canvas.width / 2, y: canvas.height / 2 };
const rayonExterieur = 300;
const rayonInterieur = 200;
let angleJoueur = 0;
let vitesse = 0.005;
let acceleration = 0.001;
let stamina = 100;
let staminaMax = 100;
let staminaDébutTour = 100;
let compteurTours = 0;

let chemin = [
        { type: 'ligne', longueur: 150, angle: 0 },
        { type: 'courbe', rayon: 100, arc: Math.PI / 2, angle: Math.PI / 2 },
        { type: 'ligne', longueur: 150, angle: Math.PI },
        { type: 'courbe', rayon: 100, arc: Math.PI / 2, angle: Math.PI + Math.PI / 2 },
        { type: 'ligne', longueur: 150, angle: 0 },
        { type: 'courbe', rayon: 100, arc: Math.PI / 2, angle: -Math.PI / 2 },
        { type: 'ligne', longueur: 150, angle: Math.PI },
        { type: 'courbe', rayon: 100, arc: Math.PI / 2, angle: -Math.PI }
       ];

let parcours = [];  // Tableau pour stocker les points de la trajectoire du joueur

function dessinerParcours() {
    let x = centre.x;
    let y = centre.y;
    let angle = 0;

    chemin.forEach((segment) => {
        if (segment.type === 'ligne') {
            // Calcul précis du point final pour une ligne
            let x2 = x + Math.cos(angle) * segment.longueur;
            let y2 = y + Math.sin(angle) * segment.longueur;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.stroke();

            // Mise à jour des coordonnées et de l'angle
            x = x2;
            y = y2;
            angle += segment.angle;
        } 
        else if (segment.type === 'courbe') {
            let startAngle = angle;
            let endAngle = startAngle + segment.arc;

            ctx.beginPath();
            ctx.arc(x, y, segment.rayon, startAngle, endAngle);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.stroke();

            // Calcul précis du nouveau point
            x = x + Math.cos(startAngle) * segment.rayon;
            y = y + Math.sin(startAngle) * segment.rayon;
            angle = endAngle;
        }
    });

    // Optionnel : fermer le circuit
    ctx.beginPath();
    ctx.moveTo(centre.x, centre.y);
    ctx.closePath();
    ctx.stroke();
}

function dessinerJoueur() {
    const x = parcours[compteurTours].x;
    const y = parcours[compteurTours].y;
    
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
}

function dessinerStamina() {
    const largeurBarre = 200;
    const hauteurBarre = 20;
    const x = canvas.width / 2 - largeurBarre / 2;
    const y = canvas.height - 50;
    
    ctx.fillStyle = "black";
    ctx.fillRect(x - 2, y - 2, largeurBarre + 4, hauteurBarre + 4);
    
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, (stamina / staminaMax) * largeurBarre, hauteurBarre);
}

function dessinerCompteurTours() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Tours: ${compteurTours}`, 10, 30);
}

function avancerJoueur() {
    let segmentActuel = chemin[compteurTours % chemin.length];
    
    if (segmentActuel.type === 'ligne') {
        // Progression sur une ligne droite
        x += Math.cos(angleJoueur) * vitesse;
        y += Math.sin(angleJoueur) * vitesse;
    } else if (segmentActuel.type === 'courbe') {
        // Progression sur une courbe
        angleJoueur += vitesse / segmentActuel.rayon;
        x = centre.x + Math.cos(angleJoueur) * segmentActuel.rayon;
        y = centre.y + Math.sin(angleJoueur) * segmentActuel.rayon;
    }

    // Ajouter la position actuelle à la trajectoire du joueur
    parcours.push({ x, y });
    if (parcours.length > 200) parcours.shift();

    // Gestion de la vitesse et de la stamina
    if (stamina > 0 && espaceAppuye) {
        vitesse += acceleration;
        stamina -= 0.5;
    }

    // Vérifier si le segment est terminé
    if (/* condition de fin de segment */) {
        compteurTours++;
    }
}

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

function boucleJeu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    dessinerParcours();  // Dessiner le parcours
    avancerJoueur();     // Avancer le joueur sur le parcours
    dessinerJoueur();    // Dessiner le joueur
    dessinerStamina();   // Dessiner la barre de stamina
    dessinerCompteurTours();  // Dessiner le compteur de tours
    
    requestAnimationFrame(boucleJeu);  // Rafraîchir la boucle du jeu
}

boucleJeu();



