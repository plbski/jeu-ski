function initialiser() {
    const carte = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 1, 1, 3.10, 3.12 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 2 représente le point de départ
        [0, 1, 0, 0, 0, 3.12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 3.01, 3.3, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 4.3, 4.3, 4.3, 4.3, 1, 0, 0, 0]
    ];

    const canvas = document.getElementById('jeu');
    const ctx = canvas.getContext('2d');
    const TAILLE_CASE = 50;

    canvas.width = carte[0].length * TAILLE_CASE;
    canvas.height = carte.length * TAILLE_CASE;

    const boutonRejouer = document.getElementById('rejouer');
    let personnage = new Personnage(0, 0, TAILLE_CASE, 50);
    let chronoDebut = null;
    let tempsFinal = null;

    personnage.trouverCheminComplet(carte);

    // Gérer les touches pour accélérer ou revenir à la vitesse normale
    window.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            personnage.gererAcceleration('space');
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.code === 'Space') {
            personnage.gererAcceleration('release');
        }
    });

    // Fonction pour réinitialiser le jeu
    function rejouer() {
        boutonRejouer.style.display = 'none'; // Masquer le bouton
        personnage = new Personnage(0, 0, TAILLE_CASE, 50); // Réinitialiser le personnage
        personnage.trouverCheminComplet(carte);
        chronoDebut = performance.now(); // Réinitialiser le chrono
        tempsFinal = null;
        boucleDeJeu(); // Redémarrer la boucle
    }

    // Associe la fonction de réinitialisation au bouton "Rejouer"
    boutonRejouer.addEventListener('click', rejouer);

	function boucleDeJeu() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	
		// Dessiner la carte avec les nouvelles couleurs
		for (let y = 0; y < carte.length; y++) {
			for (let x = 0; x < carte[y].length; x++) {
				const terrain = carte[y][x];
	
				if (terrain === 0) {
					ctx.fillStyle = 'gray'; // Mur
				} else if (terrain === 2) {
					ctx.fillStyle = 'red'; // Départ
				} else if (terrain >= 1 && terrain < 3) {
					ctx.fillStyle = 'white'; // Plat
				} else if (terrain >= 3 && terrain < 4) {
					ctx.fillStyle = `rgb(139, 69, 19)`; // Marron pour montée
				} else if (terrain >= 4 && terrain < 5) {
					ctx.fillStyle = `rgb(34, 139, 34)`; // Vert pour descente
				} else {
					ctx.fillStyle = 'black'; // Erreur ou défaut
				}
	
				// Dessiner la case
				ctx.fillRect(x * TAILLE_CASE, y * TAILLE_CASE, TAILLE_CASE, TAILLE_CASE);
				ctx.strokeStyle = 'black';
				ctx.strokeRect(x * TAILLE_CASE, y * TAILLE_CASE, TAILLE_CASE, TAILLE_CASE);
			}
		}
	
		// Déplacer et dessiner le personnage
		personnage.deplacer(carte); // Passe la carte à la méthode de déplacement
		personnage.dessiner(ctx);
	
		// Gestion de la fin de jeu
		personnage.deplacer(carte);
		personnage.dessiner(ctx, chronoDebut);
	
		if (!personnage.jeuTermine) {
			requestAnimationFrame(boucleDeJeu);
		} else {
			if (tempsFinal === null) {
				tempsFinal = performance.now() - chronoDebut;
			}
	
			// Afficher le temps total
			ctx.fillStyle = 'black';
			ctx.font = '20px Arial';
			ctx.fillText(
				`Temps total : ${(tempsFinal / 1000).toFixed(2)} s`,
				canvas.width / 2 - 100,
				canvas.height / 2
			);
			boutonRejouer.style.display = 'block'; // Afficher le bouton "Rejouer"
		}
	}
	

    chronoDebut = performance.now(); // Démarre le chronomètre
    boucleDeJeu(); // Démarre la boucle de jeu
}

window.onload = initialiser;





