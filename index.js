const RPC = require("discord-rpc");
const chalk = require('chalk');
const ws = require('ws');
// Websocket Connection
var socket = new ws("ws://0.0.0.0:2946/BSDataPuller/MapData");

const rpc = new RPC.Client({
    transport: "ipc"
})

const presence = {
    details: "Playing Beat Saber",
    largeImageKey: "beat-saber"
}

rpc.on("ready", () => {
    rpc.setActivity(presence)
    console.log("RPC active");
})

socket.onmessage = function(event) {
    var msg = JSON.parse(event.data)

    if(msg.InLevel === false || msg.LevelFinished === true) {
        presence.details = `Last played ${msg.SongName}`
        presence.state = `In Lobby`
        rpc.setActivity(presence)
    } else if (msg.InLevel === true && msg.LevelPaused === false) {
        presence.details = `Playing ${msg.SongName}`
        presence.state = `Mapped by ${msg.Mapper}`
        presence.smallImageKey = `play`
        presence.smallImageText = `Playing`
        rpc.setActivity(presence)
    } else if(msg.InLevel === true && msg.LevelPaused === true) {
        presence.details = `Playing ${msg.SongName}`
        presence.state = `Mapped by ${msg.Mapper}`
        presence.smallImageKey = "pausedd"
        presence.smallImageText = `Paused`
        rpc.setActivity(presence)
    }
}

rpc.login({
    clientId: "877115128326287390"
})

process.on('uncaughtException', (error) => {
    if(error.message.includes(`connect ECONNREFUSED`)) {
        console.log(chalk.redBright.bold(`Websocket not active!\nYou need to start Beat Saber with DataPuller installed (along with its dependencies) for this RPC to work!`))
        process.exit(1);
    } else {
        console.log(chalk.redBright.bold(`Unhandled error! If this continues happening, create a GitHub issue on bs-rpc!\n`, error))
        process.exit(1);
    }
}) 