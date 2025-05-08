import * as R from "ramda";

// Fonction pour prétraiter le texte
const preprocessText = R.pipe(
    R.defaultTo(''),
    R.toLower,
    R.replace(/\s+/g, ' '),
    R.trim
);

// Fonction pour entraîner le modèle
const trainModel = R.pipe(
    preprocessText,
    R.split(''),
    R.addIndex(R.reduce)((model, char, index, letters) => {
        if (index < letters.length - 1) {
            const nextChar = letters[index + 1];
            const currentModel = R.defaultTo({}, model[char]);
            const nextModel = R.defaultTo(0, currentModel[nextChar]);
            return R.assocPath([char, nextChar], nextModel + 1, model);
        }
        return model;
    }, {})
);

// Fonction pour prédire la prochaine lettre
const predictNextChar = R.curry((model, currentChar) => {
    const nextChars = R.propOr({}, currentChar, model);
    const maxCount = R.pipe(
        R.values,
        R.reduce(R.max, -Infinity)
    )(nextChars);

    const predictedChar = R.pipe(
        R.toPairs,
        R.filter(([_, count]) => count === maxCount),
        R.map(R.head),
        R.head
    )(nextChars);

    return predictedChar || null;
});


// Exemple d'utilisation avec un texte plus long
const texte = `
Oh grand maître du JavaScript, ô sage des fonctions fléchées,
Toi qui domptes les promesses comme un torero dompte les taureaux,
Toi dont le charisme éclaire nos écrans plus que console.log(),
Permets-moi de t'exprimer ma profonde admiration.

Comme un bon vin de Bordeaux, ton enseignement se bonifie avec le temps,
Tes explications sont plus claires que le code de Ramda,
Et ta patience est plus infinie que les boucles while(true).

Tu transformes les concepts complexes en poésie algorithmique,
Tu fais danser les callbacks comme Fred Astaire sur un parquet,
Et tu rendrais presque sexy les closures et le this.

Quand tu expliques les prototypes, on dirait Mozart composant une symphonie,
Quand tu débogues, c'est Sherlock Holmes résolvant une énigme,
Et quand tu optimises du code, c'est Usain Bolt au 100 mètres.

Merci, ô grand gourou du JS,
De nous éclairer dans ce monde obscur des bugs et des undefined,
De nous apprendre à aimer les crochets et les accolades,
Et de nous montrer que même null et undefined ont leur charme.

Puisses-tu continuer à nous guider,
À travers les méandres des frameworks et des librairies,
Avec ton humour légendaire et ta pédagogie sans égale.

Car comme disait un célèbre développeur :
"Un bon professeur de JavaScript vaut mieux qu'un debugger,
Et ton charisme est la meilleure feature de l'ES6 !"

Avec toute ma gratitude,
Un élève ébloui par ton talent.
`;


// Entraînement du modèle
const model = trainModel(texte);
console.log("Modèle entraîné :", model);

// Exemple de prédiction
const currentChar = "l";
const nextChar = predictNextChar(model, currentChar);
console.log(`La prochaine lettre après "${currentChar}" est "${nextChar}"`);

