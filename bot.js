const Discord = require('discord.js')
const client = new Discord.Client()

var fs = require('fs');
var shell = require('shelljs');
const execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var sleep = require('system-sleep');

var sstatus;
var leton;
var img;
var list = ['88.171.167.145','79.84.136.42']
var ip = 0;


////////////////////////////////////   Evenements   //////////////////////////////////////////////////////

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }
})

client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'auberge');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  var m = Math.floor(Math.random() * 6);
  switch (m) {
  case 0: channel.send(`Bienvenue sur ce serveur complétement génial, ${member}!`);
  break;
  case 1: channel.send(`Salut toi, ${member}!, qu'est-ce que tu fais là?`);
  break;
  case 2: channel.send(`Eh! t'es qui toi, ${member}?!`);
  break;
  case 3: channel.send(`Oublie pas de ramener des pizzas, ${member}.`);
  break;
  case 4: channel.send(`Laisse tes armes devant la porte, ${member}!`);
  break;
  case 5: channel.send(`Tu serais pas un joueur de Minecraft, ${member}?`);
  break;
  case 6: channel.send(`Bienvenue jeune padawan ${member}, que la force soit avec toi!`);
  break;
}
});

client.on('message', message => {
  // If the message is "what is my avatar"
  if (message.content === 'what is my avatar') {
    // Send the user's avatar URL
    message.reply(message.author.avatarURL);
  }
});


/*client.on('channelCreate', channel => {
	var str = channel.createdAt.toString();
	var res = str.substring(0, 24);
	try {channel.send("This new "+channel.type+" channel has been created the "+res+"!")} catch{}
	
});*/

client.on('ready', () => {
  client.user.setActivity('do !info for help')
})


////////////////////////////////////   Fonctions   //////////////////////////////////////////////////////


function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "status") {
        server(arguments, receivedMessage)
    } else if (primaryCommand == "on") {
        on(arguments, receivedMessage)
    } else if (primaryCommand == "stop") {
        stop(arguments, receivedMessage)
    } else if (primaryCommand == "42") {
        qd(arguments, receivedMessage)
    } else if (primaryCommand == "let") {
        let(arguments, receivedMessage)
    /*} else if (primaryCommand == "react") {
        react(arguments, receivedMessage)*/
    } else if (primaryCommand == "info") {
        info(arguments, receivedMessage)
    } else if (primaryCommand == "say") {
        say(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("I don't understand the command.")
    }
}

function react(arguments, receivedMessage) {
	receivedMessage.react(receivedMessage.guild.emojis.get('577139348252917770'))
	receivedMessage.react(receivedMessage.guild.emojis.get('577139334130434048'))
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("It looks like you might need help with " + arguments)
    } else {
        receivedMessage.channel.send("I'm not sure what you need help with.")
    }
}


function info(arguments, receivedMessage) {
	sstatus = fs.readFileSync('/home/pi/Discord_Bot/status.txt', 'utf8');
	if (sstatus == 'Piggy Island') { img = 'https://www.dropbox.com/s/76n0urs4985sc8j/piggy.png?dl=1'} else if (sstatus == 'Minecraft Survival') { img = 'https://www.dropbox.com/s/8cvulsp5hhe76jk/mc.png?dl=1'} else { img = ''}
	if (sstatus=="closed") sstatus = "fermé";
	if(fs.readFileSync('/home/pi/Discord_Bot/leton2.txt', 'utf8') == 1) {leton = "Tout le monde";} else {leton = "Les <@&572832307006668820>";}

	const info_mb = new Discord.RichEmbed()
		.setColor('#0099ff')
		.setTitle('Adresse Ip:')
		.setAuthor('Infos:')
		.setDescription('`'+list[ip]+'`')
		.setThumbnail(img)
		.addField('Le serveur est actuellement: ',sstatus, true)
		.addField('Ceux qui peuvent ouvrir le serveur Minecraft Survival sont:', leton, true)
		.addField('Commandes disponibles:', '`!on 1`, `!on 2`, `!stop`, `!status`, `!info` pour afficher ce message, `!let yes` ou `!let no` et `!say [arguments]` (pour les <@&572832307006668820>) et `!help` (qui sert à rien)', true)
		.setTimestamp()
		.setFooter('A Bot', img);


	//receivedMessage.channel.send("__Infos:__\n• Le serveur est actuellement "+sstatus+".\n• Les commandes disponibles sont\n`!on 1`, `!on 2`, `!stop`, `!status`, `!info` pour afficher ce message, `!let yes` ou `!let no` et `!say [arguments]` (pour les @Aubergiste) et `!help` (qui sert à rien).\n• "+leton+".\n• L'adresse ip est `88.171.167.145`.")
	receivedMessage.channel.send(info_mb)
}


function server(arguments, receivedMessage) {
    let product = 1
    sstatus = fs.readFileSync('/home/pi/Discord_Bot/status.txt', 'utf8');
    receivedMessage.channel.send("The server is actually "+sstatus+".")
}

function on(arguments, receivedMessage) {
	let product = 1
	
	if (arguments == 1) {

		if (fs.readFileSync('/home/pi/Discord_Bot/status.txt', 'utf8') != 'Piggy Island') {
			st();
			sleep(15*1000);
			receivedMessage.channel.send("Launching Piggy Island...")
			execute('xterm -e /home/pi/Desktop/start_Piggy.sh')
			receivedMessage.channel.send("Piggy Island Launched!")
			execute('printf "Piggy Island" > /home/pi/Discord_Bot/status.txt')
			sstatus = "Piggy Island";
	
		} else {
			receivedMessage.channel.send("The server is already Piggy Island!")
		}
	
	} else if (arguments == 2) {
			
		if (fs.readFileSync('/home/pi/Discord_Bot/status.txt', 'utf8') != 'Minecraft Survival') {
	
			if (receivedMessage.member.roles.some(r=>["Aubergiste", "moi"].includes(r.name)) == true || fs.readFileSync('/home/pi/Discord_Bot/leton2.txt', 'utf8') == 1) {
				st();
				sleep(15*1000);
				receivedMessage.channel.send("Launching Minecraft Survival...")
				execute('xterm -e /home/pi/Desktop/start_MS.sh')
				receivedMessage.channel.send("Minecraft Survival Launched!")
				execute('printf "Minecraft Survival" > /home/pi/Discord_Bot/status.txt')
				sstatus = "Minecraft Survival";
			} else {
				receivedMessage.channel.send("You dont have the permission to do that!")
			}
	
		} else {
			receivedMessage.channel.send("The server is already Minecraft Survival!")
		}

	} else {
		receivedMessage.channel.send("Your arguments are not valids, try `!on 1` or `!on 2`")
	}

}

function stop(arguments, receivedMessage) {
	let product = 1
	st();
	receivedMessage.channel.send("Server stopped")
	sstatus = "closed";

}

function execute(command) {
  exec(command, (err, stdout, stderr) => {
    process.stdout.write(stdout)
  })
}

function qd(arguments, receivedMessage) {
	receivedMessage.channel.send("It is the answer to the Ultimate Question of Life, the Universe, and Everything")
}

function let(arguments, receivedMessage) {
	if (receivedMessage.member.roles.some(r=>["Aubergiste", "moi"].includes(r.name)) == true) {
	if (arguments == 'yes') {
	execute('printf "1" > /home/pi/Discord_Bot/leton2.txt')
	receivedMessage.channel.send("Le serveur a été mis à jour.")

	} else if (arguments == 'no') {
	execute('printf "0" > /home/pi/Discord_Bot/leton2.txt')
	receivedMessage.channel.send("Le serveur a été mis à jour.")
	
	} else {
	receivedMessage.channel.send("Arguments non valides.")
	}
	
} else {
	receivedMessage.channel.send("Vous n'avez pas la permission d'éxecuter cette commande.")
}
}

function st() {

  try {
	execSync('xdotool search start_Piggy.sh windowactivate type stop', { encoding: 'utf-8' });
	execSync('xdotool search start_Piggy.sh windowactivate key Return', { encoding: 'utf-8' });
  } catch{}
	try {
	execSync('xdotool search start_MS.sh windowactivate type stop', { encoding: 'utf-8' });
	execSync('xdotool search start_MS.sh windowactivate key Return', { encoding: 'utf-8' });
  } catch{}
}



function say(arguments, receivedMessage) {

	if (receivedMessage.member.roles.some(r=>["Aubergiste", "moi"].includes(r.name)) == true || fs.readFileSync('/home/pi/Discord_Bot/leton2.txt', 'utf8') == 1) {
	execute('echo say '+arguments+' > /home/pi/Discord_Bot/ttw.txt')
  try {	
	execSync('xdotool search  start_Piggy.sh windowactivate type --file /home/pi/Discord_Bot/ttw.txt', { encoding: 'utf-8' });
	execSync('xdotool search start_Piggy.sh windowactivate key Return', { encoding: 'utf-8' });
  } catch{}
  try {	
	execSync('xdotool search  start_MS.sh windowactivate type --file /home/pi/Discord_Bot/ttw.txt', { encoding: 'utf-8' });
	execSync('xdotool search start_MS.sh windowactivate key Return', { encoding: 'utf-8' });
  } catch{}


	} else {
	receivedMessage.channel.send("You dont have the permission to do that!")
	}
}


//ZONE DES COMMANDES DE TEST








//FIN DE ZONE DE TEST









bot_secret_token = "héhé c'est secret ;)"

client.login(bot_secret_token)