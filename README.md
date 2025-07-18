# Memory-game

# <u>Fonctionnalités de base:</u>

### Création du plateau de jeu:
- Le jeu doit être composé d'une grille de 4x4 (8 paires de cartes avec des images identiques).
- Les cartes doivent être disposées aléatoirement sur le plateau à chaque nouvelle partie.
- Chaque carte doit avoir une face visible (identique pour toutes avant d’être retournée) et une face cachée (cf images fournies).

### Logique du jeu:
- Lorsqu'un joueur clique sur une carte, celle-ci se retourne pour révéler son image.
- Si deux cartes retournées sont identiques, elles restent visibles. Sinon, elles sont à nouveau cachées après un court délai.
- Ajoutez un compteur qui enregistre le nombre de mouvements effectués (click) par le joueur.

### Fin de jeu:
- Le jeu se termine lorsque toutes les paires sont trouvées.
- Afficher un message de félicitations à l'utilisateur, avec le nombre de tentatives réalisées pour trouver toutes les paires.



<br><br><br><br>

# <u>Bonus:</u>

- <u>**Bouton reset**:</u>  
Ajouter un bouton permettant de réinitialiser le jeu à tout moment, ce qui réarrange les cartes aléatoirement sur le plateau, réinitialise le timer et le compteur de mouvements.

- <u>**Timer global**:</u>  
Inclure un chronomètre visible sur l'écran, démarrant au début du jeu et s'arrêtant lorsque toutes les paires sont trouvées.

- <u>**Bouton de sauvegarde**:</u>  
Implémenter un bouton permettant de sauvegarder l'état actuel du jeu dans le localStorage, incluant le placement des cartes, les cartes déjà trouvées et le temps écoulé.

- <u>**Bouton de reprise**:</u>  
Ajouter un bouton pour charger et reprendre la partie sauvegardée précédemment depuis le localStorage.
