module.exports = {
	name: "score",
	description: "Affiche le score du joueur",
	explication: "",
	author: "Kayn",
	options: [{
		name: "personne",
		type: "USER",
		description: "Personne dont on veut voir le score",
		required: false,
		choices: [],
	}],
	intents: [],
	permissions: [],
	globalCommand: true,
};
