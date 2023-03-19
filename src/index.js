const Discord = require('discord.js');
const routes = require('discord.js');
require('dotenv').config();
const server =require('@discordjs/rest');
const { joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');


const Routes = routes.Routes;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const TOKEN = process.env.TOKEN;



const client = new Discord.Client({
    intents: [1, 512, 32768, 2, 128]
});

const rest = new server.REST({version:'10'}).setToken(TOKEN);
client.on('ready', () => {console.log(`Logged in as ${client.user.tag}!`)});

function isBotInVoiceChannel(guildId) {
    const connection = client.voice.adapters.get(guildId)
    return !!connection;
  }


//leave command
client.on('interactionCreate', (interaction) => {
    if (interaction.isChatInputCommand()) {
        
        if (interaction.commandName === 'leave') {
            if (isBotInVoiceChannel(GUILD_ID)) {
            const voice = require('@discordjs/voice');
            voice.getVoiceConnection(GUILD_ID).disconnect();
            interaction.reply("leaving");
            }else{
                interaction.reply("Não é um canal de voz")
            }
        }
    }
})

//join command
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'join') {

        const channel = interaction.options.get('channel').value;
        const canal = client.channels.cache.get(`${channel}`)

        if(canal.type == 2){
            
            try {
                joinVoiceChannel({
                    channelId: canal.id,
                    guildId: canal.guild.id,
                    adapterCreator: canal.guild.voiceAdapterCreator,
                })

                interaction.reply(`Logando no canal ${canal.name}`)

            }catch(e){
                console.log(e)
            }
        }else{
            
            interaction.reply("Não é um canal de voz")

        }
    }

})


async function main(){
    
    const commands = [
        
        {
            name: 'join',
            description: 'Join the voice channel',
            options: [
              {
                name: 'channel',
                description: 'Channel to join',
                type: 7, // Voice channel type
                required: true
              }
            ]
          },
          {
            name:'leave',
            description: 'Leave the voice channel',
            options: 
            [
              {
                name: 'channel',
                description: 'Channel to leave',
                type: 7, // Voice channel type
                required: false
              }
            ]
          },
    ];

    try {
        
        console.log("Start refreshing (/) commmands")
        
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands,
        })
        client.login(TOKEN);
        

    }catch(err){
        console.log(err)
    }

}
main();