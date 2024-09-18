lineage
=======

Family Tree Data Expression Engine, original project from : https://github.com/bengarvey/lineage

## Configuration

Config dans le fichier `config.json`.
voilà ce que font les keys:

### `data`
pointe vers le fichier qui contient les données familiales.
Par defaut, ça point sur le fichier d'exmemple : 
`data/familyData.json`.

### `filter`
Dans la barre de menu sur la page web, vous pouvez filtrer des noms spécifiques à l'aide du
champ de saisie.
Cette key permet de définir un filtre initial qui sera active lorsque la page web sera chargée.

### `startYear`
année de départ

### `endYear`
année de fin

### `speed`
combien de millisecondes dure une année quand on appuie sur le boutton "Play"?
La valeur par défaut est 100 ce qui fait que 10 années s'écoulent par seconde
(100ms = 1/10 d'une seconde).

### `menuDefaultOpen`
si c'est sur `true`, le menu est intantanément ouvert en arrivant sur la page.
Par défaut à `true`.

### `debug`
Cette key n'a aucun rapport avec le front et n'affecte que
la journalisation.


### `showDead`
Si c'est à `false`, seules les personnes en vie au moment de l'année active seront visibles.
Si c'est à `true`, tous ceux qui sont nés à cette époque (indépendamment du décès) s’affiche.



## Notes
- Ne pas hésiter à dézoomer la page pour mieux voir
- Si vous avez perdu l'interface, déplacez votre souris en haut à gauche de la page
