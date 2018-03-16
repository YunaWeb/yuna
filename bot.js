const Discord = require("discord.js");
const { Client, Util } = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const opus = require('opusscript');
const ffmpeg = require('ffmpeg');
const prefix = "y!";

const client = new Client({ disableEveryone: true});
const bot = new Discord.Client()

const youtube = new YouTube(process.env.GOOGLE_API_KEY);

const queue = new Map();

client.on("ready", () => {
  console.log(`${client.user.username} is ready!`);
  console.log("INVITE: https://discordapp.com/oauth2/authorize?client_id=417714974144724992&scope=bot&permissions=2146958591")
});

client.on('ready', () => {
  client.user.setActivity('Nepupon.osu! | y!help', {type: 1})
})

client.on('guildDelete', guild => {
  console.log(`[Bot Log] I have left ${guild.name} at ${new Date()}`);
});

client.on('guildCreate', guild => {
  console.log(`[Bot Log] I have joined ${guild.name} at ${new Date()}`);
});

client.on('warn', console.warn);

client.on('error', console.error);

client.on('message', async message => { // eslint-disable-line
	if (message.author.bot) return undefined;
	if (!message.content.startsWith(prefix)) return undefined;
	let messageArray = message.content.split(" ");

	let args = messageArray.slice(1);
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(message.guild.id);

	let command = message.content.toLowerCase().split(' ')[0];
	command = command.slice(prefix.length)

//userinfo
	if(command === `userinfo`) {
		let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");

		let embed = new Discord.RichEmbed()
      .setDescription(`**Userinfo from: ${member.user.tag}**`)
      .setThumbnail(`${member.user.avatarURL}`)
      .addField("***User ID:***", member.user.id)
      .setColor(Math.floor(Math.random() * 16777214) + 1,)
      .addField("***Nickname:***", member.user.username)
      .addField("***Playing:***", member.user.presence.game)
      .addField("***Status:***", member.user.presence.status)
      .addField("***Account Created At:***", member.user.createdAt)
      .setFooter(`Userinfo created by Yuna`);
			

			message.channel.sendEmbed(embed);

			return;
    
    console.log(`[Command Log] ${message.author.username} has used the userinfo Command!`)
	}

  //serverinfo
  const server = message.guild

  if(command === `serverinfo`) {
    
    let embed = new Discord.RichEmbed()
      .setColor(Math.floor(Math.random() * 16777214) + 1,)
      .setDescription(`**Serverinfo:**`)
      .setThumbnail(`${message.guild.iconURL}`)
      .addField("***Server ID:***", server.id)
      .addField("Owner👑:", server.owner)
      .addField("***Region:***", server.region)
      .addField("***Full Name:***", server.name)
      .addField("***Server Created At:***", server.createdAt)
      .setFooter(`Serverinfo from an awesome Server!`);
      

      message.channel.sendEmbed(embed);

      return;
    
    console.log(`[Command Log] ${message.author.username} has used the serverinfo Command!`)
  }

  //Mute
	if(command === `mute`) {
		if(!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.sendMessage("You don't have the Perms to execute this Command!")

			let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
			if(!toMute) return message.channel.sendMessage("You must mention a User!");

			if(toMute.id === message.author.id) return message.channel.sendMessage("You cannot mute yourself! ...idiot 😂")
			if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.sendMessage("You can't mute a member who has a higher role as yours!")

			let role = message.guild.roles.find(r => r.name === "Muted!");
			if(!role) {
				try{
				role = await message.guild.createRole({
					name: "Muted!",
					color: "#ff0000",
					permissions: []
				});

				message.guild.channels.forEach(async (channel, id) => {
					await channel.overwritePermissions(role, {
						SEND_MESSAGES: false,
						ADD_REACTIONS: false,
						VOICE_CONNECT: false,
						VOICE_SPEAK: false
					});
				});
			} catch(e) {
				console.log(e.stack);
			}
		}
		
		if(toMute.roles.has(role.id)) return message.channel.sendMessage("This User is already Muted!");

		await toMute.addRole(role);
		let embed = new Discord.RichEmbed()
      .setDescription(`**I have Muted the User!**`)
      .setColor(0xCC0000)

      message.channel.sendEmbed(embed);

			return;
    
    console.log(`[Command Log] ${message.author.username} has used the mute Command!`)
	}
  
  //ping
   if(command === `ping`) {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong!:ping_pong: ${m.createdTimestamp - message.createdTimestamp}ms.`);
     
     console.log(`[Command Log] ${message.author.username} has used the Ping Command!`)
  }
  
  //dm
  if(command === `dm`) {
	if(message.author.bot) return;
let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");

const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
   member.send(`I was forced from ${message.author} to dm you and send this:\n${sayMessage}`);
    
    console.log(`[Command Log] ${message.author.username} has used the dm Command!`)
}
  
if(command === `shutdown`) {
  if(message.author.id === "398167269764759583") {
    let embed = new Discord.RichEmbed()
      .setDescription(`**Yuna-Bot is shutting down...**`)
      .setColor(Math.floor(Math.random() * 16777214) + 1,)
      message.channel.sendEmbed(embed);
    client.destroy();
    console.log("[Bot Log] I'm shutting down!")
  }
  else {
  message.channel.send(`You don't have the Perms to use this command!`);
  }
}

//membercount
if(command === `members`) {
let embed = new Discord.RichEmbed()
      .setDescription(`There are currently **${message.guild.memberCount}** Members in this Server!`)
      .setColor(Math.floor(Math.random() * 16777214) + 1,)

      message.channel.sendEmbed(embed);
}
  
//say
if(command === `say`) {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
    
    console.log(`[Command Log] ${message.author.username} has used the say Command!`)
  }
	
//reverse
if(command === 'reverse') {
  if(args.length === 0) {
        return message.channel.send("Sorry but something went wrong!");
    }
    var text = args.join(" ");
    text = text.split("").reverse().join("");
    message.channel.send(`${text}`)
}

//vote
if(command === 'vote') {
  const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
  let embed = new Discord.RichEmbed()
      .setTitle('**VOTE:**')
      .setDescription(`${sayMessage}`)
      .setColor(Math.floor(Math.random() * 16777214) + 1,)
      message.channel.sendEmbed(embed)
            .then(function (message) {
              message.react("👍")
              message.react("👎")
            }).catch(function() {
             });
}

//id
if(command === `id`) {
  let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    let embed = new Discord.RichEmbed()
      .setDescription(`The ID from **${member.user.tag}** is: **${member.user.id}**`)
      .setColor(Math.floor(Math.random() * 16777214) + 1,)
      message.channel.sendEmbed(embed);
}

//waifu
    if(command === `waifu`) {
        const randomnumber = Math.floor((Math.random() * 10) + 1);
        if (randomnumber === 1)
            message.channel.send("https://cdn.discordapp.com/attachments/419580009099821059/419589271939448852/waifushit.jpg").then(message.channel.send("Your waifu is shit.. **1/10** :cry:"));
         else if (randomnumber === 2)
            message.channel.send("https://cdn.discordapp.com/attachments/419418987273650176/419594101961523200/nope.jpg").then(message.channel.send("Nope :("));
         else if (randomnumber === 3)
            message.channel.send("Your waifu is pretty shit **3/10** ");
         else if (randomnumber === 4)
          message.channel.send("https://cdn.discordapp.com/attachments/419418987273650176/419591738177355777/waifuokay.jpg").then(message.channel.send("Your waifu is Okay! 4/10"));
         else if (randomnumber === 5)
          message.channel.send("https://cdn.discordapp.com/attachments/419418987273650176/419592274268258330/average.jpg").then(message.channel.send("Average Waifu."));
         else if (randomnumber === 6)
          message.channel.send("https://cdn.discordapp.com/attachments/419418987273650176/419592679920369674/notbad.jpg").then(message.channel.send("Hey, not bad! 6/10"));
         else if (randomnumber === 7)
          message.channel.send("https://cdn.discordapp.com/attachments/419418987273650176/419591114006331402/images.jpg").then(message.channel.send("Nice waifu 7/10"));
         else if (randomnumber === 8)
          message.channel.send("https://cdn.discordapp.com/attachments/419580009099821059/419597244228960257/prettynice.jpg").then(message.channel.send("Pretty nice Waifu! :O"));
         else if (randomnumber === 9)
          message.channel.send("https://cdn.discordapp.com/attachments/419418987273650176/419593532517646348/best.jpg").then(message.channel.send("Best waifu"));
         else if (randomnumber === 10)
          message.channel.send("https://cdn.discordapp.com/attachments/419418987273650176/419593664013008916/error.jpg").then(message.channel.send("**ERROR** Waifu is rating off the scale"));
    }

//warn
if(command === `warn`) {
  if(message.author.bot) return;
  if(!message.member.hasPermission("MOVE_MEMBERS")) return message.channel.sendMessage("You don't have the Perms to execute this Command!")
let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
      else;
const sayMessage = args.join(" "); 

   member.send(`**⛔WARNING MESSAGE⛔**\nYou are warned by ${message.author.username}\n\nBecause: ${sayMessage}`);
   message.channel.sendMessage(`Warning successfully sent to ${member}!`)
  
  console.log(`[Command Log] ${message.author.username} has used the warn Command!`)
}

//clapify
if(command === `clapify`) {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(`:clap: ${sayMessage} :clap:`);
  
  console.log(`[Command Log] ${message.author.username} has used the clapify Command!`)
  }
  
 //cookie
  if(command === `cookie`) {
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");

    message.channel.sendMessage(`:cookie:You gave ${member} a cookie! :cookie:`);
    member.send(`You recieved from ${message.author} a cookie!:cookie:`);
    
    console.log(`[Command Log] ${message.author.username} has used the cookie Command!`)
  }

//bigtext
if(command === `bigtext`) {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(`**${sayMessage}**`);
  
  console.log(`[Command Log] ${message.author.username} has used the bigtext Command!`)
  }

//anisearch
if(command === `anime`) {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(`https://animestreams.tv/${sayMessage}/`);
  
  console.log(`[Command Log] ${message.author.username} has used the anime Command!`)
  }

//door
if(command === `door`) {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(`${sayMessage}:point_right::door:`);
  
  console.log(`[Command Log] ${message.author.username} has used the door Command!`)
  }
  
//urlshorten
const shorten = require('isgd');

if(command === `shorten`) {
  if (!args[0]) return message.channel.send('**Proper Usage: n!shorten <URL> [title]**')
  if (!args[1]) {
    shorten.shorten(args[0], function(res) {
      if (res.startsWith('Error:')) return message.channel.send('**Please enter a valid URL**');
      message.channel.send(`**<${res}>**`);
    })
  } else {
    shorten.custom(args[0], args[1], function(res) {
      if (res.startsWith('Error:')) return message.channel.send(`**${res}**`);
      message.channel.send(`**<${res}>**`);
    })
  }
  console.log(`[Command Log] ${message.author.username} has used the shorten Command!`)
}
  
//avatar
if(command === `avatar`) {
let member = message.mentions.members.first();
    if(!member)
      return message.channel.send({embed: {
    color: Math.floor(Math.random() * 16777214) + 1,
    title: "**This is your Avatar:**",
    url: `${message.author.avatarURL}`,
    image: {
      url: `${message.author.avatarURL}`
    },
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: `Avatar from ${message.author.tag}`
    }
  }
});

  message.channel.send({embed: {
    color: Math.floor(Math.random() * 16777214) + 1,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: `**This is the Avatar from: ${member.user.tag}**`,
    url: `${member.user.avatarURL}`,
    image: {
      url: `${member.user.avatarURL}`
    },
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: `Avatar from ${member.user.tag}`
    }
  }
});
  
  console.log(`[Command Log] ${message.author.username} has used the avatar Command!`)
}

//kick
if(command === `kick`) {
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("You don't have the Perms to execute this Command!")
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.channel.sendMessage("Sorry, but it seems like I can´t kick this user!");
    
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please type in a reason for the kick!");
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    let embed = new Discord.RichEmbed()
      .setDescription(`**${member.user.tag} has been successfully kicked!**`)
      .setColor(Math.floor(Math.random() * 16777214) + 1,)
      .addField("***Kicked by:***", message.author.username)
      .addField("***Because:***", `${reason}`)
      .setFooter(`User kicked by Yuna`);

      message.channel.sendEmbed(embed);
  
  console.log(`[Command Log] ${message.author.username} has used the kick Command!`)

  }

//invite
if(command === `invite`) {
	if (message.author.bot) return;
	message.channel.sendMessage("Invite Link for me:\n\nhttps://discordapp.com/oauth2/authorize?client_id=415891116517490698&scope=bot&permissions=2146958591")
  
  console.log(`[Command Log] ${message.author.username} has used the invite Command!`)
}

//about
if(command === `about`) {
message.channel.send({embed: {
    color: 3447003,
    title: "**Yuna**",
    description: "***A Bot to have fun with!***",
    fields: [{
        name: "Why Yuna ?",
        value: "Yuna is 24/7 Online [Except for maintenance]\nThe bot has many features\nYou can almost do anything with her :smile:"
      },
      {
        name: "Need Help or just want to Support the Bot?",
        value: "Join now the Official Yuna [Discord-Server](https://discordapp.com/invite/N3XHxm7) and be part of the community!"
      },
      {
        name: "Upvote for Yuna!",
        value: "You can upvote Yuna here :point_right: [Upvote Now](https://discordbots.org/bot/415891116517490698) or here: [Upvote Now](https://bots.discord.pw/bots/415891116517490698)"
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: bot.user.avatarURL,
      text: "About Yuna"
    }
  }
});
  
  console.log(`[Command Log] ${message.author.username} has used the about Command!`)
}

//ban
if(command === `ban`) {
    if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("You don't have the Perms to execute this Command!")
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server!");
    if(!member.bannable) 
      return message.reply("Sorry, but it seems like I can´t ban this user!");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please type in a reason for the ban!");
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    let embed = new Discord.RichEmbed()
      .setDescription(`**${member.user.tag} has been successfully banned!**`)
      .setColor(Math.floor(Math.random() * 16777214) + 1,)
      .addField("***Banned by:***", message.author.username)
      .addField("***Because:***", `${reason}`)
      .setFooter(`User banned by Yuna`);

      message.channel.sendEmbed(embed);
  
  console.log(`[Command Log] ${message.author.username} has used the ban Command!`)
  }
  
  //unban
if(command === `unban`) {
    if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("You don't have the Perms to execute this Command!")

  bot.unbanAuth = message.author;
  let user = args[0];
  if (!user) return message.reply('You must supply a User Resolvable, such as a user id.');
  message.guild.unban(user);
  let embed = new Discord.RichEmbed()
      .setDescription(`**${user} has been successfully unbanned!**`)
      .setColor(Math.floor(Math.random() * 16777214) + 1,)
      .addField("***Unbanned by:***", message.author.username)
      .setFooter(`User unbanned by Yuna`);
      

      message.channel.sendEmbed(embed);
};
  
  //clear
    if(command === `clear`) {
      if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("You don't have the Perms to execute this Command!")
        async function clear() {
            message.delete().catch(O_o=>{});
            }
            if (isNaN(args[0])) {
                message.channel.send('Please provide the number of messages to delete!');

                return;
            }

            const fetched = await message.channel.fetchMessages({limit: args[0]});

            message.channel.bulkDelete(fetched)
                .catch(error => message.channel.send(`Error: ${error}`));
      
      console.log(`[Command Log] ${message.author.username} has used the clear Command!`)

        }

//clearall
if(command === `clearall`) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("You don't have the Perms to execute this Command!")
    
    const deleteCount = parseInt(args[0], 10);
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 1000)
      return message.reply("Please provide the number of messages to delete!");
    
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  
  console.log(`[Command Log] ${message.author.username} has used the clearall Command!`)
  }

//createembed
if(command === `embed`) {

    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send({embed: {
  color: Math.floor(Math.random() * 16777214) + 1,
  description: `${sayMessage}`
}});
  
  console.log(`[Command Log] ${message.author.username} has used the embed Command!`)
}

//help
if(command === `help`) {
  let pages = ['You can view all commands if you swipe!\n**Hint: You can use the Emojis to swipe!**', 'y!ban : Bans the mentioned User from the Server\ny!unban : Unbans the specified User from the Server\ny!kick : Kicks the mentioned User from the Server\ny!mute : Mutes the mentioned User\ny!unmute : Unmutes the mentioned User\ny!clearall : Clears the whole Channel\ny!clear : Deletes a amount of Messages\ny!warn : Sends a warning to someone\ny!softban : Bans and Unbans the mentioned User from the Server', 'y!help : Shows all commands from Yuna\ny!invite : Creates a invite link for Yuna\ny!userinfo : Shows some infos about the mentioned User\ny!serverinfo : Shows some infos about the Server\ny!about : Shows some infos about the Bot\ny!ping : Pong! Shows the latency\ny!shorten : Shorten a link\ny!members : Shows how many Members in the Server are\ny!id : Shows the ID from someone\ny!vote : Vote something', 'y!say : Make the Bot say something\ny!reverse : Reverse a text\ny!clapify : Clapify a text\ny!bigtext : Make the text BIGGER\ny!door : Send something out the door\ny!embed : Creates an embed\ny!8ball : Ask the 8Ball a Question\ny!roast : Roast someone\ny!img : Sends a random Picture\ny!gif : Sends a random gif\ny!cookie : Give someone a cookie\ny!coinflip : Flip a coin\ny!waifu : Rate your Waifu', 'y!play : Plays a Song from YouTube\ny!skip : Skips the current Song\ny!stop : Stops the current Song/Queue\ny!volume : Sets the Volume\ny!playing : Shows what is currently played\ny!queue : Shows the Queue\ny!pause : Pauses the current Song\ny!resume : Resumes the paused Song', 'y!yunas : Give someone some yunas\ny!daily : Get your Daily Reward\ny!balance : Shows how much money someone has'];
  let titles = ['Commands from Yuna', 'Moderation:', 'Information:', 'Fun:', 'Music:', 'Currency:']

  let page = 1;
 
  const embed = new Discord.RichEmbed()
    .setColor(0xffffff)
    .setFooter(`Page ${page} of ${pages.length}`)
    .setDescription(pages[page-1])
    .setTitle(titles[page-1])
 
  message.channel.send(embed).then(msg => { 
    msg.react('⏪').then( r => {
      msg.react('⏩')
     
      const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
      const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;
     
      const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 });
      const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 });
     
      backwards.on('collect', r => {
        if (page === 1) return;
        page--;
        embed.setDescription(pages[page-1]);
        embed.setTitle(titles[page-1]);
        embed.setFooter(`Page ${page} of ${pages.length}`);
        msg.edit(embed)
      })
     
      forwards.on('collect', r => {
        if (page === pages.length) return;
        page++;
        embed.setDescription(pages[page-1]);
        embed.setTitle(titles[page-1]);
        embed.setFooter(`Page ${page} of ${pages.length}`);
        msg.edit(embed)
      })
   
    })
 
  })
 }

//8ball
function doMagic8BallVoodoo() {
    var rand = ['Yes', 'No', 'Why are you even trying?', 'What do you think? NO', 'Maybe', 'Never', 'Yep', 'Let me think.....uhm NO.'];

    return rand[Math.floor(Math.random()*rand.length)];
}

if(command === `8ball`)
{
    message.reply('Your anwser is: ' + doMagic8BallVoodoo());
  
  console.log(`[Command Log] ${message.author.username} has used the 8ball Command!`)
}

//roast
function doMagic8BallVoodooroast() {
    var roast = ['Do you know how long it takes for your mother to take a crap? Nine months.', 'Id slap you, but shit stains.', 'I’m jealous of all the people that havent met you!', 'Youre so ugly you scare the shit back into people.', 'Youre so ugly, when you got robbed, the robbers made you wear their masks.', ' I can explain it to you, but I cant understand it for you.', 'You bring everyone a lot of joy, when you leave the room.', 'What are you going to do for a face when the baboon wants his butt back?'];

    return roast[Math.floor(Math.random()*roast.length)];
}

if(command === `roast`) {
	let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server!");

    await message.channel.sendMessage(`${member.user} ` + doMagic8BallVoodooroast());
  
  console.log(`[Command Log] ${message.author.username} has used the roast Command!`)
}
  
//coinflip
function doMagic8BallVoodoocoin() {
    var coin = ['**HEADS**', '**TAILS**'];

    return coin[Math.floor(Math.random()*coin.length)];
}

if(command === `coinflip`) {
    await message.channel.sendMessage(`***${message.author.username}*** tossed a coin and got ` + doMagic8BallVoodoocoin());
  
  console.log(`[Command Log] ${message.author.username} has used the coinflip Command!`)
}

//yunas
if(command === `yunas`) {
  let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    let neps = args.slice(1).join(' ');
    if(!neps)
      return message.reply("Please type in the amount of neps!");
  message.channel.sendMessage(`:dollar: You gave ${member.user} ${neps} neps! :dollar:`)
  
  console.log(`[Command Log] ${message.author.username} has used the neps Command!`)
  }

//sendgif
function doMagic8BallVoodoogif() {
    var gif = ['https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fgif7.gif?1518856490228', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fgif1.gif?1518856490753', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fgif2.gif?1518856490766', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fgif4.gif?1518856491920', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fgif5.gif?1518856492069', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fgif9.gif?1518856492410', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fgif0.gif?1518856492580', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fgif6.gif?1518856494069', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fgif3.gif?1518856494249', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fgif8.gif?1518856500723'];

    return gif[Math.floor(Math.random()*gif.length)];
}

if(command === `gif`) {
message.channel.send(`Awesome Gif Incoming! :smile:` + doMagic8BallVoodoogif())
  
  console.log(`[Command Log] ${message.author.username} has used the gif Command!`)
}

//sendimg
function doMagic8BallVoodooimg() {
    var img = ['https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg4.jpg?1518856108674', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg13.jpg?1518856108815', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg8.jpg?1518856108998', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg16.jpg?1518856109151', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg6.jpeg?1518856109241', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg14.jpg?1518856109251', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg15.jpg?1518856109599', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg1.jpg?1518856109885', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg12.jpeg?1518856110149', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg11.jpg?1518856110431', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg2.png?1518856111136', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg3.png?1518856111304', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg5.jpg?1518856111410', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg10.png?1518856112015', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg9.jpg?1518856112108', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg0.jpg?1518856112358', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2Fimg7.png?1518856112740', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2FUn222benannt.JPG?1519153417084', 'https://cdn.glitch.com/3c64a92d-50f6-40a9-9b0e-33083755e3ed%2F859ac69542285997a1c1ee67c47b2f127d092057_hq.jpg?1519153417207'];

    return img[Math.floor(Math.random()*img.length)];
}

if(command === `img`) {
  message.channel.send(`Awesome Picture Incoming! :smile:` + doMagic8BallVoodooimg())
  
  console.log(`[Command Log] ${message.author.username} has used the img Command!`)
}
  
//Unmute
	if(command === `unmute`) {
		if(!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.sendMessage("You don't have the perms to execute this command!")

			let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
			if(!toMute) return message.channel.sendMessage("You must mention a user!");

			let role = message.guild.roles.find(r => r.name === "Muted!");

		if(!role || !toMute.roles.has(role.id)) return message.channel.sendMessage("This user is not muted!");

		await toMute.removeRole(role);
		let embed = new Discord.RichEmbed()
      .setDescription(`**I have Unmuted the User!**`)
      .setColor(0xCC0000)

      message.channel.sendEmbed(embed);

			return;
    
    console.log(`[Command Log] ${message.author.username} has used the unmute Command!`)
	}

	if (command === 'play') {
		const voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, message, voiceChannel, true);
			}
			return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
					`);
					
					try {
						var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return message.channel.send('No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return message.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, message, voiceChannel);
		}
	} else if (command === 'skip') {
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
	} else if (command === 'stop') {
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
	} else if (command === 'volume') {
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		if (!args[1]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return message.channel.send(`I set the volume to: **${args[1]}**`);
	} else if (command === 'playing') {
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}** 🎶`);
	} else if (command === 'queue') {
		if (!serverQueue) return message.channel.send('There is nothing playing :cry:');
		return message.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
		`);
	} else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Paused the music! ⏸');
		}
		return message.channel.send('There is nothing playing :cry:');
	} else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Resumed the music! ▶');
		}
		return message.channel.send('There is nothing playing :cry:');
	}

	return undefined;
});

async function handleVideo(video, message, voiceChannel, playlist = false) {
	const serverQueue = queue.get(message.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(message.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(message.guild.id);
			return message.channel.send(`Sorry but I could not join the voice channel:\n**Error: ${error}**`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return message.channel.send(`✅ **${song.title}** has been added to the queue! :smile:`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 Started playing: **${song.title}** 🎶`);
}

client.login(process.env.TOKEN);
