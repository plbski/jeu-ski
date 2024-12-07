class Personnage {
    constructor(x, y, tailleCase, staminaMax) {
        this.x = x;
        this.y = y;
        this.tailleCase = tailleCase;
        this.cheminComplet = [];
        this.indexCourant = 0;
        this.staminaMax = staminaMax;
        this.stamina = staminaMax; // La stamina commence à son maximum
        this.vitesseBase = 0.5; // Vitesse de déplacement par défaut (plus lent)
        this.vitesseAcc = 2; // Vitesse d'accélération (quand espace est pressé)
        this.vitesse = this.vitesseBase; // Initialement, la vitesse est à la vitesse de base
        this.accelerationActive = false; // Indicateur pour savoir si la barre espace est enfoncée
    }

    // Fonction pour diminuer la stamina à chaque mouvement si la barre espace est pressée
    diminuerStamina() {
        if (this.accelerationActive && this.stamina > 0) {
            this.stamina -= 0.2; // Décrément de la stamina par mouvement quand la barre espace est pressée
            if (this.stamina <= 0) {
                this.stamina = 0;
                this.accelerationActive = false; // Désactiver l'accélération quand la stamina est épuisée
            }
        }
    }

    // Fonction pour activer ou désactiver l'accélération en fonction de l'état de la barre espace
    gererAcceleration(touche) {
        if (touche === 'space' && this.stamina > 0) {
            this.accelerationActive = true;
            this.vitesse = this.vitesseAcc; // Accélérer lorsque la barre espace est enfoncée
        } else {
            this.accelerationActive = false;
            this.vitesse = this.vitesseBase; // Revenir à la vitesse de base lorsque la barre espace est relâchée
        }
    }

    trouverCheminComplet(carte) {
        let pointDepart = this.trouverPointDepart(carte);
        if (!pointDepart) return;

        this.cheminComplet = [pointDepart];
        this.x = pointDepart.x;
        this.y = pointDepart.y;

        const directions = [
            {dx: 1, dy: 0},   // Droite
            {dx: -1, dy: 0},  // Gauche
            {dx: 0, dy: 1},   // Bas
            {dx: 0, dy: -1}   // Haut
        ];

        while (true) {
            let dernierPoint = this.cheminComplet[this.cheminComplet.length - 1];
            let prochaineCase = null;

            for (let dir of directions) {
                let nouveauX = dernierPoint.x + dir.dx;
                let nouveauY = dernierPoint.y + dir.dy;

                if (this.estCaseValide(carte, nouveauX, nouveauY) && 
                    !this.cheminContient(nouveauX, nouveauY)) {
                    prochaineCase = {x: nouveauX, y: nouveauY};
                    break;
                }
            }

            if (!prochaineCase) break;

            this.cheminComplet.push(prochaineCase);
        }
    }

    trouverPointDepart(carte) {
        for (let y = 0; y < carte.length; y++) {
            for (let x = 0; x < carte[y].length; x++) {
                if (carte[y][x] === 1) {
                    return {x, y};
                }
            }
        }
        return null;
    }

    estCaseValide(carte, x, y) {
        return x >= 0 && x < carte[0].length && 
               y >= 0 && y < carte.length && 
               carte[y][x] === 1;
    }

    cheminContient(x, y) {
        return this.cheminComplet.some(point => 
            point.x === x && point.y === y
        );
    }

    deplacer() {
        if (this.indexCourant < this.cheminComplet.length - 1) {
            this.indexCourant += this.vitesse; // La vitesse affecte l'index
            if (this.indexCourant >= this.cheminComplet.length) {
                this.indexCourant = this.cheminComplet.length - 1;
            }
            this.x = this.cheminComplet[Math.floor(this.indexCourant)].x;
            this.y = this.cheminComplet[Math.floor(this.indexCourant)].y;

            this.diminuerStamina(); // Diminuer la stamina à chaque mouvement si espace est enfoncé
        } else {
            this.indexCourant = 0;
            this.x = this.cheminComplet[this.indexCourant].x;
            this.y = this.cheminComplet[this.indexCourant].y;
        }
    }

    dessiner(ctx) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(
            (this.x + 0.5) * this.tailleCase, 
            (this.y + 0.5) * this.tailleCase, 
            this.tailleCase / 3, 
            0, 
            Math.PI * 2
        );
        ctx.fill();

        // Affichage de la stamina
        ctx.fillStyle = 'blue';
        ctx.fillRect(10, 10, this.stamina * 2, 20); // Affichage de la barre de stamina
    }
}

// Fonction d'initialisation
function initialiser() {
    const carte = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const TAILLE_CASE = 50;
    const canvas = document.getElementById('jeu');
    const ctx = canvas.getContext('2d');
    
    canvas.width = carte[0].length * TAILLE_CASE;
    canvas.height = carte.length * TAILLE_CASE;

    const personnage = new Personnage(0, 0, TAILLE_CASE, 100);
    personnage.trouverCheminComplet(carte);

    // Gérer l'événement de la barre espace
    window.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            personnage.gererAcceleration('space');
        }
    });

    window.addEventListener('keyup', function(event) {
        if (event.code === 'Space') {
            personnage.gererAcceleration('release');
        }
    });

    // Boucle de jeu
    function boucleDeJeu() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner la carte
        for (let y = 0; y < carte.length; y++) {
            for (let x = 0; x < carte[y].length; x++) {
                ctx.fillStyle = carte[y][x] === 0 ? 'gray' : 'white';
                ctx.fillRect(x * TAILLE_CASE, y * TAILLE_CASE, TAILLE_CASE, TAILLE_CASE);
                ctx.strokeStyle = 'black';
                ctx.strokeRect(x * TAILLE_CASE, y * TAILLE_CASE, TAILLE_CASE, TAILLE_CASE);
            }
        }

        // Déplacer et dessiner le personnage
        personnage.deplacer();
        personnage.dessiner(ctx);

        requestAnimationFrame(boucleDeJeu);
    }

    // Démarrer la boucle de jeu
    boucleDeJeu();
}

// Initialiser au chargement
window.onload = initialiser;

