/********** REQUIRE **********/
const Discord = require('discord.js');
const Intents = Discord.Intents;
const Permissions = Discord.Permissions;


/********** INFORMATIONS **********/
const name = "ping";
const description = "Le bot est-il toujours vivant ?";
const explication = "";
const author = "Kayn";
const options = [];


/********** PERMISSIONS **********/
const intents = [];
const permissions = [
	Permissions.FLAGS.SEND_MESSAGES
];


/********** ACTIONS **********/
async function execute(interaction, options) {
	interaction.reply({ content: "Pong 🏓", ephemeral: true });
}

function init(client) { }

function shutdown(client) { }

/********** EXPORTS **********/
module.exports = { name, description, explication, author, options, intents, permissions, execute, init, shutdown }