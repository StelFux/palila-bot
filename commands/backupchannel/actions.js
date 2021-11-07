const { launchWorker } = require("../../services/services");

function init() {

}
function shutdown() {

}
async function execute(interaction, options) {

	let channel = options[0]?.channel;
	if(!channel)
		channel = interaction.channel;

	launchWorker("downloader", { channelId: channel.id });

	interaction.reply({ content: "Lancement de la backup en cours...", ephemeral: true });
}
async function middleware() {

}
async function configure() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
	configure,
};
