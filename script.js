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
            let x2 = x + Math.cos(angle) * segment.longueur;
            let y2 = y + Math.sin(angle) * segment.longueur;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.stroke();
            x = x2;
            y = y2;
        } else if (segment.type === 'courbe') {
            let x2 = x + Math.cos(angle) * segment.rayon;
            let y2 = y + Math.sin(angle) * segment.rayon;
            let startAngle = angle;
            let endAngle = angle + segment.arc;
            ctx.beginPath();
            ctx.arc(x, y, segment.rayon, startAngle, endAngle);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.stroke();
            x = x2 + Math.cos(endAngle) * segment.rayon;
            y = y2 + Math.sin(endAngle) * segment.rayon;
            angle = endAngle;
        }
    });
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
    let segment = chemin[compteurTours % chemin.length]; // On fait défiler le parcours
    let angleJoueurActuel = angleJoueur;
    let x = centre.x + Math.cos(angleJoueurActuel) * (rayonInterieur + rayonExterieur) / 2;
    let y = centre.y + Math.sin(angleJoueurActuel) * (rayonInterieur + rayonExterieur) / 2;
    
    if (segment.type === 'ligne') {
        angleJoueur += vitesse;  // Avancer sur une ligne droite
    } else if (segment.type === 'courbe') {
        angleJoueur += vitesse;  // Avancer sur une courbe
    }

    // Ajouter la position actuelle à la trajectoire du joueur
    parcours.push({ x, y });
    if (parcours.length > 200) parcours.shift();  // Limiter la longueur de la trajectoire
    
    // Augmenter la vitesse ou ajuster la stamina
    if (stamina > 0) {
        if (espaceAppuye) {
            vitesse += acceleration;
            stamina -= 0.5;
        }
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



