require('dotenv').config()
const fs = require('node:fs');
const path = require('node:path');

const { Client, GatewayIntentBits, Events, Collection } = require('discord.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Slash Commands Section
//#region Slash Commands
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	
	const command = client.commands.get(interaction.commandName);
	
	if (!command) return;
	
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
//#endregion

// Exclamation mark commands
//#region Exclamation commands
client.commands = new Collection()

const commandFiles = fs.readdirSync('./exclamation-mark-commands/commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./exclamation-mark-commands/commands/${file}`)
	client.commands.set(command.name.toLowerCase(), new command())
}

const exclamationPrefix = '!'

client.on('messageCreate', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return

	const args = message.content.slice(prefix.length).trim().split(/ +/)
	const commandName = args.shift().toLowerCase()
	const command = client.commands.get(commandName)

	if (!command) return

	try {
		command.execute(message, args)
	} catch (err) {
		console.error(err)
		message.reply('There was an error trying to execute that command!')
	}
})
//#endregion

// DC MAIN
//#region Discord Main
client.once(Events.ClientReady, () => {
    UpdatePresence();
    console.log('Bot is online!');
})

function UpdatePresence() {
  client.user.setPresence({ activities: [{ name: 'Managing NTE', type: 4}], status: 'online' })
}

// When user joins the server for first time
client.on(Events.GuildMemberAdd, (member) => {
	const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome')
	if (welcomeChannel) {
		welcomeChannel.send(`Welcome to the server, ${member}!`)
	}
})

client.login(process.env.CLIENT_TOKEN)
//#endregion