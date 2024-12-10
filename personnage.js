class Personnage {
    constructor(x, y, tailleCase, staminaMax) {
        this.x = x;
        this.y = y;
        this.tailleCase = tailleCase; //on part du pricipe que chaque bloc fais 10m, si modifier il faudra adapter la vitesse
        this.cheminComplet = [];
        this.indexCourant = 0;
        this.staminaMax = staminaMax;
        this.stamina = staminaMax;
        this.vitesseBase = 0.04; //vitesse en m/s ici 4m/s
        this.vitesseAcc = 0.06;
        this.vitesse = this.vitesseBase;
        this.accelerationActive = false;
        this.count_tour = 0;
        this.positionDepart = { x: 0, y: 0 };
        this.aFaitTour = false;
        this.jeuTermine = false;
    }

	ajusterVitesse(terrain) {
		if (terrain >= 3 && terrain < 4) {
			// Montée : réduire la vitesse
			const pourcentage = (terrain - 3) * 100; // Extrait le pourcentage
			this.vitesse = this.vitesseBase * (1 - pourcentage / 100); 
		} else if (terrain >= 4 && terrain < 5) {
			// Descente : augmenter la vitesse
			const pourcentage = (terrain - 4) * 100; // Extrait le pourcentage
			this.vitesse = this.vitesseBase * (1 + pourcentage / 100);
		} else {
			// Terrain plat ou autre
			this.vitesse = this.accelerationActive ? this.vitesseAcc : this.vitesseBase;
		}
	}
	

    diminuerStamina() {
        if (this.accelerationActive && this.stamina > 0) {
            this.stamina = Math.max(0, this.stamina - 0.2);
            if (this.stamina === 0) {
                this.accelerationActive = false;
                this.vitesse = this.vitesseBase; // Retour à la vitesse normale
            }
        }
    }

    gererAcceleration(touche) {
        if (touche === 'space' && this.stamina > 0) {
            this.accelerationActive = true;
        } else {
            this.accelerationActive = false;
        }
    }

    trouverPointDepart(carte) {
        for (let y = 0; y < carte.length; y++) {
            for (let x = 0; x < carte[y].length; x++) {
                if (carte[y][x] === 2) {
                    this.positionDepart = { x, y };
                    return { x, y };
                }
            }
        }
        return null;
    }

	estCaseValide(carte, x, y) {
    return (
        x >= 0 &&
        x < carte[0].length &&
        y >= 0 &&
        y < carte.length &&
        (
            (carte[y][x] >= 1 && carte[y][x] < 3) || // Plat
            (carte[y][x] >= 3 && carte[y][x] < 5) || // Montée ou Descente
            carte[y][x] === 2 // Départ/arrivée
        )
    );
}


    trouverCheminComplet(carte) {
        const pointDepart = this.trouverPointDepart(carte);
        if (!pointDepart) return;

        this.cheminComplet = [pointDepart];
        const directions = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 }
        ];

        while (true) {
            const dernierPoint = this.cheminComplet[this.cheminComplet.length - 1];
            let prochaineCase = null;

            for (const dir of directions) {
                const nouveauX = dernierPoint.x + dir.dx;
                const nouveauY = dernierPoint.y + dir.dy;

                if (
                    this.estCaseValide(carte, nouveauX, nouveauY) &&
                    !this.cheminContient(nouveauX, nouveauY)
                ) {
                    prochaineCase = { x: nouveauX, y: nouveauY };
                    break;
                }
            }

            if (!prochaineCase) break;

            this.cheminComplet.push(prochaineCase);
        }
    }

    cheminContient(x, y) {
        return this.cheminComplet.some(point => point.x === x && point.y === y);
    }

    verifierTour() {
        if (this.x === this.positionDepart.x && this.y === this.positionDepart.y) {
            if (!this.aFaitTour) {
                this.count_tour += 1;
                this.aFaitTour = true;
                console.log(`Tour ${this.count_tour} terminé !`);

                if (this.count_tour >= 5) {
                    this.jeuTermine = true;
                }
            }
        } else {
            this.aFaitTour = false;
        }
    }

    deplacer(carte) {
        if (this.indexCourant < this.cheminComplet.length - 1) {
            this.indexCourant = Math.min(
                this.indexCourant + this.vitesse,
                this.cheminComplet.length - 1
            );

            const currentPosition = this.cheminComplet[Math.floor(this.indexCourant)];
            this.x = currentPosition.x;
            this.y = currentPosition.y;

            const terrain = carte[this.y][this.x];
            this.ajusterVitesse(terrain); // Ajuste la vitesse en fonction du terrain

            this.diminuerStamina(); // Réduit la stamina si nécessaire
            this.verifierTour(); // Vérifie si un tour est terminé
        } else {
            this.indexCourant = 0; // Retourne au début
        }
    }

	dessiner(ctx) {
		// Dessiner le personnage
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
	
		// Afficher la barre de stamina
		ctx.fillStyle = 'blue';
		ctx.fillRect(10, 10, this.stamina * 2, 20);
	
		// Afficher les informations du joueur
		ctx.fillStyle = 'black';
		ctx.font = '16px Arial';
		ctx.fillText(`Tour: ${this.count_tour}`, 10, 50); // Compteur de tours
		ctx.fillText(`Vitesse: ${this.vitesse.toFixed(2)} m/s`, 10, 70); // Vitesse actuelle
	}
	
}



