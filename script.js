// Initialisation du canvas
const canvas = document.getElementById("jeu");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables globales
let vitesse = 2; // Vitesse de base
let acceleration = 0.1; // Incrément de vitesse
let joueur = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    largeur: 50,
    hauteur: 100,
    couleur: "blue"
};
let obstacles = [];
let score = 0;

// Fonction pour dessiner le joueur
function dessinerJoueur() {
    ctx.fillStyle = joueur.couleur;
    ctx.fillRect(joueur.x, joueur.y, joueur.largeur, joueur.hauteur);
}

// Fonction pour créer des obstacles
function creerObstacle() {
    const largeur = Math.random() * 100 + 50;
    const x = Math.random() * (canvas.width - largeur);
    obstacles.push({
        x: x,
        y: -100,
        largeur: largeur,
        hauteur: 20,
        couleur: "red"
    });
}

// Fonction pour dessiner les obstacles
function dessinerObstacles() {
    obstacles.forEach((obstacle) => {
        ctx.fillStyle = obstacle.couleur;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.largeur, obstacle.hauteur);
    });
}

// Fonction pour mettre à jour les obstacles
function mettreAJourObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.y += vitesse;
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score++;
        }
    });
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

    // Accélération si Espace est appuyé
    if (espaceAppuye) {
        vitesse += acceleration;
    } else {
        vitesse = Math.max(2, vitesse - 0.05); // Ralentir progressivement
    }

    // Dessiner les éléments
    dessinerJoueur();
    dessinerObstacles();

    // Mettre à jour les éléments
    mettreAJourObstacles();

    // Créer des obstacles aléatoirement
    if (Math.random() < 0.02) {
        creerObstacle();
    }

    // Afficher le score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Recommencer la boucle
    requestAnimationFrame(boucleJeu);
}

// Démarrer le jeu
boucleJeu();
