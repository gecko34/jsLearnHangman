
// ******************************************************
// Jeu Pendu - v3
// Francky F - Avec l'aimable collaboration de Lucas ;-)
// ******************************************************
//
// Quelques explications et commentaires en fin de page !


//----------------------------------------------------
//--  Déclaration des variables utilisées dans le jeu --
//----------------------------------------------------

let lifes, wordToFind, lettersFind, findOk, typeGame, computerWords, computerWordsInit;
let memoZoneGamePlay, memoZoneGameChoices, playerNumber, playerTurn, stateGame;
let statsPlayers = [];
let wordTry=[];						// Tableau avec les essais du joueur
let tableAlpha = [];
let buttonsLetters=[];				// Tableau des boutons (lettres de l'alphabet)

let buttonsGame = {};				// Tableau des boutons du jeu
let zoneGame = {};					// Tableau des zones du jeu

initMain();							// Initialisation principale
initGame();							// Initialisation variables jeu


// **********************************************
//-- *******  Déroulement du jeu  ******* --
// **********************************************


zoneGame['game'].style.display = "none";		// Efface la zone de jeu (n'apparaît qu'après choix du jeu effectués)
zoneGame['start'].style.display = "none";		// Efface zone saisie mot (n'apparaît que si player vs human)
zoneGame['playersNames'].style.display = "none";	// Efface zone saisie noms joueurs (n'apparaît que si player vs human)


// **********************************************
//-- *******  Départ - choix d'un type de jeu  ******* --
// **********************************************

// Au début seul le choix de partie est affiché (Human VS Human ou Human VS Computer)

//----------------------------------------------------
//--      Bouton : clic sur jeu Human VS ordinateur      --
//----------------------------------------------------

buttonsGame['computerGame'].addEventListener("click", function() {
	typeGame = "computer";										// Type de jeu : human vs computer

	wordToFind = seekWord();

	playerNumber = 1;		// Nombre de joueurs : 1
	initPlayers();			// - Initialise infos joueur

	statsPlayers[1][0] = "computer";		// Change le nom du joueur 2 à "computer"

	zoneGame['gameChoices'].style.display = "none";			// --> Efface écran choix de jeux
	startGame(wordToFind);									// --> Lance le jeu
});


// - Cherche un mot au hasard (random sur le nombre de mots du tableau computerWords)

function seekWord() {
	let temp = Math.floor(Math.random()*computerWords.length);
	wordToFind = computerWords[temp].toLowerCase();
	wordToFind = wordToFind.trim();	
	return wordToFind;
}


//----------------------------------------------------
//--   Bouton : Click sur jeu Human Vs Human     --
//----------------------------------------------------
// Plus d'écrans de choix dans ce type de jeu :
//     - Saisir les noms des joueurs
//     - Saisir le mot à trouver par un des joueurs
//     - Alterner les joueurs


buttonsGame['playerGame'].addEventListener("click", function() {
	typeGame = "human";										// Type de jeu : human vs human
	playerNumber = 2;										// Nombre de joueurs : 2
	initPlayers();											// - Initialise infos joueurs

	zoneGame['gameChoices'].style.display = "none";			// --> Efface écran choix de jeux
	zoneGame['playersNames'].style.display = "";			// --> Affiche écran saisie noms joueurs
});


//-------------------------------------------------------------------------------
//--   Bouton : click sur enregistrement noms des joueurs  (Jeu human Vs Human)   --
//-------------------------------------------------------------------------------

buttonsGame['playersNames'].addEventListener("click", function() {

	// Enregistre les noms des joueurs
	let temp_playerOneName = document.getElementById("inputPlayerOne").value;
	let temp_playerTwoName = document.getElementById("inputPlayerTwo").value;

	if (temp_playerOneName.length < 1) {
		statsPlayers[0][0] = "Player 1";
	} else {
		statsPlayers[0][0] = temp_playerOneName;
	}

	if (temp_playerTwoName.length < 1) {
		statsPlayers[1][0] = "Player 2";
	} else {
		statsPlayers[1][0] = temp_playerTwoName;
	}

	playerChoiceAWord();
});	


//-------------------------------------------------------------------------------
//--   Jeu Humans VS Humans - Ecran saisie du mot à trouver     --
//-------------------------------------------------------------------------------

function playerChoiceAWord() {
	zoneGame['gameChoices'].style.display = "none";				// --> Efface affichage zone choix de jeux
	zoneGame['game'].style.display = "none";					// --> Efface affichage zone de jeu
	zoneGame['playersNames'].style.display = "none";			// --> Efface écran saisie noms joueurs

	zoneGame['start'].style.display = "";						// --> Affiche zone saisie mot
	zoneGame['playerNameWord'].innerHTML = statsPlayers[playerTurn][0];		// --> Affiche nom joueur
}


//-------------------------------------------------------------------------------
//--   Jeu Humans VS Humans - Ecran saisie du mot à trouver     --
//-------------------------------------------------------------------------------

buttonsGame['giveWordToFind'].addEventListener("click", function() {
	wordToFind = document.getElementById("inputWordToFind").value;
	wordToFind = wordToFind.toLowerCase();    	// Met le mot à trouver en lettres minuscules
	wordToFind = wordToFind.trim();    			// Enlève les espaces autour du mot

	if (wordToFind.length<4) {						// si le mot à moins de 4 lettres
		infoJoueur("Hey ! Il faut au moins quatre lettres dans ton mot ! Saisi un mot plus long...");
	} else {										// si le mot à plus de 4 lettres
		zoneGame['start'].style.display = "none";	// Efface zone de départ du jeu	
		changePlayer();			// Change joueur qui joue
		startGame(wordToFind);
	}
});



function changePlayer() {
	console.log("***Avant : Joueur:**"+playerTurn+"**");
	if (playerTurn === 0) {						// Change joueur qui joue
		playerTurn = 1;
	} else {
		playerTurn = 0;
	}
	console.log("***Après : Joueur:**"+playerTurn+"**");
}

//----------------------------------------------------
//-- Démarrage du jeu --
//----------------------------------------------------


function startGame(wordToFind) {
	// initialise le jeu
	zoneGame['infos'].innerText="";
	zoneGame['game'].style.display = "";		// Affiche la zone de jeu
	zoneGame['playerName'].innerHTML = statsPlayers[playerTurn][0];		// --> Affiche nom joueur

	initGame();									// Initialise le jeu
//	infoJoueur("Le mot à trouver était : "+wordToFind);

	for (let i=0; i<wordToFind.length; i++) {	// Remplit wordTry avec des - à la place des lettres à trouver
		wordTry.push("-");
	}

	displayInfosPlayers();
	displayWordTry();					// Affiche le mot avec les lettres trouvées

	// Affiche l'alphabet des lettres trouvées
	// Cet affichage crée un bouton cliquable pour chaque lettre
	// Choisir une lettre déclenche la fonction testLetterTry
	displayAlphabet();					
	afficheLifes();						// Affiche les vies restantes
}



//----------------------------------------------------
//-- Test de la lettre jouée --
//----------------------------------------------------


function testLetterTry(letterTry) {

	findOk = false;

	for (let i=0; i<wordToFind.length; i++) {						// Boucle qui vérifie si la lettre existe dans le mot
		if (letterTry == wordToFind[i] && wordTry[i] != letterTry) {	// Si lettre dans le mot et pas encore trouvée
			lettersFind++;											// incrémente le nombre de lettres trouvées
			wordTry[i]=letterTry;									// remplace dans wordTry le - par lettre trouvée	
			displayWordTry();
			findOk = true;
		}
	}

	let temp = letterTry.toUpperCase();		// 	Met la lettre saisie en majuscule
	temp = temp.charCodeAt(0);				// 	Code ascii de la lettre saisie en majuscule (pour pouvoir tester avec code ascii du tableau alphabet)

	if (findOk == false) {
		tableAlpha[temp-65][1]=1;		// Lettre cliquée pas dans le mot --> passe la lettre en : choisie & faux
	} else {
		tableAlpha[temp-65][1]=2;		// Lettre cliquée est dans le mot --> passe la lettre en : choisie & ok
	}

	displayAlphabet();

	if (findOk == false) {
		affichePendu(11-lifes);
		lifes--;						// Réduit le nombre de vies
		afficheLifes();
	}

	// -- Test si gagné :
	if (lettersFind == wordToFind.length) {
		zoneGame['alphabet'].innerHTML = "";			// Efface zone alphabet
		zoneGame['textLetters'].innerHTML = "";			// Efface texte "lettres jouées"

		// statsPlayers : 0 = Nom, 1 = score, 2 = nb parties, 3 = parties gagnées, 4 = perdues
		statsPlayers[playerTurn][1] += lifes*100;
		statsPlayers[playerTurn][2]++;
		statsPlayers[playerTurn][3]++;
		// let messageWin="<span class='winGame'>BRAVO !!</span><br/>";
		let messageWin="BRAVO !!<br/>";
		messageWin += "Tu as gagné(e) en "+(11-lifes)+" coups !<br/><br/>";
		messageWin += "<div><span class='winGameScore'>Score : + "+(lifes*100)+"</span></div><br/>";

		afficheGameEnd(messageWin);						// Message au vainqueur
	}

	// -- Test si perdu :
	if (lifes < 1) {
		zoneGame['alphabet'].innerHTML = "";			// Efface zone alphabet
		zoneGame['textLetters'].innerHTML = "";			// Efface texte "lettres jouées"

		// statsPlayers : 0 = Nom, 1 = score, 2 = nb parties, 3 = parties gagnées, 4 = perdues
		statsPlayers[playerTurn][2]++;
		statsPlayers[playerTurn][4]++;

		let messageLost="HAHAHAHA<br/><br/>";
		messageLost += "Tu as perdu !!!<br/><br/>";
		messageLost += "Le mot à trouver était : "+wordToFind;
		stateGame = "lost";

		afficheGameEnd(messageLost);					// Message au looser (AKA Trump)
	}
}



function afficheLifes() {
	let temp="Vies restantes<br>";
	temp += "<span class='styleLifesNumber'>"+lifes+"</span>";
	zoneGame['vies'].innerHTML=temp;	
}


function infoJoueur(text) {
	zoneGame['infos'].innerText=text;
}


function afficheGameEnd(message) {

	zoneGame['alphabet'].innerHTML=message;

	if (stateGame == "lost") {
		zoneGame['alphabet'].insertAdjacentHTML('beforeend', '<img src="images/pirate-skull.png" class="pirateSkull">');
	} else {
		zoneGame['alphabet'].insertAdjacentHTML('beforeend', '<img src="images/thumbs-up.png" class="pirateSkull">');
	}

	displayInfosPlayers();

	// Affichage du bouton continuer
	temp="<button type='button' id='buttonContinueWin' class='buttonContinue'>Continuer</button>";
	zoneGame['alphabet'].insertAdjacentHTML('beforeend', temp);

	let buttonContinue=document.getElementById('buttonContinueWin');

	if (typeGame == "computer") {
		buttonContinue.addEventListener("click", function() {
			zoneGame['pendu'].innerHTML="";		// Efface dessin pendu
			wordToFind = seekWord();
			startGame(wordToFind);	
		});
	} else {
		buttonContinue.addEventListener("click", function() {
			zoneGame['pendu'].innerHTML="";		// Efface dessin pendu
			playerChoiceAWord();
		});
	}
}



// ********************************************************************************
// ******  Actions des différents boutons permanents (RESET et FONDS ECRAN) *******
// ********************************************************************************


buttonsGame['reset'].addEventListener("click", function() {
	zoneGame['pendu'].innerHTML="";					// Efface dessin pendu
	zoneGame['game'].style.display = "none";		// Efface la zone de jeu (n'apparaît qu'après choix du jeu effectués)
	zoneGame['start'].style.display = "none";		// Efface zone saisie mot (n'apparaît que si player vs human)
	zoneGame['gameChoices'].style.display = "none";				// --> Efface affichage zone choix de jeux
	zoneGame['playersNames'].style.display = "none";			// --> Efface écran saisie noms joueurs

	zoneGame['gameChoices'].style.display = "";		// Affiche choisir un jeu
	initPlayers();
	displayInfosPlayers();
	initGame();
});


buttonsGame['background1'].addEventListener("click", function() {
	let varBg = document.getElementsByTagName('body');
	varBg[0].style.backgroundImage = "url(images/manoir01.jpg";
});

buttonsGame['background2'].addEventListener("click", function() {
	let varBg = document.getElementsByTagName('body');
	varBg[0].style.backgroundImage = "url(images/manoir02.jpg";
});

buttonsGame['background3'].addEventListener("click", function() {
	let varBg = document.getElementsByTagName('body');
	varBg[0].style.backgroundImage = "url(images/manoir03.jpg";
});



// **********************************************
//-- *****  Affichages du jeu ***** --
// **********************************************


//----------------------------------------------------
//--  Affichage infos joueurs --
//----------------------------------------------------

function displayInfosPlayers() {
	zoneGame['scores'].innerHTML="";				// Efface l'affichage précédent
	// let temp="Infos joueurs<br/><br/>";
	let temp="";

	for (let i=0; i<statsPlayers.length; i++) {
		if (statsPlayers[i][0] != "computer") {
			temp += "<span class='playerName'>"+statsPlayers[i][0]+"</span><br/>";
			temp += "<span class='winGameScore'>Score : "+statsPlayers[i][1]+"</span><br/>";
			temp += "<span class='playerName'>Parties gagnées / perdues</span><br/>";
			temp += "<span class='greenParties'>"+statsPlayers[i][3]+"</span> / ";
			temp += "<span class='orangesParties'>"+statsPlayers[i][4]+"</span><br/><br/>";
		}
	}

	zoneGame['scores'].innerHTML=temp;	
}



//----------------------------------------------------
//--  Affichage tableau lettres alphabet --
//----------------------------------------------------
function displayAlphabet() {		
	let temp = "";
	buttonsLetters=[];						// Vide l'ancien tableau des boutons de l'alphabet
	zoneGame['alphabet'].innerHTML="";		// Efface l'alphabet précédent


	for (let i=0; i<26; i++) {				// Parcours tableau alphabet

		if (tableAlpha[i][1] == 0) {			// Si lettre non essayée
			zoneGame['alphabet'].insertAdjacentHTML('beforeend', '<div class="caseAlphabetEmpty" id="buttonP'+i+'">'+tableAlpha[i][0]+'</div>');
			let temp2 = document.getElementById('buttonP'+i);
			buttonsLetters.push(temp2);			// Remplit tableau avec les "lettres boutons" de l'alphabet

		} else if (tableAlpha[i][1] == 1) {		// Si lettre essayée et mauvaise, affichage en rouge
			zoneGame['alphabet'].insertAdjacentHTML('beforeend', '<div class="caseAlphabetTryRed">'+tableAlpha[i][0]+'</div>');
			buttonsLetters.push("false");		// Lettre non cliquable (déjà essayée)

		} else if (tableAlpha[i][1] == 2) {		// Si lettre essayée et bonne, affichage en vert
			zoneGame['alphabet'].insertAdjacentHTML('beforeend', '<div class="caseAlphabetTryGreen">'+tableAlpha[i][0]+'</div>');
			buttonsLetters.push("false");		// Lettre non cliquable (déjà essayée)
		}
	}
	letterInAlphabet();
}


//----------------------------------------------------
//--  Créer un événement pour chaque lettre de l'alphabet --
//----------------------------------------------------
function letterInAlphabet() {			
	for (let i=0; i<buttonsLetters.length; i++) {			// Parcours le tableau de l'alphabet
		if (buttonsLetters[i] != "false") {					// Si lettre alphabet n'est pas encore jouée, crée un bouton cliquable
			buttonsLetters[i].addEventListener("click", function() {
				let letterTry = tableAlpha[i][0].toLowerCase();
				testLetterTry(letterTry);
			});
		}
	}
}

//----------------------------------------------------
//--  Affichage du mot à trouver --
//----------------------------------------------------
function displayWordTry() {
	zoneGame['word'].innerHTML="";				// Efface l'affichage précédent
	for (let i=0; i<wordTry.length; i++) {
		if (wordTry[i]=="-") {
			zoneGame['word'].insertAdjacentHTML('beforeend', '<div class="caseTryEmpty">'+wordTry[i]+'</div>');
		} else {
			zoneGame['word'].insertAdjacentHTML('beforeend', '<div class="caseTryFind">'+wordTry[i]+'</div>');
		}
	}
}


//----------------------------------------------------
//--  Affichage du pendu --
//----------------------------------------------------
function affichePendu(numero) {
//	console.log("Numero pendu : "+numero)
	switch(numero) {
		case 0 :
			zoneGame['pendu'].insertAdjacentHTML('beforeend', '<img src="images/pendu01.png" class="pendu01">');
			break;
		case 1 :
			zoneGame['pendu'].insertAdjacentHTML('beforeend', '<img src="images/pendu02.png" class="pendu02">');
			break;
		case 2 :
			zoneGame['pendu'].insertAdjacentHTML('beforeend', '<img src="images/pendu03.png" class="pendu03">');
			break;
		case 3 :
			zoneGame['pendu'].insertAdjacentHTML('beforeend', '<img src="images/pendu04.png" class="pendu04">');
			break;
		case 4 :
			zoneGame['pendu'].insertAdjacentHTML('beforeend', '<img src="images/pendu05.png" class="pendu05">');
			break;
		case 5 :
			zoneGame['pendu'].insertAdjacentHTML('beforeend', '<img src="images/pendu06.png" class="pendu06">');
			break;
		case 6 :
			zoneGame['pendu'].insertAdjacentHTML('beforeend', '<img src="images/pendu07.png" class="pendu07">');
			break;
		case 7 :
			zoneGame['pendu'].insertAdjacentHTML('beforeend', '<img src="images/pendu08.png" class="pendu08">');
			break;
		case 8 :
			zoneGame['pendu'].insertAdjacentHTML('beforeend', '<img src="images/pendu09.png" class="pendu09">');
			break;
		case 9 :
			zoneGame['pendu'].insertAdjacentHTML('beforeend', '<img src="images/pendu10.png" class="pendu10">');
			break;
		case 10 :
			zoneGame['pendu'].insertAdjacentHTML('beforeend', '<img src="images/pendu11.png" class="pendu11">');
			break;
		default :
			break;
	}
}


// **********************************************
//-- *****  Initialisations ***** --
// **********************************************

function initGame() {
	// win = false;					// Etat du jeu
	lifes = 11;						// Nombre de vies
	lettersFind = 0;				// Nombre de lettres trouvées par le joueur
	findOk = false;
	wordTry=[];						// Tableau avec les essais du joueur
	stateGame = "start";

	//----------------------------------------------------
	//--  Initialisation du tableau lettres alphabet --
	//----------------------------------------------------
	tableAlpha = [];
	for (let i=65; i<91; i++) {
		tableAlpha.push([String.fromCharCode(i), 0]);
	}
}


function initPlayers() {
	statsPlayers = [];				// Stats des joueurs
	// 0 = Nom, 1 = score, 2 = nb parties, 3 = parties gagnées, 4 = perdues
	statsPlayers.push(["Joueur 1", 0, 0, 0, 0]);
	statsPlayers.push(["Joueur 2", 0, 0, 0, 0]);
	playerTurn = 0;			// Joueur 1 qui joue
}


function initMain() {

	//----------------------------------------------------
	//--  Initialisation du tableau boutons du jeu --
	//----------------------------------------------------
	buttonsGame['background1']=document.getElementById('buttonBg1');
	buttonsGame['background2']=document.getElementById('buttonBg2');
	buttonsGame['background3']=document.getElementById('buttonBg3');
	buttonsGame['reset']=document.getElementById('buttonRestart');	
	buttonsGame['giveWordToFind']=document.getElementById('buttonWordToFind');
	buttonsGame['computerGame']=document.getElementById('buttonComputerGame');
	buttonsGame['playerGame']=document.getElementById('buttonPlayerGame');
	buttonsGame['playersNames']=document.getElementById('buttonPlayersNames');	

	//----------------------------------------------------
	//--  Initialisation des zones du jeu --
	//----------------------------------------------------
	zoneGame['gameChoices']=document.getElementById('zoneGameChoices');
	zoneGame['start']=document.getElementById('zoneStart');
	zoneGame['game']=document.getElementById('zoneGame');
	zoneGame['alphabet']=document.getElementById('alphabet');
	zoneGame['word']=document.getElementById('wordLetters');
	zoneGame['pendu']=document.getElementById('cadrePendu');
	zoneGame['vies']=document.getElementById('lifes');
	zoneGame['infos']=document.getElementById('infoJoueur');
	zoneGame['gamePlay']=document.getElementById('zoneGamePlay');
	zoneGame['textLetters']=document.getElementById('displayTextLetters');
	zoneGame['scores']=document.getElementById('displayPlayersScores');
	zoneGame['playerName']=document.getElementById('playerName');
	zoneGame['playerNameWord']=document.getElementById('playerNameWord');
	zoneGame['playersNames']=document.getElementById('zonePlayersNames');

	//-----------------------------------------------------------------------
	//--  Mémorise la zone de recherche pour la réafficher en début de jeu --
	//-----------------------------------------------------------------------


//	memoZoneGamePlay = zoneGame['gamePlay'].innerHTML;


	//----------------------------------------------------
	//--  Initialisation mots ordinateur --
	//----------------------------------------------------
	// Il suffit de mettre un espace entre chaque mot pour en rajouter autant que souhaité. Attention, éviter les lettres accentuées !
	computerWordsInit="atre beau bete boxe brun cerf chez cire dame dent dock dodo drap dune emeu fado faux ibis jazz joli joue kaki logo loin long lune lynx mine mure ouie ours pion rhum ride rock seau test thym trou truc user vert yogi watt acces aimer aloes assez avion awale balai banjo barbe bonne bruit buche cache capot carte chien crane cycle ebene essai gifle honni jambe koala livre lourd maman moult noeud ortie peche poire pomme poste prune radar radis robot route rugby seuil taupe tenue texte tyran usuel valse acajou agneau alarme ananas angora animal arcade aviron azimut babine balade bonzai basson billet bouche boucle bronze cabane caiman cloche cheque cirage coccyx crayon garage gospel goulot gramme grelot guenon hochet hormis humour hurler jargon limite lionne menthe oiseau podium poulpe poumon puzzle quartz rapide seisme tetine tomate walabi whisky zipper abriter ballast baryton bassine batavia billard bretzel cithare chariot clairon corbeau cortege crapaud cymbale dentier djembe drapeau exemple fourmis grandir iceberg javelot jockey journal journee jouxter losange macadam mondial notable oxygene panique petrole poterie pouvoir renegat scooter senteur sifflet spirale sucette strophe tonneau trousse tunique ukulele vautour zozoter aquarium araignee arbalete archipel banquise batterie brocante brouhaha capeline clavecin cloporte debutant diapason gangster gothique hautbois herisson logiciel objectif paranoia parcours pastiche question quetsche scarabee scorpion symptome tabouret tomahawk toujours tourisme triangle utopique zeppelin accordeon ascenseur ascension aseptiser autoroute avalanche balalaika bilboquet bourricot brillance cabriolet contrario cornemuse dangereux epluchage feodalite forteresse gondolier graphique horoscope intrepide klaxonner mascarade metaphore narrateur peripetie populaire printemps quemander tambourin vestiaire xylophone acrostiche apocalypse attraction aventurier bouillotte citrouille controverse coquelicot dissimuler flibustier forestiere grenouille impossible labyrinthe maharadjah prudemment quadriceps soliloquer subjective baccalaureat abracadabra francophile pandemonium chlorophylle metallurgie metamorphose montgolfiere kaleidoscope conquistador conspirateur rhododendron qualification protozoaire quadrilatere zygomatique sorcellerie belligerant";

	// -- Place les mots de l'ordinateur dans un tableau (méthode split) - 293 mots

	computerWords = computerWordsInit.split(" ");

}


// ******************   THE END   ****************************


// Commentaires :
// Pour simplifier la programmation, j'ai créé un tableau associatif pour tous les boutons du jeu
// et un tableau associatif pour toutes les zones de jeu (tableau zoneGame).
// Pour ensuite afficher ou au contraire effacer les différents écrans, je fais juste
// appel au tableau avec le nom de la zone. 
// Plus qu'à appliquer un 
//			zoneGame['nom_de_la_zone'].style.display = "none"; --> pour la faire disparaître ou un
//			zoneGame['nom_de_la_zone'].style.display = ""; --> pour la faire apparaître
//
// Principe identique pour écrire les fonctions des boutons...
// 
//
// !!!!!!!!!!!!!!!!!!!!!!!!!!!
// ***** BUG PRISE DE TETE ***
// !!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// Des heures à chercher pourquoi certaines fonctions du programme étaient appelées plusieurs fois.
// Alors que la logique était "correcte"
// Impossible de trouver avec des console.log, à s'arracher les cheveux (heureusement, je crains pas
// grand chose de ce côté).
// En fait j'avais gardé des réflexes de programmation "linéaire" :
//			button machin, addEventListerner (click) {
//					if (click) {
//						fait telle chose;
//						nouveau button, addEventListerner (click) {
//							fait ceci ou cela;
//						};
//					};
//			};
//
//
// ET BIEN NON !!!!!
// Ce n'est pas la peine de mettre les addEventListener dans une logique conditionnelle du programme. De toute
// façon on ne peut cliquer dessus que s'ils sont affichés. Et en faisant ainsi ça les duplique à chaque appel de
// de la première fonction. D'où le comportement de mes variables.
// Il suffit de les sortir du test, et ça marche comme sur des roulettes... (et je suppose sans surcharger la mémoire
// vive de l'ordinateur).
//
//
//			button machin, addEventListerner (click) {
//				fait telle chose;
//			};
//
//			nouveau button, addEventListerner (click) {
//				fait ceci ou cela;
//			};
//
//
// Je sais pas si j'ai été très clair, mais c'est une philosophie importante de JS je pense...
// Pour plus d'infos, voir Grand Suprême Maître Flo... :-)
//
// Merci de votre attention !

// ******************   THE END OF THE END  ****************************



