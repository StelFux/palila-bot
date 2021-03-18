const Discord = require('discord.js');
const fs = require('fs');

const name = "canals";

const synthax = `${name} <action> <argument(s)>`;

const description = "Met en commun plusieurs channels dans des canaux";

const explication = `Cette commande permet de mettre en commun les messages de divers channels sur divers serveurs autour d'une meme thématique par exemple
Actions disponibles :
	- setCanal : inscrit ce channel dans un canal et le désincrit de l'ancien canal s'il existe
	- activateChannel : connecte ce channel au canal ou il est inscrit
	- desactivateChannel : déconnecte ce channel du canal ou il est inscrit
	- createCanal : créé un nouveau canal
	- seeChannelCanal : affiche a quel canal est connecté ce channel
	- disconnectChannel : déconnecte ce channel de tout canal
	- listCanal : renvoie la liste des canaux existants
`;

async function execute(message, args) {
	const config = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/config.json`));

	// on vérifie s'il y a des arguments
	if (!args[0])
		return message.channel.send(`Syntaxe incorret. \`${config.prefix}help ${name}\` pour plus d'informations.`).catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));

	// si le fichier de configuration du module canal n'existe pas, on le créé
	if (!fs.readdirSync(`./guilds/${message.guild.id}`).includes('canals_config.json')) {
		fs.writeFileSync(`./guilds/${message.guild.id}/canals_config.json`, JSON.stringify({}));
		log(`Création du fichier de configuration pour les canaux`, message);
	}

	// on récupère les configurations
	let partielGlobal = JSON.parse(fs.readFileSync('./config/canals_config.json'));
	let partielGuild = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/canals_config.json`));

	switch (args[0]) {
		// associe le channel à un canal
		case 'setCanal':

			// s'il n'y a pas de nom de canals ou un nom invalide, 
			if (!args[1] || !partielGlobal[args[1]]) {
				let listeCanal = "";

				for (let canal in partielGlobal) {
					listeCanal += ` - ${canal}\n`;
				}

				message.channel.send("Veuillez spécifier un canal pour ce channel").catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));

				const embed = new Discord.MessageEmbed()
					.setTitle("Liste des canaux disponibles")
					.setColor(0x1e80d6)
					.setDescription(listeCanal);

				return message.channel.send(embed).catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));
			}

			if (partielGuild[message.channel.name]) {
				let old_canal = partielGuild[message.channel.name].canal;
				partielGlobal[old_canal].splice(partielGlobal[old_canal].indexOf(message.channel.id), 1);
			}

			partielGuild[message.channel.name] = {
				activated: false,
				canal: args[1]
			}

			partielGlobal[args[1]].push(message.channel.id);

			log(`Ajout du channel au canal ${args[1]} par ${message.author.tag}`, message);

			message.channel.send("Ce channel fait désormais parti du canal " + args[1]).catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));

			break;
		case 'activateChannel':
			message.channel.send("Vous êtes connecté au canal " + partielGuild[message.channel.name].canal).catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error))
			partielGuild[message.channel.name].activated = true;
			break;
		case 'desactivateChannel':
			message.channel.send("Vous êtes déconnecté au canal " + partielGuild[message.channel.name].canal).catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error))
			partielGuild[message.channel.name].activated = false;
			break;
		case 'createCanal':
			if (!args[1]) {
				return message.channel.send("Veuillez préciser le nom du canal en argument").catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));
			}

			partielGlobal[args[1]] = [];

			log(`Creation du canal ${args[1]} par ${message.author.tag}`, message);

			message.channel.send("Canal " + args[1] + " créé !").catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));

			break;
		case 'seeChannelCanal':
			if (!partielGuild[message.channel.name])
				return message.channel.send("Ce channel n'est inscrit dans aucun canal").catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));

			return message.channel.send(`Ce channel est inscrit sur le canal ${partielGuild[message.channel.name].canal}`).catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));
		case 'disconnectChannel':
			if (!partielGuild[message.channel.name])
				return message.channel.send("Ce channel n'est inscrit dans aucun canal").catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));

			partielGlobal[partielGuild[message.channel.name].canal].splice(partielGlobal[partielGuild[message.channel.name].canal].indexOf(message.channel.id), 1);
			delete partielGuild[message.channel.name];
			log(`Suppression du channel des fichiers de configuration par ${message.author.tag}`, message);
			message.channel.send("Channel déconnecté").catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));
			break;
		case 'listCanal':
			let listeCanal = "";

			for (let canal in partielGlobal) {
				listeCanal += ` - ${canal}\n`;
			}

			const embed = new Discord.MessageEmbed()
				.setTitle("Liste des canaux disponibles")
				.setColor(0x1e80d6)
				.setDescription(listeCanal);

			return message.channel.send(embed).catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));
		default:
			return message.channel.send("Je ne connais pas cette opération...").catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));

	}

	fs.writeFileSync(`./config/canals_config.json`, JSON.stringify(partielGlobal));
	fs.writeFileSync(`./guilds/${message.guild.id}/canals_config.json`, JSON.stringify(partielGuild));

}

module.exports = { name, synthax, description, explication, execute };

function log(text, msg) {
	require('../utils').logStdout(text, name, msg ?? null);
}

function err(text, msg, err) {
	require('../utils').logError(text, name, msg ?? null, err ? err.stack : null)
}